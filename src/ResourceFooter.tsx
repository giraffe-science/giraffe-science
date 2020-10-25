import {Uri} from "@http4t/core/uri";
import {Icon} from "@material-ui/core";
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
        : resource.created;
    return <React.Fragment>
        <Typography className={classes.resourceType}  display="inline">
            {resource.type.toUpperCase()}
        </Typography>
        <Typography className={classes.resourceType}  display="inline">&nbsp;|&nbsp;</Typography>
        <Typography className={classes.resourceDate}  display="inline" color="textSecondary">
            {created}
        </Typography>
    </React.Fragment>

}
