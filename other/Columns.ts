export class StringColumn {
  public value: string;

  constructor(value: string) {
    this.value = value;
  }
}

export class TimestampColumn {
  public value = new Date();

  constructor(value?: Date) {
    if (typeof value !== "undefined") this.value = value;
  }
}

export class NumberColumn {
  public value: number;

  constructor(value: number) {
    this.value = value;
  }
}

export class BooleanColumn {
  public value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }
}

export class UUIDColumn extends StringColumn {}
export class TimeColumn extends StringColumn {}
export class EmailColumn extends StringColumn {}
export class VarcharColumn extends StringColumn {}

export class TinyColumn extends NumberColumn {}
export class SmallColumn extends NumberColumn {}
export class IntColumn extends NumberColumn {}
