import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import { testMysql } from "../testing.ts";
import { configLogger } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import { initializeEnv } from "../helper.ts";

initializeEnv([
  "MYSQL_PORT",
  "MYSQL_USERNAME",
  "MYSQL_PASSWORD",
  "MYSQL_HOSTNAME",
  "MYSQL_DATABASE",
]);

// Disable logging for MySQL
await configLogger({ enable: false });

const mysqlClient = new Client();

mysqlClient.connect({
  hostname: Deno.env.get("SLURP_SERVER_MYSQL_HOSTNAME")!,
  username: Deno.env.get("SLURP_SERVER_MYSQL_USERNAME")!,
  password: Deno.env.get("SLURP_SERVER_MYSQL_PASSWORD")!,
  port: +Deno.env.get("SLURP_SERVER_MYSQL_PORT")!,
  db: Deno.env.get("SLURP_SERVER_MYSQL_DATABASE")!,
});

await testMysql(mysqlClient);

export default mysqlClient;
