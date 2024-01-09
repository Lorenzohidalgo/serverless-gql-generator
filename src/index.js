const { log } = require('@serverless/utils/log');
const { forEach, last } = require('lodash');

const { parse, schema } = require('./plugin/config');
const { loadAndGenerateSchema, saveAsFiles, saveAsPostman } = require('./io');
const { parseSchema } = require('./parsers');

class ServerlessPlugin {
  constructor(serverless, options, { progress }) {
    this.serverless = serverless;
    this.options = options;
    this.progress = progress;

    this.gatheredData = {
      apiURLs: {
        graphql: [],
        realtime: [],
      },
      apiKeys: [],
    };

    this.provider = this.serverless.getProvider('aws');

    this.serverless.configSchemaHandler.defineTopLevelProperty('gql-generator', schema);

    this.commands = {
      'gql-generator': {
        usage: 'Generate GraphQL Requests & Postman Collections',
        commands: {
          'validate-schema': {
            usage: 'Validate the graphql schema',
            lifecycleEvents: ['run'],
          },
          generate: {
            usage: 'Generates the GraphQl requests as per the configuration',
            lifecycleEvents: ['run'],
          },
        },
      },
    };

    this.hooks = {
      'gql-generator:validate-schema:run': () => this.validateSchema(),
      'gql-generator:generate:run': async () => this.generate(),
      'after:aws:info:displayServiceInfo': async () => this.generate(),
    };
  }

  async gatherData() {
    const { StackResources } = await this.provider.request(
      'CloudFormation',
      'describeStackResources',
      {
        StackName: this.provider.naming.getStackName(),
        LogicalResourceId: 'GraphQlApi',
      },
    );

    const apiId = last(StackResources?.[0]?.PhysicalResourceId?.split('/'));

    if (!apiId) {
      throw new this.serverless.classes.Error(
        'AppSync Api not found in stack. Did you forget to deploy?',
      );
    }

    const { graphqlApi } = await this.provider.request('AppSync', 'getGraphqlApi', {
      apiId,
    });

    forEach(graphqlApi?.uris, (value, type) => {
      this.gatheredData.apiURLs[type.toLowerCase()].push(value);
    });

    const { apiKeys } = await this.provider.request('AppSync', 'listApiKeys', {
      apiId,
    });

    apiKeys?.forEach((apiKey) => {
      if (apiKey.id) this.gatheredData.apiKeys.push(apiKey.id);
    });
  }

  validateSchema() {
    try {
      this.loadConfig();
      const {
        schema: { path, encoding, assumeValidSDL },
      } = this.config;
      loadAndGenerateSchema(path, encoding, assumeValidSDL);
      log.success('GraphQL Schema Validated');
    } catch (error) {
      throw new this.serverless.classes.Error(error.message);
    }
  }

  async generate() {
    try {
      this.loadConfig();
      const {
        environment: { name, url, apiKey },
        schema: { path, encoding, assumeValidSDL },
        output: { directory, requests, postman, useVariables, maxDepth },
      } = this.config;
      if (!url) {
        log.info('Domain Information not provided, fetching information');
        await this.gatherData();
      }
      log.info('Validating Schema');
      const gqlSchema = loadAndGenerateSchema(path, encoding, assumeValidSDL);
      log.info('Parsing Schema');
      const parsedSchema = await parseSchema(gqlSchema, useVariables, maxDepth);
      if (requests) {
        log.info('Saving Raw Requests');
        saveAsFiles(directory, parsedSchema);
      }
      if (postman) {
        log.info('Saving Postman Collection');
        saveAsPostman(
          directory,
          parsedSchema,
          name,
          url ?? this.gatheredData.apiURLs.graphql[0],
          apiKey ?? this.gatheredData.apiKeys[0],
        );
      }
      log.success('GraphQL Requests Generated');
    } catch (error) {
      throw new this.serverless.classes.Error(error.message);
    }
  }

  loadConfig() {
    log.info('Loading gql-generator config');
    const { 'gql-generator': gqlConfig } = this.serverless.configurationInput;
    log.info('gql-generator config validated');
    const {
      service,
      provider: { stage },
    } = this.serverless.configurationInput;
    this.config = parse(gqlConfig, service, stage);
    log.info('gql-generator config loaded successfully');
  }
}

module.exports = ServerlessPlugin;
