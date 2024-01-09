const { resolve } = require('path');
const { loadAndGenerateSchema } = require('../../../../src/io');
const { buildArgumentFields } = require('../../../../src/parsers/helpers/buildArgumentFields');

describe('Test handler.js', () => {
  const schemaFilePath = resolve('./samples/basic.graphql');
  const gqlSchema = loadAndGenerateSchema(schemaFilePath, 'utf-8', true);

  test('test1', () => {
    const arg = gqlSchema.getQueryType().getFields().Tweet.args[0];
    buildArgumentFields(gqlSchema, arg, true, 10);
  });
});
