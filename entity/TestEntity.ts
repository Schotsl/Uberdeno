import {
  BooleanColumn,
  EmailColumn,
  IntColumn,
  SmallColumn,
  TimeColumn,
  TimestampColumn,
  TinyColumn,
  VarcharColumn,
} from "../other/Columns.ts";

import BaseEntity from "./BaseEntity.ts";

export default class TestEntity extends BaseEntity {
  public int = new IntColumn();
  public time = new TimeColumn();
  public tiny = new TinyColumn();
  public small = new SmallColumn();
  public email = new EmailColumn();
  public boolean = new BooleanColumn();
  public varchar = new VarcharColumn();
  public timestamp = new TimestampColumn();

  constructor() {
    super();
  }
}
