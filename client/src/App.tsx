import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { TasksProvider } from './contexts/task-context';
function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <TasksProvider>
                <Dashboard />
              </TasksProvider>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
