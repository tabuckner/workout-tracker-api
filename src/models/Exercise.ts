import { Schema, model} from 'mongoose';

let exerciseSchema: Schema = new Schema({
  createdAt: Date,
  updatedAt: Date,
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
});

export default model('Exercise', exerciseSchema);