import { Request, Response, NextFunction } from 'express';

export class BaseController {
  sayHi() {
    console.log('HIIII');
  }
  doSomeShit(req: Request, res: Response, next: NextFunction) {
    res.status(200).json('all gucci man');
  }
}
