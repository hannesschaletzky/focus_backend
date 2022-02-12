import { Request, Response, NextFunction } from 'express';
import { BaseController } from 'controllers/_BaseController';

export class InitController extends BaseController {
  createGame(req: Request, res: Response, next: NextFunction) {
    res.status(200).json('all good');
  }
}
