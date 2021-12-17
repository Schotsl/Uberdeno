import BaseCollection from "../collection/BaseCollection.ts";
import TestEntity from "../entity/TestEntity.ts";

export default class HistoryCollection extends BaseCollection {
  public tests: TestEntity[] = [];
}
