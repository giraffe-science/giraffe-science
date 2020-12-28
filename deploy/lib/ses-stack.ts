import * as route53 from "@aws-cdk/aws-route53";
import {PublicHostedZone} from "@aws-cdk/aws-route53";
import * as s3 from "@aws-cdk/aws-s3";
import {BucketAccessControl, BucketEncryption} from "@aws-cdk/aws-s3";
import * as ses from "@aws-cdk/aws-ses";
import * as sesActions from '@aws-cdk/aws-ses-actions';
import * as cdk from "@aws-cdk/core";
import {Duration, StackProps} from "@aws-cdk/core";
import * as magic from 'aws-cdk-ses-domain-identity'
import 'source-map-support/register';

export class SesStack extends cdk.Stack {
    readonly transactionalMailSesSubdomain: magic.DnsValidatedDomainIdentity;

    constructor(scope: cdk.Construct, id: string, env: string, zone: PublicHostedZone, props: StackProps) {
        super(scope, id, {
            description: "Scientific Giraffe SES",
            ...props
        });
        // We use a subdomain so that transactional emails do not affect the reputation of our main domain
        const transactionalEmailSubdomain = `hello.${zone.zoneName}`;
        const signupEmailAddress = `signup@${transactionalEmailSubdomain}`;

        // TODO: do we actually need this?
        new magic.DnsValidatedDomainIdentity(this, "sesDomainIdentity", {
            region: props.env?.region,
            domainName: zone.zoneName,
            dkim: true,
            hostedZone: zone
        });
        this.transactionalMailSesSubdomain = new magic.DnsValidatedDomainIdentity(this, "sesDomainIdentitySignup", {
            region: props.env?.region,
            domainName: transactionalEmailSubdomain,
            dkim: true,
            hostedZone: zone
        });
        const cloudwatchProblems = `cloudwatch-problems-${env}`;
        new ses.CfnConfigurationSet(this, "cloudwatchProblemConfigurationSet", {
            name: cloudwatchProblems
        });
        new ses.CfnConfigurationSetEventDestination(this, "cloudwatchProblemEventDestination", {
            configurationSetName: cloudwatchProblems,
            eventDestination: {
                enabled: true,
                name: cloudwatchProblems,
                matchingEventTypes: ["reject", "bounce", "complaint"],
                cloudWatchDestination: {
                    dimensionConfigurations: [{
                        dimensionValueSource: "messageTag",
                        dimensionName: "type",
                        defaultDimensionValue: "unknown",
                    }]
                }
            }
        });
        const signupRepliesBucket = new s3.Bucket(this, "signupSesReplies", {
            bucketName: `sg-signup-ses-replies-${env}`,
            accessControl: BucketAccessControl.PRIVATE,
            encryption: BucketEncryption.S3_MANAGED,
        });
        new ses.ReceiptRuleSet(this, "signupReceiptRuleSet", {
            receiptRuleSetName: `signup-${env}`,
            dropSpam: true,
            rules: [
                {
                    receiptRuleName: `sg-signup-s3-${env}`,
                    recipients: [signupEmailAddress],
                    actions: [
                        new sesActions.S3({
                            bucket: signupRepliesBucket,
                            objectKeyPrefix: "signup-"
                        })
                    ]
                }
            ]
        });
        // https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-mx-record.html
        new route53.MxRecord(this, "transactionalMxRecord", {
            zone,
            recordName: transactionalEmailSubdomain,
            ttl: Duration.minutes(5),
            values: [{
                priority: 10,
                hostName: `inbound-smtp.${props.env?.region}.amazonaws.com`
            }]
        })
    }
}
