export default class BaseEntity {
  public uuid = ``;

  // Remove 2 hours to adjust for UTC database
  public created: Date = new Date(Date.now() - 1000 * 60 * 60 * 2);
  public updated: Date = new Date(Date.now() - 1000 * 60 * 60 * 2);

  constructor(uuid?: string) {
    // Only generate a UUIDV4 if it hasn't been provided
    if (typeof uuid === "undefined") {
      this.uuid = globalThis.crypto.randomUUID();
    } else {
      this.uuid = uuid;
    }
  }
}
