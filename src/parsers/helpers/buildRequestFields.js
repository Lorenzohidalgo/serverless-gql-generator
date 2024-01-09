const buildRequestFields = (gqlSchema, typeName, maxDepth, currDepth = 0) => {
  let queryStr = '';

  if (!gqlSchema.getType(typeName).getFields) return queryStr;

  if (currDepth >= maxDepth) return queryStr;

  const fields = gqlSchema.getType(typeName).getFields();

  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];
    const currTypeName = field.type.toJSON().replace(/[[\]!]/g, '');
    const fieldType = gqlSchema.getType(currTypeName);

    if (!fieldType.getFields) {
      queryStr += `${fieldName}\n`;
      return;
    }

    queryStr += `${fieldName} ${buildRequestFields(
      gqlSchema,
      currTypeName,
      maxDepth,
      currDepth + 1,
    )}\n`;
  });

  return `{\n ${queryStr} }`;
};

module.exports = {
  buildRequestFields,
};
