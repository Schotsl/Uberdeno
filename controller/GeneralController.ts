import { Client } from "https://deno.land/x/mysql@v2.10.2/mod.ts";
import { ColumnInfo } from "../types.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { generateColumns, populateInstance, renderREST } from "../helper.ts";

import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";
import GeneralRepository from "../repository/GeneralRepository.ts";
import InterfaceController from "./InterfaceController.ts";

export default class GeneralController implements InterfaceController {
  private Entity: { new (): BaseEntity };

  private generalColumns: ColumnInfo[] = [];
  private generalRepository: GeneralRepository;

  constructor(
    mysqlClient: Client,
    name: string,
    Entity: { new (): BaseEntity },
    Collection: { new (): BaseCollection },
  ) {
    this.Entity = Entity;

    this.generalColumns = generateColumns(Entity);
    this.generalRepository = new GeneralRepository(
      mysqlClient,
      name,
      Entity,
      Collection,
    );
  }

  async getCollection(
    { response, state }: {
      response: Response;
      state: State;
    },
  ) {
    const { offset, limit } = state;

    const result = await this.generalRepository.getCollection(offset, limit);
    const parsed = renderREST(result);

    response.body = parsed;
  }

  async removeObject(
    { params, response }: {
      request: Request;
      params: { uuid: string };
      response: Response;
    },
  ) {
    const uuid = params.uuid;
    await this.generalRepository.removeObject(uuid);

    response.status = 204;
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    const body = await request.body();
    const value = await body.value;
    const object = new this.Entity();
    delete value.uuid;

    populateInstance(value, this.generalColumns, object);

    const result = await this.generalRepository.addObject(object);
    const parsed = renderREST(result);

    response.body = parsed;
  }
}
