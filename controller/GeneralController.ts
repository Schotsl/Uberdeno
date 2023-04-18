// deno-lint-ignore-file no-explicit-any

import { ColumnInfo } from "../types.ts";
import { Filter } from "../types.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v12.2.0/mod.ts";
import { generateColumns, populateInstance, renderREST } from "../helper.ts";

import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";
import GeneralRepository from "../repository/GeneralRepository.ts";
import InterfaceController from "./InterfaceController.ts";

export default class GeneralController implements InterfaceController {
  private Entity: { new (): BaseEntity };

  private generalFilter?: Filter;
  private generalColumns: ColumnInfo[] = [];
  private generalRepository: GeneralRepository;

  constructor(
    name: string,
    Entity: { new (): BaseEntity },
    Collection: { new (): BaseCollection },
    filter?: Filter,
  ) {
    this.Entity = Entity;

    this.generalFilter = filter;
    this.generalColumns = generateColumns(Entity);
    this.generalRepository = new GeneralRepository(
      name,
      Entity,
      Collection,
    );
  }

  private generateFilter(state: State): Filter | undefined {
    if (typeof this.generalFilter === "undefined") {
      return undefined;
    }

    const {
      key,
      type,
      value,
    } = this.generalFilter;

    return {
      key,
      type,
      value: state[value],
    };
  }

  async getCollection(
    { response, state }: {
      response: Response;
      state: State;
    },
  ) {
    const { offset, limit } = state;

    const filter = this.generateFilter(state);
    const result = await this.generalRepository.getCollection(
      offset,
      limit,
      filter,
    );
    const parsed = renderREST(result);

    response.body = parsed;
  }

  async getObject(
    { response, params, state }: {
      response: Response;
      params: { uuid: string };
      state: State;
    },
  ): Promise<any> {
    const uuid = params.uuid;

    const filter = this.generateFilter(state);
    const result = await this.generalRepository.getObject(uuid, filter);
    const parsed = renderREST(result);

    response.body = parsed;

    return result;
  }

  async updateObject(
    { request, response, value, state, uuid, params }: {
      request: Request;
      response: Response;
      params: { uuid: string };
      state: State;
      value?: any;
      uuid?: string;
    },
  ) {
    // If the body hasn't been consumed will consume it our self
    if (typeof value === "undefined") {
      const body = await request.body();
      const fetch = await body.value;

      value = fetch;
    }

    value.uuid = params.uuid;

    if (typeof uuid !== "undefined") {
      value.uuid = uuid;
    }

    // TODO: Should probably be a single query instead of two
    const filter = this.generateFilter(state);
    const object = await this.generalRepository.getObject(params.uuid, filter);

    populateInstance(value, this.generalColumns, object, true);

    const result = await this.generalRepository.updateObject(object);
    const parsed = renderREST(result);

    response.body = parsed;

    return result;
  }

  async removeObject(
    { response, params, state }: {
      response: Response;
      params: { uuid: string };
      state: State;
    },
  ) {
    const uuid = params.uuid;
    const filter = this.generateFilter(state);

    await this.generalRepository.removeObject(uuid, filter);

    response.status = 204;
  }

  async addObject<T>(
    { request, response, state, value, uuid }: {
      request: Request;
      response: Response;
      state: State;
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

    const filter = this.generateFilter(state);
    const result = await this.generalRepository.addObject(object, filter);
    const parsed = renderREST(result);

    response.body = parsed;

    return result;
  }
}
