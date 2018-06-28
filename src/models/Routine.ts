import { Schema, model} from 'mongoose';

let routineSchema: Schema = new Schema({
  createdAt: Date,
  updatedAt: Date,
  name: { type: String, required: true },
  exercises: [
    { type: Schema.Types.ObjectId, ref: 'Exercise' },
  ]
});

export default model('Routine', routineSchema);