import {CognitoUser, CognitoUserPool, ISignUpResult} from "amazon-cognito-identity-js";

type Signup = {
    email: string;
    password: string;
}
type ConfirmSignup = {
    email: string;
    code: string;
}

export interface Users {
    signup(signup: Signup): Promise<ISignUpResult>;
    confirm(confirm: ConfirmSignup): Promise<ISignUpResult>;
}

function callback<T, E>(reject: (reason?: any) => void,
                        resolve: (value?: (PromiseLike<T> | T)) => void) {
    return (e?: E, result?: T) => {
        if (e) {
            reject(e)
        } else {
            resolve(result)
        }
    };
}

export class CognitoUsers implements Users {
    constructor(private userPool: CognitoUserPool) {


    }

    static connect(poolId: string, clientId: string) {
        const userPool = new CognitoUserPool({
            UserPoolId: poolId,
            ClientId: clientId
        });
        return new CognitoUsers(userPool)
    }

    signup(signup: Signup): Promise<ISignUpResult> {
        return new Promise((resolve, reject) => this.userPool.signUp(
            signup.email,
            signup.password,
            [],
            [],
            callback(reject, resolve)
        ));
    }

    confirm(confirm: ConfirmSignup): Promise<ISignUpResult> {
        const user = new CognitoUser(
            {Username: confirm.email, Pool: this.userPool}
        );
        return new Promise((resolve, reject) =>
            user.confirmRegistration(confirm.code, true, callback(reject, resolve)));

    }

}
