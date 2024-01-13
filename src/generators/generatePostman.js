const { Collection, ItemGroup, Item, Url, RequestAuth } = require('postman-collection');

const { log } = require('@serverless/utils/log');

const buildItemList = (operations, rawUrl) =>
  operations.map(
    (op) =>
      new Item({
        name: op.operationName,
        request: {
          method: 'POST',
          url: Url.parse(rawUrl),
          body: {
            mode: 'graphql',
            graphql: {
              query: op.operation,
              variables: op.variables,
            },
          },
        },
      }),
  );

const generatePostman = (parsedSchema, collectionName, rawUrl, apiKey) => {
  if (!parsedSchema.mutations && !parsedSchema.queries && !parsedSchema.subscriptions) {
    throw new Error('No operations found to be saved');
  }

  const newCollection = new Collection({
    info: {
      name: collectionName,
    },
  });

  if (apiKey?.length > 0) {
    newCollection.auth = new RequestAuth({
      type: 'apikey',
      apikey: [
        {
          key: 'value',
          value: apiKey,
          type: 'string',
        },
        {
          key: 'key',
          value: 'x-api-key',
          type: 'string',
        },
        {
          key: 'in',
          value: 'header',
          type: 'string',
        },
      ],
    });
  }

  if (parsedSchema.mutations) {
    newCollection.items.add(
      new ItemGroup({
        name: 'mutations',
        item: buildItemList(parsedSchema.mutations, rawUrl),
      }),
    );
  }

  if (parsedSchema.queries) {
    newCollection.items.add(
      new ItemGroup({
        name: 'queries',
        item: buildItemList(parsedSchema.queries, rawUrl),
      }),
    );
  }

  if (parsedSchema.subscriptions) {
    log.warning('Exporting subscriptions to postman is not yet supported');
    /**
    newCollection.items.add(
      new ItemGroup({
        name: 'subscriptions',
        item: buildItemList(parsedSchema.subscriptions, rawUrl),
      }),
    );
     */
  }

  return [
    {
      folder: 'postman',
      name: `${collectionName}.postman_collection.json`,
      content: JSON.stringify(newCollection, null, 2),
    },
  ];
};

module.exports = {
  generatePostman,
};
