import {Card} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {Link} from "react-router-dom";
import {Identifier, Resource} from "./Library";
import {ResourceFooter} from "./ResourceFooter";
import {ResourceLinks} from "./ResourceLinks";
import {useClasses} from "./styles";

export function ResourceCard({resource, i}: { resource: Resource, i: number }) {
    const classes = useClasses();
    const canonicalId = resource.identifiers.reduce((acc, id) => {
        if (!acc) return id;
        if (acc.type === "doi") return acc;
        if (id.type === "doi") return id;
        if (id.type === "url") return id;
        return acc;
    }, undefined as Identifier | undefined)

    return <Card className={classes.resourceCard} key={i}
                 style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
        <CardContent className={classes.resourceCardContent}>
            <Link
                to={canonicalId ? `/resources/${canonicalId.type}/${encodeURIComponent(canonicalId.value)}` : "/resources"}
                className={classes.resourceLink}>
                <Typography className={classes.resourceTitle}
                            variant="h5"
                            component="h5">{resource.title}</Typography></Link>
            {resource.summary
                ? resource.summary.split("\n")
                    .map((text, i) =>
                        <Typography variant="body1"
                                    color="textSecondary"
                                    key={i}>{text}</Typography>)
                : <Typography variant="body1">&nbsp;</Typography>}
            <ResourceLinks resource={resource}/>
        </CardContent>
        <CardActions style={{margin:"0",padding:"15px 0 0 0"}}>
            {resource.type &&
            <Grid item container alignContent="flex-start" alignItems="flex-start">
              <ResourceFooter resource={resource}/>
            </Grid>
            }
        </CardActions>
    </Card>;
}
