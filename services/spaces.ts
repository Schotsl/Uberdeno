import { S3Bucket } from "https://deno.land/x/s3@0.5.0/mod.ts";
import { initializeEnv } from "../helper.ts";

initializeEnv([
  "SPACES_ID",
  "SPACES_KEY",
  "SPACES_REGION",
  "SPACES_BUCKET",
  "SPACES_ENDPOINT",
]);

const spacesClient = new S3Bucket({
  endpointURL: Deno.env.get("SPACES_ENDPOINT")!,
  accessKeyID: Deno.env.get("SPACES_ID")!,
  secretKey: Deno.env.get("SPACES_KEY")!,
  region: Deno.env.get("SPACES_REGION")!,
  bucket: Deno.env.get("SPACES_BUCKET")!,
});

export default spacesClient;