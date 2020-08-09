import {bufferText} from "@http4t/core/bodies";
import {HttpHandler, HttpRequest, HttpResponse} from "@http4t/core/contract";
import {uriString} from "@http4t/core/requests";

export class RetryHandler implements HttpHandler {
    constructor(private readonly decorated: HttpHandler, private readonly retries: number = 3) {

    }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        let response;
        for (let i = 0; i < this.retries; i++) {
            response = await this.decorated.handle(request);
            if (response.status !== 500)
                return {
                    ...response,
                    body: await bufferText(response.body)
                };
            console.log(`retry ${request.method} ${uriString(request)}`);
        }
        return response as any as HttpResponse;
    }

}