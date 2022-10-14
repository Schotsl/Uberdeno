import { S3Bucket } from "https://deno.land/x/s3@0.4.1/mod.ts";
import { getSignedUrl } from "https://deno.land/x/aws_s3_presign@1.3.0/mod.ts";
import { initializeEnv } from "../helper.ts";

initializeEnv([
  "SPACES_ID",
  "SPACES_KEY",
  "SPACES_REGION",
  "SPACES_BUCKET",
  "SPACES_ENDPOINT",
]);

const signedCredentials = {
  region: Deno.env.get("SPACES_REGION")!,
  endpoint: Deno.env.get("SPACES_ENDPOINT")!,
  bucketName: Deno.env.get("SPACES_BUCKET")!,
  accessKeyId: Deno.env.get("SPACES_ID")!,
  secretAccessKey: Deno.env.get("SPACES_KEY")!,
};

const spacesCredentials = {
  bucket: Deno.env.get("SPACES_BUCKET")!,
  region: Deno.env.get("SPACES_REGION")!,
  secretKey: Deno.env.get("SPACES_KEY")!,
  accessKeyID: Deno.env.get("SPACES_ID")!,
  endpointURL: Deno.env.get("SPACES_ENDPOINT")!,
};

class SpacesClient {
  bucket: S3Bucket;

  constructor() {
    this.bucket = new S3Bucket(spacesCredentials);
  }

  signedGET(filename: string) {
    return getSignedUrl({
      method: "GET",
      objectPath: `/${filename}`,
      ...signedCredentials,
    });
  }

  signedPUT(filename: string) {
    return getSignedUrl({
      method: "PUT",
      objectPath: `/${filename}`,
      ...signedCredentials,
    });
  }

  deleteFile(filename: string) {
    return this.bucket.deleteObject(filename);
  }
}

const spacesClient = new SpacesClient();

export default spacesClient;
