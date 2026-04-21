import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
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
import AzureAnalyticsPage from './pages/admin/HadoopAnalyticsPage';
import POSBillingPage from './pages/features/POSBillingPage';
import SecurityPage from './pages/features/SecurityPage';

function App() {
  const location = useLocation();

  return (
    <DarkModeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
              <Route path="/demo" element={<PageTransition><DemoPage /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
              <Route path="/admin/employees" element={<PageTransition><EmployeesPage /></PageTransition>} />
              <Route path="/admin/branches" element={<PageTransition><BranchesPage /></PageTransition>} />
              <Route path="/admin/inventory" element={<PageTransition><InventoryPage /></PageTransition>} />
              <Route path="/admin/billing" element={<PageTransition><BillingPage /></PageTransition>} />
              <Route path="/admin/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
              <Route path="/admin/azure-analytics" element={<PageTransition><AzureAnalyticsPage /></PageTransition>} />
              <Route path="/features/multi-branch" element={<PageTransition><MultiBranchPage /></PageTransition>} />
              <Route path="/features/ai-insights" element={<PageTransition><AIInsightsPage /></PageTransition>} />
              <Route path="/features/pos-billing" element={<PageTransition><POSBillingPage /></PageTransition>} />
              <Route path="/features/security" element={<PageTransition><SecurityPage /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </div>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;