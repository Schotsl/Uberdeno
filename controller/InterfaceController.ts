import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v10.1.0/mod.ts";

export default interface InterfaceController {
  getCollection(
    { request, response }: {
      request?: Request;
      response?: Response;
      state?: State;
    },
  ): void;

  removeObject(
    { params, response }: { params: { uuid: string }; response: Response },
  ): void;

  // updateObject(
  //   { params, response }: { params: { uuid: string }; response: Response },
  // ): void;

  addObject(
    { request, response }: { request: Request; response: Response },
  ): void;
}
