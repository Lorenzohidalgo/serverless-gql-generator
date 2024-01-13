const mapInfo = (operation, type) => {
  const info = [];

  info.push({
    folder: type,
    name: `${operation.operationName}.graphql`,
    content: operation.operation,
  });

  if (operation.variables)
    info.push({
      folder: type,
      name: `${operation.operationName}.variables.json`,
      content: operation.variables,
    });

  return info;
};

const generateRaw = (parsedSchema) => {
  if (!parsedSchema.mutations && !parsedSchema.queries && !parsedSchema.subscriptions) {
    throw new Error('No operations found to be saved');
  }

  const requests = [];

  if (parsedSchema.mutations) {
    const mutations = parsedSchema.mutations.map((operation) => mapInfo(operation, 'mutations'));
    requests.push(...mutations);
  }

  if (parsedSchema.queries) {
    const queries = parsedSchema.queries.map((operation) => mapInfo(operation, 'queries'));
    requests.push(...queries);
  }

  if (parsedSchema.subscriptions) {
    const subscriptions = parsedSchema.subscriptions.map((operation) =>
      mapInfo(operation, 'subscriptions'),
    );
    requests.push(...subscriptions);
  }

  return requests.flat();
};

module.exports = {
  generateRaw,
};
