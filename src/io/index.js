const { loadAndGenerateSchema } = require('./loadSchema');
const { saveLocal } = require('./saveLocal');
const { saveS3 } = require('./saveS3');

module.exports = {
  loadAndGenerateSchema,
  saveLocal,
  saveS3,
};
