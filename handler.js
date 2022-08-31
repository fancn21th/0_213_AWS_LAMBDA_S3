"use strict";
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const client = new S3Client(); // Pass in opts to S3 if necessary
const StringDecoder = require("string_decoder").StringDecoder;

// refer to https://stackoverflow.com/questions/36942442/how-to-get-response-from-s3-getobject-in-node-js
// thanks !
const getObject = (Bucket, Key) => {
  return new Promise(async (resolve, reject) => {
    const getObjectCommand = new GetObjectCommand({ Bucket, Key });

    try {
      const response = await client.send(getObjectCommand);

      const decoder = new StringDecoder("utf-8");
      let buffer = "";

      response.Body.once("error", (err) => {
        throw new Error(err);
      });

      response.Body.on("data", (chunk) => {
        buffer += decoder.write(chunk);
      });

      response.Body.once("end", () => {
        buffer += decoder.end();
        resolve(buffer);
      });
    } catch (err) {
      // Handle the error or throw
      return reject(err);
    }
  });
};

module.exports.access2s3 = async (event) => {
  const path = event.pathParameters.proxy;

  const Key = `${path}.json`;
  const Bucket = process.env.BUCKET;

  try {
    const data = await getObject(Bucket, Key);
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          data: JSON.parse(data),
        },
        null,
        2
      ),
    };
  } catch (err) {
    // Handle the error or throw
    console.error(err);
  }
};
