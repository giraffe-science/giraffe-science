import {bufferText} from "@http4t/core/bodies";
import {HttpHandler, HttpRequest, HttpResponse} from "@http4t/core/contract";
import {uriString} from "@http4t/core/requests";

export class LoggingHandler implements HttpHandler {
    constructor(private readonly decorated: HttpHandler, private readonly logBody: boolean = false) {

    }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const response = await this.decorated.handle(request);
        const body = await bufferText(response.body);
        console.log(`${request.method} ${uriString(request)} ${response.status}${this.logBody ? `\n${body.substr(0,2000)}` : ""}`);
        return {...response, body};
    }



}