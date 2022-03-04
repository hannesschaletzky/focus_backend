import { Request, Response, NextFunction } from 'express';
import { HttpException } from 'middleware/mw_error';

import { Repository } from 'db/gameRepository';
import { Status } from 'utils/types';

export const checkGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.body.id;
  // game exists?
  let result = await Repository.gameExists(id).catch((err) => {
    return next(new HttpException(400, err));
  });
  if (!result) {
    next(new HttpException(400, `game not found`));
  }
  // game in init status?
  result = await Repository.gameInStatus(id, Status.init).catch((err) => {
    return next(new HttpException(400, err));
  });
  if (!result) {
    next(new HttpException(400, `game not in init status`));
  }

  next();
};
