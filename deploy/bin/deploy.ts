#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import {ApiStack} from '../lib/api-stack';
import {DnsStack} from "../lib/dns-stack";
import {SesStack} from "../lib/ses-stack";
import {UserPoolStack} from "../lib/user-pool-stack";
import {getProps} from "./config";

const props = getProps();
const env = props.environment;
const app = new cdk.App();

const dns = new DnsStack(app, `SgDns-${props.name}`, {...props.dns, env});
const ses = new SesStack(app, `SgSes-${props.name}`, dns.zone, {env});
// new UserPoolStack(app, `SgUserPool-${props.name}`, dns.zone, ses.helloSesSubdomain, {env});
new ApiStack(app, `SgApi-${props.name}`, {env});
