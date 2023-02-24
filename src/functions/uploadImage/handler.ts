import { randomUUID } from 'node:crypto';
import S3 from 'aws-sdk/clients/s3';
import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

const bucketName = process.env.BUCKET_NAME;

export const uploadImage: (
  S3,
) => ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  (s3: S3) => async (event) => {
    try {
      const { image, type } = event.body;
      const id = randomUUID();

      const result = await s3
        .upload({
          Bucket: bucketName,
          Key: `${id}.${type}`,
          Body: Buffer.from(image, 'base64'),
          ContentType: `image/${type}`,
          ACL: 'public-read',
        })
        .promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ id: result.Key }),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to upload image' }),
      };
    }
  };

export const main = middyfy(
  uploadImage(
    new S3({
      endpoint: 'http://localhost:4566',
      s3ForcePathStyle: true,
    }),
  ),
);
