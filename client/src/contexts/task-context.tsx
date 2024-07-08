import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ObjectId } from 'mongodb';

export interface Task {
  _id?: ObjectId;
  userId: string;
  task: string;
  description: string;
  status: string;
}

interface TaskContextType {
  tasks: Task[];
  completedTasks: Task[];
  addTask: (task: Task) => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchAllTasks: () => Promise<void>;
  editTask: (taskId: string, updatedTask: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: ObjectId) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]); 
  const { user } = useUser();

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    const response = await fetch(
      'https://taskybackend-sigma.vercel.app/tasks/getAll'
    );
    try {
      if (response.ok) {
        const tasks = await response.json();
        setTasks(tasks.filter((task: Task) => task.status !== 'completed'));
        setCompletedTasks(tasks.filter((task: Task) => task.status === 'completed')); 
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching all tasks:', error);
    }
  };

  const fetchTasks = async () => {
    if (!user) return;
    const response = await fetch(
      `https://taskybackend-sigma.vercel.app/tasks/getAllByUserId/${user.id}`
    );
    try {
      if (response.ok) {
        const tasks = await response.json();
        setTasks(tasks.filter((task: Task) => task.status !== 'completed')); 
        setCompletedTasks(tasks.filter((task: Task) => task.status === 'completed')); 
      } else {
        throw new Error('Failed to fetch user tasks');
      }
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };

  const addTask = async (task: Task) => {
    try {
      const response = await fetch(
        'https://taskybackend-sigma.vercel.app/tasks',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        }
      );
      if (response.ok) {
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const editTask = async (taskId: string, updatedTask: Task) => {
    try {
      const response = await fetch(
        `https://taskybackend-sigma.vercel.app/tasks/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        }
      );
      if (response.ok) {
        const updatedTaskFromServer = await response.json();
        if (updatedTaskFromServer.status === 'completed') {
          // Move task to completedTasks
          setCompletedTasks((prevCompletedTasks) => [
            ...prevCompletedTasks,
            updatedTaskFromServer,
          ]);
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== updatedTaskFromServer._id)
          );
        } else {
          // Update task in tasks
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === updatedTaskFromServer._id
                ? updatedTaskFromServer
                : task
            )
          );
        }
        console.log('Task edited successfully!');
      } else {
        throw new Error('Failed to edit task');
      }
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(
        `https://taskybackend-sigma.vercel.app/tasks/${taskId}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        await response.json(); 
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
        setCompletedTasks((prevCompletedTasks) =>
          prevCompletedTasks.filter((task) => task._id !== taskId)
        );
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const completeTask = (taskId: ObjectId) => {
    const taskToComplete = tasks.find((task) => task._id === taskId);
    if (taskToComplete) {
      const updatedTask = { ...taskToComplete, status: 'completed' };
      editTask(taskToComplete._id?.toString() || '', updatedTask);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        completedTasks,
        addTask,
        fetchTasks,
        fetchAllTasks,
        editTask,
        deleteTask,
        completeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};

