import {Uri} from "@http4t/core/uri";
import {Icon} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
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
                    return <Typography variant="body2" key={i}>original: <a href={url}>{Uri.of(url)?.authority?.host}<Icon
                        className="launch"/></a></Typography>;
                })
        }
    </React.Fragment>;
}