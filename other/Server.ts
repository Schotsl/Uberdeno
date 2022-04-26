// deno-lint-ignore-file no-explicit-any

import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import {
  Application,
  Context,
  Middleware,
  State,
} from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { errorHandler, limitHandler, postHandler } from "../middleware.ts";

const id = Deno.env.get("DENO_DEPLOYMENT_ID")
  ? Deno.env.get("DENO_DEPLOYMENT_ID")
  : false;

const region = Deno.env.get("DENO_DEPLOYMENT_ID")
  ? Deno.env.get("DENO_DEPLOYMENT_ID")
  : false;

const version = "v1.0.0";

export default class Server {
  private application: Application;

  constructor() {
    this.application = new Application();

    this.application.use(oakCors());

    this.application.use(errorHandler);
    this.application.use(limitHandler);
    this.application.use(postHandler);

    this.application.use(({ response }) => {
      response.body = {
        id,
        region,
        version,
      };
    });
  }

  public use(
    middleware: Middleware<State, Context<State, Record<string, any>>>,
  ) {
    return this.application.use(middleware);
  }

  public listen(port = 8080) {
    return this.application.listen({ port });
  }
}
