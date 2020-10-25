import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import React from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Library, Resource} from "./library/Library";
import {Lookup} from "./library/Lookup";
import {ResourceCard} from "./ResourceCard";
import {Tags} from "./Tags";

function hasTag(resource: Resource, tags: Set<string>): boolean {
    for (const tag of resource.tags.map(t => t.id)) {
        if (tags.has(tag)) return true;
    }
    return false;
}

export function ResourcesPage({library, lookup}: { library: Library, lookup: Lookup }) {
    const location = useLocation();
    const tags = new Set((new URLSearchParams(location.search).get('tags') || "").split(",").filter(x=>x));
    const history = useHistory();

    console.log("tags",tags);
    function toggleTag(tag: string) {
        const newTags = new Set(tags);
        if (tags.has(tag))
            newTags.delete(tag)
        else
            newTags.add(tag);
        history.push(`/?tags=${[...newTags].join(",")}`)
    }

    return <React.Fragment>
        <Container className="App">
            <Container>
                {<Tags tags={Object.values(library.tags)} selected={tags} onClick={toggleTag}/>}
            </Container>
            <div style={{borderTop: "1px solid #999", marginTop: "10px"}}>&nbsp;</div>
        </Container>
        <Container className="App">
            <Grid container spacing={10}>
                {
                    library.resources
                        .filter(resource => tags.size === 0 ? true : hasTag(resource, tags))
                        .map((resource, i) =>
                            <Grid item key={i} xs={12} sm={6} md={4} style={{display: 'flex'}}>
                                <ResourceCard resource={resource} i={i} lookup={lookup}/>
                            </Grid>
                        )
                }

            </Grid>
        </Container>
    </React.Fragment>;
}
