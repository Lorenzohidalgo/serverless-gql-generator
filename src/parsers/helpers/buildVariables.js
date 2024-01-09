const { GraphQLNonNull, GraphQLEnumType, GraphQLList } = require('graphql');
const { log } = require('@serverless/utils/log');

const getDefault = (field, fieldType) => {
  if (fieldType instanceof GraphQLEnumType) return fieldType.getValues()[0].value;

  switch (fieldType.name) {
    case 'String':
      return field.name;
    case 'Int':
    case 'Float':
      return 0;
    case 'ID':
      return 'UUID';
    case 'Boolean':
      return false;
    default:
      log.warning(`${fieldType.name} not yet supported`);
      return fieldType.name;
  }
};

const mapDefault = (field, fieldType) => {
  if (!(field.type instanceof GraphQLNonNull)) return null;

  const fieldDefault = getDefault(field, fieldType);

  if (field.type.ofType instanceof GraphQLList) return [fieldDefault];

  return fieldDefault;
};

const buildType = (gqlSchema, argument, maxDepth, currDepth = 0) => {
  if (currDepth >= maxDepth) return null;

  const currArgumentName = argument.type.toJSON().replace(/[[\]!]/g, '');
  const currArgumentType = gqlSchema.getType(currArgumentName);
  if (!currArgumentType.getFields) {
    return mapDefault(argument, currArgumentType);
  }

  const fields = currArgumentType.getFields();

  const childObject = {};

  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];
    const currTypeName = field.type.toJSON().replace(/[[\]!]/g, '');
    const fieldType = gqlSchema.getType(currTypeName);

    if (!fieldType.getFields) {
      childObject[fieldName] = mapDefault(field, fieldType);
      return;
    }

    const typeQuery = buildType(gqlSchema, field, maxDepth, currDepth + 1);

    if (field.type.ofType instanceof GraphQLList) {
      childObject[fieldName] = [typeQuery];
      return;
    }

    childObject[fieldName] = typeQuery;
  });

  return childObject;
};

const buildObject = (gqlSchema, operation, maxDepth) => {
  const variables = {};
  operation.args.forEach((argument) => {
    variables[argument.name] = buildType(gqlSchema, argument, maxDepth);
  });
  return variables;
};

const buildString = (operation) => {
  const input = operation.args.map((arg) => `$${arg.name}: ${arg.type.toJSON()}`).join(', ');
  return input ? `(${input})` : '';
};

const buildVariables = (gqlSchema, operation, maxDepth) => ({
  string: buildString(operation),
  json: buildObject(gqlSchema, operation, maxDepth),
});

module.exports = {
  buildVariables,
};
