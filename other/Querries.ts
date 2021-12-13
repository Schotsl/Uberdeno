import { ColumnInfo, ColumnType } from "../types.ts";

export default class Querries {
  private table: string;
  private names: string;
  private parse: string;
  private values: string;

  constructor(columns: Array<ColumnInfo>, table: string) {
    const names: string[] = [];
    const parse: string[] = [];
    const values: string[] = [];

    columns.forEach((column) => {
      const { title, type } = column;

      switch (type) {
        case ColumnType.UUIDColumn:
          values.push(`UNHEX(REPLACE(?, '-', ''))`);
          parse.push(`HEX(\`${title}\`) AS \`${title}\``);
          break;
        case ColumnType.IPv64Column:
          values.push(`INET6_ATON(?)`);
          parse.push(`INET6_NTOA(\`${title}\`) AS \`${title}\``);
          break;
        default:
          values.push(`?`);
          parse.push(`\`${title}\``);
          break;
      }

      names.push(
        `\`${title}\``,
      );
    });

    this.table = table;
    this.parse = parse.join(", ");
    this.names = names.join(", ");
    this.values = values.join(", ");
  }

  getQuery() {
    return `SELECT ${this.parse} FROM ${this.table} WHERE uuid = UNHEX(REPLACE(?, '-', ''))`;
  }

  countQuery() {
    return `SELECT COUNT(uuid) AS total FROM ${this.table}`;
  }

  fetchQuery() {
    return `SELECT ${this.parse} FROM ${this.table} ORDER BY created DESC LIMIT ? OFFSET ?`;
  }

  removeQuery() {
    return `DELETE FROM ${this.table} WHERE uuid = UNHEX(REPLACE(?, '-', ''))`;
  }

  insertQuery() {
    return `INSERT INTO ${this.table} (${this.names}) VALUES (${this.values})`;
  }
}
