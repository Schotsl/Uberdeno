import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";

import InterfaceController from "../controller/InterfaceController.ts";

export default class GeneralRouter {
  public router: Router;

  constructor(
    controller: InterfaceController,
    path: string,
    version = "v1",
  ) {
    this.router = new Router({ prefix: `/${version}/${path}` });

    const collection = controller.getCollection.bind(controller);
    const object = controller.getObject.bind(controller);
    const remove = controller.removeObject.bind(controller);
    const post = controller.addObject.bind(controller);

    this.router.get("/", collection);
    this.router.get("/:uuid", object);
    this.router.post("/", post);
    this.router.delete("/:uuid", remove);
  }
}
