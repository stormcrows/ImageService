import { uploadImage } from './handler';

describe('uploadImage function', () => {
  it('should upload an image to S3', async () => {
    const testKey = 'test-key';
    const event = {
      body: {
        image: 'base64data',
        type: 'jpg',
      },
    } as any;

    const s3 = {
      upload: () => ({
        promise: () =>
          Promise.resolve({
            Key: testKey,
          }),
      }),
    };

    const context = {} as any;
    const cb = () => {};
    const response = (await uploadImage(s3)(event, context, cb)) as any;

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ id: testKey });
  });
});
