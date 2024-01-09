const { mkdirSync, writeFileSync } = require('fs');
const { saveAsPostman } = require('../../../src/io/saveAsPostman');

jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('saveAsPostman.js', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Happy Path', async () => {
    const parsedSchema = {
      mutations: [{ operationName: 'operationName', operation: 'operation' }],
      queries: [{ operationName: 'operationName', operation: 'operation' }],
      subscriptions: [{ operationName: 'operationName', operation: 'operation' }],
    };
    saveAsPostman('./outDir', parsedSchema, 'collectionName', 'https://my-appsync.url.com/graphql');
    expect(writeFileSync).toHaveBeenCalledTimes(1);
    expect(mkdirSync).toHaveBeenCalledTimes(1);
  });

  test('Only mutations', async () => {
    const parsedSchema = {
      mutations: [{ operationName: 'operationName', operation: 'operation' }],
    };
    saveAsPostman('./outDir', parsedSchema, 'collectionName', 'https://my-appsync.url.com/graphql');
    expect(writeFileSync).toHaveBeenCalledTimes(1);
    expect(mkdirSync).toHaveBeenCalledTimes(1);
  });

  test('Only queries and subscriptions', async () => {
    const parsedSchema = {
      queries: [{ operationName: 'operationName', operation: 'operation' }],
      subscriptions: [{ operationName: 'operationName', operation: 'operation' }],
    };
    saveAsPostman('./outDir', parsedSchema, 'collectionName', 'https://my-appsync.url.com/graphql');
    expect(writeFileSync).toHaveBeenCalledTimes(1);
    expect(mkdirSync).toHaveBeenCalledTimes(1);
  });

  test('Error Handling - not EEXIST', async () => {
    const parsedSchema = {
      mutations: [{ operationName: 'operationName', operation: 'operation' }],
      queries: [{ operationName: 'operationName', operation: 'operation' }],
      subscriptions: [{ operationName: 'operationName', operation: 'operation' }],
    };
    mkdirSync.mockImplementationOnce(() => {
      throw new Error();
    });
    try {
      saveAsPostman('./outDir', parsedSchema, 'collectionName', 'https://my-appsync.url.com/graphql');
      expect(false).toBe(true);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  test('Error Handling - EEXIST', async () => {
    const parsedSchema = {
      mutations: [{ operationName: 'operationName', operation: 'operation' }],
      queries: [{ operationName: 'operationName', operation: 'operation' }],
      subscriptions: [{ operationName: 'operationName', operation: 'operation' }],
    };
    mkdirSync.mockImplementationOnce(() => {
      // eslint-disable-next-line no-throw-literal
      throw { code: 'EEXIST' };
    });
    try {
      saveAsPostman('./outDir', parsedSchema, 'collectionName', 'https://my-appsync.url.com/graphql');
      expect(false).toBe(true);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
