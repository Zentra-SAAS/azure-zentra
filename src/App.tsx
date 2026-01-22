import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/admin/EmployeesPage';
import BranchesPage from './pages/admin/BranchesPage';
import InventoryPage from './pages/admin/InventoryPage';
import BillingPage from './pages/admin/BillingPage';
import SettingsPage from './pages/admin/SettingsPage';
import MultiBranchPage from './pages/features/MultiBranchPage';
import AIInsightsPage from './pages/features/AIInsightsPage';
import POSBillingPage from './pages/features/POSBillingPage';
import SecurityPage from './pages/features/SecurityPage';

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin/employees" element={<EmployeesPage />} />
              <Route path="/admin/branches" element={<BranchesPage />} />
              <Route path="/admin/inventory" element={<InventoryPage />} />
              <Route path="/admin/billing" element={<BillingPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/features/multi-branch" element={<MultiBranchPage />} />
              <Route path="/features/ai-insights" element={<AIInsightsPage />} />
              <Route path="/features/pos-billing" element={<POSBillingPage />} />
              <Route path="/features/security" element={<SecurityPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;