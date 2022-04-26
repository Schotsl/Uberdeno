import { UUIDColumn } from "../other/Columns.ts";
import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";

export default interface RepositoryInterface {
  addObject(
    object: Partial<BaseEntity>,
  ): Promise<BaseEntity>;

  getObject(
    uuid: UUIDColumn | string,
    ...args: unknown[]
  ): Promise<BaseEntity>;

  updateObject(
    object: BaseEntity,
  ): Promise<BaseEntity>;

  removeObject(
    uuid: UUIDColumn | string,
    ...args: unknown[]
  ): Promise<void>;

  getCollection(
    offset: number,
    limit: number,
    ...args: unknown[]
  ): Promise<BaseCollection>;
}
