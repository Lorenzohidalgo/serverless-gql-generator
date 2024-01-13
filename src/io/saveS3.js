const { log } = require('@serverless/utils/log');

const getFileKey = (userFolder, serviceName, stage, fileFolder, fileName) =>
  [userFolder, serviceName, stage, fileFolder, fileName].filter((e) => e).join('/');

const saveS3 = async (provider, s3Config, outputFiles) => {
  const { bucketName, serviceName, stage, folder } = s3Config;

  const promises = outputFiles.map((file) => {
    const fileKey = getFileKey(folder, serviceName, stage, file.folder, file.name);
    return provider.request('S3', 'putObject', {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.content,
    });
  });

  const uploadResults = await Promise.allSettled(promises);
  const failureCount = uploadResults.filter((res) => res.status === 'rejected').length;

  if (failureCount === 0) log.success('GraphQL Requests uploaded to S3 successfully');
  else if (failureCount === uploadResults.length) throw new Error('Failed to upload GraphQL requests to S3');
  else log.warning('Some GraphQL Requests ailed to upload');
};

module.exports = {
  saveS3,
};
