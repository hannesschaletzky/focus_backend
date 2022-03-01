import { Request, ColumnValue } from 'tedious';
import { getSQLServerConnection } from '../db/db_server';

type SQLResponse = {
  [key: string]: string;
};

export const executeQuery = (query: string) => {
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
    getSQLServerConnection().then((con) => {
      con.execSql(request);
    });
  });
};
