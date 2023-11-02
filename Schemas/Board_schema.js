const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const subtaskSchema = new Schema({
  title: String,
  isCompleted: Boolean,
});


const taskSchema = new Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ['Todo', 'Doing', 'Done'],
    default: 'Todo',
  },
  subtasks: [{ type: Schema.Types.ObjectId, ref: 'Subtask' }],
});


const boardSchema = new Schema({
  name: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

const Subtask_Model = mongoose.model('Subtask', subtaskSchema);
const Task_Model = mongoose.model('Task', taskSchema);
const Board_Model = mongoose.model('Board', boardSchema);

module.exports = {
  Subtask_Model,
  Task_Model,
  Board_Model,
};
