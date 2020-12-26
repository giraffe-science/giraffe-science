# Deployment

## Context

We need to choose an AWS region to deploy to

## Concerns

* Latency to users
* Availability of services
* Reliability of region
* Price

## Decision

Use `us-west-2`

## Consequences

### Good

* SES is available
* `us-west-2` is more reliable than `us-east-1`

### Not so good

* `us-west-2` is further away from europe than `us-east-1`, so response times willbe slower
* Slightly more expensive than `us-east-1`

## Rejected

* Regions that do not support all SES features, which leaves us with:
  * `us-east-1`
  * `us-west-2`
  * `eu-west-1`

* `eu-west-1`
  * Most of our users will be in the US, and the round trip to Europe would impact 
    latencies

* `us-east-1`
  * Closer to European users than `us-west-2`
  * But, crucially, changes to services are tested here first, and so it often 
    experiences downtime
