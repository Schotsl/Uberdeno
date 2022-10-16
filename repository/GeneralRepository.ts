import { ColumnInfo } from "../types.ts";
import { generateColumns } from "../helper.ts";
import { UUIDColumn } from "../other/Columns.ts";
import { ColumnType } from "../types.ts";
import {
  DuplicateResource,
  InvalidProperty,
  MissingResource,
} from "../errors.ts";

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

  public queryClient: Querries;

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

  public async removeObject(uuid: UUIDColumn | string): Promise<void> {
    const parsed = typeof uuid === "string" ? uuid : uuid.getValue()!;
    const query = this.queryClient.removeQuery();
    const data = await mysqlClient.execute(query, [parsed]);

    if (data.affectedRows === 0) {
      throw new MissingResource(this.generalName);
    }
  }

  async updateObject(
    object: Partial<BaseEntity>,
  ): Promise<BaseEntity> {
    const values = [];
    const exclude = [
      "created",
      "updated",
      "uuid",
      "person",
      "location",
      "reference",
      "machine",
    ];

    let query = `UPDATE ${this.queryClient.table} SET`;

    for (const [key, value] of Object.entries(object)) {
      if (
        typeof value != "undefined" && value !== null && !exclude.includes(key)
      ) {
        query += ` ${key}=?,`;
        values.push(value.getValue());
      } else if (
        typeof value != "undefined" && value !== null && key === "reference"
      ) {
        query += ` ${key}=UNHEX(REPLACE(?, '-', '')),`;
        values.push(value.getValue());
      }
    }

    if (values.length > 0) {
      query = query.slice(0, -1);
      query += " WHERE uuid = UNHEX(REPLACE(?, '-', ''))";
      await mysqlClient.execute(query, [...values, object.uuid?.getValue()]);
    }

    const data = await this.getObject(object.uuid!);
    return data!;
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
      const message = error.message;

      const duplicate = new RegExp(/for\skey\s'(.*)'$/);
      const refrence = new RegExp(
        /(?<=FOREIGN KEY \(`)(.*)(?=`\) REFERENCES)/g,
      );

      // Throw an error if the resource already exists
      if (duplicate.test(message)) {
        throw new DuplicateResource(this.generalName);
      }

      // Make sure we catch invalid UUID refrences
      if (refrence.test(message)) {
        const matches = message.match(refrence)!;
        const property = matches[0];

        throw new InvalidProperty(property, property);
      }

      throw error;
    });

    const result = await this.getObject(object.uuid);
    return result!;
  }

  // TODO: Add uid: UUIDColumn | string to remove function

  public async getObject(uuid: UUIDColumn | string): Promise<BaseEntity> {
    const parsed = typeof uuid === "string" ? uuid : uuid.getValue()!;
    const query = this.queryClient.getQuery();
    const data = await mysqlClient.execute(query, [parsed]);

    if (typeof data.rows === "undefined" || data.rows.length === 0) {
      throw new MissingResource(this.generalName);
    }

    const row = data.rows![0];
    return this.generalMapper.mapObject(row);
  }

  public async getObjectBy(key: string, value: string): Promise<BaseEntity> {
    const query = this.queryClient.getQueryBy();
    const data = await mysqlClient.execute(query, [key, value]);

    if (typeof data.rows === "undefined" || data.rows.length === 0) {
      throw new MissingResource(this.generalName);
    }

    const row = data.rows![0];
    return this.generalMapper.mapObject(row);
  }
}
