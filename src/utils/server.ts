import express from 'express';
import { InitController } from '../controllers/InitController';

export const setupExpressServer = () => {
  return new Promise<express.Express>((resolve) => {
    const app = express();

    app.get('/', (req, res) => {
      res.json('Hello World! BROOO');
    });

    const initController = new InitController();
    app.get('/init', initController.createGame);
    app.get('/do', initController.doSomeShit);

    resolve(app);
  });
};
