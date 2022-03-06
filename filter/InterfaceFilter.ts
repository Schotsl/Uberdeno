import BaseEntity from "../entity/BaseEntity.ts";

export default interface InterfaceFilter {
  beforeResponse?(entity: BaseEntity): BaseEntity;
  beforeProcessing?(entity: BaseEntity): BaseEntity;
}
