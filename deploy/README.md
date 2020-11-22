## How we set up a new AWS account

* Create the AWS account
* Create an access key for the root user **and delete it at the end of these steps**
* Bootstrap CDK in `us-east` https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html
```
ACCOUNT={{account}}
REGION=us-east-1
AWS_ACCESS_KEY_ID={{access key}} 
AWS_SECRET_ACCESS_KEY={{secret key}} 
yarn run cdk bootstrap aws://$ACCOUNT/$REGION
```
* Create IAM user and groups ready for CDK to use 
```
AWS_ACCESS_KEY_ID={{access key}} AWS_SECRET_ACCESS_KEY={{secret key}} yarn run cdk deploy -a bin/cdk-bootstrap.js
```
* Delete the access key for the root user
* Create an access key for the `cdk` user https://console.aws.amazon.com/iam/home#/users/cdk?section=security_credentials
* Add the cdk key details to github secrets
  https://github.com/giraffe-science/giraffe-science.github.io/settings/secrets/actions
