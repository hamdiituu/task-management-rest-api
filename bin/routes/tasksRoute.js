const route = require('express').Router();
const {taskSchema, taskStatusType} = require('../schemas/taskSchema');

route.get('/all', (req, res) => {
    const userId = req.user._id;
    taskSchema.find({userId: userId})
        .then((r) => res.status(200).send(r))
        .catch((e) => res.status(500).send(e));
});

route.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;
    taskSchema.findOne({_id: id, userId: userId})
        .then((r) => res.status(200).send(r))
        .catch((e) => res.status(500).send(e));
});

route.get('/types', (req, res) => {
    res.status(200).send(taskStatusType);
});

route.post('/create', (req, res) => {
    const task = req.body;
    task.status = taskStatusType.N;
    task.userId = req.user._id;
    taskSchema.create(task)
        .then((r) => res.status(201).send(r))
        .catch((e) => res.status(500).send(e));

});

route.put('/statusUpdate/:id', (req, res) => {
    const {id} = req.params;
    const {status} = req.body;
    const userId = req.user._id;
    if (!status || !taskStatusType[status]) {
        return res.status(500).send("status parameter not found or not match!");
    }

    taskSchema.findOneAndUpdate({_id: id, userId: userId}, {status: taskStatusType[status]})
        .then(() => res.status(202).send("status update!"))
        .catch((e) => res.status(500).send(e));
});

route.delete('/remove/:id', (req, res) => {
    const {id} = req.params;
    const userId = req.user._id;
    taskSchema.findOneAndUpdate({_id: id, userId: userId}, {status: taskStatusType.R})
        .then((r) => res.status(202).send(r))
        .catch((e) => res.status(500).send(e));
});

route.get('/removedList', (req, res) => {
    const userId = req.user._id;
    taskSchema.find({status: taskStatusType.R ,userId :userId})
        .then((r) => res.status(200).send(r))
        .catch((e) => res.status(500).send(e));
});

module.exports = route;