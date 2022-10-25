import { initializeEnv } from "../helper.ts";

initializeEnv([
  "SPACES_ID",
  "SPACES_KEY",
  "SPACES_REGION",
  "SPACES_BUCKET",
  "SPACES_ENDPOINT",
  "CONVERT_KEY",
]);

class ConvertClient {
  bucket: string;
  region: string;
  endpoint: string;

  access_key_id: string;
  secret_access_key: string;
  convert_access_key: string;

  constructor() {
    this.bucket = Deno.env.get("SPACES_BUCKET")!;
    this.region = Deno.env.get("SPACES_REGION")!;
    this.endpoint = Deno.env.get("SPACES_ENDPOINT")!;

    this.access_key_id = Deno.env.get("SPACES_ID")!;
    this.secret_access_key = Deno.env.get("SPACES_KEY")!;
    this.convert_access_key = Deno.env.get("CONVERT_KEY")!;
  }

  async convertPPTX(uuid: string) {
    const {
      bucket,
      region,
      endpoint,
      access_key_id,
      secret_access_key,
      convert_access_key,
    } = this;

    const url = "https://api.cloudconvert.com/v2/jobs";
    const method = "POST";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${convert_access_key}`,
    };
    console.log({
      key: `${uuid}.pptx`,
      region,
      bucket,
      endpoint,
      operation: "import/s3",
      access_key_id,
      secret_access_key,
    });
    const query = {
      tasks: {
        import: {
          key: `${uuid}.pptx`,
          region,
          bucket,
          endpoint,
          operation: "import/s3",
          access_key_id,
          secret_access_key,
        },
        convert: {
          input: "import",
          alpha: false,
          width: 1920,
          height: 1080,
          engine: "office",
          operation: "convert",
          output_type: "slides",
          output_format: "png",
          input_format: "pptx",
          pixel_density: 300,
          hidden_slides: false,
        },
        export: {
          key: `${uuid}/%d.png`,
          input: "convert",
          region,
          bucket,
          endpoint,
          operation: "export/s3",
          access_key_id,
          secret_access_key,
        },
      },
      tag: "jobbuilder",
    };

    const body = JSON.stringify(query);
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const data = await response.json();
    return data.data.id;
  }

  async convertPPTXStatus(uuid: string) {
    const url = `https://api.cloudconvert.com/v2/jobs/${uuid}`;
    const method = "GET";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.convert_access_key}`,
    };

    const response = await fetch(url, {
      method,
      headers,
    });

    const data = await response.json();
    return data.data.status;
  }
}

const convertClient = new ConvertClient();

export default convertClient;
