import { initializeEnv } from "../helper.ts";
import {
  Bot,
  createBot,
  CreateBotOptions,
  CreateMessage,
  sendMessage,
  startBot,
} from "https://deno.land/x/discordeno@13.0.0-rc45/mod.ts";

initializeEnv([
  "DISCORD_ID",
  "DISCORD_TOKEN",
]);

class DiscordClient {
  discordeno: Bot;

  constructor(config: CreateBotOptions) {
    this.discordeno = createBot(config);
  }

  async sendError(message: CreateMessage) {
    const channel = BigInt(948935943811903540n);
    await sendMessage(this.discordeno, channel, message);
  }

  async sendLog(message: CreateMessage) {
    const channel = BigInt(949741041840435220n);
    await sendMessage(this.discordeno, channel, message);
  }
}

const discordClient = new DiscordClient({
  token: Deno.env.get("DISCORD_TOKEN")!,
  botId: BigInt(Deno.env.get("DISCORD_ID")!),
  events: {},
  intents: [],
});

await startBot(discordClient.discordeno);

export default discordClient;
