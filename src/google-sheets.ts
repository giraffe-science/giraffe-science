import {bufferText} from "@http4t/core/bodies";
import {HttpHandler} from "@http4t/core/contract";
import {get} from "@http4t/core/requests";
import {load as cheerio} from "cheerio";
import {ByIds, Identifier, Library, Resource, Tags} from "./Library";
import {CachedLookup, CrossRefLookup, Lookup} from "./Lookup";
import {parseReferences} from "./references";
import {CheerioSheets, Csv} from "./Sheets";
import {Complete} from "./util/Complete";
import {formatDate} from "./util/dates";

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

async function parseRow(row: string[], headers: HeaderLookup, sheetTitle: string, lookup: Lookup): Promise<Resource> {
    const fields = headers.fields;

    const references = [
        ...parseReferences(row[fields.citation]),
        ...headers.links
            .map(({description, index}) =>
                ({type: "url", value: row[index], description} as Identifier))
            .filter(ref => !isBlank(ref.value))];

    const doi = references.find(r => r.type === "doi")?.value;

    const manualTitle = row[fields.title]?.replace(/^[“"]/, "")?.replace(/[”"]\s*$/, "");
    const resourceTitle = isBlank(manualTitle)
        ? doi ? (await lookup.lookup(doi))?.title : undefined
        : manualTitle;

    const manualYear = row[fields.year];
    const resourceYear = isBlank(manualYear)
        ? doi ? formatDate((await lookup.lookup(doi))?.published) : undefined
        : manualYear;

    return removeUndefined<Resource>({
        type: row[fields.type].toLowerCase(),
        tags: [sheetTitle.toLowerCase()],
        citation: row[fields.citation],
        summary: row[fields.summary],
        title: resourceTitle,
        created: resourceYear,
        identifiers: references
    });
}

function parseResources(sheet: Sheet, data: Csv, lookup: Lookup): Promise<Resource>[] {
    const headers: HeaderLookup = headerLookup(data[0]);
    return data
        .slice(1)
        .filter(row => {
            if (!isBlank(row[headers.fields.citation])) return true;
            if (!isBlank(row[headers.fields.title])) return true;
            for (const link of headers.links) {
                if (!isBlank(row[link.index])) return true;
            }
            return false;
        })
        .reduce(
            (acc, row) => {
                return [...acc, parseRow(row, headers, sheet.title, lookup)]
            },
            [] as Promise<Resource>[])
}


export async function worksheets(page: CheerioStatic): Promise<Sheet[]> {
    return page("#sheet-menu").children("li").map((i, li) => {
        return ({
            id: li.attribs.id.replace("sheet-button-", ""),
            title: li.firstChild.firstChild.data
        });
    }).get();
}

export async function resources(sheets: Sheet[],
                                sheetLoader: CheerioSheets,
                                lookup: Lookup): Promise<Resource[]> {
    const resourcePromises = await Promise.all(
        sheets
            .map(sheet => ({...sheet, csv: sheetLoader.load(sheet.id)}))
            .map(async sheet => Promise.all(parseResources(sheet, await sheet.csv, lookup))));

    return resourcePromises.flatMap(r => r);
}


function library(resources: Resource[]): Library {
    const tags = resources
        .reduce((acc, resource) =>
            resource.tags.reduce((acc, tag) => {
                acc[tag] = (acc[tag] || [])
                acc[tag].push(resource);
                return acc;
            }, acc), {} as Tags)

    const ids = resources.reduce((acc, resource) => resource.identifiers.reduce((acc, id) => {
        if (id.type === "doi" || id.type === "url")
        {
            const existing = acc[id.type][id.value];
            if(!existing || resource.summary){
                acc[id.type][id.value] = resource;
            }
        }
        return acc;
    }, acc), {doi: {}, issn: {}, pmc: {}, pmid: {}, url: {}} as ByIds)

    return {resources: resources, tags, ids};
}

export async function load(http: HttpHandler): Promise<Library> {
    const page: CheerioStatic = await http.handle(get(
        `${baseUrl}/pubhtml`,
        ["Accept", "*/*"],
    ))
        .then(response => bufferText(response.body))
        .then(text => cheerio(text));
    const sheets = await worksheets(page);

    const sheetLoader = new CheerioSheets(page);
    const lookup = new CachedLookup(new CrossRefLookup(http));

    const res = await resources(sheets, sheetLoader, lookup);

    return library(res);
}