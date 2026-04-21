import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { Copy, Check, Shield, Loader2 } from 'lucide-react';
import { CreateOrgForm } from '../components/CreateOrgForm';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';
import { TotalSalesCard } from '../components/dashboard/TotalSalesCard';
import { FraudAlertCard } from '../components/dashboard/FraudAlertCard';
import { StockRiskCard } from '../components/dashboard/StockRiskCard';
import { SalesTrendChart } from '../components/dashboard/SalesTrendChart';
import { FraudTrendChart } from '../components/dashboard/FraudTrendChart';
import { FreeTrialBanner } from '../components/dashboard/FreeTrialBanner';
import { GlassCard } from '../components/ui/GlassCard';
import { motion, Variants } from 'framer-motion';
import { TextReveal } from '../components/ui/TextReveal';

const DashboardPage: React.FC = () => {
  const { user, logout, loading, isOwner } = useAuth();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-300">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const organization = user.organization;
  const orgCode = organization?.org_code || 'ORG-LOADING';
  const passkey = organization?.passkey || 'PASS-LOADING';

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const cardHover = {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  };

  return (
    <AdminLayout onLogout={handleLogoutClick} userName={user.name} orgName={user.organization?.name}>
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Organization Creation Flow (No Org) */}
        {isOwner && !organization && (
          <div className="max-w-3xl mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                <TextReveal text={`Welcome to Zentra, ${user.name}`} />
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Let's get your business set up.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Create Your Organization
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  To get started, please create an organization. This will generate your unique organization code and passkey.
                </p>
              </div>

              <CreateOrgForm userId={user.id} />
            </motion.div>
          </div>
        )}

        {/* Main Dashboard (Has Org) */}
        {organization && (
          <div className="space-y-8">
            {/* Header */}
            <motion.div variants={itemVariants}>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                <TextReveal text="Dashboard" />
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Welcome back, {user.name}
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <FreeTrialBanner createdAt={organization.created_at} />
            </motion.div>

            {/* Real-time Sales Card & Alerts */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
            >
              <motion.div variants={itemVariants} whileHover={cardHover}>
                <TotalSalesCard orgId={organization.id} />
              </motion.div>
              <motion.div variants={itemVariants} whileHover={cardHover}>
                <FraudAlertCard orgId={organization.id} />
              </motion.div>
              <motion.div variants={itemVariants} whileHover={cardHover}>
                <StockRiskCard orgId={organization.id} />
              </motion.div>
            </motion.div>

            {/* Visual Analytics Charts */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              <motion.div variants={itemVariants} whileHover={cardHover}>
                <SalesTrendChart orgId={organization.id} />
              </motion.div>
              <motion.div variants={itemVariants} whileHover={cardHover}>
                <FraudTrendChart orgId={organization.id} />
              </motion.div>
            </motion.div>

            {/* Analytics Dashboard - The "Big Data" View */}
            <motion.div variants={itemVariants}>
              <AnalyticsDashboard orgId={organization.id} isOwner={isOwner} userId={user.id} />
            </motion.div>

            {/* Owner Section: Credentials (Collapsible or Bottom) */}
            {isOwner && (
              <motion.div
                variants={itemVariants}
                className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Organization Credentials
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Organization Code Card */}
                  <GlassCard className="p-6 flex flex-col justify-between transform transition-all hover:scale-[1.02] hover:shadow-2xl">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization Code</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="text-xl font-mono font-bold text-gray-900 dark:text-white">
                          {orgCode}
                        </code>
                        <button
                          onClick={() => copyToClipboard(orgCode, 'orgCode')}
                          className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-blue-600"
                          title="Copy Code"
                        >
                          {copiedField === 'orgCode' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Share this with your staff to join.</p>
                  </GlassCard>

                  {/* Passkey Card */}
                  <GlassCard className="p-6 flex flex-col justify-between transform transition-all hover:scale-[1.02] hover:shadow-2xl">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Passkey</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="text-xl font-mono font-bold text-gray-900 dark:text-white">
                          {passkey}
                        </code>
                        <button
                          onClick={() => copyToClipboard(passkey, 'passkey')}
                          className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-teal-600"
                          title="Copy Passkey"
                        >
                          {copiedField === 'passkey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-red-500 mt-2">Keep this secret. Reroll if compromised.</p>
                  </GlassCard>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default DashboardPage;