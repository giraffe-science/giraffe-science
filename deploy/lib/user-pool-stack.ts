import {LambdaRestApi} from '@aws-cdk/aws-apigateway';
import * as cognito from "@aws-cdk/aws-cognito";
import {AccountRecovery} from "@aws-cdk/aws-cognito";
import {AssetCode, Function, Runtime} from "@aws-cdk/aws-lambda";
import {PublicHostedZone} from "@aws-cdk/aws-route53";
import * as cdk from "@aws-cdk/core";
import {StackProps} from "@aws-cdk/core";
import * as magic from "aws-cdk-ses-domain-identity";
import 'source-map-support/register';

export interface UserPoolProps extends StackProps {
    adminUser: {
        username: string,
        email: string
    }
}

export class UserPoolStack extends cdk.Stack {
    constructor(scope: cdk.Construct,
                id: string,
                env: string,
                zone: PublicHostedZone,
                transactionalSesDomain: magic.DnsValidatedDomainIdentity,
                props: UserPoolProps) {
        super(scope, id, {
            description: "Scientific Giraffe User Pool",
            ...props

        });

        const signupEmailAddress = `signup@${transactionalSesDomain.domainName}`;
        const userPool = new cognito.UserPool(this, "apiUserPool", {
            userPoolName: `scientific-giraffe-${env}`,
            // Invite only
            userVerification: {
                smsMessage: undefined,
                emailSubject: "Scientific Giraffe: Verify your details",
            },
            selfSignUpEnabled: false,

            passwordPolicy: {minLength: 14},
            autoVerify: {
                email: true
            },
            accountRecovery: AccountRecovery.EMAIL_ONLY,
            signInAliases: {
                email: true,
                preferredUsername: true,
                phone: false,
                username: true
            },
            signInCaseSensitive: false,

            userInvitation: {
                emailSubject: "Scientific Giraffe: Welcome",
            },

            // Unused
            customAttributes: {},
            lambdaTriggers: {},
            standardAttributes: {},

            // SMS
            enableSmsRole: false,
            smsRole: undefined,
            smsRoleExternalId: undefined,

            // MFA
            mfa: undefined,
            mfaSecondFactor: undefined,
        });

        new cognito.CfnUserPoolUser(this, "rootUser", {
            userPoolId: userPool.userPoolId,
            username: props.adminUser.username,
            desiredDeliveryMediums: ["EMAIL"],
            forceAliasCreation: true,
            userAttributes: [
                {
                    name: "email",
                    value: props.adminUser.email
                }
            ]
        })
        const cfnUserPool = userPool.node.defaultChild as cognito.CfnUserPool;

        cfnUserPool.emailConfiguration = {
            emailSendingAccount: 'DEVELOPER',
            from: `Scientific Giraffe <${signupEmailAddress}>`,
            // SES integration is only available in us-east-1, us-west-2, eu-west-1
            sourceArn: `arn:aws:ses:${this.region}:${this.account}:identity/${signupEmailAddress}`,
        };
        const apiFunction = new Function(this, 'apiFunction', {
            code: new AssetCode('src'),
            handler: 'index.handler',
            runtime: Runtime.NODEJS_12_X
        });

        new LambdaRestApi(this, 'apiLambdaRestApi', {
            restApiName: 'Scientific Giraffe API',
            handler: apiFunction,
            proxy: true
        });
    }
}
