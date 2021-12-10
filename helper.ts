import { config } from "https://deno.land/x/dotenv@v3.0.0/mod.ts";
import { ColumnInfo, ColumnType } from "./types.ts";
import {
  BooleanColumn,
  DateColumn,
  EmailColumn,
  IntColumn,
  NumberColumn,
  SmallColumn,
  StringColumn,
  TimeColumn,
  TinyColumn,
  UUIDColumn,
  VarcharColumn,
} from "./other/Columns.ts";

// String validation
import {
  validateDate,
  validateEmail,
  validateString,
  validateTime,
  validateUUID,
  validateVarchar,
} from "./validation/string.ts";

// Number validation
import {
  validateInt,
  validateNumber,
  validateSmall,
  validateTiny,
} from "./validation/number.ts";

// Boolean validation
import { validateBoolean } from "./validation/boolean.ts";

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
      value instanceof TimeColumn || value instanceof DateColumn ||
      value instanceof UUIDColumn ||
      value instanceof EmailColumn || value instanceof SmallColumn ||
      value instanceof NumberColumn || value instanceof StringColumn ||
      value instanceof BooleanColumn ||
      value instanceof VarcharColumn
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
    } else if (instance[title] instanceof DateColumn) {
      type = ColumnType.DateColumn;
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
    }

    return {
      title,
      type,
    };
  });
}

export function validateInstance(
  body: Record<string, never>,
  columns: ColumnInfo[],
  optional = false,
) {
  columns.forEach((column: any) => {
    const { type, title } = column;

    const value = body[title];
    const exclude = [
      "updated",
      "created",
      "uuid",
    ];

    // We don't need to validate these properties since the system provides them
    if (exclude.includes(title)) return;

    if (type === ColumnType.IntColumn) {
      validateInt(value, title, optional);
    } else if (type === ColumnType.TinyColumn) {
      validateTiny(value, title, optional);
    } else if (type === ColumnType.TimeColumn) {
      validateTime(value, title, optional);
    } else if (type === ColumnType.DateColumn) {
      validateDate(value, title, optional);
    } else if (type === ColumnType.UUIDColumn) {
      validateUUID(value, title, optional);
    } else if (type === ColumnType.EmailColumn) {
      validateEmail(value, title, optional);
    } else if (type === ColumnType.SmallColumn) {
      validateSmall(value, title, optional);
    } else if (type === ColumnType.NumberColumn) {
      validateNumber(value, title, optional);
    } else if (type === ColumnType.StringColumn) {
      validateString(value, title, optional);
    } else if (type === ColumnType.BooleanColumn) {
      validateBoolean(value, title, optional);
    } else if (type === ColumnType.VarcharColumn) {
      validateVarchar(value, title, optional);
    }
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
      instance[title] = new IntColumn(body[title]);
    } else if (type === ColumnType.TinyColumn) {
      instance[title] = new TinyColumn(body[title]);
    } else if (type === ColumnType.TimeColumn) {
      instance[title] = new TimeColumn(body[title]);
    } else if (type === ColumnType.DateColumn) {
      instance[title] = new DateColumn(body[title]);
    } else if (type === ColumnType.UUIDColumn) {
      instance[title] = new UUIDColumn(body[title]);
    } else if (type === ColumnType.EmailColumn) {
      instance[title] = new EmailColumn(body[title]);
    } else if (type === ColumnType.SmallColumn) {
      instance[title] = new SmallColumn(body[title]);
    } else if (type === ColumnType.NumberColumn) {
      instance[title] = new NumberColumn(body[title]);
    } else if (type === ColumnType.StringColumn) {
      instance[title] = new StringColumn(body[title]);
    } else if (type === ColumnType.BooleanColumn) {
      instance[title] = new BooleanColumn(body[title]);
    } else if (type === ColumnType.VarcharColumn) {
      instance[title] = new VarcharColumn(body[title]);
    }
  });

  return instance;
}
