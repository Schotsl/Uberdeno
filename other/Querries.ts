import { ColumnInfo, ColumnType } from "../types.ts";

export default class Querries {
  private table: string;
  private values: string;

  private setNames: string;
  private getNames: string;

  constructor(columns: Array<ColumnInfo>, table: string) {
    const setNames: string[] = [];
    const getNames: string[] = [];

    const values: string[] = [];

    columns.forEach((column) => {
      const { title, type } = column;

      // We need to wrap the UUID in order to transform it back into a string
      values.push(
        type === ColumnType.UUIDColumn ? `UNHEX(REPLACE(?, '-', ''))` : `?`,
      );

      getNames.push(
        type === ColumnType.UUIDColumn
          ? `HEX(\`${title}\`) AS \`${title}\``
          : `\`${title}\``,
      );

      setNames.push(
        `\`${title}\``,
      );
    });

    this.table = table;
    this.values = values.join(", ");
    
    this.getNames = getNames.join(", ");
    this.setNames = setNames.join(", ");
  }

  getQuery() {
    return `SELECT ${this.getNames} FROM ${this.table} WHERE uuid = UNHEX(REPLACE(?, '-', ''))`;
  }

  countQuery() {
    return `SELECT COUNT(uuid) AS total FROM ${this.table}`;
  }

  fetchQuery() {
    return `SELECT ${this.getNames} FROM ${this.table} ORDER BY created DESC LIMIT ? OFFSET ?`;
  }

  removeQuery() {
    return `DELETE FROM ${this.table} WHERE uuid = UNHEX(REPLACE(?, '-', ''))`;
  }

  insertQuery() {
    return `INSERT INTO ${this.table} (${this.setNames}) VALUES (${this.values})`;
  }
}
