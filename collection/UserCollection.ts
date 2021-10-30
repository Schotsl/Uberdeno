import BaseCollection from "./BaseCollection.ts";
import UserEntity from "../entity/UserEntity.ts";

export default class UserCollection extends BaseCollection {
  public users: UserEntity[] = [];
}
