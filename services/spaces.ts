import { S3Bucket, S3BucketConfig } from "https://deno.land/x/s3@0.5.0/mod.ts";
import { initializeEnv } from "../helper.ts";

initializeEnv([
  "SPACES_ID",
  "SPACES_KEY",
  "SPACES_REGION",
  "SPACES_BUCKET",
  "SPACES_ENDPOINT",
]);

class SpacesClient {
  bucket: S3Bucket;

  constructor(config: S3BucketConfig) {
    this.bucket = new S3Bucket(config);
  }

  async deleteBase64(name: string) {
    console.log(name);
    await this.bucket.deleteObject(name);
  }
}

const spacesClient = new SpacesClient({
  endpointURL: Deno.env.get("SPACES_ENDPOINT")!,
  accessKeyID: Deno.env.get("SPACES_ID")!,
  secretKey: Deno.env.get("SPACES_KEY")!,
  region: Deno.env.get("SPACES_REGION")!,
  bucket: Deno.env.get("SPACES_BUCKET")!,
});

export default spacesClient;
