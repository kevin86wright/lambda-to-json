import fetch from "node-fetch";
import { S3 } from "aws-sdk";

const s3 = new S3();

export async function main() {
  // get the json data
  const res = await fetch("https://swapi.dev/api/people/1/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  console.log(data);

  // uploads a file to S3
  await s3
    .putObject({
      Bucket: process.env.BUCKET_NAME,
      Key: "filename.json",
      Body: JSON.stringify(data),
    })
    .promise();
}
