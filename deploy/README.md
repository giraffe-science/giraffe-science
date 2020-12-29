## Checklist when changing infrastructure


## How we set up a new AWS environment/account

We use AWS CDK to deploy infrastructure, for reasons documented 
[here](../doc/adrs/deployment.md).

We use one account per environment, so it's easier to reason about permissions when
we lock down prod.
 
We do not currently use AWS Organisations, to keep complexity low, but might do in future.

We chose `us-west-2` for our main region, for reasons documented 
[here](../doc/adrs/aws-region.md)

### Create new environment config

Add config details to [bin/config.ts](bin/config.ts)

> NB: do not check in account number. Use an environment variable instead, e.g.:
> `expectEnv('SCIENTIFIC_GIRAFFE_PROD_ACCOUNT')`

### Prepare the AWS account

1) Create the AWS account
1) Move SES out of sandbox mode:
   https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html
   > NB: this needs to be done once for each region
1) Make sure the root user has MFA configured

### Bootstrap CDK

1) Create an access key for the root user **and delete it at the end of these steps**
1) Bootstrap CDK in the region you're targetting https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html

   ```
   ACCOUNT={{account}}
   REGION={{region}}
   AWS_ACCESS_KEY_ID={{access key}} # root account 
   AWS_SECRET_ACCESS_KEY={{secret key}} # root account 
   yarn run cdk bootstrap aws://$ACCOUNT/$REGION
   ```

1) Create IAM user and groups ready for CDK to use using 
   [bin/deploy-cdk-bootstrap.ts](bin/deploy-cdk-bootstrap.ts)

   ```
   AWS_ACCESS_KEY_ID={{access key}} # root account 
   AWS_SECRET_ACCESS_KEY={{secret key}} # root account 
   SCIENTIFIC_GIRAFFE_ENV={{env}} 
   yarn run cdk deploy -a "npx ts-node bin/deploy-cdk-bootstrap.ts"
   ```

1) Delete the access key for the root user
   > NB: Don't forget to do this! Root users should never have access keys.
1) Create an access key for the `cdk` user https://console.aws.amazon.com/iam/home#/users/cdk?section=security_credentials
1) Add the cdk key details to github secrets
   https://github.com/giraffe-science/giraffe-science.github.io/settings/secrets/actions   

### Deploy the stack

See: [bin/deploy.ts](bin/deploy.ts).

```
AWS_ACCESS_KEY_ID={{access key}} # cdk user
AWS_SECRET_ACCESS_KEY={{secret key}}  # cdk user
SCIENTIFIC_GIRAFFE_ENV={{env}} 
yarn run cdk deploy --all
```

This might take a long time the first time and seem like it's hung while creating 
`sesDomainIdentity`. Don't worry, this step takes up to 10 minutes; just let it run.

The first time round will fail with:
```
Amazon SES account is in Sandbox. Verify Send-to email address or Amazon SES Account
```

You'll need to [manually verify](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html)
the `signup@hello.${domain}` email address. 

As long as the ses stack has deployed, Amazon's verification email will end up in the 
`${??}-signup-ses-replies-${env}` s3 bucket and you can find a link to follow there.

### Point domain at Route53

At time of writing, [Route53 does not support .science TLDs](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/registrar-tld-list.html#S). 
So our registrar is still [gandi.net](gandi.net).

Our stack includes a Route53 hosted zone, and you need to log in to your registrar and
point each domain at the name servers for the hosted zone.

Instructions are [here](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/migrate-dns-domain-inactive.html#migrate-dns-update-domain-inactive).
