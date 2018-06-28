import { Schema, model} from 'mongoose';

let routineSchema: Schema = new Schema({
  name: { type: String, required: true },
  exercises: [
    { type: Schema.Types.ObjectId, ref: 'Exercise' },
  ],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default model('Routine', routineSchema);