import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import React, {useState} from "react";
import {Library, Resource} from "./library/Library";
import {ResourceCard} from "./ResourceCard";

function hasTag(resource: Resource, tags: Set<string>): boolean {
    const lowerCaseTags = new Set([...tags].map(t => t.toLowerCase()));
    for (const tag of resource.tags.map(t => t.toLowerCase())) {
        if (lowerCaseTags.has(tag)) return true;
    }
    return false;
}

export function ResourcesPage({library}: { library: Library }) {
    const [tags, setTags] = useState<Set<string>>(new Set());

    function toggleTag(tag: string) {
        tag = tag.toLowerCase();
        const newTags = new Set(tags);
        if (tags.has(tag))
            newTags.delete(tag)
        else
            newTags.add(tag);
        setTags(newTags);
    }

    return <React.Fragment>
        <Container className="App">
            <Container>
                {Object.keys(library.tags).map(tag =>
                    <Chip label={tag.toUpperCase()}
                          key={tag}
                          clickable
                          color={tags.has(tag) ? "primary" : "default"}
                          onClick={() => toggleTag(tag)}
                    />)}
            </Container>
            <div style={{borderTop: "1px solid #999", marginTop: "10px"}}>&nbsp;</div>
        </Container>
        <Container className="App">
            <Grid container spacing={10}>
                {
                    library.resources
                        .filter(resource => tags.size === 0 ? true : hasTag(resource, tags))
                        .filter(resource => resource.type !== "mepedia")
                        .map((resource, i) =>
                            <Grid item key={i} xs={12} sm={6} md={4} style={{display: 'flex'}}>
                                <ResourceCard resource={resource} i={i}/>
                            </Grid>
                        )
                }

            </Grid>
        </Container>
    </React.Fragment>;
}
