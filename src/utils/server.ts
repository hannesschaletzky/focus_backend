import express from 'express';
import bodyParser from 'body-parser';
import { errorHandler } from 'middleware/mw_error';
import { Controller } from 'controllers/Controller';
import { req_ID, req_Name, req_Color } from 'middleware/mw_require';

export const setupExpressServer = () => {
  return new Promise<express.Express>((resolve) => {
    const app = express();

    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

    // routes
    app.get('/', (req, res) => {
      res.json('This is the focus game backend');
    });
    app.post('/init', req_Color, Controller.r_create);
    app.post('/finish', req_ID, req_Name, Controller.r_finish);
    app.get('/leaderboard', Controller.r_leaders);
    app.get('/totalgames', Controller.r_totalGames);

    // error handler
    app.use(errorHandler);

    resolve(app);
  });
};
