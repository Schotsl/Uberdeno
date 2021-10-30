import { config } from "https://deno.land/x/dotenv@v3.0.0/mod.ts";
import { red } from "https://deno.land/std@0.110.0/fmt/colors.ts";

export function initializeEnv(variables: string[]) {
  if (Deno.env.get("DENO_DEPLOYMENT_ID") === undefined) {
    config({ export: true, path: ".env", defaults: ".env" });
  }

  variables.forEach((variable: string) => {
    if (!Deno.env.get(variable)) {
      console.log(red(`${variable} .env variable must be set.`));
      Deno.exit();
    }
  });
}

export function restoreUUID(hex: string): string {
  // Re-add the dashes to the UUID and lowercase the string
  const dashed = `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${
    hex.substr(12, 4)
  }-${hex.substr(16, 4)}-${hex.substr(20)}`;

  return dashed.toLowerCase();
}