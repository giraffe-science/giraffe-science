import {LambdaRestApi} from '@aws-cdk/aws-apigateway';
import {AssetCode, Function, Runtime} from "@aws-cdk/aws-lambda";
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';

const app = new cdk.App();

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
  }
}

new ApiStack(app, 'ApiStack')
