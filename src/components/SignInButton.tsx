import Button from "@material-ui/core/Button";
import React from "react";
import {SiFacebook} from 'react-icons/si';
import {Facebook, FullUser} from "../auth/Facebook";

export function SignInButton({facebook, user, setUser}: { facebook: Facebook, user: FullUser | undefined | null, setUser: (user: FullUser | null) => void }) {
    const hasFetchedUser = typeof user !== "undefined";
    const hasUser = Boolean(user);

    if (!hasFetchedUser) facebook.user().then(setUser).catch()

    const buttonText = hasUser ? "Logout" : "Login";
    const onClick = () => {
        if (hasUser) {
            facebook
                .logout()
                .then(() => setUser(null))
                .catch();
        } else {
            facebook.login()
                .then(() => facebook.user())
                .then(setUser)
                .catch();
        }
    };

    return <React.Fragment>
        {hasFetchedUser && <Button variant="outlined" color="primary" onClick={onClick}><SiFacebook/>&nbsp;&nbsp;{
            buttonText
        }</Button>}
    </React.Fragment>
}
