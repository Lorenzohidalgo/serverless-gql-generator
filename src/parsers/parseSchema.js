const { log } = require('@serverless/utils/log');

const { formatGQL, formatJSON } = require('../formatter');
const { buildOperation } = require('./helpers/buildOperation');
const { buildVariables } = require('./helpers/buildVariables');
const { MUTATION, QUERY, SUBSCRIPTION } = require('./helpers/wrappers');

const mapOperation = async (operationName, raw, varObject) => {
  const operation = await formatGQL(raw);
  const variables = varObject ? await formatJSON(JSON.stringify(varObject)) : null;
  return { operationName, operation, variables };
};

const parseOperations = (gqlSchema, operationType, wrapper, useVariables, maxDepth) => {
  const operationFields = operationType.getFields();
  return Object.keys(operationFields).map((opName) => {
    const variables = useVariables
      ? buildVariables(gqlSchema, operationFields[opName], maxDepth)
      : null;
    const operation = useVariables ? opName + variables.string : opName;
    const raw = wrapper(
      operation,
      buildOperation(gqlSchema, operationFields[opName], useVariables, maxDepth),
    );
    return mapOperation(opName, raw, variables?.json);
  });
};

const parseSchema = async (gqlSchema, useVariables, maxDepth) => {
  const parsedSchema = {};
  if (gqlSchema.getMutationType()) {
    parsedSchema.mutations = await Promise.all(
      parseOperations(gqlSchema, gqlSchema.getMutationType(), MUTATION, useVariables, maxDepth),
    );
  } else {
    log.warning('No mutation type found in your schema');
  }

  if (gqlSchema.getQueryType()) {
    parsedSchema.queries = await Promise.all(
      parseOperations(gqlSchema, gqlSchema.getQueryType(), QUERY, useVariables, maxDepth),
    );
  } else {
    log.warning('No queries type found in your schema');
  }

  if (gqlSchema.getSubscriptionType()) {
    parsedSchema.subscriptions = await Promise.all(
      parseOperations(
        gqlSchema,
        gqlSchema.getSubscriptionType(),
        SUBSCRIPTION,
        useVariables,
        maxDepth,
      ),
    );
  } else {
    log.warning('No subscriptions type found in your schema');
  }

  return parsedSchema;
};

module.exports = {
  parseSchema,
};
