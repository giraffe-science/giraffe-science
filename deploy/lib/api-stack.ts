import {LambdaRestApi} from '@aws-cdk/aws-apigateway';
import {AssetCode, Function, Runtime} from "@aws-cdk/aws-lambda";
import * as route53 from "@aws-cdk/aws-route53";
import {PublicHostedZone} from "@aws-cdk/aws-route53";
import * as cdk from "@aws-cdk/core";
import {Duration} from "@aws-cdk/core";
import * as magic from 'aws-cdk-ses-domain-identity'
import 'source-map-support/register';

function gandiMail(zone: PublicHostedZone) {
    const stack = zone.stack;
    // @	MX	300	10 spool.mail.gandi.net.
    // @	MX	300	50 fb.mail.gandi.net.
    new route53.MxRecord(stack, "mail", {
        values: [{
            priority: 10,
            hostName: "spool.mail.gandi.net."
        },
            {
                priority: 50,
                hostName: "fb.mail.gandi.net."
            }],
        zone,
        ttl: Duration.minutes(5),
    })
    // @	TXT	300	"v=spf1 include:_mailcust.gandi.net ?all"
    new route53.TxtRecord(stack, "spf", {
        values: ["v=spf1 include:_mailcust.gandi.net ?all"],
        comment: "https://support.dnsimple.com/articles/spf-record/",
        zone,
        ttl: Duration.minutes(5),
    })
    // _imap._tcp	SRV	300	0 0 0 .
    new route53.SrvRecord(stack, "imap", {
        recordName: "_imap._tcp",
        values: [{
            priority: 0,
            weight: 0,
            port: 0,
            hostName: "."
        }],
        zone,
        ttl: Duration.minutes(5),
    })
    // _imaps._tcp	SRV	300	0 1 993 mail.gandi.net.
    new route53.SrvRecord(stack, "imaps", {
        recordName: "_imaps._tcp",
        comment: "https://support.dnsimple.com/articles/srv-record/",
        values: [{
            priority: 200,
            weight: 1,
            port: 993,
            hostName: "mail.gandi.net."
        }],
        zone,
        ttl: Duration.minutes(5),
    })
    // _pop3._tcp	SRV	300	0 0 0 .
    new route53.SrvRecord(stack, "pop3", {
        recordName: "_pop3._tcp",
        values: [{
            priority: 0,
            weight: 0,
            port: 0,
            hostName: "."
        }],
        zone,
        ttl: Duration.minutes(5),
    })
    // _pop3s._tcp	SRV	300	10 1 995 mail.gandi.net.
    new route53.SrvRecord(stack, "pop3s", {
        recordName: "_pop3s._tcp",
        values: [{
            priority: 10,
            weight: 1,
            port: 995,
            hostName: "mail.gandi.net."
        }],
        zone,
        ttl: Duration.minutes(5),
    })
    // _submission._tcp	SRV	300	0 1 465 mail.gandi.net.
    new route53.SrvRecord(stack, "submission", {
        recordName: "_submission._tcp",
        values: [{
            priority: 0,
            weight: 1,
            port: 465,
            hostName: "mail.gandi.net."
        }],
        zone,
        ttl: Duration.minutes(5),
    })
    // webmail	CNAME	300	webmail.gandi.net.
    new route53.CnameRecord(stack, "webmail", {
        recordName: "webmail",
        domainName: "webmail.gandi.net",
        zone,
        ttl: Duration.minutes(5),
    })
}

function githubPages(zone: PublicHostedZone) {
    // www	CNAME	300	giraffe-science.github.io.
    new route53.CnameRecord(zone.stack, "www", {
        recordName: "www",
        domainName: "giraffe-science.github.io.",
        zone,
        ttl: Duration.minutes(5),
    });
    // @	A	300	185.199.108.153
    // @	A	300	185.199.109.153
    // @	A	300	185.199.110.153
    // @	A	300	185.199.111.153
    new route53.ARecord(zone.stack, "github pages", {
        target: {
            values: [
                "185.199.108.153",
                "185.199.109.153",
                "185.199.110.153",
                "185.199.111.153"]
        },
        zone,
        ttl: Duration.minutes(5),
    });
}
export type ApiStackProps = {
    id:string,
    domainName:string,
}

export class ApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, props: ApiStackProps) {
        super(scope, props.id, {
            description: "Scientific Giraffe Api"
        });

        const apiFunction = new Function(this, 'apiFunction', {
            code: new AssetCode('src'),
            handler: 'index.handler',
            runtime: Runtime.NODEJS_12_X
        });

        const apiLambdaRestApi = new LambdaRestApi(this, 'apiLambdaRestApi', {
            restApiName: 'Scientific Giraffe API',
            handler: apiFunction,
            proxy: true
        });

        const zone = new route53.PublicHostedZone(this, "giraffeScienceZone", {
            zoneName: props.domainName
        });
        gandiMail(zone);
        githubPages(zone);
        new magic.DnsValidatedDomainIdentity(this, "sesDomainIdentity", {
            domainName: props.domainName,
            dkim:true,
            hostedZone:zone
        })
    }
}
