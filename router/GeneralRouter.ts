// deno-lint-ignore-file no-explicit-any

import {
  Router,
  RouterMiddleware,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";

interface ParamsDictionary {
  [key: string]: string;
}

import InterfaceController from "../controller/InterfaceController.ts";

export default class GeneralRouter {
  public router: Router;
  public controller: InterfaceController;

  constructor(
    controller: InterfaceController,
    path: string,
    version = "v1",
  ) {
    this.router = new Router({ prefix: `/${version}/${path}` });
    this.controller = controller;

    const collection = controller.getCollection.bind(controller);
    const remove = controller.removeObject.bind(controller);
    const object = controller.getObject.bind(controller);
    const post = controller.addObject.bind(controller);
    const put = controller.updateObject.bind(controller);

    this.router.get("/", collection);
    this.router.get("/entity/:uuid", object);
    this.router.put("/:uuid", put);
    this.router.post("/", post);
    this.router.delete("/:uuid", remove);
  }

  get(
    path: string,
    callback: RouterMiddleware<string, ParamsDictionary, Record<string, any>>,
  ) {
    callback = callback.bind(this.controller);
    this.router.get(path, callback);
  }

  post(
    path: string,
    callback: RouterMiddleware<string, ParamsDictionary, Record<string, any>>,
  ) {
    callback = callback.bind(this.controller);
    this.router.post(path, callback);
  }

  delete(
    path: string,
    callback: RouterMiddleware<string, ParamsDictionary, Record<string, any>>,
  ) {
    callback = callback.bind(this.controller);
    this.router.post(path, callback);
  }

  put(
    path: string,
    callback: RouterMiddleware<string, ParamsDictionary, Record<string, any>>,
  ) {
    callback = callback.bind(this.controller);
    this.router.put(path, callback);
  }
}
