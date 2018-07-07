import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface IDecodedToken {
  email: string;
  userId: string;
}

export interface IDecodedRefreshToken {
  email: string;
  key: string;
}

export interface IRequestAuth extends Request {
  userData: {
    email: string,
    userId: string
  }
}

export function checkAuth(req: IRequestAuth, res: Response, next: NextFunction) { // Are Magick Cauldron
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY) as IDecodedToken;
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'You are not authenticated.'
    });
  }

}