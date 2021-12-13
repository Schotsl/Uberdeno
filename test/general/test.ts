import { errorHandler, limitHandler, postHandler } from "../../middleware.ts";
import { TinyColumn, VarcharColumn } from "../../other/Columns.ts";
import { Application, Router } from "https://deno.land/x/oak@v10.0.0/mod.ts";

import mysqlClient from "../../connections/mysql.ts";

import GeneralController from "../../controller/GeneralController.ts";
import BaseCollection from "../../collection/BaseCollection.ts";
import BaseEntity from "../../entity/BaseEntity.ts";

export class OriginEntity extends BaseEntity {
  public title: VarcharColumn;
  public amount: TinyColumn;

  constructor(title: string, amount: number) {
    super();

    this.title = new VarcharColumn(title);
    this.amount = new TinyColumn(amount);
  }
}

export class OriginCollection extends BaseCollection {
  public origins: OriginEntity[] = [];
}

const originApp = new Application();
const originRouter = new Router();
const originController = new GeneralController(
  mysqlClient,
  "origin",
  OriginEntity,
  OriginCollection,
);

originRouter.get("/", originController.getCollection.bind(originController));
originRouter.post("/", originController.addObject.bind(originController));
originRouter.delete(
  "/:uuid",
  originController.removeObject.bind(originController),
);

originApp.use(postHandler);
originApp.use(errorHandler);
originApp.use(limitHandler);

originApp.use(originRouter.routes());

originApp.listen({ port: 8080 });
