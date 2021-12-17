import BareEntity from "./BareEntity.ts";

import { TimestampColumn } from "../other/Columns.ts";

export default class BaseEntity extends BareEntity {
  public created = new TimestampColumn("created", true, new Date());
  public updated = new TimestampColumn("updated", true, new Date());

  constructor() {
    super();
  }
}
