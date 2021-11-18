import BareEntity from "./BareEntity.ts";

export default class BaseEntity extends BareEntity {
  public created = new Date();
  public updated = new Date();
}
