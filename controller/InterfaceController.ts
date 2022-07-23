import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";

export default interface InterfaceController {
  getCollection(
    { request, response, state }: {
      request: Request;
      response: Response;
      state: State;
    },
  ): void;

  getObject(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ): void;

  removeObject(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ): void;

  updateObject(
    { request, response }: {
      request: Request;
      response: Response;
    },
  ): void;

  addObject(
    { request, response }: {
      request: Request;
      response: Response;
    },
  ): void;
}
