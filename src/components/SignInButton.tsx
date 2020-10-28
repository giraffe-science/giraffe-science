import {Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import React, {useRef, useState} from "react";
import {Users} from "../auth/Users";

type State = {
    email?: string
    password?: string
}

export function EmailPassword({title, state, setState, onSubmit}: { title: string, state: State, setState: (state: State) => void, onSubmit: (state: State) => void }) {
    return <React.Fragment>
        <TextField required
                   label="Email"
                   value={state.email}
                   onChange={(e) =>
                       setState({...state, email: e.target.value})}
                   fullWidth={true}
                   style={{marginBottom: "10px"}}/>
        <TextField required
                   label="Password"
                   type="password"
                   value={state.password}
                   onChange={(e) =>
                       setState({...state, password: e.target.value})}
                   fullWidth={true}
                   style={{marginBottom: "10px"}}/>

        <Grid container justify="flex-end" alignItems="center">
            <Button variant="contained" color="primary"
                    onClick={() => {
                        FB.login(function(response) {
                            if (response.authResponse) {
                                console.log('Welcome!  Fetching your information.... ');
                                FB.api('/me', function(response:any) {
                                    console.log('Good to see you, ' + response.name + '.');
                                    var userId=response.id
                                    FB.api(
                                        `/${userId}/groups`,
                                        function (response:any) {
                                            if(response.error){
                                                console.log(response.error);
                                            }
                                            if (response && !response.error) {
                                                console.log(response);
                                            }
                                        }
                                    );

                                });
                            } else {
                                console.log('User cancelled login or did not fully authorize.');
                            }
                        },
                            {return_scopes:true,scope:"groups_access_member_info"});
                        onSubmit(state)
                    }}>{title}</Button>
        </Grid>
    </React.Fragment>
}

export function SignInButton({users}: { users: Users }) {
    const [showSignIn, setShowSignIn] = useState<boolean>(false);
    const [tab, setTab] = useState<number>(0);
    const [state, setState] = useState<State>({});
    const signInButton = useRef(null);
    const isLogin = tab === 0;
    const isRegister = tab === -1;
    return <React.Fragment>
        <Grid item>
            <Button variant={"contained"}
                    color="primary"
                    ref={signInButton}
                    onClick={() => {
                        setShowSignIn(!showSignIn)
                    }}>
                Sign in
            </Button>
        </Grid>
        <Popover
            id={showSignIn ? "sign-in-popover" : undefined}
            open={showSignIn}
            anchorEl={signInButton.current}
            onClose={() => setShowSignIn(false)}
            anchorOrigin={{horizontal: "right", vertical: "bottom"}}
            transformOrigin={{horizontal: "right", vertical: "top"}}
        >
            <Paper elevation={5} style={{width: "300px", backgroundColor: "#666", padding: "15px"}}>
                <Grid style={{backgroundColor: "white", padding: "15px"}}>
                    <Tabs value={tab}
                          variant="fullWidth"
                          indicatorColor="primary"
                          textColor="primary"
                          onChange={(e, value) => setTab(value)}
                          style={{marginBottom:"10px"}}
                          aria-label="Login or register">
                        <Tab label="Login" fullWidth={true} style={{padding: "0px", minWidth: "120px"}}/>
                        <Tab label="Register" fullWidth={true} style={{padding: "0px", minWidth: "120px"}}/>
                    </Tabs>
                    <EmailPassword title={isLogin ? "Login" : "Register"}
                                   state={state}
                                   setState={setState}
                                   onSubmit={(state)=>{
                                       // if(isRegister){
                                       //     users.signup(state).then()
                                       // }
                                   }}
                    />
                </Grid>
            </Paper>
        </Popover>

    </React.Fragment>
}
