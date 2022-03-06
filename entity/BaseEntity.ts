import { UUIDColumn } from "../other/Columns.ts";
import { TimestampColumn } from "../other/Columns.ts";

export default class BaseEntity {
  public uuid: UUIDColumn;

  public created = new TimestampColumn("created", true, new Date());
  public updated = new TimestampColumn("updated", true, new Date());

  constructor(uuid?: string) {
    if (typeof uuid === "undefined") {
      this.uuid = new UUIDColumn("uuid", true, globalThis.crypto.randomUUID());
    } else {
      this.uuid = new UUIDColumn("uuid", true, uuid);
    }
  }
}
