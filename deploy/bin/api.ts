#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import {ApiStack, ApiStackProps} from '../lib/api-stack';

const prod: ApiStackProps = {
    id: "ApiStack",
    domainName: 'giraffe.science'
};
const app = new cdk.App();
new ApiStack(app, prod);
