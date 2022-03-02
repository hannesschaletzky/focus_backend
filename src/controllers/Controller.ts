import { Request, Response, NextFunction } from 'express';
import { HttpException } from 'middleware/mw_error';
import { Status } from 'utils/types';
import { Repository } from 'db/repository';

function sendSuccess(res: Response, obj: Record<string, unknown> | unknown) {
  res.status(200).json(obj);
}

export class Controller {
  // INIT
  static r_create(req: Request, res: Response, next: NextFunction) {
    const color = req.body.color;
    Repository.executeQuery(
      `INSERT INTO ${Repository.getTable()} (color)
        VALUES ('${color}');
      SELECT SCOPE_IDENTITY() AS [SCOPE_IDENTITY];`
    )
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
    const rounds = req.body.rounds;
    // 1. delete old record with same name and points
    // 2. set current game to finished
    const tbl = Repository.getTable();
    Repository.executeQuery(
      `DELETE
      FROM ${tbl}
      WHERE name = '${name}' AND
            rounds=(SELECT rounds FROM ${tbl} WHERE id=${id});

      UPDATE ${tbl}
      SET status = '${Status.finished}',
          name = '${name}',
          rounds = ${rounds}
      WHERE id=${id}`
    )
      .then(() => {
        sendSuccess(res, { msg: `DB: ${name} has finished game ${id}` });
      })
      .catch((err: Error) => {
        return next(new HttpException(400, err.message));
      });
  }

  // LEADERBOARD
  static r_leaders(req: Request, res: Response, next: NextFunction) {
    Repository.executeQuery(
      `SELECT  TOP 10
            name,
            rounds,
            created_at,
            color
      FROM ${Repository.getTable()} 
      WHERE status='finished'
      ORDER BY rounds DESC, created_at DESC`
    )
      .then((rows) => {
        sendSuccess(res, rows);
      })
      .catch((err: Error) => {
        return next(new HttpException(400, err.message));
      });
  }

  // TOTAL GAMES
  static r_totalGames(req: Request, res: Response, next: NextFunction) {
    Repository.executeQuery(
      `SELECT COUNT(*)
      FROM ${Repository.getTable()};`
    )
      .then((rows) => {
        sendSuccess(res, rows[0]['']);
      })
      .catch((err: Error) => {
        return next(new HttpException(400, err.message));
      });
  }
}
