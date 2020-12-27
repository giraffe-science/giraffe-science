import {LambdaRestApi} from '@aws-cdk/aws-apigateway';
import {AssetCode, Function, Runtime} from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import {StackProps} from "@aws-cdk/core";
import 'source-map-support/register';


export class ApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string,env:string, props: StackProps) {
        super(scope, id, {
            description: "Scientific Giraffe Api",
            ...props
        });

        const apiFunction = new Function(this, 'apiFunction', {
            code: new AssetCode('src'),
            handler: 'index.handler',
            runtime: Runtime.NODEJS_12_X
        });

        new LambdaRestApi(this, 'apiLambdaRestApi', {
            restApiName: `Scientific Giraffe Api ${env}`,
            handler: apiFunction,
            proxy: true
        });
    }
}
