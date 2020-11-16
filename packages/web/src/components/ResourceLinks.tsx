import {Uri} from "@http4t/core/uri";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {IdType, Link, Resource} from "../library/Library";

function toUrl(uri: string): string {
    return uri.startsWith("http") ? uri : `http://${uri}`;
}

function link(resource: Resource): Link {
    switch (resource.id.type) {
        case IdType.doi:
            return {type: "doi.org", url: `https://doi.org/${resource.id.value}`, text: resource.id.value}
        case IdType.url:
            return {type: "original", url: resource.id.value}
        default:
            assertUnreachable(resource.id.type);
    }
}

export function assertUnreachable(value: never): never {
    throw new Error(`Did not expect value ${JSON.stringify(value)}`);
}

const linkTypePriority: { [k: string]: number } = ["article", "article abstract", "pdf"].reduce((acc, type, i) => {
    acc[type] = i;
    return acc;
}, {} as { [k: string]: number })

function priority(a: Link) {
    return a.type ? linkTypePriority[a.type] || 100 : 200;
}

export function ResourceLinks({resource, count}: { resource: Resource, count?: number }) {
    const resourceLink: Link = link(resource)

    const linksToInclude = [...resource.links].sort((a, b) =>
        priority(a) - priority(b)
    ).splice(0, count || resource.links.length);

    return <React.Fragment>
        {
            [resourceLink, ...linksToInclude]
                .map((link) => {
                    const url = toUrl(link.url);
                    return <Typography variant="body2" key={link.url}>{link.type || "link"}: <a
                        href={url}>{link.text || Uri.of(url)?.authority?.host}</a></Typography>;
                })
        }
        {linksToInclude.length === 0 &&
        <Typography variant="body2">&nbsp;</Typography>
        }
    </React.Fragment>;
}
