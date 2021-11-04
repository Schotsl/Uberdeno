import { red } from "https://deno.land/std@0.110.0/fmt/colors.ts";
import { Context } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {
  InvalidBody,
  InvalidHeader,
  MissingBody,
  UberdenoError,
} from "./errors.ts";

export async function postHandler(
  ctx: Context,
  next: () => Promise<unknown>,
): Promise<void> {
  if (ctx.request.method === "POST" || ctx.request.method === "PUT") {
    if (!ctx.request.hasBody) {
      throw new MissingBody();
    }

    if (ctx.request.headers.get("Content-Type") !== "application/json") {
      throw new InvalidHeader();
    }

    const body = ctx.request.body({ type: "json" });
    await body.value.catch(() => {
      throw new InvalidBody();
    });
  }

  await next();
  return;
}

export async function errorHandler(
  ctx: Context,
  next: () => Promise<unknown>,
): Promise<void> {
  await next().catch(
    (error: UberdenoError) => {
      if (
        error.statusError === 500 || typeof error.statusError === "undefined"
      ) {
        ctx.response.body = "Internal Server Error";
        ctx.response.status = 500;

        console.log(error.message);
        console.log(error.stack);

        const headers = { "Content-Type": "application/json" };
        const method = "POST";
        const body = JSON.stringify({
          error: error.message,
          stack: error.stack,
          fixed: false,
        });

        fetch(`https://api.bot-ross.com/v1/log`, { headers, method, body })
          .catch(() => console.log(red(`Couldn't report log to Bot-Ross`)));

        return;
      }

      ctx.response.status = error.statusError;
      ctx.response.body = {
        message: error.message,
      };
    },
  );
}
