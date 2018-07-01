import { Schema, model} from 'mongoose';
import * as unique from 'mongoose-unique-validator';

let userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at' } });

userSchema.plugin(unique);

export default model('User', userSchema);