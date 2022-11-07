import { S3Bucket } from "https://deno.land/x/s3@0.5.0/mod.ts";
import { getSignedUrl } from "https://raw.githubusercontent.com/mashaal/aws_s3_presign/mashaal-patch-1/mod.ts";
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
  endpointURL: `https://${Deno.env.get("SPACES_ENDPOINT")}`,
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

  async deleteFile(filename: string) {
    return await this.bucket.deleteObject(filename);
  }

  async listFiles(directory: string) {
    return await this.bucket.listObjects({ prefix: directory });
  }
}

const spacesClient = new SpacesClient();

export default spacesClient;
