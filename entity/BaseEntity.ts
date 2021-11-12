import BareEntity from "./BareEntity.ts";

export default class BaseEntity extends BareEntity {
  public created: Date = new Date();
  public updated: Date = new Date();
}
