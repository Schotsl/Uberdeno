// deno-lint-ignore-file no-explicit-any

import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import {
  Application,
  Context,
  Middleware,
  Router,
  State,
} from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { errorHandler, limitHandler, postHandler } from "../middleware.ts";

const id = Deno.env.get("DENO_DEPLOYMENT_ID")
  ? Deno.env.get("DENO_DEPLOYMENT_ID")
  : false;

const region = Deno.env.get("DENO_REGION")
  ? Deno.env.get("DENO_REGION")
  : false;

const version = "v1.0.0";

export default class Server {
  private application: Application;

  constructor() {
    const application = new Application();

    application.use(oakCors());

    application.use(errorHandler);
    application.use(limitHandler);
    application.use(postHandler);

    const router = new Router();

    // We need a / route to make sure that the server is online
    router.get("/", ({ response }) => {
      response.body = { id, region, version };
    });

    application.use(router.routes());
    application.use(router.allowedMethods());

    this.application = application;
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
