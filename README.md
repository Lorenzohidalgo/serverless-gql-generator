# serverless-gql-generator

Serverless Framework Plugin to help generate GraphQL requests

# Installation

```
npm install serverless-gql-generator
```

# Quick start

```yaml
service: my-app

plugins:
  - serverless-gql-generator
```

## Default values and overrideable config

```yaml
service: my-app

plugins:
  - serverless-gql-generator

gql-generator:
  schema:
    path: ./schema.graphql # Overrides default schema path 
    encoding: utf-8
    assumeValidSDL: true
  output:
    directory: ./output # Output directory
    useVariables: true # use variables or have the input inline
    maxDepth: 10 # max depth for schema recursion
    rawRequests: false # set to true to generate raw requests
    postman:
      collectionName: test-name # Overrides colection name, defaults to `${service}-${stage}`
      url: https://test.com/graphql # Overrides url for postman collection
      apiKey: abc-123 # Overrides default API Key if any
```

# CLI

## Schema Validate
```
serverless gql-generator validate-schema
```

## Manual Requests generation
```
serverless gql-generator generate
```