import {
  Bucket,
  Function,
  Cron,
  StackContext,
} from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  // destination bucket where JSON will be stored
  const bucket = new Bucket(stack, "DestinationBucket");

  const lambda = new Function(stack, "Function", {
    handler: "functions/lambda.main",
    environment: {
      BUCKET_NAME: bucket.bucketName,
    },
    permissions: [bucket],
  });

  // Cron job is an EventBridge Rule that runs on a schedule
  new Cron(stack, "Cron", {
    schedule: "rate(1 minute)",
    job: lambda,
  });
}
