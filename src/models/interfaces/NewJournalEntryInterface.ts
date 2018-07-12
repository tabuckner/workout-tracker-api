export interface INewExercisePerformance {
  exercise: string; // ID
  performance: {
    sets: number;
    reps: number;
    weight: number;
  }
}

export interface INewJournalEntry {
  baseRoutine: string;
  exercisePerformances: INewExercisePerformance[];
  creator: string;
}