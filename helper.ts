// deno-lint-ignore-file no-explicit-any

import { config } from "https://deno.land/x/dotenv@v3.0.0/mod.ts";
import { ColumnInfo, ColumnType } from "./types.ts";
import {
  BooleanColumn,
  EmailColumn,
  IntColumn,
  IPv64Column,
  NumberColumn,
  SmallColumn,
  StringColumn,
  TimeColumn,
  TimestampColumn,
  TinyColumn,
  UUIDColumn,
  VarcharColumn,
} from "./other/Columns.ts";

export function initializeEnv(variables: string[]) {
  // Don't read the .env file if we're running on Deno Deploy
  if (Deno.env.get("DENO_DEPLOYMENT_ID") === undefined) {
    config({ export: true, path: ".env", defaults: ".env" });
  }

  // Check if every variable has been set
  variables.forEach((variable: string) => {
    if (!Deno.env.get(variable)) {
      throw Error(`${variable} .env variable must be set.`);
    }
  });
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
      value instanceof IntColumn || value instanceof TinyColumn ||
      value instanceof TimeColumn || value instanceof TimestampColumn ||
      value instanceof UUIDColumn ||
      value instanceof EmailColumn || value instanceof SmallColumn ||
      value instanceof NumberColumn || value instanceof StringColumn ||
      value instanceof BooleanColumn ||
      value instanceof VarcharColumn || value instanceof IPv64Column
    ) {
      input[key] = value.value;
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
    } else if (instance[title] instanceof TimestampColumn) {
      type = ColumnType.TimestampColumn;
    } else if (instance[title] instanceof UUIDColumn) {
      type = ColumnType.UUIDColumn;
    } else if (instance[title] instanceof EmailColumn) {
      type = ColumnType.EmailColumn;
    } else if (instance[title] instanceof SmallColumn) {
      type = ColumnType.SmallColumn;
    } else if (instance[title] instanceof NumberColumn) {
      type = ColumnType.NumberColumn;
    } else if (instance[title] instanceof StringColumn) {
      type = ColumnType.StringColumn;
    } else if (instance[title] instanceof BooleanColumn) {
      type = ColumnType.BooleanColumn;
    } else if (instance[title] instanceof VarcharColumn) {
      type = ColumnType.VarcharColumn;
    } else if (instance[title] instanceof IPv64Column) {
      type = ColumnType.IPv64Column;
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
  instance: any,
) {
  columns.forEach((column: any) => {
    const { type, title } = column;
    const exclude = [
      "updated",
      "created",
      "uuid",
    ];

    if (exclude.includes(title)) return;

    // TODO: Could probably use the value wrapper

    if (type === ColumnType.IntColumn) {
      instance[title] = new IntColumn(body[title], title);
    } else if (type === ColumnType.TinyColumn) {
      instance[title] = new TinyColumn(body[title], title);
    } else if (type === ColumnType.TimeColumn) {
      instance[title] = new TimeColumn(body[title], title);
    } else if (type === ColumnType.TimestampColumn) {
      instance[title] = new TimestampColumn(body[title], title);
    } else if (type === ColumnType.UUIDColumn) {
      instance[title] = new UUIDColumn(body[title], title);
    } else if (type === ColumnType.EmailColumn) {
      instance[title] = new EmailColumn(body[title], title);
    } else if (type === ColumnType.SmallColumn) {
      instance[title] = new SmallColumn(body[title], title);
    } else if (type === ColumnType.NumberColumn) {
      instance[title] = new NumberColumn(body[title], title);
    } else if (type === ColumnType.StringColumn) {
      instance[title] = new StringColumn(body[title], title);
    } else if (type === ColumnType.BooleanColumn) {
      instance[title] = new BooleanColumn(body[title], title);
    } else if (type === ColumnType.VarcharColumn) {
      instance[title] = new VarcharColumn(body[title], title);
    } else if (type === ColumnType.IPv64Column) {
      instance[title] = new IPv64Column(body[title], title);
    }
  });

  return instance;
}
