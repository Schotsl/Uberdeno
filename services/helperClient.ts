import { initializeEnv } from "../helper.ts";

initializeEnv([
  "HELPER_IP",
  "HELPER_KEY",
]);

interface helperConfig {
  helperIp: string;
  helperKey: string;
}

class HelperClient {
  helperIp: string;
  helperKey: string;

  constructor(config: helperConfig) {
    this.helperIp = config.helperIp;
    this.helperKey = config.helperKey;
  }

  alert() {
    const url = `http://helper.bot-ross.dev/v1/hue/alert?key=${this.helperKey}&ip=${this.helperIp}`;
    const method = "POST";
    const headers = { "Content-Type": "application/json" };

    fetch(url, { method, headers });
  }
}

const helperClient = new HelperClient({
  helperIp: Deno.env.get("HELPER_IP")!,
  helperKey: Deno.env.get("HELPER_KEY")!,
});

export default helperClient;
