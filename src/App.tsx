import {Card} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import React, {useState} from 'react';
import './App.css';
import fur from "./images/fur.png"
import {Library, Resource} from "./Library";
import {ResourceCard} from "./ResourceCard";
import {theme, useClasses} from "./styles";

function hasTag(resource: Resource, tags: Set<string>): boolean {
    for (const tag of resource.tags) {
        if (tags.has(tag)) return true;
    }
    return false;
}

function App({loading}: { loading: Promise<Library> }) {
    const classes = useClasses();
    const [error, setError] = useState<any>();
    const [library, setLibrary] = useState<Library>();
    const [tags, setTags] = useState<Set<string>>(new Set());

    loading
        .then(library => setLibrary(library))
        .catch(setError);

    if (error)
        console.log(error);

    function toggleTag(tag: string) {
        const newTags = new Set(tags);
        if (tags.has(tag))
            newTags.delete(tag)
        else
            newTags.add(tag);
        setTags(newTags);
    }

    const furHeight = "60px";
    const furMargin = "8px";
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container >
                <AppBar className={classes.appBar} position="fixed">
                    <div style={{borderBottom: "1px solid #999", marginBottom: "10px"}}>&nbsp;</div>
                    <Grid container justify="center">
                        <Grid item>
                            <img alt="" src={fur} style={{height: furHeight, marginRight: furMargin}}/>
                        </Grid>
                        <Grid item>
                            <Typography variant="h1" className={classes.h1Scientific} style={{marginBottom:"5px"}}>SCIENTIFIC</Typography>
                            <Typography variant="h1" className={classes.h1Giraffe}>GIRAFFE</Typography>
                        </Grid>
                        <Grid item>
                            <img alt="" src={fur} style={{height: furHeight, marginLeft:furMargin}}/>
                        </Grid>
                    </Grid>
                    <div style={{borderTop: "1px solid #999", marginTop: "10px"}}>&nbsp;</div>
                    <Container className="App">
                        {library
                            ? <Container>
                                {Object.keys(library.tags).map(tag =>
                                    <Chip label={tag.toUpperCase()}
                                          key={tag}
                                          clickable
                                          color={tags.has(tag) ? "primary" : "default"}
                                          onClick={() => toggleTag(tag)}
                                    />)}
                            </Container>
                            : <p>Loading...</p>
                        }
                    </Container>
                    <div style={{borderTop: "1px solid #999", marginTop: "10px"}}>&nbsp;</div>
                </AppBar>
            </Container>

            <Container className="App">

                {error && <Card>
                  <CardContent>
                    <p>Error: ${error?.message || "error"}</p>
                  </CardContent>
                </Card>}
                {library
                    ? <Grid container spacing={10}>
                        {
                            library.resources
                                .filter(resource => tags.size === 0 ? true : hasTag(resource, tags)).map((resource, i) =>
                                <Grid item key={i} xs={12} sm={6} md={4} style={{display: 'flex'}}>
                                    <ResourceCard resource={resource} i={i}/>
                                </Grid>
                            )
                        }

                    </Grid>
                    : <p>loading...</p>}
            </Container>
        </ThemeProvider>
    );
}

export default App;
