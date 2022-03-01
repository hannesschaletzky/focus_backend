/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { HttpException } from 'middleware/mw_error';

const extractFromBody = (
  key: string,
  body: {
    [key: string]: string;
  }
) => {
  if (!body[key]) {
    throw new HttpException(400, `body: ${key} missing`);
  }
  return body[key];
};

const parseToInt = (value: string) => {
  const parsed = Number.parseInt(value);
  if (Number.isNaN(parsed)) {
    throw new HttpException(400, `body: ${value} must be of type integer`);
  }
  return parsed;
};

// require ID passed in body
export const req_ID = (req: Request, res: Response, next: NextFunction) => {
  try {
    const extract = extractFromBody('id', req.body);
    const idInt = parseToInt(extract);
    req.body.id = idInt;
    next();
  } catch (err) {
    next(err);
  }
};

// require name passed in body
export const req_Name = (req: Request, res: Response, next: NextFunction) => {
  try {
    extractFromBody('name', req.body);
    next();
  } catch (err) {
    next(err);
  }
};

// require color passed in body
export const req_Color = (req: Request, res: Response, next: NextFunction) => {
  try {
    extractFromBody('color', req.body);
    next();
  } catch (err) {
    next(err);
  }
};
