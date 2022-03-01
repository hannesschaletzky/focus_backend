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

// return server connection
let con: Connection;
let open = false;
export const getSQLServerConnection = () => {
  return new Promise<Connection>((resolve) => {
    if (!open) {
      con = new Connection(config);
      con.on('connect', (err) => {
        if (err) {
          console.log('db connection failed');
          throw err;
        }
        console.log(`db connection to ${config.options?.database} established`);
        open = true;
        resolve(con);
      });
      con.on('end', () => {
        console.log('db connection ended');
        open = false;
      });
      con.connect();
    } else {
      resolve(con);
    }
  });
};

// return sql table corresponding to node_env
const getTable = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'dev_games';
    case 'test':
      return 'test_games';
    case 'production':
      return 'prod_games';
  }
};
export const tableName = getTable();
