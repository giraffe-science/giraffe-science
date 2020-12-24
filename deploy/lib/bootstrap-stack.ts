#!/usr/bin/env node
import {Group, ManagedPolicy, User} from "@aws-cdk/aws-iam";
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';

const app = new cdk.App();

export class CdkBootstrapStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const deployers = new Group(this, 'deployersGroup', {
            groupName: "deployers",
            managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")],
        });
        new User(this, 'cdkUser', {
            userName: "cdk",
            groups: [deployers]
        });
    }
}

new CdkBootstrapStack(app, 'CdkBootstrapStack', {
    description: `Used to create the IAM role that will be used by AWS CDK.
    Intended to be run with AWS account root credentials.
    
    Once run, create access token(s) for the 'cdk' user`
})
