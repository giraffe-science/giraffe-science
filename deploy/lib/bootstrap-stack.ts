#!/usr/bin/env node
import {Group, ManagedPolicy, User} from "@aws-cdk/aws-iam";
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';

export interface CdkBootstrapProps extends cdk.StackProps {
    environmentName: string
}

export class CdkBootstrapStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: CdkBootstrapProps) {
        super(scope, id, {description: "User and group used by CDK to deploy", ...props});

        const deployers = new Group(this, 'deployersGroup', {
            groupName: `deployers-${props.environmentName}`,
            managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")],
        });
        new User(this, 'cdkUser', {
            userName: `cdk-${props.environmentName}`,
            groups: [deployers]
        });
    }
}
