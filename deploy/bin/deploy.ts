#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import {ApiStack} from '../lib/api-stack';
import {DnsStack} from "../lib/dns-stack";
import {SesStack} from "../lib/ses-stack";
import {UserPoolStack} from "../lib/user-pool-stack";
import {getProps} from "./config";

const {env: envName, props} = getProps();
const app = new cdk.App();
const env = props.environment;
const dns = new DnsStack(app, `SgDns-${envName}`, envName, {
    ...props.dns,
    env: props.environment
});
const ses = new SesStack(app, `SgSes-${envName}`, envName, dns.zone, {
    env
});
new UserPoolStack(app, `SgUserPool-${envName}`, envName, dns.zone, ses.transactionalMailSesSubdomain, {
    env,
    ...props.users
});
new ApiStack(app, `SgApi-${envName}`, envName, {
    env,
    zone: dns.zone,
    certificate: dns.rootEdgeCertificate
});
