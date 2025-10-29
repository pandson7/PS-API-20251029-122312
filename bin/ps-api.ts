#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PsApiStack } from '../lib/ps-api-stack';

const app = new cdk.App();
new PsApiStack(app, 'PsApiStack20251029122312', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
