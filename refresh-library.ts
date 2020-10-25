import {writeFileSync} from 'fs';
import {resolve} from "path";
import {load} from "./src/library/airtable";

const file = resolve("src/library/library.json");

load()
  .then(library => writeFileSync(
    file,
    JSON.stringify(library, null, 2)))
  .catch(console.log)
