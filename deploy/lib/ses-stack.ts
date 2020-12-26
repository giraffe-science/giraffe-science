import {PublicHostedZone} from "@aws-cdk/aws-route53";
import * as cdk from "@aws-cdk/core";
import {StackProps} from "@aws-cdk/core";
import * as magic from 'aws-cdk-ses-domain-identity'
import 'source-map-support/register';


export class SesStack extends cdk.Stack {
    readonly helloSesSubdomain: magic.DnsValidatedDomainIdentity;

    constructor(scope: cdk.Construct, id: string, zone: PublicHostedZone, props: StackProps) {
        super(scope, id, {
            description: "Scientific Giraffe SES",
            ...props
        });

        new magic.DnsValidatedDomainIdentity(this, "sesDomainIdentity", {
            region: props.env?.region,
            domainName: zone.zoneName,
            dkim: true,
            hostedZone: zone
        });
        this.helloSesSubdomain = new magic.DnsValidatedDomainIdentity(this, "sesDomainIdentitySignup", {
            region: props.env?.region,
            domainName: `hello.${zone.zoneName}`,
            dkim: true,
            hostedZone: zone
        });
    }
}
