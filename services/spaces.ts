import { S3Bucket, S3BucketConfig } from "https://deno.land/x/s3@0.5.0/mod.ts";
import { readerFromStreamReader } from "https://deno.land/std/io/mod.ts";
import { decode, encode } from "https://deno.land/std/encoding/base64.ts";
import { initializeEnv } from "../helper.ts";
import { readAll } from "https://deno.land/std@0.121.0/streams/mod.ts";

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

  async putBase64(name: string, base64: string) {
    const buffer = decode(base64);
    const config = { contentEncoding: "base64" };
    
    await this.bucket.putObject(name, buffer, config);

    return buffer.byteLength;
  }

  async getBase64(name: string) {
    const response = await this.bucket.getObject(name);
    const stream = response?.body?.getReader();
    const reader = readerFromStreamReader(stream!);
    const buffer = await readAll(reader);
    const base64 = encode(buffer);

    return base64;
  }

  async deleteBase64(name: string) {
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