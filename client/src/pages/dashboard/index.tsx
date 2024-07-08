import { useUser } from '@clerk/clerk-react';
import TaskForm from './task-form';
import TaskList from './task-list';
import { Auth } from '../auth/index'; 

export const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="dashboard-container">
      <Auth />
      <h1>Welcome to Tasky, {user?.firstName}!</h1>
      <h2>Add your tasks and manage them all in one place!</h2>
      <TaskForm />
      <TaskList />
    </div>
  );
};
