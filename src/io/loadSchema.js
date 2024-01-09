const { readFileSync } = require('fs');
const { Source, buildSchema } = require('graphql');

const loadAndGenerateSchema = (schemaFilePath, encoding, assumeValidSDL) => {
  const typeDef = readFileSync(schemaFilePath, { encoding });
  const source = new Source(typeDef);
  const gqlSchema = buildSchema(source, { assumeValidSDL });
  return gqlSchema;
};

module.exports = {
  loadAndGenerateSchema,
};
