import {ServerHandler} from "@http4t/node/server";
import {startApp} from "./app";

(async function main() {
    const router = await startApp();
    const server = new ServerHandler(router);
    console.log('Running on port', (await server.url()).authority);
})();
