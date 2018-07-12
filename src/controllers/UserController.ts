import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crs from 'crypto-random-string';
import User from '../models/User';
import { INewUser } from '../models/interfaces/NewUserInterface';
import { IDecodedToken, IDecodedRefreshToken } from '../middleware/check-auth';

const JWT_SECRET = crs(15);
const tokenList = {};

class UserRouter {

  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public getAllUsers(req: Request, res: Response, next: NextFunction): void {
    User.find({})
      .then((data) => {
        const status = res.statusCode;
        const count = data.length;
        res.json({
          message: 'Users fetched successfully.',
          status,
          count,
          data
        });
      })
      .catch((err) => {
        const status = res.statusCode;
        res.json({
          message: 'Users failed to fetch.',
          status,
          err
        });
      });
  }

  public createUser(req: Request, res: Response, next: NextFunction): void {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const newUser: INewUser = {
          email: req.body.email,
          password: hash
        };
        const user = new User(newUser);

        user.save()
          .then((data) => {
            const status = res.statusCode;
            res.json({
              message: 'User created successfully.',
              status,
              data
            });
          })
          .catch((err) => {
            const status = res.statusCode;
            res.json({
              message: 'User failed to be created.',
              status,
              err
            });
          });
      });
  }

  public deleteUser(req: Request, res: Response, next: NextFunction): void {
    User.deleteOne({
      _id: req.body.id
    })
      .then(data => {
        let status = res.statusCode
        if (data.n > 0) {
          res.json({
            message: 'User deleted successfully',
            status,
            data
          });
        } else {
          status = 401;
          res.json({
            message: 'Not authorized.',
            status
          });
        }
      })
      .catch(error => {
        const status = 500;
        res.json({
          message: 'Unable to delete User.',
          status,
          error
        });
      });
  }

  public authenticateUser(req: Request, res: Response, next: NextFunction): void {
    let fetchedUser;
    User.findOne({
      email: req.body.email
    })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            message: 'Auth Failed',
            status: res.status
          });
        }
        fetchedUser = user;
        return bcrypt.compareSync(req.body.password, fetchedUser.password) // Used to return here.
      })
      .then(result => {
        if (!result) {
          return res.status(401).json({
            message: 'Auth Failed',
            status: res.status
          });
        }
        const token = jwt.sign({
          email: fetchedUser.email, // Are Magick Dusts
          userId: fetchedUser._id // Are Magick Dusts
        },
          process.env.JWT_KEY, {
            expiresIn: '30m'
          });
        const hashedKey = bcrypt.hashSync(JWT_SECRET, 10);
        const refreshToken = jwt.sign({
          userId: fetchedUser._id,
          key: hashedKey
        },
          process.env.JWT_REFRESH_KEY, {
            expiresIn: '7d' // Max time before a user must fully re-auth.
          });
        const response = {
          message: 'Auth successful.',
          token: token,
          refreshToken: refreshToken,
          expiresIn: 1800,
          userId: fetchedUser._id
        };
        tokenList[refreshToken] = response;
        res.status(200).json(response)
      })
      .catch(err => {
        return res.status(401).json({
          message: 'Auth Failed.',
          status: res.status
        });
      });
  }

  public refreshToken(req: Request, res: Response, next: NextFunction): void {
    const reqRefreshToken = req.body.refreshToken;
    const decodedRefreshToken = jwt.verify(reqRefreshToken, process.env.JWT_REFRESH_KEY) as IDecodedRefreshToken;
    const originalToken = req.headers.authorization.split('Bearer ')[1];
    const decodedOriginalToken = jwt.decode(originalToken) as IDecodedToken;
    const reqRefreshExistsInMemory = reqRefreshToken in tokenList;
    const secretIsValid = bcrypt.compareSync(JWT_SECRET, decodedRefreshToken.key);

    if (reqRefreshToken && reqRefreshExistsInMemory && secretIsValid) {
      const newToken = jwt.sign({
          email: decodedOriginalToken.email,
          userId: decodedOriginalToken.userId
        },
          process.env.JWT_KEY, {
            expiresIn: '30m'
          });
        const newHashedKey = bcrypt.hashSync(JWT_SECRET, 10);
        const newRefreshToken = jwt.sign({
          userId: decodedOriginalToken.userId,
          key: newHashedKey
        },
          process.env.JWT_REFRESH_KEY, {
            expiresIn: '7d'
          });
        const response = {
          message: 'Session Tokens successfully refreshed.',
          token: newToken,
          refreshToken: newRefreshToken,
          expiresIn: 1800,
          userId: decodedOriginalToken.userId
        };
        delete tokenList[reqRefreshToken];
        tokenList[newRefreshToken] = response;
        res.status(200).json(response)
    } else {
      res.status(401).json({
        message: 'Auth failed.',
        status: res.status
      });
    }
  }

  public routes() {
    this.router.get('/', this.getAllUsers);
    this.router.delete('/', this.deleteUser);
    this.router.post('/signup', this.createUser);
    this.router.post('/login', this.authenticateUser);
    this.router.post('/refresh', this.refreshToken);
  }

}

const userRoutes = new UserRouter();
userRoutes.routes();

export default userRoutes.router;
