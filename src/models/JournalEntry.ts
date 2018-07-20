import * as mongoose from 'mongoose';
const deepPopulate = require('mongoose-deep-populate')(mongoose);

let journalEntrySchema: mongoose.Schema = new mongoose.Schema({
  baseRoutine: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine', required: true },
  exercisePerformances: [
    {
      exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
      performance: [
        {
          set: { type: Number, required: true },
          reps: { type: Number, required: true },
          weight: { type: Number, required: true },
        }
      ]
    }
  ],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
journalEntrySchema.plugin(deepPopulate);

export default mongoose.model('JournalEntry', journalEntrySchema);