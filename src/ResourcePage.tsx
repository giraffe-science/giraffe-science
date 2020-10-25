import {Container} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Markdown from 'markdown-to-jsx';
import React from "react";
import {useHistory, useParams} from "react-router-dom";
import {ByIds, getDoi, IdType, Library, Resource} from "./library/Library";
import {Lookup} from "./library/Lookup";
import {ResourceFooter} from "./ResourceFooter";
import {ResourceLinks} from "./ResourceLinks";
import {useClasses} from "./styles";
import {Tags} from "./Tags";
import {useMeta} from "./useMeta";
import {formatDateForCitation} from "./util/dates";


export function ResourcePage({library, lookup}: { library: Library, lookup: Lookup }) {
    const {identifierType, identifier} = useParams();
    const history = useHistory();
    const classes = useClasses();
    const resource = library.byId[identifierType as keyof ByIds]?.[decodeURIComponent(identifier)];
    const doi = getDoi(resource);
    const meta = useMeta(doi, lookup);
    return <React.Fragment>
        {!resource && <p>Resource not found</p>}
        {resource && <Container>
          <Container style={{justifyContent: "center"}}>
              {meta?.publicationTitle &&
              <Container style={{width: "100%"}}>
                <Typography style={{textAlign: "center"}} variant="h2">{meta?.publicationTitle}</Typography>
              </Container>}

            <Container style={{maxWidth: "900px", paddingTop: "10px", paddingBottom: "10px"}}>
              <Typography style={{textAlign: "center"}} variant="h1"
              >{resource.title}</Typography>

            </Container>
            <Container style={{textAlign: "center", maxWidth: "300px"}}>
              <ResourceFooter resource={resource} meta={meta}/>
            </Container>
          </Container>


          <Container className={classes.content}>
              {resource.summary
                  ? <Typography variant="body1" style={{marginTop: "20px"}}><Markdown
                      options={{disableParsingRawHTML: true}}>{resource.summary}</Markdown></Typography>
                  : <Typography variant="body1">&nbsp;</Typography>}
              <Tags tags={resource.tags} onClick={(tag)=>history.push(`/?tags=${tag}`)}/>
              {<ResourceLinks resource={resource}/>}
              {meta && <Typography variant="body2" style={{marginTop: "20px"}}>{[
                  meta.authors.join("; "),
                  formatDateForCitation(meta.published),
                  `"${meta.title}"`,
                  meta.publicationTitle,
                  meta.doi ? `doi: ${meta.doi}` : "",
                  meta.issn ? `issn: ${meta.issn}` : "",
              ].join(" ")}</Typography>}
          </Container>
        </Container>
        }

    </React.Fragment>;
}
