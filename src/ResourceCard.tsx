import {Card} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {Link} from "react-router-dom";
import {GiraffeMarkdown} from "./components/GiraffeMarkdown";
import {getDoi, Resource} from "./library/Library";
import {Lookup} from "./library/Lookup";
import {ResourceFooter} from "./ResourceFooter";
import {ResourceLinks} from "./ResourceLinks";
import {useClasses} from "./styles";
import {useMeta} from "./useMeta";

export function ResourceCard({resource, i, lookup}: { resource: Resource, i: number, lookup: Lookup }) {
    const classes = useClasses();
    const doi = getDoi(resource);
    const meta = useMeta(doi, lookup);

    return <Card className={classes.resourceCard} key={i}
                 style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
        <CardContent className={classes.resourceCardContent}>
            <Link
                to={`/resources/${resource.id.type}/${encodeURIComponent(resource.id.value)}`}
                className={classes.resourceLink}>
                <Typography className={classes.resourceTitle}
                            variant="h5"
                            component="h5">{resource.title}</Typography></Link>
            {resource.summary
                ? <GiraffeMarkdown color="textSecondary">{resource.summary}</GiraffeMarkdown>
                : <Typography variant="body1">&nbsp;</Typography>}

        </CardContent>
        <CardActions style={{margin: "0", padding: "15px 0 0 0"}}>
            <Grid container style={{flexDirection: "column", alignContent: "flex-start", alignItems: "flex-start"}}>
                {resource.type &&
                <Grid container>
                  <ResourceFooter resource={resource} meta={meta}/>
                </Grid>
                }
                <ResourceLinks resource={resource} count={1}/>
            </Grid>
        </CardActions>
    </Card>;
}
