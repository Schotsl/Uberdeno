// deno-lint-ignore-file no-explicit-any

import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import { ColumnInfo } from "../types.ts";
import { UUIDColumn } from "../other/Columns.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v10.0.0/mod.ts";
import {
  generateColumns,
  populateInstance,
  renderREST,
  validateInstance,
} from "../helper.ts";
import InterfaceController from "./InterfaceController.ts";

import GeneralRepository from "../repository/GeneralRepository.ts";

export default class GeneralController implements InterfaceController {
  private Entity: any;

  private generalColumns: ColumnInfo[] = [];
  private generalRepository: GeneralRepository;

  constructor(mysqlClient: Client, name: string, Entity: any, Collection: any) {
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
    const uuid = new UUIDColumn(params.uuid);
    await this.generalRepository.removeObject(uuid);

    response.status = 204;
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    const body = await request.body();
    const value = await body.value;
    const object = new this.Entity();

    validateInstance(value, this.generalColumns);
    populateInstance(value, this.generalColumns, object);

    const result = await this.generalRepository.addObject(object);
    const parsed = renderREST(result);

    response.body = parsed;
  }
}
