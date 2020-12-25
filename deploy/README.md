## How we set up a new AWS account

### Bootstrap CDK

We use AWS CDK to deploy infrastructure, for reasons documented [here](../doc/adrs/deployment.md).

1) Create the AWS account
2) Create an access key for the root user **and delete it at the end of these steps**
3) Bootstrap CDK in `us-east` https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html

   ```
   ACCOUNT={{account}}
   REGION=us-east-1
   AWS_ACCESS_KEY_ID={{access key}} 
   AWS_SECRET_ACCESS_KEY={{secret key}} 
   yarn run cdk bootstrap aws://$ACCOUNT/$REGION
   ```

4) Create IAM user and groups ready for CDK to use 

   ```
   AWS_ACCESS_KEY_ID={{access key}} AWS_SECRET_ACCESS_KEY={{secret key}} yarn run cdk deploy -a "npx ts-node bin/bootstrap.ts"
   ```

5) Delete the access key for the root user
6) Create an access key for the `cdk` user https://console.aws.amazon.com/iam/home#/users/cdk?section=security_credentials
7) Add the cdk key details to github secrets
   https://github.com/giraffe-science/giraffe-science.github.io/settings/secrets/actions   

### Deploy the stack 

```
AWS_ACCESS_KEY_ID={{access key}} 
AWS_SECRET_ACCESS_KEY={{secret key}} 
yarn run cdk deploy
```

### Point domain at Route53

At time of writing, [Route53 does not support .science](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/registrar-tld-list.html#S)
domains. So our registrar is still [gandi.net](gandi.net).

Our stack includes a Route53 hosted zone, which as of the current deployment is 
[here](https://console.aws.amazon.com/route53/v2/hostedzones#ListRecordSets/Z06476631ST7OH4711Z2G).

Our Gandi DNS [points at the nameservers for the hosted zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/migrate-dns-domain-inactive.html#migrate-dns-update-domain-inactive).
