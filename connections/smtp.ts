import { SmtpClient } from "https://raw.githubusercontent.com/Schotsl/deno-smtp/master/smtp.ts";
import { initializeEnv } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/helper.ts";

initializeEnv([
  "IMAP_PORT",
  "IMAP_HOSTNAME",
  "IMAP_USERNAME",
  "IMAP_PASSWORD",
]);

const smtpClient = new SmtpClient();

await smtpClient.connectTLS({
  hostname: Deno.env.get("IMAP_HOSTNAME")!,
  username: Deno.env.get("IMAP_USERNAME")!,
  password: Deno.env.get("IMAP_PASSWORD")!,
  port: +Deno.env.get("IMAP_PORT")!,
});

export default smtpClient;
