# Data store

## Concerns

* Maintenance cost
* Implementation cost

## Decision

Use Postgres free tier. Use Postgres v10.12, so we have an easy path
to move to Aurora serverless if we choose.

Consider Dynamo once our schema has settled.

## Consequences

### Good

* All structured data is in one data store
* We don't need to worry about changing access patterns

### Not so good

* It would be nice to use up the free tier of DynamoDb when we can
* Scaling will be a bit more expensive than DynamoDb
* In year 2, our database will not be part of the free tier

## Rejected

* MySql (Postgres has fewer WTF moments)
* DynamoDb (we don't know our domain yet and Dynamo is expensive to change)

