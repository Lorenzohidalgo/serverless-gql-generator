const MUTATION = (opName, query) => `mutation ${opName} { ${query} }`;
const QUERY = (opName, query) => `query ${opName} { ${query} }`;
const SUBSCRIPTION = (opName, query) => `subscription ${opName} { ${query} }`;

module.exports = {
  MUTATION,
  QUERY,
  SUBSCRIPTION,
};
