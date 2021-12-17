// String validation
import {
  validateEmail,
  validateIPv64,
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
  public required: boolean;
  public value?: string;
  public title: string;

  constructor(title: string, required = true, value?: string) {
    this.required = required;
    this.title = title;

    if (typeof value !== "undefined") {
      this.setValue(value);
    }
  }

  setValue(value?: string) {
    validateString(value, this.title, this.required);
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

export class EmailColumn extends StringColumn {
  setValue(value?: string) {
    validateEmail(value, this.title, this.required);
    this.value = value;
  }
}

export class TimeColumn extends StringColumn {
  setValue(value?: string) {
    validateTime(value, this.title, this.required);
    this.value = value;
  }
}

export class UUIDColumn extends StringColumn {
  setValue(value?: string) {
    validateUUID(value, this.title, this.required);
    this.value = value;
  }
}

export class VarcharColumn extends StringColumn {
  setValue(value?: string) {
    validateVarchar(value, this.title, this.required);
    this.value = value;
  }
}

export class IPv64Column extends StringColumn {
  setValue(value?: string) {
    validateIPv64(value, this.title, this.required);
    this.value = value;
  }
}

// Below are the number types

export class NumberColumn {
  public required: boolean;
  public value?: number;
  public title: string;

  constructor(title: string, required = true, value?: number) {
    this.required = required;
    this.title = title;

    if (typeof value !== "undefined") {
      this.setValue(value);
    }
  }

  setValue(value?: number) {
    validateNumber(value, this.title, this.required);
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

export class TinyColumn extends NumberColumn {
  setValue(value?: number) {
    validateTiny(value, this.title, this.required);
    this.value = value;
  }
}

export class SmallColumn extends NumberColumn {
  setValue(value?: number) {
    validateSmall(value, this.title, this.required);
    this.value = value;
  }
}

export class IntColumn extends NumberColumn {
  setValue(value?: number) {
    validateInt(value, this.title, this.required);
    this.value = value;
  }
}

// Below are the date types

export class TimestampColumn {
  public required: boolean;
  public value?: Date;
  public title: string;

  constructor(title: string, required = true, value?: string | Date) {
    this.required = required;
    this.title = title;

    if (typeof value !== "undefined") {
      this.setValue(value);
    }
  }

  setValue(value?: string | Date) {
    if (value instanceof Date) {
      this.value = value;
      return;
    }

    validateTimestamp(value, this.title, this.required);

    // We gotta translate the ISO string back into a JavaScript Date object
    const time = Date.parse(value!);
    const date = new Date(time);

    this.value = date;
  }

  getValue() {
    return this.value;
  }
}

// Below are the boolean types

export class BooleanColumn {
  public required: boolean;
  public value?: boolean;
  public title: string;

  constructor(title: string, required = true, value?: boolean | number) {
    this.required = required;
    this.title = title;

    if (typeof value !== "undefined") {
      this.setValue(value);
    }
  }

  setValue(value?: boolean | number) {
    if (typeof value === "boolean") {
      this.value = value;
      return;
    }

    validateBinary(value, this.title, this.required);

    this.value = value === 1;
  }

  getValue() {
    return this.value;
  }
}
