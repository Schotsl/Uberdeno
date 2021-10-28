import { Request, Response } from "https://deno.land/x/oak@v9.0.1/mod.ts";

export default interface InterfaceController {
  getCollection(
    { request, response }: { request: Request; response: Response },
  ): void;

  removeObject(
    { params, response }: { params: { uuid: string }; response: Response },
  ): void;

  updateObject(
    { params, response }: { params: { uuid: string }; response: Response },
  ): void;

  addObject(
    { request, response }: { request: Request; response: Response },
  ): void;
}
