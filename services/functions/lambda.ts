import fetch from "node-fetch";
import { SSM, S3 } from "aws-sdk";

// aws sdk clients
const ssm = new SSM();
const s3 = new S3();

// fetching api keys from SSM
const apiKey = await ssm
  .getParameter({ Name: process.env.API_KEY_PARAM_NAME })
  .promise();
const apiSecret = await ssm
  .getParameter({ Name: process.env.API_SECRET_PARAM_NAME })
  .promise();

// actual values of the parameters
console.log(apiKey.Parameter.Value);
console.log(apiSecret.Parameter.Value);

// request config
const url = "https://swapi.dev/api/people/1/";
const reqConfig = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};

// filename of the file in s3
const filename = "the_filename.json";

export async function main() {
  // send the request
  const res = await fetch(url, reqConfig);
  // get the json
  const data = await res.json();
  console.log(data);

  // uploads json into a file in S3
  await s3
    .putObject({
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Body: JSON.stringify(data),
    })
    .promise();
}
