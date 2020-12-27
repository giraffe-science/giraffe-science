#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import {CdkBootstrapStack} from "../lib/bootstrap-stack";
import {getProps} from "./config";

const {env, props} = getProps();
const app = new cdk.App();

new CdkBootstrapStack(app, `SgCdk-${env}`, env, {
    env: props.environment
});
