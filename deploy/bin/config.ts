import {Environment} from "@aws-cdk/core/lib/environment";
import {DnsStackProps} from "../lib/dns-stack";
import {UserPoolProps} from "../lib/user-pool-stack";
import {PatientScienceEnv} from "../lib/util";

export type Props = {
    environment: PatientScienceEnv
    dns: DnsStackProps
    users: UserPoolProps
}
export const environments: { [env: string]: () => Props } = {
    prod: () => ({
        environment: {
            name:"Production",
            protectFromDataDeletion:true,
            account: expectEnv('SCIENTIFIC_GIRAFFE_PROD_ACCOUNT'),
            region: "us-west-2"
        },
        dns: {
            domainName: 'giraffe.science'
        },
        users: {
            adminUser: {
                username: "root",
                email: expectEnv('SCIENTIFIC_GIRAFFE_PROD_ROOT_USER_EMAIL'),
            }
        }
    })
}

function expectEnv(name: string): string {
    if (!process.env.hasOwnProperty(name))
        throw new Error(`${name} was not defined`)
    return process.env[name] as string;
}


export function getProps(): { env: string, props: Props } {
    const env = expectEnv('SCIENTIFIC_GIRAFFE_ENV');
    if (!environments.hasOwnProperty(env))
        throw new Error(`SCIENTIFIC_GIRAFFE_ENV '${env}' does not exist`);
    return {
        env,
        props: environments[env]()
    };
}
