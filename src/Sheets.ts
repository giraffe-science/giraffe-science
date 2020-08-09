import {bufferText} from "@http4t/core/bodies";
import {HttpHandler} from "@http4t/core/contract";
import {get} from "@http4t/core/requests";
import Papa, {ParseError, ParseResult} from "papaparse";
import {baseUrl} from "./google-sheets";

export type Csv = string[][];

export interface Sheets {
    load(id: string): Promise<Csv>;
}

export class CsvSheets implements Sheets {
    constructor(private readonly http: HttpHandler) {
    }

    load(id: string): Promise<Csv> {
        return new Promise<Csv>(async (resolve, reject) => {
            const url = `${baseUrl}/pub?gid=${id}&single=true&output=csv`;
            const text = await bufferText((await this.http.handle(get(url))).body);
            const file = new File(text.split("\n"), "data.csv");
            Papa.parse(file, {
                download: true,
                complete: function (results: ParseResult<string[]>) {
                    resolve(results.data)
                },
                error: function (error: ParseError) {
                    reject(error);
                }
            });
        });
    }

}

export class CheerioSheets implements Sheets {
    constructor(private readonly cheerio: CheerioStatic) {
    }

    async load(id: string): Promise<Csv> {
        const $ = this.cheerio;
        const data: string[][] = [];
        $(`#${id} tbody tr`).each(function () {
            // @ts-ignore
            const thing = $(this).find('td').map(function () {
                // @ts-ignore
                return $(this).text();
            }).get();
            data.push(thing);
        });
        return data;
    }

}