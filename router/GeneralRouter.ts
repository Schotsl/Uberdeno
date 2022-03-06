import { Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";

import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";
import InterfaceFilter from "../filter/InterfaceFilter.ts";
import GeneralController from "../../Uberdeno/controller/GeneralController.ts";

export default class GeneralRouter {
  public router: Router;

  constructor(version: string, path: string, table: string, entity: { new (): BaseEntity }, collection: { new (): BaseCollection }, filter?: InterfaceFilter) {
    const controller = new GeneralController(
      table,
      entity,
      collection,
      filter,
    )

    this.router = new Router({ prefix: `/${version}/${path}` });

    const get = controller.getCollection.bind(controller);
    const post = controller.addObject.bind(controller);
    const remove = controller.removeObject.bind(controller);
    
    this.router.get("/", get);
    this.router.post("/", post);
    this.router.delete("/:uuid", remove);
  }
}