import Chip from "@material-ui/core/Chip";
import React from "react";
import {Tag} from "./library/Library";

export function Tags({tags, onClick, selected = new Set()}: { tags: Tag[], selected?: Set<string>, onClick: (tag: string) => void }) {
    return <React.Fragment>
        {tags
            .filter(tag => tag.isDiagnosis)
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
            .map(tag =>
                <Chip label={tag.name.toUpperCase()}
                      key={tag.id}
                      clickable
                      color={selected.has(tag.id) ? "primary" : "default"}
                      onClick={() => onClick(tag.id)}
                />)}
    </React.Fragment>
}
