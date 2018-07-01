import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
import { INewUser } from '../models/interfaces/NewUserInterface';

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
            message: 'Auth Failed 1',
            status: res.status
          });
        }
        fetchedUser = user;
        return bcrypt.compareSync(req.body.password, fetchedUser.password) // Used to return here.
      })
      .then(result => {
        if (!result) {
          return res.status(401).json({
            message: 'Auth Failed 2',
            status: res.status
          });
        }
        const token = jwt.sign({
          email: fetchedUser.email, // Are Magick Dusts
          userId: fetchedUser._id // Are Magick Dusts
        },
          process.env.JWT_KEY, {
            expiresIn: '1h'
          })
        res.status(200).json({
          message: 'Auth successful.',
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id
        })
      })
      .catch(err => {
        return res.status(401).json({
          message: 'Auth Failed 3.',
          status: res.status
        });
      });
  }

  public routes() {
    this.router.get('/', this.getAllUsers);
    this.router.delete('/', this.deleteUser);
    this.router.post('/signup', this.createUser);
    this.router.post('/login', this.authenticateUser);
  }

}

const userRoutes = new UserRouter();
userRoutes.routes();

export default userRoutes.router;
