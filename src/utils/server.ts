import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler } from 'middleware/mw_error';
import { GameController } from 'controllers/controller';
import { req_ID, req_Name, req_Color, req_Rounds } from 'middleware/mw_require';

export const setupExpressServer = () => {
  return new Promise<express.Express>((resolve) => {
    const app = express();

    // server wide config
    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    app.use(cors());

    // routes
    app.get('/', (req, res) => {
      res.json('This is the focus game backend');
    });
    app.post('/init', req_Color, GameController.r_create);
    app.post('/finish', req_ID, req_Name, req_Rounds, GameController.r_finish);
    app.get('/leaderboard', GameController.r_leaders);
    app.get('/totalgames', GameController.r_totalGames);

    // error handler
    app.use(errorHandler);

    resolve(app);
  });
};
