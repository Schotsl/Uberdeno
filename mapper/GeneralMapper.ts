import { ColumnInfo } from "../types.ts";
import { generateColumns, populateInstance } from "../helper.ts";

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

    // Find the property that isn't "total", "limit" or "offset"
    const invalid = ["total", "limit", "offset"];
    const instance = new this.Collection();
    const columns = Object.keys(instance);

    let label = ``;
    let index = 0;

    while (!label.length) {
      label = invalid.includes(columns[index]) ? `` : columns[index];
      index += 1;
    }

    // Store the label for creating collections in the future
    this.generalLabel = label;
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
