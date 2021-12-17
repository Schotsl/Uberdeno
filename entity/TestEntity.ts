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
  public int = new IntColumn("int");
  public time = new TimeColumn("time");
  public tiny = new TinyColumn("tiny");
  public ipv4 = new IPv64Column("ipv4");
  public ipv6 = new IPv64Column("ipv6");
  public small = new SmallColumn("small");
  public email = new EmailColumn("email");
  public boolean = new BooleanColumn("boolean");
  public varchar = new VarcharColumn("varchar");
  public timestamp = new TimestampColumn("timestamp");

  constructor() {
    super();
  }
}
