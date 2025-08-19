import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
    description: string;
    category: string;
    title: string;
    dueDate: Date; 
    user: string;  
}

const TaskSchema = new Schema<ITask>({
    description: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    user: { type: String, required: true },
}, {
    timestamps: true, 
});

const Task = model<ITask>('Task', TaskSchema);

export default Task;
