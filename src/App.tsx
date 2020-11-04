import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import {Alert} from "@material-ui/lab";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import React, {useState} from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import './App.css';
import {Facebook, FullUser} from "./auth/Facebook";
import {SignInButton} from "./components/SignInButton";
import {FeatureFlags} from "./FeatureFlags";
import fur2 from "./images/fur-2.png"
import fur from "./images/fur.png"
import {Library} from "./library/Library";
import {Lookup} from "./library/Lookup";
import {PrivacyPolicy} from "./PrivacyPolicy";
import {ResourcePage} from "./ResourcePage";
import {ResourcesPage} from "./ResourcesPage";
import {theme, useClasses} from "./styles";
import {TermsOfService} from "./TermsOfService";
import {ErrorReports} from "./util/ErrorReports";

export type Props = { loading: Promise<Library>, lookup: Lookup, facebook: Facebook, errors: ErrorReports, flags: FeatureFlags };

export function App({loading, lookup, facebook, errors, flags}: Props) {
    const classes = useClasses();
    const [error, setError] = useState<any>();
    const [library, setLibrary] = useState<Library>();
    const [user, setUser] = useState<FullUser | null | undefined>(undefined);

    errors.add(setError);

    loading
        .then(library => setLibrary(library))
        .catch(errors.reporter);

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
                                <Grid container item xs={3} justify="flex-start" alignItems="center">
                                    {flags.signIn && <SignInButton facebook={facebook} user={user} setUser={setUser}/>}
                                    <Typography>{JSON.stringify(user?.groups)}</Typography>
                                </Grid>
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
                                    {/*<SignInButton facebook={facebook}/>*/}
                                </Grid>
                            </Grid>
                        </Link>
                        <div style={{borderTop: "1px solid #999", marginTop: "10px"}}>&nbsp;</div>
                    </AppBar>
                </Container>

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

                <Snackbar open={Boolean(error)} autoHideDuration={6000}>
                    <Alert onClose={() => setError(null)} severity="error">
                        {error?.message || "Something went wrong"}
                    </Alert>
                </Snackbar>

                <Container>
                    <div style={{borderTop: "1px solid #999", marginTop: "100px"}}/>
                    <Grid container
                          justify="center"
                          spacing={1}
                          alignContent="center"
                          alignItems="center"
                          style={{minHeight: "40px"}}>
                        <Grid item>
                            <Link to={"/privacy"}>privacy</Link> | <Link to={"/tos"}>terms of service</Link>
                        </Grid>
                    </Grid>
                </Container>
            </Router>
        </ThemeProvider>
    );
}
