import BaseEntity from "./BaseEntity.ts";

export default class UserEntity extends BaseEntity {
  public email: null | number = null;
  public discord: null | string = null;
  public lastname: null | string = null;
  public firstname: null | string = null;
}
