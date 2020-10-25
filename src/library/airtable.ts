import {__, arrayof, build, construct, data, isstring, opt, UnexpectedItemBehaviour} from "@deckchair-technicians/vice";
import {Constructor} from "@deckchair-technicians/vice/dist/types/impl/util/types";
import Airtable from 'airtable';
import * as fs from "fs";
import {index, Indexed} from "../util/objects";
import {IdType, isResourceType, library, Library, Resource, ResourceType, Tag} from "./Library";

@data
class Article {
    readonly id: string = __(isstring());
    readonly title: string = __(isstring());
    readonly summary?: string = __(opt(isstring()));
    readonly doi: string = __(isstring());
    readonly links?: string[] = __(opt(arrayof(isstring())));
    readonly tags?: string[] = __(opt(arrayof(isstring())));
}

@data
class Link {
    readonly id: string = __(isstring());
    readonly type?: string = __(opt(isstring()));
    readonly url: string = __(isstring());
}

@data
class WebPage {
    readonly id: string = __(isstring());
    readonly url: string = __(isstring());
    readonly type: ResourceType = __(isResourceType);
    readonly title: string = __(isstring());
    readonly summary?: string = __(opt(isstring()));
    readonly author?: string = __(opt(isstring()));
    readonly links?: string[] = __(opt(arrayof(isstring())));
    readonly tags?: string[] = __(opt(arrayof(isstring())));
}

export async function article$resource(article: Article, tags: Indexed<Tag>, links: Indexed<Link>, report: (record: any, e: any) => void): Promise<Resource> {
    return construct(Resource, {
        id: {type: IdType.doi, value: article.doi},
        title: article.title,
        summary: article.summary,
        type: ResourceType.article,
        tags: article.tags?.flatMap(tag => {
            if (!(tag in tags)) {
                report(article, `No such tag "${tag}" in article ${article.doi}`);
                return [];
            }
            return tags[tag];
        }) || [],
        links: article.links?.flatMap(link => {
            if (!(link in links)) {
                report(article, `No such link "${link}" in article ${article.doi}`);
                return [];
            }
            return [links[link]];
        }) || []
    }, {unexpected: UnexpectedItemBehaviour.DELETE});
}

export async function webPage$resource(page: WebPage, tags: Indexed<Tag>, links: Indexed<Link>, report: (record: any, e: any) => void): Promise<Resource> {
    return construct(Resource, {
        id: {type: IdType.url, value: page.url},
        title: page.title,
        summary: page.summary,
        type: page.type,
        tags: page.tags?.flatMap(tag => {
            if (!(tag in tags)) {
                report(page, `No such tag "${tag}" in page ${page.url}`);
                return [];
            }
            return [tags[tag]];
        }) || [],
        links: page.links?.flatMap(link => {
            if (!(link in links)) {
                report(page, `No such link "${link}" in page ${page.url}`);
                return [];
            }
            return [links[link]];
        }) || [],

    });
}


async function read<T extends { id: string }>(type: Constructor<T>, tableName: string, base: Airtable.Base, report: (record: any, e: any) => void): Promise<T[]> {
    const rows = await base(tableName).select().all();
    return rows
        // Strip out empty rows (which only have a value for "added")
        .filter(row => Object.getOwnPropertyNames(row.fields)
            .filter(n => n != "added")
            .filter(n => (row.fields as any)[n])
            .length > 0)
        .map(row => {
            try {
                return build(type, {id: row.id, ...row.fields}, {unexpected: UnexpectedItemBehaviour.DELETE})
            } catch (e) {
                report({id: row.id, ...row.fields}, e);
                return null;
            }
        }).filter(x => x) as T[];
}

async function indexed<T extends { id: string }>(type: Constructor<T>, tableName: string, base: Airtable.Base, report: (record: any, e: any) => void) {
    return index(row => row.id, await read(type, tableName, base, report));
}

export async function load(): Promise<Library> {
    function reporter(array: [any, any][]): (record: any, e: any) => void {
        return (row: any, e: any) => {
            array.push([row, e]);
        }
    }

    const articleErrors: [any, any][] = [];
    const webPageErrors: [any, any][] = [];
    const tagsErrors: [any, any][] = [];
    const urlsErrors: [any, any][] = [];

    const base = new Airtable().base("appAf6vudMV9hz4By");
    const articles = await read(Article, "articles", base, reporter(articleErrors));
    const webPages = await read(WebPage, "web pages", base, reporter(webPageErrors));
    const tags: Indexed<Tag> = await indexed(Tag, "tags", base, reporter(tagsErrors));
    const links = await indexed(Link, "urls", base, reporter(urlsErrors));

    function output(errors: [any, any][]) {
        return errors.map(([row, e]) => `${JSON.stringify(row)}\n    ${JSON.stringify(e)}`).join("\n");
    }

    const res = await Promise.all([
        ...articles
            .map(article => article$resource(article, tags, links, reporter(articleErrors))),
        ...webPages
            .map(page => webPage$resource(page, tags, links, reporter(webPageErrors)))

    ])
    const lib = library(res, tags);

    if (!fs.existsSync("output")) fs.mkdirSync("output");
    fs.writeFileSync("output/articles.csv", output(articleErrors));
    fs.writeFileSync("output/web-pages.csv", output(webPageErrors));
    fs.writeFileSync("output/tags.csv", output(tagsErrors));
    fs.writeFileSync("output/urls.csv", output(urlsErrors));

    fs.writeFileSync("output/library.json", JSON.stringify(lib, null, 2));
    return lib;
}

