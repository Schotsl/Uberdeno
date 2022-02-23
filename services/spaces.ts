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
    await this.bucket.deleteObject(name);
  }

  async signedGET(file: string) {
    const headers = { 'Content-Type': 'application/json' };
    const method = "POST";
    const body = JSON.stringify({ file });
    
    const response = await fetch('http://localhost:69/v1/signed/get', { headers, method, body });
    const parsed = await response.text();
  
    return parsed;
  }
  
  async signedPUT(file: string, type: string, size: number) {
    const headers = { 'Content-Type': 'application/json' };
    const method = "POST";
    const body = JSON.stringify({ file, type, size });
    
    const response = await fetch('http://localhost:69/v1/signed/put', { headers, method, body });
    const parsed = await response.text();
  
    return parsed;
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
