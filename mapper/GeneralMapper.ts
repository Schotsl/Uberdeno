import { ColumnInfo } from "../types.ts";
import { findColumn, generateColumns, populateInstance } from "../helper.ts";

import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";
import InterfaceMapper from "./InterfaceMapper.ts";

export default class GeneralMapper implements InterfaceMapper {
  private Entity: { new (): BaseEntity };
  private Collection: { new (): BaseCollection };

  private generalLabel: string;
  private generalColumns: ColumnInfo[] = [];

  constructor(
    Entity: { new (): BaseEntity },
    Collection: { new (): BaseCollection },
  ) {
    this.Entity = Entity;
    this.Collection = Collection;

    this.generalLabel = findColumn(Collection);
    this.generalColumns = generateColumns(Entity);
  }

  public mapObject(row: Record<string, never>): BaseEntity {
    const entity = new this.Entity();

    // Transform strings and numbers into the column wrappers
    populateInstance(row, this.generalColumns, entity);

    return entity;
  }

  public mapArray(
    rows: Record<string, never>[],
  ): BaseEntity[] {
    // Map the rows into an array of entities
    const entries = rows.map((row) => this.mapObject(row));
    return entries;
  }

  public mapCollection(
    rows: Record<string, never>[],
    offset: number,
    limit: number,
    total: number,
  ): BaseCollection {
    const label = this.generalLabel;
    const collection = this.mapArray(rows);

    return {
      [label]: collection,
      total,
      limit,
      offset,
    };
  }
}
