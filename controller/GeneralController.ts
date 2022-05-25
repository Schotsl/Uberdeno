// deno-lint-ignore-file no-explicit-any

import { ColumnInfo } from "../types.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";
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
    name: string,
    Entity: { new (): BaseEntity },
    Collection: { new (): BaseCollection },
  ) {
    this.Entity = Entity;

    this.generalColumns = generateColumns(Entity);
    this.generalRepository = new GeneralRepository(
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

  async getObject(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ) {
    const uuid = params.uuid;

    const result = await this.generalRepository.getObject(uuid);
    const parsed = renderREST(result);

    response.body = parsed;
  }

  async removeObject(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ) {
    const uuid = params.uuid;

    await this.generalRepository.removeObject(uuid);

    response.status = 204;
  }

  async addObject<T>(
    { request, response, value, uuid }: {
      request: Request;
      response: Response;
      value?: any;
      uuid?: string;
    },
  ): Promise<any> {
    // If the body hasn't been consumed will consume it our self
    if (typeof value === "undefined") {
      const body = await request.body();
      const fetch = await body.value;

      value = fetch;
    }

    delete value.uuid;

    if (typeof uuid !== "undefined") {
      value.uuid = uuid;
    }

    const object = new this.Entity();

    populateInstance(value, this.generalColumns, object);

    const result = await this.generalRepository.addObject(object);
    const parsed = renderREST(result);

    response.body = parsed;

    return result;
  }
}
