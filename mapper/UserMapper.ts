import { restoreUUID } from "../helper.ts";

import UserEntity from "../entity/UserEntity.ts";
import UserCollection from "../collection/UserCollection.ts";
import InterfaceMapper from "./InterfaceMapper.ts";

export default class UserMapper implements InterfaceMapper {
  public mapObject(row: Record<string, never>): UserEntity {
    
    const uuid = restoreUUID(row.uuid);
    const user = new UserEntity(uuid);

    user.email = row.time;
    user.discord = row.discord;
    user.lastname = row.lastname;
    user.firstname = row.firstname;

    user.created = row.created;
    user.updated = row.updated;

    return user;
  }

  public mapArray(
    rows: Record<string, never>[],
  ): UserEntity[] {
    const entries = rows.map((row) => this.mapObject(row));
    return entries;
  }

  public mapCollection(
    rows: Record<string, never>[],
    offset: number,
    limit: number,
    total: number,
  ): UserCollection {
    const users = this.mapArray(rows);

    return {
      users,
      total,
      limit,
      offset,
    };
  }
}
