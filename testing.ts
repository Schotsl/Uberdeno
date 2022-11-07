import { Client } from "https://deno.land/x/mysql@v2.10.3/mod.ts";

export async function testMysql(mysqlClient: Client) {
  const port = mysqlClient.config.port!;
  const host = mysqlClient.config.hostname!;

  const timeout = setTimeout(() => {
    throw Error(`Couldn't connect to ${host}:${port}`);
  }, 10000);

  await mysqlClient.query("SHOW VARIABLES LIKE 'version%';");

  clearTimeout(timeout);
}
