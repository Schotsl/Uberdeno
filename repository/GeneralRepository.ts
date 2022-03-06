import { ColumnInfo } from "../types.ts";
import { generateColumns } from "../helper.ts";
import { ColumnType } from "../types.ts";
import { DuplicateResource, MissingResource } from "../errors.ts";

import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";

import Querries from "../other/Querries.ts";
import mysqlClient from "../services/mysqlClient.ts";
import GeneralMapper from "../mapper/GeneralMapper.ts";
import InterfaceRepository from "./InterfaceRepository.ts";

export default class GeneralRepository implements InterfaceRepository {
  private generalName: string;
  private generalMapper: GeneralMapper;
  private generalColumns: ColumnInfo[] = [];

  private queryClient: Querries;

  constructor(
    name: string,
    Entity: { new (): BaseEntity },
    Collection: { new (): BaseCollection },
  ) {
    this.generalName = name;
    this.generalMapper = new GeneralMapper(Entity, Collection);
    this.generalColumns = generateColumns(Entity);

    this.queryClient = new Querries(this.generalColumns, this.generalName);
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<BaseCollection> {
    const fetch = this.queryClient.fetchQuery();
    const count = this.queryClient.countQuery();

    const promises = [
      mysqlClient.execute(fetch, [limit, offset]),
      mysqlClient.execute(count),
    ];

    const data = await Promise.all(promises);
    const rows = data[0].rows!;
    const total = data[1].rows![0].total;

    return this.generalMapper.mapCollection(rows, offset, limit, total);
  }

  public async removeObject(uuid: string): Promise<void> {
    const remove = this.queryClient.removeQuery();
    const data = await mysqlClient.execute(remove, [uuid]);

    if (data.affectedRows === 0) {
      throw new MissingResource(this.generalName);
    }
  }

  public async addObject(object: BaseEntity): Promise<BaseEntity> {
    const insert = this.queryClient.insertQuery();
    const values = this.generalColumns.filter((column) => {
      const { title, type } = column;

      if (type === ColumnType.UnknownColumn) {
        return false;
      }

      if (title === `updated` || title === `created`) {
        return false;
      }

      return true;
    }).map((column) => {
      const title = column.title as keyof BaseEntity;
      return object[title].getValue();
    });

    await mysqlClient.execute(insert, values).catch((error: Error) => {
      // Throw a duplicate error to the user if a unique key is already used
      const regexp = new RegExp(/for\skey\s'(.*)'$/);
      const message = error.message;

      if (regexp.test(message)) throw new DuplicateResource("user");

      throw error;
    });

    const result = await this.getObject(object.uuid.getValue()!);
    return result!;
  }

  public async getObject(uuid: string): Promise<BaseEntity> {
    const get = this.queryClient.getQuery();
    const data = await mysqlClient.execute(get, [uuid]);

    if (typeof data.rows === "undefined" || data.rows.length === 0) {
      throw new MissingResource(this.generalName);
    }

    const row = data.rows![0];
    return this.generalMapper.mapObject(row);
  }
}
