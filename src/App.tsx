import {Card} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import React, {useState} from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import './App.css';
import {Users} from "./auth/Users";
import {SignInButton} from "./components/SignInButton";
import fur2 from "./images/fur-2.png"
import fur from "./images/fur.png"
import {Library} from "./library/Library";
import {Lookup} from "./library/Lookup";
import {PrivacyPolicy} from "./PrivacyPolicy";
import {ResourcePage} from "./ResourcePage";
import {ResourcesPage} from "./ResourcesPage";
import {theme, useClasses} from "./styles";
import {TermsOfService} from "./TermsOfService";

export function App({loading, lookup, users}: { loading: Promise<Library>, lookup: Lookup, users: Users }) {
    const classes = useClasses();
    const [error, setError] = useState<any>();
    const [library, setLibrary] = useState<Library>();

    loading
        .then(library => setLibrary(library))
        .catch(setError);

    if (error)
        console.log(error);


    const furHeight = "62px";
    const furMargin = "8px";
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <CssBaseline/>
                <Container>
                    <AppBar className={classes.appBar} position="sticky">
                        <div style={{borderBottom: "1px solid #999", marginBottom: "10px"}}>&nbsp;</div>
                        <Link to="/">
                            <Grid container>
                                <Grid container item xs={3} justify="flex-start" alignItems="center"/>
                                <Grid container item justify="center" xs={6}>
                                    <Grid item>
                                        <img alt="" src={fur} style={{height: furHeight, marginRight: furMargin}}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h1" className={classes.h1Scientific}
                                                    style={{marginBottom: "5px"}}>SCIENTIFIC</Typography>
                                        <Typography variant="h1" className={classes.h1Giraffe}>GIRAFFE</Typography>
                                    </Grid>
                                    <Grid item>
                                        <img alt="" src={fur2} style={{height: furHeight, marginLeft: furMargin}}/>
                                    </Grid>
                                </Grid>
                                <Grid container item xs={3} justify="flex-end" alignItems="center">
                                    {/*<SignInButton users={users}/>*/}
                                </Grid>
                            </Grid>
                        </Link>
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

                <Switch>
                    <Route path="/resources/:identifierType/:identifier">
                        {library && <ResourcePage library={library} lookup={lookup}/>}
                    </Route>
                    <Route path="/privacy">
                        <PrivacyPolicy/>
                    </Route>
                    <Route path="/tos">
                        <TermsOfService/>
                    </Route>
                    <Route path="/">
                        {library && <ResourcesPage library={library} lookup={lookup}/>}
                    </Route>
                </Switch>
                <Container>
                    <div style={{borderTop: "1px solid #999", marginTop: "10px"}}/>
                    <Grid container
                          justify="center"
                          spacing={1}
                          alignContent="center"
                          alignItems="center"
                          style={{minHeight:"40px"}}>
                        <Grid item>
                            <Link to={"/privacy"}>privacy</Link> | <Link to={"/tos"}>terms of service</Link>
                        </Grid>
                    </Grid>
                </Container>
            </Router>
        </ThemeProvider>
    );
}
