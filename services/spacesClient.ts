import { initializeEnv } from "../helper.ts";
import { getSignedUrl } from 'https://deno.land/x/aws_s3_presign/mod.ts'

initializeEnv([
  "SPACES_ID",
  "SPACES_KEY",
  "SPACES_REGION",
  "SPACES_BUCKET",
  "SPACES_ENDPOINT",
]);

const spacesCredentials = {
  region: Deno.env.get("SPACES_REGION")!,
  endpoint: Deno.env.get("SPACES_ENDPOINT")!,
  bucketName: Deno.env.get("SPACES_BUCKET")!,
  accessKeyId: Deno.env.get("SPACES_ID")!,
  secretAccessKey: Deno.env.get("SPACES_KEY")!,
}

class SpacesClient {
  signedGET(filename: string) {
    return getSignedUrl({
      method: 'GET',
      objectPath: `/${filename}`,
      ...spacesCredentials,
    })
  }

  signedPUT(filename: string) {
    return getSignedUrl({
      method: 'PUT',
      objectPath: `/${filename}`,
      ...spacesCredentials,
    })
  }
}

const spacesClient = new SpacesClient();

export default spacesClient;
