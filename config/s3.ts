import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "default",
  endpoint: process.env.ARVAN_CLOUD_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.ARVAN_CLOUD_S3_ACCESS_KEY!,
    secretAccessKey: process.env.ARVAN_CLOUD_S3_SECRET_KEY!,
  },
});

export default s3;
