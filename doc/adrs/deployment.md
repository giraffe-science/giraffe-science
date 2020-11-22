# Deployment

## Context

We want to deploy our backend services to AWS

## Concerns

* Easy to understand
* Easy to change, safely
* Repeatable
* Zero budget
* Ideally a single way to define our whole infrastructure

## Decision

Use AWS CDK

## Consequences

### Good

* Close to zero cost
* Environments can be described in code instead of thousands of lines
  of yaml or xml
* Can be expressed in typescript, like the rest of the stack
* You can see the resources we've created as CloudFormation stacks
  in AWS console
* State of previous runs are stored in CloudFormation- no need for 
  separate management of state, as with Terraform https://www.terraform.io/docs/state/index.html

### Not so good

* Another tool to learn

## Rejected

* CloudFormation https://aws.amazon.com/cloudformation/
  * Templating mechanisms are unreadable and messy
  * Xml
  * Quickly approaches thousands of lines of config

* Terraform https://www.terraform.io/
  * yaml templating is unreadable and messy- always end up generating the 
    yaml from a proper programming language
  * Need to store state somewhere
  * No native concept of promoting a configuration
  * End up needing https://terragrunt.gruntwork.io for grown-up
    management

* Pulumi https://www.pulumi.com/
  * No additional templating language, which is great
  * But $50 a month if we want collaboration https://www.pulumi.com/pricing/

* Serverless https://www.serverless.com/
  * We potentially run out of road if we use AWS services it doesn't support
  * Eventually costs money
