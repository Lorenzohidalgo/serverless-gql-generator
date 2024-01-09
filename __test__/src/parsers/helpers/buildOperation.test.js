const { resolve } = require('path');
const { loadAndGenerateSchema } = require('../../../../src/io/loadSchema');
const { buildOperation } = require('../../../../src/parsers/helpers/buildOperation');

describe('Test handler.js', () => {
  const schemaFilePath = resolve('./__test__/samples/basic.graphql');
  const gqlSchema = loadAndGenerateSchema(schemaFilePath, 'utf-8', true);

  test('test1', async () => {
    buildOperation(gqlSchema, gqlSchema.getQueryType().getFields().Notifications);
  });
});
