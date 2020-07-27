import {FetchHandler} from "@http4t/browser/fetch";
import {bufferText} from "@http4t/core/bodies";
import {get} from "@http4t/core/requests";
import {load as cheerio} from "cheerio";
import Papa, {ParseError, ParseResult} from "papaparse";
import {Complete} from "./util/Complete";

type Sheet = {
    readonly id: string;
    readonly title: string;
}
type Row = {
    readonly citation?: string;
    readonly type: string;
    readonly title?: string;
    readonly year?: string;
    readonly summary?: string;
    readonly link?: string;
    readonly downloadLink?: string;
}

export type ReferenceType = "doi" | "issn" | "pmid" | "pmc" | "url";
export type Reference = { type: ReferenceType, value: string };
export type Resource = {
    readonly type: string;
    readonly tags: Set<string>;
    readonly citation?: string;
    readonly summary?: string;
    readonly title?: string;
    readonly year?: string;
    readonly references: Reference[];
}
export type Tags = { [k: string]: Resource[] };
export type Library = {
    readonly resources: Resource[],
    readonly tags: Tags,

}
export const baseUrl: string = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRI6k4TXgDpkUQIY2GuGRG76ejHPTOMqp473sN5JpPydPDRlwLTmZtyAc3gXB0AVAbMxMMxvi5mcfMp"

function guessHeader(value: string): keyof Row | undefined {
    if (value.toLowerCase().includes("type")) return "type";
    if (value.toLowerCase().includes("citation")) return "citation";
    if (value.toLowerCase().includes("summary")) return "summary";
    if (value.toLowerCase().includes("title")) return "title";
    if (value.toLowerCase().includes("year")) return "year";
    if (value.toLowerCase().replace(" ", "") === "link") return "link";
    if (value.toLowerCase().includes("download")) return "downloadLink";
    return undefined;
}

type HeaderLookup = { -readonly [K in keyof Complete<Row>]: number };

function isBlank(v: any): boolean {
    return typeof v === "undefined" || (typeof v === "string" && v.replace(" ", "") === "");
}

function removeUndefined<T>(value: T): T {
    return Object.entries(value)
        .reduce((acc, [k, v]) =>
                isBlank(v)
                    ? acc
                    : Object.assign({[k]: v}, acc),
            {} as any as T);
}

function headerLookup(values: string[]): HeaderLookup {
    return values.reduce((acc, value, i) => {
        const header = guessHeader(value);
        if (header) acc[header] = i;
        return acc;
    }, {} as HeaderLookup);
}

function references(citation: string): Reference[] {
    const regexes: [ReferenceType, RegExp[]][] = [
            ["doi",
                [
                    // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
                    /doi: (10.\d{4,9}\/[-._;()/:A-Z0-9]+?)\.?/ig,
                    /doi: (10.1002\/[^\s]+?)\.?/ig,
                    /doi: (10.\d{4}\/\d+-\d+X?(\d+)\d+<[\d\w]+:[\d\w]*>\d+.\d+.\w+;\d)\.?/ig,
                    /doi: (10.1207\/[\w\d]+&\d+_\d+?)\.?/ig,
                    /doi: (10.1021\/\w\w\d+?)\.?/ig,
                ],
            ],
            ["issn", [/issn ([0-9]+-[0-9]+)/ig]],
            ["pmc", [/pmc ([0-9]+)/ig]],
            ["pmid", [/pmid ([0-9]+)/ig]]
        ]
    ;
    return regexes.reduce((acc, [type, regexes]) => {
        for (const regex of regexes) {
            for (const match of citation.matchAll(regex)) {
                acc.push({type: type, value: match[1]})
            }
        }
        return acc;
    }, [] as Reference[]);
}

function parseSheet({title, data}: RawSheet): Resource[] {
    const headers: HeaderLookup = headerLookup(data[0]);
    return data.slice(1).reduce((acc, row) => {
        const link = row[headers.link];
        const downloadLink = row[headers.downloadLink];
        return [...acc, removeUndefined<Resource>({
            type: row[headers.type].toLowerCase(),
            tags: new Set([title]),
            citation: row[headers.citation],
            summary: row[headers.summary],
            title: row[headers.title]?.replace(/^[“"]/,"")?.replace(/[”"]\s*$/,""),
            year: row[headers.year],
            references: [
                ...references(row[headers.citation]),
                ...(link ? [{type: "url", value: link} as Reference] : []),
                ...(downloadLink ? [{type: "url", value: downloadLink} as Reference] : [])]
        })]
    }, [] as Resource[]);
}

type RawSheet = { id: string, title: string, url: string, data: string[][] };

function download(sheet: Sheet): Promise<RawSheet> {
    return new Promise<RawSheet>((resolve, reject) => {
        const url = `${baseUrl}/pub?gid=${sheet.id}&single=true&output=csv`;
        Papa.parse(url, {
            download: true,
            complete: function (results: ParseResult<string[]>) {
                resolve({id: sheet.id, title: sheet.title, url, data: results.data})
            },
            error: function (error: ParseError, file?: File) {
                reject(error);
            }
        });
    });
}

export async function load(): Promise<Library> {
    const http = new FetchHandler();
    const webPage = http.handle(get(`${baseUrl}/pubhtml`))
        .then(response => bufferText(response.body))
        .then(text => cheerio(text));

    const sheets: Promise<Sheet[]> = webPage.then(
        page =>
            page("#sheet-menu").children("li").map((i, li) => {
                console.log(li);
                console.log(li.firstChild.firstChild.data);
                return ({
                    id: li.attribs.id.replace("sheet-button-", ""),
                    title: li.firstChild.firstChild.data
                });
            }).get());

    const resources = await sheets
        .then(all =>
            Promise
                .all(all.map(download))
                .then(all => all.reduce((acc, sheet) =>
                    [...acc, ...parseSheet(sheet)], [] as Resource[])));

    const tags = resources.reduce((acc, resource) =>
        [...resource.tags].reduce((acc, tag) => {
            acc[tag] = (acc[tag] || [])
            acc[tag].push(resource);
            return acc;
        }, acc), {} as Tags)

    const library = {resources: resources, tags};
    console.log(library);
    return library;
}