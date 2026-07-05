import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InstitutionLayout from './components/layout/InstitutionLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ProducerList from './pages/ProducerList';
import ProducerDetail from './pages/ProducerDetail';
import Opportunities from './pages/Opportunities';
import Report from './pages/Report';
import ReviewGuide from './pages/ReviewGuide';
import Login from './pages/Login';
import RoleGuard from './components/auth/RoleGuard';
import ProducerLayout from './components/layout/ProducerLayout';
import ProducerDashboard from './pages/producer/ProducerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/review-guide" element={<ReviewGuide />} />
        
        <Route path="/institution" element={
          <RoleGuard allowedRole="institution">
            <InstitutionLayout />
          </RoleGuard>
        }>
          <Route index element={<Navigate to="/institution/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="producers" element={<ProducerList />} />
          <Route path="producers/:id" element={<ProducerDetail />} />
          <Route path="producers/:id/report" element={<Report />} />
          <Route path="opportunities" element={<Opportunities />} />
        </Route>

        <Route path="/producer" element={
          <RoleGuard allowedRole="producer">
            <ProducerLayout />
          </RoleGuard>
        }>
          <Route index element={<Navigate to="/producer/home" replace />} />
          <Route path="home" element={<ProducerDashboard />} />
          <Route path="production" element={<ProducerDashboard />} />
          <Route path="finance" element={<ProducerDashboard />} />
          <Route path="documents" element={<ProducerDashboard />} />
          <Route path="opportunities" element={<ProducerDashboard />} />
          <Route path="readiness" element={<ProducerDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
