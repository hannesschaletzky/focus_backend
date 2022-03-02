import { Request, ColumnValue } from 'tedious';
//https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/tedious/index.d.ts
import { Connection, ConnectionConfig } from 'tedious';

// config
const config: ConnectionConfig = {
  authentication: {
    options: {
      userName: process.env.SQL_Server_user,
      password: process.env.SQL_Server_pw
    },
    type: 'default'
  },
  server: process.env.SQL_Server_url,
  options: {
    database: process.env.SQL_Server_database,
    encrypt: true,
    trustServerCertificate: true
  }
};

type SQLResponse = {
  [key: string]: string;
};

export class Repository {
  // return server connection
  static con: Connection;
  static open = false;

  // establish connection
  static establishSQLConnection() {
    return new Promise<Connection>((resolve) => {
      if (!this.open) {
        this.con = new Connection(config);
        this.con.on('connect', (err) => {
          if (err) {
            console.log('db connection failed');
            throw err;
          }
          console.log(
            `db connection to ${config.options?.database} established`
          );
          this.open = true;
          resolve(this.con);
        });
        this.con.on('end', () => {
          console.log('db connection ended');
          this.open = false;
        });
        this.con.connect();
      } else {
        resolve(this.con);
      }
    });
  }

  // execute query to SQL database
  static executeQuery(query: string) {
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
      this.establishSQLConnection().then((con) => {
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
