#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import {ApiStack} from '../lib/api-stack';

const app = new cdk.App();
new ApiStack(app, 'ApiStack');
