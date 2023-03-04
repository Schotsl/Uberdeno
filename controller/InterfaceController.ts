import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v12.0.0/mod.ts";

export default interface InterfaceController {
  getCollection(
    { request, response, state }: {
      request: Request;
      response: Response;
      state: State;
    },
  ): void;

  getObject(
    { response, params, state }: {
      response: Response;
      params: { uuid: string };
      state: State;
    },
  ): void;

  removeObject(
    { response, params, state }: {
      response: Response;
      params: { uuid: string };
      state: State;
    },
  ): void;

  updateObject(
    { request, response, state }: {
      request: Request;
      response: Response;
      state: State;
    },
  ): void;

  addObject(
    { request, response, state }: {
      request: Request;
      response: Response;
      state: State;
    },
  ): void;
}
