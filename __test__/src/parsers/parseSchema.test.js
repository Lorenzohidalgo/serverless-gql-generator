const { resolve } = require('path');
const { loadAndGenerateSchema } = require('../../../src/io/loadSchema');
const { parseSchema } = require('../../../src/parsers/parseSchema');

describe('Test handler.js', () => {
  const schemaFilePath = resolve('./__test__/samples/basic.graphql');
  const gqlSchema = loadAndGenerateSchema(schemaFilePath, 'utf-8', true);

  test('test1', async () => {
    await parseSchema(gqlSchema);
  });
});
