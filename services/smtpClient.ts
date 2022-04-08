import { SmtpClient } from "https://raw.githubusercontent.com/Schotsl/denomailer/master/smtp.ts";
import { initializeEnv } from "../helper.ts";

initializeEnv([
  "SMTP_PORT",
  "SMTP_HOSTNAME",
  "SMTP_USERNAME",
  "SMTP_PASSWORD",
]);

const smtpClient = new SmtpClient();
await smtpClient.connectTLS({
  hostname: "mail.flevohost.eu",
  username: "svanholst@corvusconsultancy.nl",
  password: Deno.env.get("SMTP_PASSWORD")!,
  port: 465,
});

export default smtpClient;
