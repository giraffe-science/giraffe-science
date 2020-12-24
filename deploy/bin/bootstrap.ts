#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import {CdkBootstrapStack} from "../lib/bootstrap-stack";

const app = new cdk.App();
new CdkBootstrapStack(app, 'CdkBootstrapStack');
