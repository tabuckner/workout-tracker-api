import { Schema, model} from 'mongoose';

let journalEntrySchema: Schema = new Schema({
  baseRoutine: { type: Schema.Types.ObjectId, ref: 'Routine', required: true },
  exercisePerformance: [
    {
      exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
      performance: {
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        weight: { type: Number, required: true },
      }
    }
  ],
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default model('Routine', journalEntrySchema);