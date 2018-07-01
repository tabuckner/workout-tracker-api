import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';

/**
 * Controllers/Routers
 */
import ExerciseRouter from './controllers/ExerciseController';
import RoutineRouter from './controllers/RoutineController';
import UserController from './controllers/UserController';

class Server {

  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config() { // TODO: Set real secrets and secure.
    const MONGO_PW = 'developmentpassword' || process.env.MONGO_PW;
    // const MONGO_URI = `mongodb+srv://tabuckner:${MONGO_PW}@development-w7lz5.mongodb.net/test?retryWrites=true`;
    const MONGO_URI = `mongodb+srv://tabuckner:${MONGO_PW}@development-w7lz5.mongodb.net/test`;
    mongoose.connect(MONGO_URI || process.env.MONGODB_URI);

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(logger('dev'));
    this.app.use(cors());
    this.app.use(compression());
  }

  public routes() {
    let router: express.Router;
    router = express.Router();

    this.app.use('/', router);
    this.app.use('/api/exercises', ExerciseRouter);
    this.app.use('/api/routines', RoutineRouter);
    this.app.use('/api/users', UserController);
  }

}

export default new Server().app;
