import {Environment} from "@aws-cdk/core/lib/environment";
import {DnsStackProps} from "../lib/dns-stack";

export type Props = {
    name: string
    environment: Environment
    dns: DnsStackProps
}
export const environments: { [env: string]: () => Props } = {
    prod: () => ({
        name: "prod",
        environment: {
            account: expectEnv('SCIENTIFIC_GIRAFFE_PROD_ACCOUNT'),
            region: "us-west-2"
        },
        dns: {
            domainName: 'giraffe.science'
        }
    })
}

function expectEnv(name: string): string {
    if (!process.env.hasOwnProperty(name))
        throw new Error(`${name} was not defined`)
    return process.env[name] as string;
}

export const envKey = expectEnv('SCIENTIFIC_GIRAFFE_ENV');

export function getProps(): Props {
    if (!environments.hasOwnProperty(envKey))
        throw new Error(`SCIENTIFIC_GIRAFFE_ENV '${envKey}' does not exist`);
    return environments[envKey]();
}
