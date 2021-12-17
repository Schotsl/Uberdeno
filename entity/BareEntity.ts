import { UUIDColumn } from "../other/Columns.ts";

export default class BareEntity {
  public uuid: UUIDColumn;

  constructor(uuid?: string) {
    if (typeof uuid === "undefined") {
      this.uuid = new UUIDColumn("uuid", true, globalThis.crypto.randomUUID());
    } else {
      this.uuid = new UUIDColumn("uuid", true, uuid);
    }
  }
}
