const { mergeWith } = require('lodash');

const buildDefaults = (service, stage) => ({
  schema: {
    path: './schema.graphql',
    encoding: 'utf-8',
    assumeValidSDL: true,
  },
  environment: { name: `${service}-${stage}`, url: null, apiKey: null },
  output: {
    directory: './output',
    requests: false,
    postman: true,
    useVariables: true,
    maxDepth: 10,
  },
});

const parse = (rawConfig, service, stage) => mergeWith(buildDefaults(service, stage), rawConfig);

module.exports = {
  parse,
};
