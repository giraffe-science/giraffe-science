import {Card} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import React, {useState} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import './App.css';
import fur from "./images/fur.png"
import {Library} from "./Library";
import {Resources} from "./Resources";
import {theme, useClasses} from "./styles";


export function App({loading}: { loading: Promise<Library> }) {
    const classes = useClasses();
    const [error, setError] = useState<any>();
    const [library, setLibrary] = useState<Library>();

    loading
        .then(library => setLibrary(library))
        .catch(setError);

    if (error)
        console.log(error);


    const furHeight = "60px";
    const furMargin = "8px";
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <CssBaseline/>
                <Container>
                    <AppBar className={classes.appBar} position="sticky">
                        <div style={{borderBottom: "1px solid #999", marginBottom: "10px"}}>&nbsp;</div>
                        <Grid container justify="center">
                            <Grid item>
                                <img alt="" src={fur} style={{height: furHeight, marginRight: furMargin}}/>
                            </Grid>
                            <Grid item>
                                <Typography variant="h1" className={classes.h1Scientific}
                                            style={{marginBottom: "5px"}}>SCIENTIFIC</Typography>
                                <Typography variant="h1" className={classes.h1Giraffe}>GIRAFFE</Typography>
                            </Grid>
                            <Grid item>
                                <img alt="" src={fur} style={{height: furHeight, marginLeft: furMargin}}/>
                            </Grid>
                        </Grid>
                        <div style={{borderTop: "1px solid #999", marginTop: "10px"}}>&nbsp;</div>

                    </AppBar>
                </Container>
                {error &&
                <Container className="App"><Card>
                  <CardContent>
                    <p>Error: ${error?.message || "error"}</p>
                  </CardContent>
                </Card></Container>}
                {!library && <Container className="App"><p>Loading...</p></Container>}

                {library && <Resources library={library}/>}
            </Router>
        </ThemeProvider>
    );
}

export default App;
