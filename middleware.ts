import { red } from "https://deno.land/std@0.140.0/fmt/colors.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";

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

    // We'll transfer every header key to lowercase for easier comparison
    request.headers.forEach((_value, key) => {
      key = key.toLowerCase();
    });

    if (request.headers.get("content-type") !== "application/json") {
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
      if (
        error.statusError === 500 || typeof error.statusError === "undefined"
      ) {
        response.body = "Internal Server Error";
        response.status = 500;

        console.log(error.message);
        console.log(error.stack);

        if (
          Deno.env.get("OVERSIGHT_UUID") === undefined &&
          Deno.env.get("DENO_DEPLOYMENT_ID") === undefined
        ) {
          console.log(`Application is missing a Oversight UUID`);
        } else if (
          Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined &&
          Deno.env.get("OVERSIGHT_UUID") !== undefined
        ) {
          const headers = { "Content-Type": "application/json" };
          const method = "POST";
          const body = JSON.stringify({
            project: Deno.env.get("OVERSIGHT_UUID"),
            message: error.message,
            stack: error.stack,
            fixed: false,
          });

          fetch(`https://oversight.deno.dev/v1/error`, {
            headers,
            method,
            body,
          })
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
