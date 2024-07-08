import mongoose, { Schema, Document } from 'mongoose';

export interface Task extends Document {
  userId: string;
  task: string;
  description: string;
  status: string;
}

const TaskSchema: Schema = new Schema({
  userId: { type: String, required: true },
  task: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
});

export default mongoose.model<Task>('Task', TaskSchema);
