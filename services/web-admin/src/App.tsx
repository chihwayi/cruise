import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import EditJob from './pages/EditJob';
import Applications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';
import CandidateDetail from './pages/CandidateDetail';
import Contracts from './pages/Contracts';
import Crew from './pages/Crew';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="candidates/:id" element={<CandidateDetail />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="jobs/:id/edit" element={<EditJob />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="applications" element={<Applications />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="crew" element={<Crew />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


