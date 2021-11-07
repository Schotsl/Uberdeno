export default class BareEntity {
  public uuid = ``;

  constructor(uuid?: string) {
    if (typeof uuid === "undefined") {
      this.uuid = globalThis.crypto.randomUUID();
    } else {
      this.uuid = uuid;
    }
  }
}
