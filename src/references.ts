import {Reference, ReferenceType} from "./Library";

export function parseReferences(citation: string): Reference[] {
    const regexes: [ReferenceType, RegExp[]][] = [
            ["doi",
                [
                    // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
                    /doi: ?([^ ]+)/ig,
                    /doi: ?(10.1002\/[^\s]+)/ig,
                    /doi: ?(10.\d{4}\/\d+-\d+X?(\d+)\d+<[\d\w]+:[\d\w]*>\d+.\d+.\w+;\d)/ig,
                    /doi: ?(10.1207\/[\w\d]+&\d+_\d+)/ig,
                    /doi: ?(10.1021\/\w\w\d+)/ig,
                ],
            ],
            ["issn", [/issn ([0-9]+-[0-9]+)/ig]],
            ["pmc", [/pmc ([0-9]+)/ig]],
            ["pmid", [/pmid ([0-9]+)/ig]]
        ]
    ;
    return regexes.reduce((acc, [type, regexes]) => {
        for (const regex of regexes) {
            for (const match of citation.matchAll(regex)) {
                acc.push({type: type, value: match[1].replace(/\.$/, "")})
            }
        }
        return acc;
    }, [] as Reference[]);
}