import {buildRouter} from "@http4t/bidi/router";
import {HttpHandler, HttpRequest, HttpResponse} from "@http4t/core/contract";
import {Closeable} from "@http4t/core/server";
import {hello} from "@scientific-giraffe/core";
import {Api, routes} from "./api";
import {handleError} from "./filters/errors";
import {middlewares} from "./utils/Filter";
import {CumulativeLogger} from "./utils/Logger";

function behaviour(logger: CumulativeLogger): Api {
    return {
        async hello(): Promise<string> {
            logger.info("hello called");
            return hello();
        }
    };
}

function router(logger: CumulativeLogger): HttpHandler {
    return buildRouter(routes, behaviour(logger));
}

export async function startApp(): Promise<HttpHandler & Closeable> {
    const logger = new CumulativeLogger();

    return {
        async handle(request: HttpRequest): Promise<HttpResponse> {
            const middleware = middlewares(
                handleError(logger));

            return middleware(router(logger)).handle(request);
        },
        async close(): Promise<void> {
        }
    };
}
