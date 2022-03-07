import { Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";

// import BaseEntity from "../entity/BaseEntity.ts";
// import BaseCollection from "../collection/BaseCollection.ts";
// import InterfaceFilter from "../filter/InterfaceFilter.ts";
import InterfaceController from "../controller/InterfaceController.ts";

export default class GeneralRouter {
  public router: Router;

  constructor(
    controller: InterfaceController,
    path: string,
    version = "v1",
  ) {
    this.router = new Router({ prefix: `/${version}/${path}` });

    const get = controller.getCollection.bind(controller);
    const post = controller.addObject.bind(controller);
    const remove = controller.removeObject.bind(controller);

    this.router.get("/", get);
    this.router.post("/", post);
    this.router.delete("/:uuid", remove);
  }
}
