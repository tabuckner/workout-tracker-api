import { Router, Request, Response, NextFunction } from 'express';
import Exercise from '../models/Exercise';
import { INewExercise } from '../models/interfaces/NewExerciseInterface';
import { checkAuth, IRequestAuth } from '../middleware/check-auth';
import { INewJournalEntry } from '../models/interfaces/NewJournalEntryInterface';
import JournalEntry from '../models/JournalEntry';

class JournalEntryRouter {

  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public getJournalEntries(req: Request, res: Response, next: NextFunction): void {
    JournalEntry.find({})
      .populate({ path: 'baseRoutine', select: 'name'})
      .populate({ path: 'exercisePerformances.exercise', select: 'name sets reps weight'})
      .then((data) => {
        const status = res.statusCode;
        const count = data.length;
        res.json({
          message: 'Journal Entries fetched successfully.',
          status,
          count,
          data
        });
      })
      .catch((err) => {
        const status = res.statusCode;
        res.json({
          message: 'Journal Entries failed to fetch.',
          status,
          err
        });
      });
  }

  public getJournalEntry(req: Request, res: Response, next: NextFunction): void {
    const id = req.params.id;
    JournalEntry.findOne({ _id: id })
      .deepPopulate('baseRoutine baseRoutine.exercises exercisePerformances.exercise')
      .then((data) => {
        let status = res.statusCode;
        if (!data) {
          status = 404;
          return res.json({
            message: `No Journal Entry found for id: '${id}'`,
            status,
            data
          });
        }
        res.json({
          message: 'Journal Entry fetched successfully.',
          status,
          data
        });
      })
      .catch((err) => {
        const status = res.statusCode;
        res.json({
          message: 'Journal Entry failed to fetch.',
          status,
          err
        });
      });
  }

  public createJournalEntry(req: IRequestAuth, res: Response, next: NextFunction): void {
    const newJournalEntry: INewJournalEntry = {
      baseRoutine: req.body.baseRoutine,
      exercisePerformances: req.body.exercisePerformances,
      creator: req.userData.userId
    };

    const journalEntry = new JournalEntry(newJournalEntry);

    journalEntry.save()
      .then((data) => {
        const status = res.statusCode;
        res.json({
          message: 'Journal Entry created successfully.',
          status,
          data
        });
      })
      .catch((err) => {
        const status = res.statusCode;
        res.json({
          message: 'Journal Entry failed to save to the database.',
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

  public deleteJournalEntry(req: IRequestAuth, res: Response, next: NextFunction): void {
    const id = req.params.id;
    const requestor = req.userData.userId
    JournalEntry.findOneAndRemove({ _id: id, creator: requestor })
      .then((data) => {
        let status = res.statusCode;
        if (!data) {
          status = 404;
          return res.json({
            message: `No Journal Entry found for id: '${id}'`,
            status,
            data
          });
        }
        res.json({
          message: 'Journal Entry deleted successfully.',
          status,
          data
        });
      })
      .catch((err) => {
        const status = res.statusCode;
        res.json({
          message: 'Journal Entry failed to delete.',
          status,
          err
        });
      });
  }

  public routes() {
    this.router.get('/', this.getJournalEntries);
    this.router.post('/', checkAuth, this.createJournalEntry);
    this.router.get('/:id', this.getJournalEntry);
    // this.router.put('/:id', checkAuth, this.updateExercise);
    this.router.delete('/:id', checkAuth, this.deleteJournalEntry);
  }

}

const journalEntryRoutes = new JournalEntryRouter();
journalEntryRoutes.routes();

export default journalEntryRoutes.router;
