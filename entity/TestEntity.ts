import {
  BooleanColumn,
  EmailColumn,
  IntColumn,
  IPv64Column,
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
  public ipv4 = new IPv64Column();
  public ipv6 = new IPv64Column();
  public small = new SmallColumn();
  public email = new EmailColumn();
  public boolean = new BooleanColumn();
  public varchar = new VarcharColumn();
  public timestamp = new TimestampColumn();

  constructor() {
    super();
  }
}
