"use strict";

module.exports.access2s3 = async (event) => {
  // const path = event.pathParameters.proxy;

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "hi",
      },
      null,
      2
    ),
  };
};
