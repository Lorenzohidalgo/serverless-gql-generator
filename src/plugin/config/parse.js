const { mergeWith } = require('lodash');

const buildDefaults = (service, stage) => ({
  schema: {
    path: './schema.graphql',
    encoding: 'utf-8',
    assumeValidSDL: true,
  },
  output: {
    directory: './output',
    useVariables: true,
    maxDepth: 10,
    postman: { name: `${service}-${stage}`, url: null, apiKey: null },
    rawRequests: false,
  },
});

const parse = (rawConfig, service, stage) => mergeWith(buildDefaults(service, stage), rawConfig);

module.exports = {
  parse,
};
