export class StringColumn {
  public value?: string;

  constructor(value?: string) {
    this.value = value;
  }
}

export class TimestampColumn {
  public value = new Date();

  constructor(value?: Date) {
    if (typeof value !== "undefined") {
      if (typeof value === "string") {
        // We gotta translate the ISO string back into a JavaScript Date object
        const milli = Date.parse(value);
        const date = new Date(milli);

        this.value = date;
      } else {
        // Just store it if it's a date
        this.value = value;
      }
    }
  }
}

export class NumberColumn {
  public value?: number;

  constructor(value?: number) {
    this.value = value;
  }
}

export class BooleanColumn {
  public value?: boolean;

  constructor(value?: boolean) {
    if (typeof value === "number") {
      // We gotta translate the number back into a boolean type
      const boolean = value === 1;

      this.value = boolean;
    } else {
      // Just store it if it's a boolean
      this.value = value;
    }
  }
}

export class UUIDColumn extends StringColumn {}
export class TimeColumn extends StringColumn {}
export class EmailColumn extends StringColumn {}
export class VarcharColumn extends StringColumn {}

export class TinyColumn extends NumberColumn {}
export class SmallColumn extends NumberColumn {}
export class IntColumn extends NumberColumn {}
