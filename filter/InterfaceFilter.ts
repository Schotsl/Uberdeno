import BaseEntity from "../entity/BaseEntity.ts";

export default interface InterfaceFilter {
  beforeResponse?(entity: BaseEntity): BaseEntity | Promise<BaseEntity>;
  beforeProcessing?(entity: BaseEntity): BaseEntity | Promise<BaseEntity>;
}
