import { Schema, model} from 'mongoose';

let exerciseSchema: Schema = new Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default model('Exercise', exerciseSchema);