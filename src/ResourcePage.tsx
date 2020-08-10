import {Container} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {ByIds, Library} from "./Library";
import {Lookup, Metadata} from "./Lookup";
import {ResourceFooter} from "./ResourceFooter";
import {useClasses} from "./styles";
import {formatDateForCitation} from "./util/dates";

export function ResourcePage({library, lookup}: { library: Library, lookup: Lookup }) {
    const {identifierType, identifier} = useParams();
    const [meta, setMeta] = useState<Metadata>();
    const classes = useClasses();
    const resource = library.ids[identifierType as keyof ByIds]?.[decodeURIComponent(identifier)];
    const doi = resource?.identifiers.find(i => i.type === "doi")?.value;
    if (doi) {
        lookup.lookup(doi).then(setMeta)
    }
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
                  ? <Typography variant="body1" style={{marginTop: "20px"}}>{resource.summary}</Typography>
                  : <Typography variant="body1">&nbsp;</Typography>}
              {
                  resource.identifiers
                      .filter(id => id.type === "url")
                      .map((id,i) =>
                      <p><a href={id.value}>{id.value}</a></p>)
              }
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