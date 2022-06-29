import {
  Bucket,
  Function,
  Cron,
  StackContext,
} from "@serverless-stack/resources";
import { App } from "aws-cdk-lib";

export function MyStack({ stack }: StackContext) {
  // destination bucket where JSON will be stored
  const bucket = new Bucket(stack, "DestinationBucket", {
    cdk: {
      bucket: {
        // this boolean controls if the files in the bucket are internet facing
        publicReadAccess: true,
      },
    },
  });

  // the lambda
  const lambda = new Function(stack, "Function", {
    handler: "functions/lambda.main",
    environment: {
      // passing in the bucket name so the s3 sdk can write to bucket
      BUCKET_NAME: bucket.bucketName,
    },
    // granting lambda read/write permissions on the bucket
    permissions: [bucket],
  });

  // Cron job is an EventBridge Rule that runs the job on a schedule
  new Cron(stack, "Cron", {
    // the rate the lambda gets triggered
    schedule: "rate(1 minute)",
    job: lambda,
    // this boolean controls if the cronjob is enabled and triggering the lambda
    enabled: true,
  });
}
