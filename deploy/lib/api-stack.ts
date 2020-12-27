import * as api from "@aws-cdk/aws-apigateway";
import {ICertificate} from "@aws-cdk/aws-certificatemanager/lib/certificate";
import * as lambda from "@aws-cdk/aws-lambda";
import * as route53 from "@aws-cdk/aws-route53";
import * as targets from "@aws-cdk/aws-route53-targets";
import * as cdk from "@aws-cdk/core";
import {StackProps} from "@aws-cdk/core";
import 'source-map-support/register';

export interface ApiProps extends StackProps {
    zone: route53.HostedZone,
    certificate: ICertificate
}

export class ApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, env: string, props: ApiProps) {
        super(scope, id, {
            description: "Scientific Giraffe Api",
            ...props
        });

        const apiFunction = new lambda.Function(this, 'apiFunction', {
            code: new lambda.AssetCode('src'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_12_X
        });
        const apiLambda = new api.LambdaRestApi(this, 'apiLambdaRestApi', {
            restApiName: `Scientific Giraffe Api ${env}`,
            handler: apiFunction,
            proxy: true,
            endpointTypes: [api.EndpointType.EDGE],
            defaultCorsPreflightOptions: {
                // TODO: tighten this up
                allowOrigins: api.Cors.ALL_ORIGINS,
            },
            domainName: {
                domainName: `api.${props.zone.zoneName}`,
                certificate: props.certificate,
                endpointType: api.EndpointType.EDGE
            }
        });
        new route53.ARecord(this, 'CustomDomainAliasRecord', {
            zone: props.zone,
            recordName: 'api',
            target: route53.RecordTarget.fromAlias(new targets.ApiGateway(apiLambda)),
        })
    }
}
