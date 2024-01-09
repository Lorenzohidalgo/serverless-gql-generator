const { mkdirSync, writeFileSync } = require('fs');
const { saveAsFiles } = require('../../../src/io/saveAsFiles');

jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('Test saveAsFiles.js', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Happy Path', async () => {
    const parsedSchema = {
      mutations: [{ operationName: 'operationName', operation: 'operation' }],
      queries: [{ operationName: 'operationName', operation: 'operation' }],
      subscriptions: [{ operationName: 'operationName', operation: 'operation' }],
    };
    saveAsFiles('./outputDir', parsedSchema);
    expect(writeFileSync).toHaveBeenCalledTimes(3);
    expect(mkdirSync).toHaveBeenCalledTimes(4);
  });

  test('Only mutations', async () => {
    const parsedSchema = {
      mutations: [{ operationName: 'operationName', operation: 'operation' }],
    };
    saveAsFiles('./outputDir', parsedSchema);
    expect(writeFileSync).toHaveBeenCalledTimes(1);
    expect(mkdirSync).toHaveBeenCalledTimes(2);
  });

  test('Only queries and subscriptions', async () => {
    const parsedSchema = {
      queries: [{ operationName: 'operationName', operation: 'operation' }],
      subscriptions: [{ operationName: 'operationName', operation: 'operation' }],
    };
    saveAsFiles('./outputDir', parsedSchema);
    expect(writeFileSync).toHaveBeenCalledTimes(2);
    expect(mkdirSync).toHaveBeenCalledTimes(3);
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
      saveAsFiles('./outputDir', parsedSchema);
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
      saveAsFiles('./outputDir', parsedSchema);
      expect(false).toBe(true);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
