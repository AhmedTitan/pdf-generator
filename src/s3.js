import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const uploadFile = async (s3Key, file) => {
  let config = {
    Bucket: process.env.S3_BUCKET || "",
    Key: s3Key,
    Body: file,
  };

  await s3.putObject(config).promise();
  return s3Key;
};

const getFile = (key) => {
  return s3
    .getObject({
      Bucket: process.env.S3_BUCKET || "",
      Key: key,
    })
    .promise();
};

const deleteFile = (key) => {
  return s3
    .deleteObject({
      Bucket: process.env.S3_BUCKET || "",
      Key: key,
    })
    .promise();
};

export default {
  uploadFile,
  getFile,
  deleteFile,
};
