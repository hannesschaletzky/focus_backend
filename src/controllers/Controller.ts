import { Request, Response, NextFunction } from 'express';
import { executeQuery } from 'db/db_request';
import { tableName } from 'db/db_server';
import { HttpException } from 'middleware/mw_error';
import { Status } from 'utils/types';

function sendSuccess(res: Response, obj: Record<string, unknown> | unknown) {
  res.status(200).json(obj);
}

export class Controller {
  // INIT
  static r_create(req: Request, res: Response, next: NextFunction) {
    const color = req.body.color;
    executeQuery(`INSERT INTO ${tableName} (color)
                    VALUES ('${color}');
                  SELECT SCOPE_IDENTITY() AS [SCOPE_IDENTITY];`)
      .then((rows) => {
        const id = Number.parseInt(rows[0]['SCOPE_IDENTITY']);
        sendSuccess(res, { id: id, msg: 'game initialized' });
      })
      .catch((err: Error) => {
        return next(new HttpException(400, err.message));
      });
  }

  // FINISH
  static r_finish(req: Request, res: Response, next: NextFunction) {
    const id = req.body.id;
    const name = req.body.name;
    // 1. delete old record with same name and points
    // 2. set current game to finished
    executeQuery(`DELETE
                  FROM ${tableName}
                  WHERE name = '${name}' AND
                        rounds=(SELECT rounds FROM ${tableName} WHERE id=${id});

                  UPDATE ${tableName}
                  SET status = '${Status.finished}',
                      name = '${name}'
                  WHERE id=${id}`)
      .then(() => {
        sendSuccess(res, { msg: `DB: ${name} has finished game ${id}` });
      })
      .catch((err: Error) => {
        return next(new HttpException(400, err.message));
      });
  }

  // LEADERBOARD
  static r_leaders(req: Request, res: Response, next: NextFunction) {
    executeQuery(`SELECT  TOP 10
                        name,
                        rounds,
                        created_at,
                        color
                  FROM ${tableName} 
                  WHERE status='finished'
                  ORDER BY rounds DESC, created_at DESC`)
      .then((rows) => {
        sendSuccess(res, rows);
      })
      .catch((err: Error) => {
        return next(new HttpException(400, err.message));
      });
  }

  // TOTAL GAMES
  static r_totalGames(req: Request, res: Response, next: NextFunction) {
    executeQuery(`SELECT COUNT(*)
                  FROM ${tableName};`)
      .then((rows) => {
        sendSuccess(res, rows[0]['']);
      })
      .catch((err: Error) => {
        return next(new HttpException(400, err.message));
      });
  }
}
