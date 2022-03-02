import 'dotenv/config';
import { setupExpressServer } from './utils/server';
//import { getSQLServerConnection } from 'db/db_server';
import { Repository } from 'db/repository';

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

// setup express server
setupExpressServer().then((server) => {
  server.listen(port, () => {
    console.log(`Server running on ${hostname}:${port}/`);
  });
});

// init sql server connection
Repository.establishSQLConnection();
