import { Router, Request, Response, NextFunction } from 'express';
import Exercise from '../models/Exercise';
import { INewExercise } from '../models/interfaces/NewExerciseInterface';
import { checkAuth, IRequestAuth } from '../middleware/check-auth';

class ExerciseRouter {

  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public getExercises(req: Request, res: Response, next: NextFunction): void {
    Exercise.find({})
    .then((data) => {
      const status = res.statusCode;
      const count = data.length;
      res.json({
        message: 'Exercises fetched successfully.',
        status,
        count,
        data
      });
    })
    .catch((err) => {
      const status = res.statusCode;
      res.json({
        message: 'Exercises failed to fetch.',
        status,
        err
      });
    });
  }

  public getExercise(req: Request, res: Response, next: NextFunction): void {
    const id = req.params.id;
    Exercise.findOne({ _id: id })
    .then((data) => {
      let status = res.statusCode;
      if (!data) {
        status = 404;
        return res.json({
          message: `No exercise found for id: '${id}'`,
          status,
          data
        });
      }
      res.json({
        message: 'Exercise fetched successfully.',
        status,
        data
      });
    })
    .catch((err) => {
      const status = res.statusCode;
      res.json({
        message: 'Exercise failed to fetch.',
        status,
        err
      });
    });
  }

  public createExercise(req: IRequestAuth, res: Response, next: NextFunction): void {
    const newExercise: INewExercise = {
      name: req.body.name,
      sets: req.body.sets,
      reps: req.body.reps,
      weight: req.body.weight,
      creator: req.userData.userId
    };

    const exercise = new Exercise(newExercise);

    exercise.save()
    .then((data) => {
      const status = res.statusCode;
      res.json({
        message: 'Exercise created successfully.',
        status,
        data
      });
    })
    .catch((err) => {
      const status = res.statusCode;
      res.json({
        message: 'Exercise failed to save to the database.',
        status,
        err
      });
    });
  }

  public updateExercise(req: IRequestAuth, res: Response, next: NextFunction): void {
    const id = req.params.id;
    const requestor = req.userData.userId
    Exercise.findOneAndUpdate({ _id: id, creator: requestor }, req.body)
    .then((data) => {
      let status = res.statusCode;
      if (!data) {
        status = 404;
        return res.json({
          message: `No exercise found for id: '${id}'`,
          status,
          data
        });
      }
      res.json({
        message: 'Exercise updated successfully.',
        status,
        data
      });
    })
    .catch((err) => {
      const status = res.statusCode;
      res.json({
        message: 'Exercise failed to update.',
        status,
        err
      });
    });
  }

  public deleteExercise(req: IRequestAuth, res: Response, next: NextFunction): void {
    const id = req.params.id;
    const requestor = req.userData.userId
    Exercise.findOneAndRemove({ _id: id, creator: requestor })
    .then((data) => {
      let status = res.statusCode;
      if (!data) {
        status = 404;
        return res.json({
          message: `No exercise found for id: '${id}'`,
          status,
          data
        });
      }
      res.json({
        message: 'Exercise deleted successfully.',
        status,
        data
      });
    })
    .catch((err) => {
      const status = res.statusCode;
      res.json({
        message: 'Exercise failed to delete.',
        status,
        err
      });
    });
  }

  public routes() {
    this.router.get('/', this.getExercises);
    this.router.post('/', checkAuth, this.createExercise);
    this.router.get('/:id', this.getExercise);
    this.router.put('/:id', checkAuth, this.updateExercise);
    this.router.delete('/:id', checkAuth, this.deleteExercise);
  }

}

const exerciseRoutes = new ExerciseRouter();
exerciseRoutes.routes();

export default exerciseRoutes.router;
