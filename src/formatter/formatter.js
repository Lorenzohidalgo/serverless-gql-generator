const { format } = require('prettier/standalone');
const gql = require('prettier/plugins/graphql');
const babel = require('prettier/plugins/babel');
const estree = require('prettier/plugins/estree');

const formatGQL = async (query) =>
  format(query, {
    parser: 'graphql',
    plugins: [gql],
  });

const formatJSON = async (jsonString) =>
  format(jsonString, {
    parser: 'json',
    plugins: [babel, estree],
  });

module.exports = {
  formatJSON,
  formatGQL,
};
