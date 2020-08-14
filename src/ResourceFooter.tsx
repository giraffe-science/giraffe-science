import Typography from "@material-ui/core/Typography";
import React from "react";
import {Resource} from "./library/Library";
import {Metadata} from "./library/Lookup";
import {useClasses} from "./styles";
import {formatDate} from "./util/dates";

export function ResourceFooter({resource, meta}: { resource: Resource, meta?: Metadata }) {
    const classes = useClasses();
    const created = meta?.published
        ? formatDate(meta.published)
        : resource.created || (resource.type === "mepedia" ? "2020" : undefined);
    return <React.Fragment>
        <Typography className={classes.resourceType} gutterBottom display="inline">
            {resource.type.toUpperCase()}
        </Typography>
        <Typography className={classes.resourceType} gutterBottom display="inline">&nbsp;|&nbsp;</Typography>
        <Typography className={classes.resourceDate} gutterBottom display="inline" color="textSecondary">
            {created}
        </Typography>
    </React.Fragment>

}
