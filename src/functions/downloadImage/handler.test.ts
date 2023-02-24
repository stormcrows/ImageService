import { downloadImage } from './handler';

describe('downloadImage function', () => {
  it('should download an image from S3', async () => {
    const testImage = Buffer.from('test-image-data');
    const testImageType = 'image/jpeg';

    const event = {
      pathParameters: { id: 'test-image-key' },
    } as any;

    const s3 = {
      getObject: () => ({
        promise: () =>
          Promise.resolve({
            Body: testImage,
            ContentType: testImageType,
          }),
      }),
    };

    const context = {} as any;
    const cb = () => {};
    const response = (await downloadImage(s3)(event, context, cb)) as any;

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(testImage.toString('base64'));
    expect(response.headers['Content-Type']).toBe(testImageType);
    expect(response.isBase64Encoded).toBe(true);
  });
});
