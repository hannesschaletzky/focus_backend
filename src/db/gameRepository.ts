import { Request, ColumnValue } from 'tedious';
import { Status } from 'utils/types';
import { ConnectionPool } from './dbConnection';

type SQLResponse = {
  [key: string]: string;
};

export class Repository {
  // check if game exists
  static gameExists(id: number) {
    return new Promise<boolean | Error>((resolve, reject) => {
      this.executeQuery(
        `
        SELECT *
        FROM ${this.getTable()}
        WHERE id=${id};`
      )
        .then((rows) => {
          resolve(rows.length != 0);
        })
        .catch((err: Error) => {
          reject(err.message);
        });
    });
  }

  // check if game is in status
  static gameInStatus(id: number, status: Status) {
    return new Promise<boolean | Error>((resolve, reject) => {
      this.executeQuery(
        `
        SELECT status
        FROM ${this.getTable()}
        WHERE id=${id};`
      )
        .then((rows) => {
          // rows are filled bc existence of game was already checked
          resolve(rows[0].status == status);
        })
        .catch((err: Error) => {
          reject(err.message);
        });
    });
  }

  // execute query to SQL database
  static executeQuery(query: string, init = false) {
    return new Promise<SQLResponse[]>((resolve, reject) => {
      // create request
      const request: Request = new Request(query, (err) => {
        if (err) {
          reject(err);
        }
      });

      // parse response & return
      const rows: SQLResponse[] = [];
      request.on('row', (columns: ColumnValue[]) => {
        const values: SQLResponse = {};
        columns.forEach((column) => {
          values[column.metadata.colName] = column.value;
        });
        rows.push(values);
      });
      request.on('requestCompleted', () => resolve(rows));

      // execute request
      ConnectionPool.getConnection(init).then((con) => {
        con.execSql(request);
      });
    });
  }

  static getTable() {
    switch (process.env.NODE_ENV) {
      case 'development':
        return 'dev_games';
      case 'test':
        return 'test_games';
      case 'production':
        return 'prod_games';
    }
  }
}
