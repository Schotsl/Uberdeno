// String validation
import {
  validateEmail,
  validateString,
  validateTime,
  validateTimestamp,
  validateUUID,
  validateVarchar,
} from "../validation/string.ts";

// Number validation
import {
  validateBinary,
  validateInt,
  validateNumber,
  validateSmall,
  validateTiny,
} from "../validation/number.ts";

// Below are the string types

export class StringColumn {
  public value?: string;
  public title?: string;

  constructor(value?: string, title?: string) {
    this.value = value;
    this.title = title !== "undefined" ? title : "unknown";

    if (typeof value !== "undefined") {
      validateString(this.value!, this.title!);
    }
  }
}

export class EmailColumn {
  public value?: string;
  public title?: string;

  constructor(value?: string, title?: string) {
    this.value = value;
    this.title = title !== "undefined" ? title : "unknown";

    if (typeof value !== "undefined") {
      validateEmail(this.value!, this.title!);
    }
  }
}

export class TimeColumn {
  public value?: string;
  public title?: string;

  constructor(value?: string, title?: string) {
    this.value = value;
    this.title = title !== "undefined" ? title : "unknown";

    if (typeof value !== "undefined") {
      validateTime(this.value!, this.title!);
    }
  }
}

export class UUIDColumn {
  public value?: string;
  public title?: string;

  constructor(value?: string, title?: string) {
    this.value = value;
    this.title = title !== "undefined" ? title : "unknown";

    if (typeof value !== "undefined") {
      validateUUID(this.value!, this.title!);
    }
  }
}

export class VarcharColumn {
  public value?: string;
  public title?: string;

  constructor(value?: string, title?: string) {
    this.value = value;
    this.title = title !== "undefined" ? title : "unknown";

    if (typeof value !== "undefined") {
      validateVarchar(this.value!, this.title!);
    }
  }
}

// Below are the date types

export class TimestampColumn {
  public value?: Date;
  public title?: string;

  constructor(value?: Date, title?: string) {
    this.value = value;
    this.title = title !== "undefined" ? title : "unknown";

    if (value instanceof Date) {
      // Skip the validation and set the date if it's already a Date object
      this.value = value;
    } else if (typeof value !== "undefined") {
      validateTimestamp(this.value!, this.title!);

      // We gotta translate the ISO string back into a JavaScript Date object
      const time = Date.parse(value);
      const date = new Date(time);

      this.value = date;
    }
  }
}

// Below are the number types

export class NumberColumn {
  public value?: number;
  public title?: string;

  constructor(value?: number, title?: string) {
    this.value = value;
    this.title = title !== "undefined" ? title : "unknown";

    if (typeof value !== "undefined") {
      validateNumber(this.value!, this.title!);
    }
  }
}

export class TinyColumn {
  public value?: number;
  public title?: string;

  constructor(value?: number, title?: string) {
    this.value = value;
    this.title = title !== "undefined" ? title : "unknown";

    if (typeof value !== "undefined") {
      validateTiny(this.value!, this.title!);
    }
  }
}

export class SmallColumn {
  public value?: number;
  public title?: string;

  constructor(value?: number, title?: string) {
    this.value = value;
    this.title = title !== "undefined" ? title : "unknown";

    if (typeof value !== "undefined") {
      validateSmall(this.value!, this.title!);
    }
  }
}

export class IntColumn {
  public value?: number;
  public title?: string;

  constructor(value?: number, title?: string) {
    this.value = value;
    this.title = title !== "undefined" ? title : "unknown";

    if (typeof value !== "undefined") {
      validateInt(this.value!, this.title!);
    }
  }
}

// Below are the boolean types

export class BooleanColumn {
  public value?: boolean;
  public title?: string;

  constructor(value?: boolean, title?: string) {
    this.value = value;
    this.title = title !== "undefined" ? title : "unknown";

    if (typeof value === "boolean") {
      // Skip the validation and set the date if it's already a boolean
      this.value = value;
    } else if (typeof value !== "undefined") {
      // MySQL returns a number instead of a boolean so we have to check for that
      validateBinary(this.value!, this.title!);

      this.value = value === 1;
    }
  }
}
