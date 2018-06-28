import { Router, Request, Response, NextFunction } from 'express';
import Routine from '../models/Routine';
import { INewRoutine } from '../models/interfaces/NewRoutineInterface';

class RoutineRouter {

  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public getRoutines(req: Request, res: Response, next: NextFunction): void {
    Routine.find({})
    .then((data) => {
      const status = res.statusCode;
      const count = data.length;
      res.json({
        message: 'Routines fetched successfully.',
        status,
        count,
        data
      });
    })
    .catch((err) => {
      const status = res.statusCode;
      res.json({
        message: 'Routines failed to fetch.',
        status,
        err
      });
    });
  }

  public getRoutine(req: Request, res: Response, next: NextFunction): void {
    const id = req.params.id;
    Routine.findOne({ _id: id }).populate('exercises')
    .then((data) => {
      let status = res.statusCode;
      if (!data) {
        status = 404;
        return res.json({
          message: `No routine found for id: '${id}'`,
          status,
          data
        });
      }
      res.json({
        message: 'Routine fetched successfully.',
        status,
        data
      });
    })
    .catch((err) => {
      const status = res.statusCode;
      res.json({
        message: 'Routine failed to fetch.',
        status,
        err
      });
    });
  }

  public createRoutine(req: Request, res: Response, next: NextFunction): void {
    const newRoutine: INewRoutine = {
      name: req.body.name,
      exercises: req.body.exercises
    };

    const routine = new Routine(newRoutine);

    routine.save()
    .then((data) => {
      const status = res.statusCode;
      res.json({
        message: 'Routine created successfully.',
        status,
        data
      });
    })
    .catch((err) => {
      const status = res.statusCode;
      res.json({
        message: 'Routine failed to save to the database.',
        status,
        err
      });
    });
  }

  public updateRoutine(req: Request, res: Response, next: NextFunction): void {
    const id = req.params.id;
    Routine.findOneAndUpdate({ _id: id }, req.body)
    .then((data) => {
      let status = res.statusCode;
      if (!data) {
        status = 404;
        return res.json({
          message: `No routine found for id: '${id}'`,
          status,
          data
        });
      }
      res.json({
        message: 'Routine updated successfully.',
        status,
        data
      });
    })
    .catch((err) => {
      const status = res.statusCode;
      res.json({
        message: 'Routine failed to update.',
        status,
        err
      });
    });
  }

  public deleteRoutine(req: Request, res: Response, next: NextFunction): void {
    const id = req.params.id;
    Routine.findOneAndRemove({ _id: id })
    .then((data) => {
      let status = res.statusCode;
      if (!data) {
        status = 404;
        return res.json({
          message: `No routine found for id: '${id}'`,
          status,
          data
        });
      }
      res.json({
        message: 'Routine deleted successfully.',
        status,
        data
      });
    })
    .catch((err) => {
      const status = res.statusCode;
      res.json({
        message: 'Routine failed to delete.',
        status,
        err
      });
    });
  }

  public routes() {
    this.router.get('/', this.getRoutines);
    this.router.post('/', this.createRoutine);
    this.router.get('/:id', this.getRoutine);
    this.router.put('/:id', this.updateRoutine);
    this.router.delete('/:id', this.deleteRoutine);
  }

}

const routineRoutes = new RoutineRouter();
routineRoutes.routes();

export default routineRoutes.router;