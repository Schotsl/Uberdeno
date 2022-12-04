import { S3Bucket } from "https://deno.land/x/s3@0.5.0/mod.ts";
import { getSignedUrl } from "https://deno.land/x/aws_s3_presign@1.3.1/mod.ts";
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

  async getFile(filename: string) {
    const response = await this.bucket.listObjects({ prefix: filename });
    const contents = response?.contents;

    if (!contents || contents.length === 0) {
      return null;
    }

    return {
      name: contents[0].key!.replace(/^.*\/(.*)$/, "$1"),
      size: contents[0].size!,
      updated: contents[0].lastModified!,
      download: spacesClient.signedGET(contents[0].key!),
    };
  }

  async getFiles(directory: string) {
    const response = await this.bucket.listObjects({ prefix: directory });
    const contents = response?.contents;

    if (!contents || contents.length === 0) {
      return null;
    }

    // The first item is just the directory instead of a file so we'll remove it
    contents.shift();

    return contents.map((content) => {
      return {
        name: content.key!.replace(/^.*\/(.*)$/, "$1"),
        size: content.size!,
        updated: content.lastModified!,
        download: spacesClient.signedGET(content.key!),
      };
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
