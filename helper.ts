// deno-lint-ignore-file no-explicit-any

import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { ColumnInfo, ColumnType } from "./types.ts";
import {
  BooleanColumn,
  EmailColumn,
  IntColumn,
  IPv64Column,
  LargeColumn,
  LatColumn,
  LngColumn,
  NumberColumn,
  SmallColumn,
  StringColumn,
  TimeColumn,
  TimestampColumn,
  TinyColumn,
  UrlColumn,
  UUIDColumn,
  VarcharColumn,
} from "./other/Columns.ts";

import BaseEntity from "./entity/BaseEntity.ts";
import BaseCollection from "./collection/BaseCollection.ts";

export function initializeEnv(variables: string[]) {
  // Don't read the .env file if we're running on Deno Deploy
  if (Deno.env.get("DENO_DEPLOYMENT_ID") === undefined) {
    config({ export: true, path: ".env", defaults: ".env.defaults" });
  }

  // Check if every variable has been set
  variables.forEach((variable: string) => {
    if (!Deno.env.get(variable)) {
      throw Error(`${variable} .env variable must be set.`);
    }
  });
}

export function findColumn(Collection: { new (): BaseCollection }): string {
  // Find the property that isn't "total", "limit" or "offset"
  const invalid = ["total", "limit", "offset"];
  const instance = new Collection();
  const columns = Object.keys(instance);

  let label = ``;
  let index = 0;

  while (!label.length) {
    label = invalid.includes(columns[index]) ? `` : columns[index];
    index += 1;
  }

  return label;
}

export function restoreUUID(hex: string): string {
  // Re-add the dashes to the UUID and lowercase the string
  const dashed = `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${
    hex.substr(12, 4)
  }-${hex.substr(16, 4)}-${hex.substr(20)}`;

  return dashed.toLowerCase();
}

export function renderREST(input: any): any {
  // Recursively parse input arrays into rendered arrays
  if (input instanceof Array) {
    input.map((entry) => renderREST(entry));
    return input;
  }

  const keys = Object.keys(input);

  // Loop over every object property
  keys.forEach((key) => {
    const value = input[key];

    // Recursively parse property arrays into rendered arrays
    if (value instanceof Array) {
      input[key] = renderREST(value);
    }

    // Transform the column wrappers back into their strings, number or booleans
    if (
      value instanceof LatColumn || value instanceof LngColumn ||
      value instanceof IntColumn || value instanceof TinyColumn ||
      value instanceof TimeColumn || value instanceof TimestampColumn ||
      value instanceof UUIDColumn || value instanceof LargeColumn ||
      value instanceof EmailColumn || value instanceof SmallColumn ||
      value instanceof NumberColumn || value instanceof StringColumn ||
      value instanceof BooleanColumn || value instanceof UrlColumn ||
      value instanceof VarcharColumn || value instanceof IPv64Column
    ) {
      input[key] = value.getValue();
    }
  });

  return input;
}

export function generateColumns(Entity: any): ColumnInfo[] {
  const instance = new Entity();
  const columns = Object.keys(instance);

  return columns.map((title) => {
    let type = ColumnType.UnknownColumn;

    if (instance[title] instanceof IntColumn) {
      type = ColumnType.IntColumn;
    } else if (instance[title] instanceof TinyColumn) {
      type = ColumnType.TinyColumn;
    } else if (instance[title] instanceof TimeColumn) {
      type = ColumnType.TimeColumn;
    } else if (instance[title] instanceof LatColumn) {
      type = ColumnType.LatColumn;
    } else if (instance[title] instanceof LngColumn) {
      type = ColumnType.LngColumn;
    } else if (instance[title] instanceof TimestampColumn) {
      type = ColumnType.TimestampColumn;
    } else if (instance[title] instanceof UUIDColumn) {
      type = ColumnType.UUIDColumn;
    } else if (instance[title] instanceof EmailColumn) {
      type = ColumnType.EmailColumn;
    } else if (instance[title] instanceof UrlColumn) {
      type = ColumnType.UrlColumn;
    } else if (instance[title] instanceof LargeColumn) {
      type = ColumnType.LargeColumn;
    } else if (instance[title] instanceof SmallColumn) {
      type = ColumnType.SmallColumn;
    } else if (instance[title] instanceof BooleanColumn) {
      type = ColumnType.BooleanColumn;
    } else if (instance[title] instanceof VarcharColumn) {
      type = ColumnType.VarcharColumn;
    } else if (instance[title] instanceof IPv64Column) {
      type = ColumnType.IPv64Column;

      // Numbers and String have to be very last since most Columns are extended from either of these
    } else if (instance[title] instanceof StringColumn) {
      type = ColumnType.StringColumn;
    } else if (instance[title] instanceof NumberColumn) {
      type = ColumnType.NumberColumn;
    }

    return {
      title,
      type,
    };
  });
}

export function populateInstance(
  body: Record<string, never>,
  columns: ColumnInfo[],
  instance: BaseEntity,
) {
  columns.forEach((column: ColumnInfo) => {
    const type = column.type;
    const title = column.title as keyof BaseEntity;

    const value = body[title];
    const target = instance[title];

    // TODO: Make sure we convert MySQL number formatted as strings to numbers so the REST API can be strict

    if (type !== ColumnType.UnknownColumn) {
      target.setValue(value);
    }
  });

  return instance;
}
