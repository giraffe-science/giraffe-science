import {ErrorReports} from "../util/ErrorReports";

export type User = {
    name: string,
    id: string
}

export type FullUser = User & {
    groups: any
}

function fb(): Promise<fb.FacebookStatic> {
    return new Promise<facebook.FacebookStatic>((resolve) => {
        function wait() {
            if (window.FB) resolve(window.FB);
            else
                setInterval(wait, 1000);
        }

        wait();
    })
}

export class Facebook {
    constructor(private errors: ErrorReports) {
    }

    async status(): Promise<facebook.StatusResponse> {
        return this.errors.promise((resolve) => {
            fb().then(fb => fb.getLoginStatus(async (response) => {
                    console.log(response);
                    resolve(response);
                })
            )
        })
    }

    async logout(): Promise<facebook.StatusResponse> {
        console.log("LOGOUT");
        return this.errors.promise((resolve) => {
            fb().then(fb => fb.logout((response) => {
                console.log("logout", response);
                resolve(response);
            }))
        })
    }

    async login(): Promise<facebook.StatusResponse> {
        return this.errors.promise((resolve, reject) => {
            fb().then(fb => fb.login(function (response) {
                    console.log("login", response);
                    if (response.authResponse) {
                        resolve(response)
                    } else {
                        reject(response);
                    }
                },
                {
                    return_scopes: true,
                    scope: "groups_access_member_info,email,publish_to_groups"
                }))
        })
    }

    async user(): Promise<FullUser | null> {
        return this.errors.promise((resolve, reject) => {
            fb().then(fb => fb.api('/me', function (me: any) {
                if (me.error) {
                    console.log("could not get 'me'", me.error);
                    resolve(null);
                } else {
                    FB.api(
                        `/${me.id}/groups`,
                        function (groups: any) {
                            if (groups.error) {
                                reject(groups.error)
                            } else {
                                resolve({...me, groups});
                            }
                        }
                    );
                }
            }))
        });

    }
}
