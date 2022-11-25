import { UUIDColumn } from "../other/Columns.ts";
import { Filter } from "../types.ts";

import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";

export default interface RepositoryInterface {
  addObject(
    object: Partial<BaseEntity>,
    filter?: Filter,
  ): Promise<BaseEntity>;

  getObject(
    uuid: UUIDColumn | string,
    filter?: Filter,
    ...args: unknown[]
  ): Promise<BaseEntity>;

  updateObject(
    object: BaseEntity,
    filter?: Filter,
  ): Promise<BaseEntity>;

  removeObject(
    uuid: UUIDColumn | string,
    filter?: Filter,
    ...args: unknown[]
  ): Promise<void>;

  getCollection(
    offset: number,
    limit: number,
    filter?: Filter,
    ...args: unknown[]
  ): Promise<BaseCollection>;

  getObjectBy(
    key: string,
    value: string,
    filter: Filter,
  ): Promise<BaseEntity>;
}
