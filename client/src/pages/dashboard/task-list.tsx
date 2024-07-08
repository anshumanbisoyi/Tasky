import React, { useState, useEffect } from 'react';
import { useTasks, Task } from '../../contexts/task-context';
import './TaskList.css';
import { ObjectId } from 'mongodb';

const TaskList: React.FC = () => {
  const {
    tasks,
    fetchTasks,
    fetchAllTasks,
    completeTask,
    deleteTask,
    editTask,
  } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [currentTaskId, setCurrentTaskId] = useState<ObjectId | null>(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleFilter = (filterType: string) => {
    switch (filterType) {
      case 'all':
        fetchAllTasks();
        setShowCompletedTasks(false);
        break;
      case 'your':
        fetchTasks();
        setShowCompletedTasks(false);
        break;
      default:
        fetchAllTasks();
        setShowCompletedTasks(false);
        break;
    }
  };

  const handleEdit = (taskId: ObjectId, updatedTask: Task) => {
    setCurrentTaskId(taskId);
    setTask(updatedTask.task);
    setDescription(updatedTask.description);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTaskId) {
      const updatedTask: Partial<Task> = {
        _id: currentTaskId,
        task,
        description,
      };

      try {
        await editTask(currentTaskId.toString(), updatedTask as Task);
        setShowModal(false);
        setCurrentTaskId(null);
        setTask('');
        setDescription('');
        console.log('Task edited successfully!');
      } catch (error) {
        console.error('Error editing task:', error);
      }
    }
  };

  const handleDelete = async (taskId: ObjectId) => {
    try {
      await deleteTask(taskId.toString());
      console.log('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = (taskId: ObjectId, newStatus: string) => {
    if (newStatus === 'completed') {
      completeTask(taskId);
    } else {

    }
  };

  return (
    <div className="task-container">
      <div className="filter-buttons">
        <button onClick={() => handleFilter('all')}>All Tasks</button>
        <button onClick={() => handleFilter('your')}>Your Tasks</button>
      </div>

      <div className="task-box">
        {showCompletedTasks
          ? tasks
              .filter((task) => task.status === 'completed')
              .map((task) => (
                <TaskCard
                  key={task._id?.toString()}
                  task={task}
                  onEdit={() => handleEdit(task._id!, task)}
                  onDelete={() => handleDelete(task._id!)}
                  onStatusChange={(newStatus: string) =>
                    handleStatusChange(task._id!, newStatus)
                  }
                />
              ))
          : tasks.map((task) => (
              <TaskCard
                key={task._id?.toString()}
                task={task}
                onEdit={() => handleEdit(task._id!, task)}
                onDelete={() => handleDelete(task._id!)}
                onStatusChange={(newStatus: string) =>
                  handleStatusChange(task._id!, newStatus)
                }
              />
            ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <form className="task-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="task">Task:</label>
                <input
                  type="text"
                  id="task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Update Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (newStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="task-card">
      <h3>{task.task}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <div className="task-buttons">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
        <button
          onClick={() =>
            onStatusChange(
              task.status === 'completed' ? 'incomplete' : 'completed'
            )
          }
        >
          {task.status === 'completed' ? 'Incomplete' : 'Complete'}
        </button>
      </div>
    </div>
  );
};

export default TaskList;
