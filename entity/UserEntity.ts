import BaseEntity from "./BaseEntity.ts";

export default class UserEntity extends BaseEntity {
  public email: null | number;
  public lastname: null | string;
  public firstname: null | string;

  public discord?: string;
}
