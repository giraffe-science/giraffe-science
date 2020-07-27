import {FetchHandler} from "@http4t/browser/fetch";
import {bufferText} from "@http4t/core/bodies";
import {get} from "@http4t/core/requests";
import {load as cheerio} from "cheerio";
import Papa, {ParseError, ParseResult} from "papaparse";
import {CachedLookup, CrossRefLookup, Lookup} from "./Lookup";
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
    readonly links: string[];
}

export type ReferenceType = "doi" | "issn" | "pmid" | "pmc" | "url";
export type Reference = { type: ReferenceType, value: string, description?: string };
export type Resource = {
    readonly type: string;
    readonly tags: Set<string>;
    readonly citation?: string;
    readonly summary?: string;
    readonly title?: string;
    readonly created?: string;
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
    if (value.toLowerCase().includes("link")) return "links";
    return undefined;
}

type FieldLookup = { -readonly [K in keyof Complete<Row>]: number };
type HeaderLookup = {
    fields: FieldLookup,
    links: [{ description?: string, index: number }]
};

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
        if (header) {
            if (header === "links") {
                const description = value.toLowerCase().replace(/\s*link\s*/, "");
                acc.links.push({description: isBlank(description) ? undefined : description, index: i})
            } else {
                acc.fields[header] = i;
            }
        }

        return acc;
    }, {fields: {}, links: []} as any as HeaderLookup);
}

export function parseReferences(citation: string): Reference[] {
    const regexes: [ReferenceType, RegExp[]][] = [
            ["doi",
                [
                    // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
                    /doi: ?([^ ]+)/ig,
                    /doi: ?(10.1002\/[^\s]+)/ig,
                    /doi: ?(10.\d{4}\/\d+-\d+X?(\d+)\d+<[\d\w]+:[\d\w]*>\d+.\d+.\w+;\d)/ig,
                    /doi: ?(10.1207\/[\w\d]+&\d+_\d+)/ig,
                    /doi: ?(10.1021\/\w\w\d+)/ig,
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
                acc.push({type: type, value: match[1].replace(/\.$/, "")})
            }
        }
        return acc;
    }, [] as Reference[]);
}


const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatDate(date: Date | undefined): string | undefined {
    if (typeof date === "undefined") return;
    return `${date?.getDay()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

async function parseRow(row: string[], headers: HeaderLookup, sheetTitle: string, lookup: Lookup): Promise<Resource> {
    const fields = headers.fields;

    const references = [
        ...parseReferences(row[fields.citation]),
        ...headers.links
            .map(({description, index}) =>
                ({type: "url", value: row[index], description} as Reference))
            .filter(ref => !isBlank(ref.value))];

    const doi = references.find(r => r.type === "doi")?.value;

    const manualTitle = row[fields.title]?.replace(/^[“"]/, "")?.replace(/[”"]\s*$/, "");
    const resourceTitle = isBlank(manualTitle)
        ? doi ? (await lookup.lookup(doi))?.title : undefined
        : manualTitle;

    const manualYear = row[fields.year];
    const resourceYear = isBlank(manualYear)
        ? doi ? formatDate((await lookup.lookup(doi))?.created) : undefined
        : manualYear;

    return removeUndefined<Resource>({
        type: row[fields.type].toLowerCase(),
        tags: new Set([sheetTitle]),
        citation: row[fields.citation],
        summary: row[fields.summary],
        title: resourceTitle,
        created: resourceYear,
        references
    });
}

function parseResources({title, data}: RawSheet, lookup: Lookup): Promise<Resource>[] {
    const headers: HeaderLookup = headerLookup(data[0]);
    return data.slice(1).reduce(
        (acc, row) => {
            return [...acc, parseRow(row, headers, title, lookup)]
        },
        [] as Promise<Resource>[])
}

type RawSheet = { id: string, title: string, url: string, data: string[][] };

function download(sheet: Sheet): Promise<RawSheet> {
    return new Promise<RawSheet>(async (resolve, reject) => {
        const url = `${baseUrl}/pub?gid=${sheet.id}&single=true&output=csv`;
        const text = await bufferText((await new FetchHandler().handle(get(url))).body);
        const file = new File(text.split("\n"), "data.csv");
        Papa.parse(file, {
            download: true,
            complete: function (results: ParseResult<string[]>) {
                resolve({id: sheet.id, title: sheet.title, url, data: results.data})
            },
            error: function (error: ParseError) {
                reject(error);
            }
        });
    });
}

export async function load(): Promise<Library> {
    const http = new FetchHandler();
    const lookup = new CachedLookup(new CrossRefLookup(http));

    const page = await http.handle(get(`${baseUrl}/pubhtml`))
        .then(response => bufferText(response.body))
        .then(text => cheerio(text));

    const sheets: Sheet[] = page("#sheet-menu").children("li").map((i, li) => {
        return ({
            id: li.attribs.id.replace("sheet-button-", ""),
            title: li.firstChild.firstChild.data
        });
    }).get();

    const resourcePromises = await Promise.all(
        sheets
            .map(download)
            .map(async csv => Promise.all(parseResources(await csv, lookup))));
    const resources: Resource[] = resourcePromises.flatMap(r => r);

    const tags = resources
        .reduce((acc, resource) =>
            [...resource.tags].reduce((acc, tag) => {
                acc[tag] = (acc[tag] || [])
                acc[tag].push(resource);
                return acc;
            }, acc), {} as Tags)

    const library = {resources: resources, tags};
    console.log(library);
    return library;
}