import { Request, Response, NextFunction } from 'express';
import { HttpException } from 'middleware/mw_error';

import CryptoJS from 'crypto-js';

const decryptWithAES = (ciphertext: string) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const passphrase = process.env.PASSPHRASE || 'NOTHING';
      const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      resolve(originalText);
    } catch (err) {
      reject(err);
    }
  });
};

// decrypt passed value "rounds" from req.body
export const decrypt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // decrypt and validate
  const roundsCipher = req.body.rounds;
  const uri_decoded = decodeURIComponent(roundsCipher);
  decryptWithAES(uri_decoded)
    .then((res) => {
      const rounds = Number.parseInt(res);
      if (isNaN(rounds)) {
        return next(
          new HttpException(400, 'decrypted rounds string is not a number')
        );
      }
      req.body.rounds = rounds; // save
      next();
    })
    .catch((err) => {
      return next(new HttpException(400, err.message));
    });
};
