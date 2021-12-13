export enum ColumnType {
  IntColumn = "IntColumn",
  TimestampColumn = "TimestampColumn",
  UUIDColumn = "UUIDColumn",
  TimeColumn = "TimeColumn",
  TinyColumn = "TinyColumn",
  SmallColumn = "SmallColumn",
  EmailColumn = "EmailColumn",
  StringColumn = "StringColumn",
  NumberColumn = "NumberColumn",
  VarcharColumn = "VarcharColumn",
  BooleanColumn = "BooleanColumn",
  UnknownColumn = "UnknownColumn",
}

export interface ColumnInfo {
  type: ColumnType;
  title: string;
}
