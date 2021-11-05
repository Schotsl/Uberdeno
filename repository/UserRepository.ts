import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import { DuplicateResource, MissingResource } from "../errors.ts";

import UserEntity from "../entity/UserEntity.ts";
import UserMapper from "../mapper/UserMapper.ts";
import UserCollection from "../collection/UserCollection.ts";
import InterfaceRepository from "./InterfaceRepository.ts";

export default class UserRepository implements InterfaceRepository {
  private mysqlClient: Client;
  private userMapper: UserMapper;

  constructor(mysqlClient: Client) {
    this.mysqlClient = mysqlClient;
    this.userMapper = new UserMapper();
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<UserCollection> {
    const promises = [];

    promises.push(this.mysqlClient.execute(
      `SELECT HEX(uuid) AS uuid, email, discord, lastname, firstname, created, updated FROM user ORDER BY created DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    ));

    promises.push(this.mysqlClient.execute(
      `SELECT COUNT(uuid) AS total FROM user`,
    ));

    const data = await Promise.all(promises);
    const rows = data[0].rows!;
    const total = data[1].rows![0].total;

    return this.userMapper.mapCollection(rows, offset, limit, total);
  }

  public async updateObject(
    object: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const values = [];
    const exclude = ["created", "updated", "uuid"];

    let query = "UPDATE user SET";

    for (const [key, value] of Object.entries(object)) {
      if (value !== null && !exclude.includes(key)) {
        query += ` ${key}=?,`;
        values.push(value);
      }
    }

    if (values.length > 0) {
      query = query.slice(0, -1);
      query += " WHERE uuid = UNHEX(REPLACE(?, '-', ''))";

      await this.mysqlClient.execute(query, [...values, object.uuid]);
    }

    const data = await this.getObject(object.uuid!);
    return data!;
  }

  public async removeObject(uuid: string): Promise<void> {
    const deleteResult = await this.mysqlClient.execute(
      `DELETE FROM user WHERE uuid = UNHEX(REPLACE(?, '-', ''))`,
      [uuid],
    );

    if (deleteResult.affectedRows === 0) {
      throw new MissingResource("user");
    }
  }

  // TODO: Allow user to set Discord too null

  public async addObject(object: UserEntity): Promise<UserEntity> {
    await this.mysqlClient.execute(
      `INSERT INTO user (uuid, email, discord, lastname, firstname) VALUES(UNHEX(REPLACE(?, '-', '')), ?, ?, ?, ?)`,
      [
        object.uuid,
        object.email,
        object.discord,
        object.lastname,
        object.firstname,
      ],
    ).catch((error: Error) => {
      const message = error.message;
      const ending = message.slice(-20);

      // If the email is a duplicate
      if (ending === "for key 'user.email'") {
        throw new DuplicateResource("user");
      }

      throw error;
    });

    const result = await this.getObject(object.uuid);
    return result!;
  }

  public async getObject(uuid: string): Promise<UserEntity> {
    const data = await this.mysqlClient.execute(
      `SELECT HEX(uuid) AS uuid, email, discord, lastname, firstname, created, updated FROM user WHERE uuid = UNHEX(REPLACE(?, '-', ''))`,
      [uuid],
    );

    if (typeof data.rows === "undefined" || data.rows.length === 0) {
      throw new MissingResource("user");
    }

    const row = data.rows![0];
    return this.userMapper.mapObject(row);
  }
}
