import { red } from "https://deno.land/std@0.110.0/fmt/colors.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v10.0.0/mod.ts";
import {
  InvalidBody,
  InvalidHeader,
  InvalidProperty,
  LimitExceeded,
  MissingBody,
  UberdenoError,
} from "./errors.ts";

export async function postHandler(
  { request }: {
    request: Request;
  },
  next: () => Promise<unknown>,
): Promise<void> {
  if (request.method === "POST" || request.method === "PUT") {
    if (!request.hasBody) {
      throw new MissingBody();
    }

    if (request.headers.get("Content-Type") !== "application/json") {
      throw new InvalidHeader();
    }

    const body = request.body({ type: "json" });
    await body.value.catch(() => {
      throw new InvalidBody();
    });
  }

  await next();
  return;
}

export async function errorHandler(
  { response }: {
    response: Response;
  },
  next: () => Promise<unknown>,
): Promise<void> {
  await next().catch(
    (error: UberdenoError) => {
      console.log(error.statusError);
      if (
        error.statusError === 500 || typeof error.statusError === "undefined"
      ) {
        response.body = "Internal Server Error";
        response.status = 500;

        console.log(error.message);
        console.log(error.stack);

        const headers = { "Content-Type": "application/json" };
        const method = "POST";
        const body = JSON.stringify({
          error: error.message,
          stack: error.stack,
          fixed: false,
        });

        if (Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined) {
          fetch(`https://api.bot-ross.com/v1/log`, { headers, method, body })
            .catch(() => console.log(red(`Couldn't report log to Bot-Ross`)));
        }

        return;
      }

      response.status = error.statusError;
      response.body = {
        message: error.message,
      };
    },
  );
}

export async function limitHandler(
  { request, state }: {
    request: Request;
    state: State;
  },
  next: () => Promise<unknown>,
): Promise<void> {
  if (request.method === "GET") {
    let limit = request.url.searchParams.get(`limit`)
      ? request.url.searchParams.get(`limit`)
      : 5;

    let offset = request.url.searchParams.get(`offset`)
      ? request.url.searchParams.get(`offset`)
      : 0;

    if (isNaN(+limit!) || Number(limit) < 0) {
      throw new InvalidProperty("limit", "number");
    }

    if (isNaN(+offset!) || Number(offset) < 0) {
      throw new InvalidProperty("offset", "number");
    }

    limit = Number(limit);
    offset = Number(offset);

    if (limit > 99) {
      throw new LimitExceeded();
    }

    state.limit = limit;
    state.offset = offset;
  }

  await next();
  return;
}
