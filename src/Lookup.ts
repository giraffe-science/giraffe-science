import {bufferText} from "@http4t/core/bodies";
import {HttpHandler} from "@http4t/core/contract";
import {get} from "@http4t/core/requests";

type Metadata = {
    readonly title: string;
    readonly created: Date;
}

export interface Lookup {
    lookup(doi: string): Promise<Metadata | undefined>;
}

type Crossref = {
    message: {
        title: string[],
        created: {
            timestamp: number
        }
    }
}

export class CrossRefLookup implements Lookup {
    constructor(private readonly http: HttpHandler) {

    }

    async lookup(doi: string): Promise<Metadata | undefined> {
        const url = `https://api.crossref.org/works/${doi}`;
        const response = await this.http.handle(get(url));
        if (response.status !== 200) {
            return undefined;
        }
        const json: Crossref = JSON.parse(await bufferText(response.body));
        return {
            title: json.message.title.join(" "),
            created: new Date(json.message.created.timestamp)
        };
    }
}

export class CachedLookup implements Lookup {
    constructor(private readonly decorated: Lookup, private readonly cache: { [doi: string]: Metadata | undefined }={}) {

    }

    async lookup(doi: string): Promise<Metadata | undefined> {
        if (!this.cache.hasOwnProperty(doi))
            this.cache[doi] = await this.decorated.lookup(doi);
        return this.cache[doi];
    }
}