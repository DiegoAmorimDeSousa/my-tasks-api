import { Schema, model, Document } from 'mongoose';
import { Task } from '@domain/entities/Task';

// Estende a interface Task com Document do Mongoose para tipagem completa
// Agora, TaskDocument estende apenas Document, e as propriedades de Task são adicionadas ao Schema.
export interface TaskDocument extends Document, Omit<Task, 'id'> {} // Corrigido: Omitimos 'id' de Task aqui.

const TaskSchema = new Schema<TaskDocument>({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  dueDate: { type: Date },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Atualiza o updatedAt em cada save
TaskSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const TaskModel = model<TaskDocument>('Task', TaskSchema);