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

export class ConnectionPool {
  private static currentConenction: Connection;

  static getConnection(init = false) {
    return new Promise<Connection>((resolve, reject) => {
      const createConnection = () => {
        const con = new Connection(config);
        con.on('connect', onConnect);
        con.on('end', onEnd);
        con.on('error', onError);
        this.currentConenction = con;
        con.connect();
      };

      const onConnect = (err: Error) => {
        if (err) {
          console.log('db connection failed');
          reject(err);
        }
        console.log(`db connection to ${config.options?.database} established`);
        resolve(this.currentConenction);
      };

      const onEnd = () => {
        console.log('db connection ended');
      };

      const onError = (err: Error) => {
        console.log('db connection retrieved error: ' + err.message);
      };

      if (init) {
        console.log('creating new connection');
        createConnection();
        // setTimeout(() => {
        //   console.log('close conn');
        //   this.currentConenction.close();
        // }, 1500);
      } else {
        // returning current connection
        resolve(this.currentConenction);
      }
    });
  }
}
