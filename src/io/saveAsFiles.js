const { mkdirSync, writeFileSync } = require('fs');
const { join } = require('path');

const createDir = (path) => {
  try {
    mkdirSync(path);
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

const saveFile = (destinationDirectory, outputFolder, fileName, contents) => {
  const writeFolder = join(destinationDirectory, `./${outputFolder}`);
  createDir(writeFolder);
  writeFileSync(join(writeFolder, `./${fileName}`), contents);
};

const saveOperation = (destinationDirectory, outputFolder, operation) => {
  saveFile(
    destinationDirectory,
    outputFolder,
    `${operation.operationName}.graphql`,
    operation.operation,
  );

  if (operation.variables)
    saveFile(
      destinationDirectory,
      outputFolder,
      `${operation.operationName}.variables.json`,
      operation.variables,
    );
};

const saveAll = (destinationDirectory, outputFolder, operations) =>
  operations.forEach((operation) => saveOperation(destinationDirectory, outputFolder, operation));

const saveAsFiles = (destinationDirectory, parsedSchema) => {
  if (!parsedSchema.mutations && !parsedSchema.queries && !parsedSchema.subscriptions) {
    throw new Error('No operations found to be saved');
  }

  createDir(destinationDirectory);

  if (parsedSchema.mutations) {
    saveAll(destinationDirectory, 'mutations', parsedSchema.mutations);
  }

  if (parsedSchema.queries) {
    saveAll(destinationDirectory, 'queries', parsedSchema.queries);
  }

  if (parsedSchema.subscriptions) {
    saveAll(destinationDirectory, 'subscriptions', parsedSchema.subscriptions);
  }
};

module.exports = {
  saveAsFiles,
};
