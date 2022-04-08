import Mailgun from "https://raw.githubusercontent.com/Schotsl/Mailgun/main/index.ts";

import { initializeEnv } from "../helper.ts";

initializeEnv([
  "MAILGUN_KEY",
  "MAILGUN_REGION",
  "MAILGUN_DOMAIN",
]);

const key = Deno.env.get("MAILGUN_KEY")!;
const region = Deno.env.get("MAILGUN_REGION")!;
const domain = Deno.env.get("MAILGUN_DOMAIN")!;

const mailgunClient = new Mailgun({ key, region, domain });

export default mailgunClient;
