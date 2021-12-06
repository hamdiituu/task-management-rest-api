const mongoose = require('mongoose');

const taskStatusType = Object.freeze({
    C: 'Completed',
    W: 'Waiting',
    P: 'Processing',
    D: 'Done',
    R: 'Remove',
    N: 'New'
});

const taskSchema = new mongoose.Schema({
     userId: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
     },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: Object.values(taskStatusType),
        default: taskStatusType.N,
        required: true
    }
}, {timestamps: true});

//Object.assign(taskStatusType.statics, {taskStatusType});

module.exports = {taskSchema: mongoose.model('task', taskSchema), taskStatusType: taskStatusType};