# Hosting

## Concerns

* Cheap
* Flexible
* Familiar
* Easy to automate
* Services needed:
  * File storage (article PDFs, eventually)
  * Email
  * Login and , including Facebook login

## Decision

Use AWS.

## Consequences

### Good

* We'll never run out of road- every service we might need in future will be available
* We can use [cdk](./doc/adrs/deployment.md) to provide [infrastructure as code](https://en.wikipedia.org/wiki/Infrastructure_as_code)
  so we get a version history of all the infrastructure changes we've made, and we
  can see all the infrastructure in one place, instead of scattered around the AWS console
* Free tier is free:
  * Enough lambda time for a small site
  * Free micro database for a year
  * 5GB of S3 file storage
  * 65,000 emails a month
* Our developer already knows how to use AWS

### Not so good

* It's more complicated than Heroku 

## Rejected

* AWS Lightsail (still AWS, but using batteries-included configuration)
  * Was already quite far down the track with configuring things ourselves
* Azure 
  * Previous experience has not been good- never again
* Google Compute Platform
  * Unfamiliar to our developer
  * Less rich services available than AWS
  * Infrastruture as code requires Terraform, which is not as nice as CDK
* Heroku
  * Fewer features
  * Infrastruture as code requires Terraform, which is not as nice as CDK


