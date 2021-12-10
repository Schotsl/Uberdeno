import BareEntity from "./BareEntity.ts";

import { DateColumn } from "../other/Columns.ts";

export default class BaseEntity extends BareEntity {
  public created = new DateColumn();
  public updated = new DateColumn();
}
