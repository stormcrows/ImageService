import { join } from 'path';
import { readFileSync } from 'fs';
import axios from 'axios';
import S3 from 'aws-sdk/clients/s3';

const BASE_URL = 'http://localhost:3000/dev'; // replace with your API Gateway URL
const s3 = new S3({
  endpoint: 'http://localhost:4566',
  s3ForcePathStyle: true,
});
const bucketName = process.env.BUCKET_NAME;

const IMAGE_PATH = join(__dirname, 'test-image.jpg');

describe('upload and download an image using generated id', () => {
  beforeAll(async () => {
    await s3.createBucket({ Bucket: bucketName }).promise();
  });

  afterAll(async () => {
    const objects = await s3.listObjects({ Bucket: bucketName }).promise();
    if (objects.Contents) {
      const objectKeys = objects.Contents.map((object) => ({
        Key: object.Key,
      }));
      await s3
        .deleteObjects({ Bucket: bucketName, Delete: { Objects: objectKeys } })
        .promise();
    }
    await s3.deleteBucket({ Bucket: bucketName }).promise();
  });

  it('should upload and download an image', async () => {
    // upload
    const image = readFileSync(IMAGE_PATH).toString('base64');
    const type = IMAGE_PATH.split('.').pop();

    const uploadResponse = await axios.post(`${BASE_URL}/uploadImage`, {
      image,
      type,
    });

    expect(uploadResponse.status).toEqual(200);
    const id = uploadResponse.data.id;

    // download
    const downloadResponse = await axios.get(
      `${BASE_URL}/downloadImage/${id}`,
      {
        responseType: 'arraybuffer',
      },
    );
    expect(downloadResponse.status).toEqual(200);
    expect(downloadResponse.headers['content-type']).toEqual(`image/${type}`);
    expect(downloadResponse.data.byteLength).toBeGreaterThan(0);
  });
});
