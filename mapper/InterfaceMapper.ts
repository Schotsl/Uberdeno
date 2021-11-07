import BaseEntity from "../entity/BaseEntity.ts";
import BareEntity from "../entity/BareEntity.ts";
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
  ): Promise<BaseEntity | BareEntity> | BaseEntity | BareEntity;

  mapArray(
    rows: Record<string, never>[],
  ): Promise<BaseEntity[] | BareEntity[]> | BaseEntity[] | BareEntity[];
}
