import {useState} from "react";
import {Lookup, Metadata} from "./library/Lookup";

export function useMeta(doi: string | undefined, lookup: Lookup) {
    const [meta, setMeta] = useState<Metadata>();
    if (doi) {
        lookup.lookup(doi).then(setMeta)
    }
    return meta;
}
