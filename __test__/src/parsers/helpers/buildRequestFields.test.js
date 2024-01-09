const { resolve } = require('path');
const { loadAndGenerateSchema } = require('../../../../src/io/loadSchema');
const { buildRequestFields } = require('../../../../src/parsers/helpers/buildRequestFields');

describe('Test handler.js', () => {
  const schemaFilePath = resolve('./__test__/samples/basic.graphql');
  const gqlSchema = loadAndGenerateSchema(schemaFilePath, 'utf-8', true);

  test('test1', () => {
    buildRequestFields(gqlSchema, 'Tweet');
  });
});
