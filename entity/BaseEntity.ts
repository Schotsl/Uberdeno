import BareEntity from "./BareEntity.ts";

import { TimestampColumn } from "../other/Columns.ts";

export default class BaseEntity extends BareEntity {
  public created = new TimestampColumn();
  public updated = new TimestampColumn();
}
