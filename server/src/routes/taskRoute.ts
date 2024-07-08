import express, { Request, Response } from 'express';
import TaskModel, { Task } from '../models/Task';

const router = express.Router();

router.get('/getAllByUserId/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const tasks = await TaskModel.find({ userId: userId });
    if (tasks.length > 0) {
      res.status(200).json(tasks);
    } else {
      res.status(404).json({ message: 'No task found!' });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getAll', async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.find();
    if (tasks.length > 0) {
      res.status(200).json(tasks);
    } else {
      res.status(404).json({ message: 'No tasks found!' });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newTask = new TaskModel(req.body);
    const task = await newTask.save();
    res.status(200).json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatedTask = req.body;
    const task = await TaskModel.findByIdAndUpdate(id, updatedTask, {
      new: true,
    });
    if (!task) {
      res.status(404).json('Task not found');
    } else {
      res.status(200).json(task);
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await TaskModel.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json('Task not found');
    } else {
      res.status(200).json({ message: 'Task deleted successfully', task });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
