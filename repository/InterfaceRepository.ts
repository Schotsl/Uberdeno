import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";

export default interface RepositoryInterface {
  getCollection(
    offset: number,
    limit: number,
    ...args: unknown[]
  ): Promise<BaseCollection>;

  updateObject(object: BaseEntity): Promise<BaseEntity>;
  removeObject(uuid: string, ...args: unknown[]): Promise<void>;

  addObject(object: Partial<BaseEntity>): Promise<BaseEntity>;
  getObject(uuid: string, ...args: unknown[]): Promise<BaseEntity>;
}
