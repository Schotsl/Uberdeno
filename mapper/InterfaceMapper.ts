import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";

export default interface InterfaceMapper {
  mapCollection(
    rows: Record<string, never>[],
    offset: number,
    limit: number,
    total: number,
  ): Promise<BaseCollection> | BaseCollection;

  mapObject(
    row: Record<string, never>,
  ): Promise<BaseEntity> | BaseEntity;

  mapArray(
    rows: Record<string, never>[],
  ): Promise<BaseEntity[]> | BaseEntity[];
}
