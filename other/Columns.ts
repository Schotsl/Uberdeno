// String validation
import {
  validateEmail,
  validateIPv64,
  validateLarge,
  validateString,
  validateTime,
  validateTimestamp,
  validateUUID,
  validateVarchar,
} from "../validation/string.ts";

// Number validation
import {
  validateLat,
  validateLng,
  validateBinary,
  validateInt,
  validateNumber,
  validateSmall,
  validateTiny,
} from "../validation/number.ts";

import { restoreUUID } from "../helper.ts";

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
    const required = this.required && typeof this.value === "undefined";
    const result = validateString(value, this.title, required);

    if (result) {
      this.value = value;
    }
  }

  getValue() {
    return this.value;
  }
}

export class EmailColumn extends StringColumn {
  setValue(value?: string) {
    const required = this.required && typeof this.value === "undefined";
    const result = validateEmail(value, this.title, required);

    if (result) {
      this.value = value;
    }
  }
}

export class TimeColumn extends StringColumn {
  setValue(value?: string) {
    const required = this.required && typeof this.value === "undefined";
    const result = validateTime(value, this.title, required);

    if (result) {
      this.value = value;
    }
  }
}

export class UUIDColumn extends StringColumn {
  setValue(value?: string) {
    if (typeof value === "string") {
      const regex = new RegExp(
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
      );

      if (regex.test(value)) {
        this.value = value;
        return;
      }

      value = restoreUUID(value);
    }

    const required = this.required && typeof this.value === "undefined";
    const result = validateUUID(value, this.title, required);

    if (result) {
      this.value = value;
      return;
    }
  }
}

export class VarcharColumn extends StringColumn {
  setValue(value?: string) {
    const required = this.required && typeof this.value === "undefined";
    const result = validateVarchar(value, this.title, required);

    if (result) {
      this.value = value;
    }
  }
}

export class LargeColumn extends StringColumn {
  setValue(value?: string) {
    const required = this.required && typeof this.value === "undefined";
    const result = validateLarge(value, this.title, required);

    if (result) {
      this.value = value;
    }
  }
}

export class IPv64Column extends StringColumn {
  setValue(value?: string) {
    const required = this.required && typeof this.value === "undefined";
    const result = validateIPv64(value, this.title, required);

    if (result) {
      this.value = value;
    }
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
    const required = this.required && typeof this.value === "undefined";
    const result = validateNumber(value, this.title, required);

    if (result) {
      this.value = value;
    }
  }

  getValue() {
    return this.value;
  }
}

export class FloatColumn extends NumberColumn {
  setValue(value?: number) {
    const required = this.required && typeof this.value === "undefined";
    const result = validateTiny(value, this.title, required);

    if (result) {
      this.value = value;
    }
  }
}

export class TinyColumn extends NumberColumn {
  setValue(value?: number) {
    const required = this.required && typeof this.value === "undefined";
    const result = validateTiny(value, this.title, required);

    if (result) {
      this.value = value;
    }
  }
}

export class SmallColumn extends NumberColumn {
  setValue(value?: number) {
    const required = this.required && typeof this.value === "undefined";
    const result = validateSmall(value, this.title, required);

    if (result) {
      this.value = value;
    }
  }
}

export class IntColumn extends NumberColumn {
  setValue(value?: number) {
    const required = this.required && typeof this.value === "undefined";
    const result = validateInt(value, this.title, required);

    if (result) {
      this.value = value;
    }
  }
}

export class LngColumn extends NumberColumn {
  setValue(value?: number) {
    const required = this.required && typeof this.value === "undefined";
    const result = validateLng(value, this.title, required);

    if (result) {
      this.value = Math.round(value! * 1000000) / 1000000;
    }
  }
}

export class LatColumn extends NumberColumn {
  setValue(value?: number) {
    const required = this.required && typeof this.value === "undefined";
    const result = validateLat(value, this.title, required);

    if (result) {
      this.value = Math.round(value! * 1000000) / 1000000;
    }
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

    const required = this.required && typeof this.value === "undefined";
    const result = validateTimestamp(value, this.title, required);

    if (result) {
      // We gotta translate the ISO string back into a JavaScript Date object
      const time = Date.parse(value!);
      const date = new Date(time);

      this.value = date;
    }
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

    const required = this.required && typeof this.value === "undefined";
    const result = validateBinary(value, this.title, required);

    if (result) {
      this.value = value === 1;
    }
  }

  getValue() {
    return this.value;
  }
}
