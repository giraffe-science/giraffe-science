import {Uri} from "@http4t/core/uri";
import {Icon} from "@material-ui/core";
import React from "react";
import {Resource} from "./Library";

function toUrl(uri: string): string {
    return uri.startsWith("http") ? uri : `http://${uri}`;
}

export function ResourceLinks({resource}: { resource: Resource }) {
    return <React.Fragment>
        {
            resource.identifiers
                .filter(id => id.type === "url")
                .map((id, i) => {
                    const url = toUrl(id.value);
                    return <p key={i}><a href={url}>original: {Uri.of(url)?.authority?.host}<Icon
                        className="launch"/></a></p>;
                })
        }
    </React.Fragment>;
}