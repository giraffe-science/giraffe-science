import {HttpHandler, HttpRequest, HttpResponse} from "@http4t/core/contract";
import {Uri} from "@http4t/core/uri";
import axios from "axios";

export class AxiosClient implements HttpHandler {
    async handle(request: HttpRequest): Promise<HttpResponse> {
        const response = await axios.request({
            method: request.method as any,
            url: Uri.of(request.uri).toString(),
            headers: request.headers.reduce((acc, [n, v]) => {
                // @ts-ignore
                acc[n] = v;
                return acc;
            }, {}),
            data: request.body,
            transformResponse: res=>res,
            validateStatus: () => true
        });
        console.log(response);
        return {
            status: response.status,
            headers: Object.entries(response.headers).map(([n, v]) => ([n, v as string])),
            body: response.data
        };
    }

}