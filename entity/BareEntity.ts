import { UUIDColumn } from "../other/Columns.ts";

export default class BareEntity {
  public uuid: UUIDColumn;

  constructor(uuid?: string) {
    if (typeof uuid === "undefined") {
      this.uuid = new UUIDColumn(globalThis.crypto.randomUUID(), "uuid");
    } else {
      this.uuid = new UUIDColumn(uuid, "uuid");
    }
  }
}
