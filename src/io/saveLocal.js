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

const saveLocal = (destinationDirectory, fileList) => {
  if (!fileList) {
    throw new Error('No files found to be saved');
  }

  createDir(destinationDirectory);

  fileList.forEach((file) => saveFile(destinationDirectory, file.folder, file.name, file.content));
};

module.exports = {
  saveLocal,
};
