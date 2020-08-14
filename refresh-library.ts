import fs from 'fs';
import * as path from "path";
import {load} from "./src/library/google-sheets";
import {CurlClient} from "./src/util/http4t/CurlClient";
import {RetryHandler} from "./src/util/http4t/RetryHandler";

const file = path.resolve("src/library.json");
console.log(file);
load(new RetryHandler(new CurlClient()))
    .then(library => fs.writeFileSync(
        file,
        JSON.stringify(library, null, 2)))
    .catch(console.log)
