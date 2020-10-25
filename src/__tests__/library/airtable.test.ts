import {writeFileSync} from "fs";
import {resolve} from "path";
import {load} from "../../library/airtable";

describe('Regenerate library', () => {
    it('From airtable', async () => {
        const file = resolve("src/library/library.json");

        await load()
            .then(library => writeFileSync(
                file,
                JSON.stringify(library, null, 2)))
    });
});
