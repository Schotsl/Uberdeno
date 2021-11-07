import BareEntity from "./BareEntity.ts";

export default class BaseEntity extends BareEntity {
  // Remove 2 hours to adjust for UTC database
  public created: Date = new Date(Date.now() - 1000 * 60 * 60 * 2);
  public updated: Date = new Date(Date.now() - 1000 * 60 * 60 * 2);
}
