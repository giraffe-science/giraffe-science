import {response} from "@http4t/bidi/lenses/StatusLens";
import {$request} from "@http4t/bidi/requests";
import {route, Routes} from "@http4t/bidi/routes";
import {text} from "./TextLens";


export type Api = {
    hello: () => Promise<string>;
}

export const routes: Routes<Api> = {
    hello: route(
        $request('GET', '/hello'),
        response(200, text())
    )
}
