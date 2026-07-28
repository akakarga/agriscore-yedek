import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router';
import InstitutionLayout from './components/layout/InstitutionLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import RoleGuard from './components/auth/RoleGuard';
import ProducerLayout from './components/layout/ProducerLayout';
import AiCoPilot from './components/AiCoPilot';
import AppTour from './components/AppTour';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProducerList = lazy(() => import('./pages/ProducerList'));
const ProducerDetail = lazy(() => import('./pages/ProducerDetail'));
const Opportunities = lazy(() => import('./pages/Opportunities'));
const Report = lazy(() => import('./pages/Report'));
const ReviewGuide = lazy(() => import('./pages/ReviewGuide'));
const ProducerDashboard = lazy(() => import('./pages/producer/ProducerDashboard'));
const CksAnalyzer = lazy(() => import('./pages/CksAnalyzer'));
const DecisionRoom = lazy(() => import('./pages/DecisionRoom'));

const RouteFallback = () => (
  <div
    className="min-h-[40vh] flex items-center justify-center text-sm text-slate-500"
    role="status"
    aria-live="polite"
  >
    Ekran hazırlanıyor…
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
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
            <Route path="decision-room" element={<DecisionRoom />} />
            <Route path="decision-room/:id" element={<DecisionRoom />} />
            <Route path="cks-analiz" element={<CksAnalyzer />} />
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
            <Route path="cks-analiz" element={<CksAnalyzer />} />
          </Route>
        </Routes>
      </Suspense>
      <AiCoPilot />
      <AppTour />
    </Router>
  );
}

export default App;
