import S3 from 'aws-sdk/clients/s3';
import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

const bucketName = process.env.BUCKET_NAME;

export const downloadImage: (
  S3,
) => ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  (s3: S3) => async (event) => {
    try {
      const result = await s3
        .getObject({
          Bucket: bucketName,
          Key: event.pathParameters?.id,
        })
        .promise();

      return {
        statusCode: 200,
        headers: { 'Content-Type': result.ContentType },
        body: result.Body.toString('base64'),
        isBase64Encoded: true,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  };

export const main = middyfy(
  downloadImage(
    new S3({
      endpoint: 'http://localhost:4566',
      s3ForcePathStyle: true,
    }),
  ),
);
