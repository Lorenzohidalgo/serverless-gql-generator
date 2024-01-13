# serverless-gql-generator

## 🚀 **What is it?**

`serverless-gql-generator` is here to revolutionize your GraphQL development process! It brings seamless automation to the table, offering:

### ✨ **Automatic GraphQL Request Generation:**

Every deploy triggers automatic GraphQL request generation, ensuring your API requests are always up-to-date.

### 📂 **Export to .graphql Files and Postman Collections:**

Easily export generated requests as raw .graphql files and/or Postman collections. It's all about simplifying your workflow!

### 🪣 **Upload the generated files to S3:**

Easily upload all generated files to the desired S3 Buckets. Making it easier to share the files with your team!

### 🔐 **Automatic URL & API Key Retrieval:**

No more manual hassle! `serverless-gql-generator` automatically fetches URL and API keys, streamlining your integration process.

### 🔄 **Inline Input or .variables.json:**

Choose your preferred way to generate requests - whether with inline input or through a handy .variables.json file.

### ✨ **Why should you care?**

Say goodbye to the tedious manual work of keeping your GraphQL requests in sync. With `serverless-gql-generator`, focus on building incredible applications while your GraphQL requests stay effortlessly up-to-date.

# 🛠️ **How to get started:**

## 1. Install and add the dependency to your project

Use the following command to install the plugin and save as a `devDependency` in your project:

```
npm install -D serverless-gql-generator
```

## 2. Add the Plugin

Add the plugin under the `plugins` list in your `serverless.yml` file

```yaml
service: my-app

plugins:
  - serverless-gql-generator
```

## 3. (Optional) Override defaults

If required, one can override the defaults by adding any of the following configuration attributes:

```yaml
gql-generator:
  schema:
    path: ./schema.graphql # Overrides default schema path 
    encoding: utf-8
    assumeValidSDL: true
  output:
    directory: ./output # Output directory
    s3: # Enables Upload to AWS S3
      bucketName: gql-output-bucket # Mandatory Bucket name
      folderPath: s3folder/path # Override Folder Path inside s3, defaults to `${service}/${stage}`
      skipLocalSaving: false # if the files should also be saved locally or not
    useVariables: true # use variables or have the input inline
    maxDepth: 10 # max depth for schema recursion
    rawRequests: false # set to true to generate raw requests
    postman:
      collectionName: test-name # Overrides colection name, defaults to `${service}-${stage}`
      url: https://test.com/graphql # Overrides url for postman collection
      apiKey: abc-123 # Overrides default API Key if any
```

## 4. Trigger the Request Generation

### Automatic trigger

The Request generation will be triggered automatically on every deployment.

### Manual - CLI trigger

Additionally, developers can also use the following commands to manually trigger the following tasks

#### **Schema Validation**

Use the following CLI command to validate your GraphQL schema:
```
serverless gql-generator validate-schema
```

#### **Requests generation**

Use the following CLI command to trigger the Request generation without redeploying your current service:
```
serverless gql-generator generate
```