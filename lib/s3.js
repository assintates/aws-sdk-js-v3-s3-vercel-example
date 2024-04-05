import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const putObject = async (key, body, contentType) => {
  const s3 = new S3Client({
    endpoint: "https://gateway.storjshare.io", // Replace with your Storj S3 Gateway endpoint
    region: 'eu1',
    credentials: {
      accessKeyId: "jwkbdxjrlvv6w7oo252fmo7kmiga", // Replace with your access key
      secretAccessKey: "jz52ctrgesptwj6voigbnkgg5dqrejh3xmuamnrmmevx2nvxklyfq" // Replace with your secret key
    },
    //forcePathStyle: true, // Required for S3-compatible services that are not AWS
    s3ForcePathStyle: true,
    signatureVersion: "v4",
     connectTimeout: 0,
    httpOptions: { timeout: 0 },
  });

  // workaround for the issue: https://github.com/aws/aws-sdk-js-v3/issues/1800
  s3.middlewareStack.add(
    (next, context) => (args) => {
      delete args.request.headers["content-type"];
      return next(args);
    },
    {
      step: "build",
    }
  );

  const objectParams = {
    ACL: "public-read",
    Bucket: 'xux',
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  const results = await s3.send(new PutObjectCommand(objectParams));
  return results;
};
