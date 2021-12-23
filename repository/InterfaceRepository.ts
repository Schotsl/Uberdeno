import BaseEntity from "../entity/BaseEntity.ts";
import BareEntity from "../entity/BareEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";
import { UUIDColumn } from "../other/Columns.ts";

export default interface RepositoryInterface {
  getCollection(
    offset: number,
    limit: number,
    ...args: unknown[]
  ): Promise<BaseCollection>;

  // updateObject(
  //   object: BaseEntity | BareEntity,
  // ): Promise<BaseEntity | BareEntity>;

  removeObject(uuid: string, ...args: unknown[]): Promise<void>;

  addObject(
    object: Partial<BaseEntity | BareEntity>,
  ): Promise<BaseEntity | BareEntity>;
  getObject(
    uuid: string,
    ...args: unknown[]
  ): Promise<BaseEntity | BareEntity>;
}
