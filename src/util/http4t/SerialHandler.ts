import {bufferText} from "@http4t/core/bodies";
import {HttpHandler, HttpRequest, HttpResponse} from "@http4t/core/contract";
import {uriString} from "@http4t/core/requests";

export class SerialHandler implements HttpHandler {
    constructor(private readonly decorated: HttpHandler, private readonly retries: number = 3) {

    }

    private inFlight: Promise<HttpResponse> | undefined;
    private queue: { request: HttpRequest, resolve: (response: HttpResponse) => void }[] = [];

    enqueue(request:HttpRequest) : Promise<HttpResponse>{
        return new Promise((resolve) => {
            this.queue.push({request,resolve});
        })
    }
    async handle(request: HttpRequest): Promise<HttpResponse> {
        if (this.inFlight) {
            return this.enqueue(request);
        } else {
            this.inFlight = this.decorated.handle(request);
            this.inFlight
            return this.inFlight;
        }
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