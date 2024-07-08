import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useTasks, Task } from '../../contexts/task-context';
import './TaskForm.css';

const TaskForm: React.FC = () => {
  const { addTask } = useTasks();
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const newTask: Task = {
      userId: user?.id ?? '',
      task,
      description,
      status: 'incomplete',
    };

    try {
      await addTask(newTask);
      setTask('');
      setDescription('');
      console.log('Task added successfully!');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div>
      <button className="add-task-button" onClick={() => setShowModal(true)}>
        Add Task
      </button>
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
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskForm;
