import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";

import { gray, green, red } from "https://deno.land/std@0.110.0/fmt/colors.ts";

export async function testMysql(mysqlClient: Client) {
  const port = mysqlClient.config.port!;
  const host = mysqlClient.config.hostname!;

  const timeout = setTimeout(() => {
    throw Error(`Couldn't connect to ${host}:${port}`);
  }, 1000);

  await mysqlClient.query("SHOW VARIABLES LIKE 'version%';");

  clearTimeout(timeout);
}
