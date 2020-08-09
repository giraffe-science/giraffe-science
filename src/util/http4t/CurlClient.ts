import {HttpHandler, HttpRequest, HttpResponse} from "@http4t/core/contract";
import {appendHeader} from "@http4t/core/messages";
import {uriString} from "@http4t/core/requests";
import {responseOf} from "@http4t/core/responses";
import {exec} from "child_process";

const statusPattern = /.+\s+([0-9]+)\s+([^ ]+)?/

interface State<T> {
    readonly value: T;

    read(line: string): State<T>;
}

class Body implements State<HttpResponse> {
    constructor(readonly value: HttpResponse, private readonly body?: string) {

    }

    read(line: string): State<HttpResponse> {
        const body = this.body ? `${this.body}\n${line}` : line;
        return new Body({...this.value, body}, body);
    }
}

class HeaderOrBlank implements State<HttpResponse> {
    constructor(readonly value: HttpResponse) {

    }

    read(line: string): State<HttpResponse> {
        if (!line || line === "") {
            return new Body(this.value);
        }
        const colon = line.indexOf(":");
        const name = line.substr(0, colon >= 0 ? colon : line.length);
        const value = colon >= 0 ? line.substr(colon + 1) : "";
        return new HeaderOrBlank(appendHeader(this.value, name, value))
    }

}

class StatusLine implements State<HttpResponse> {
    readonly value = responseOf(200);

    read(line: string): State<HttpResponse> {
        const statusMatch = line.match(statusPattern);
        if (!statusMatch) throw new Error(`Not a valid status line "${line}"`);
        return new HeaderOrBlank(responseOf(Number.parseInt(statusMatch[1])));
    }
}

function parse(stdout: string): HttpResponse {
    return stdout
        .split(/\r?\n/)
        .reduce((state, line) => state.read(line), new StatusLine())
        .value;
}

export class CurlClient implements HttpHandler {
    async handle(request: HttpRequest): Promise<HttpResponse> {
        return new Promise((resolve, reject) => {
            if (request.body && request.body !== "")
                throw new Error(`CurlClient does not yet support body ${request.method} ${uriString(request)}`);
            const command =
                `curl -i -X ${request.method} ${request.headers.map(([n, v]) => `-H "${n.replace('"', '\"')}: ${v.replace('"', '\"')}"`).join("\n")} "${uriString(request)}"`;
            // console.log(command);
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject({error, stdout, stderr})
                } else {
                    resolve(parse(stdout))
                }
            })
        })
    }

}