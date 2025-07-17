"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const mongoose_1 = require("mongoose");
const TaskSchema = new mongoose_1.Schema({
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
exports.TaskModel = (0, mongoose_1.model)('Task', TaskSchema);
