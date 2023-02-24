# ImageService

AWS Lambda service that allows for uploading and downloading of images of any type, and stores them on S3.

## Installation/deployment instructions

- Ensure you're using at least `node v14.15`
- Ensure you have installed `docker` and `docker-compose`
- Run `npm i` to install the project dependencies

## Test your service

- Run `sls offline` - to spin up local serverless server
- Run `sls run init-localstack` - to spin up localstack, local version of AWS cloud using docker-compose
- Run `sls run test:integration` to run a test that uploads an existing image file into localstack's S3, and then downloads it verifying it is the same data
- Run `sls test` to run unit tests
