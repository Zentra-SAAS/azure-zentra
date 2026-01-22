import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, FileText, CheckCircle, Users, Database, Key } from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeContext';

const SecurityPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const features = [
    {
      icon: Lock,
      title: 'Row Level Security (RLS)',
      description: 'Advanced database security ensuring users can only access their own data with granular permissions.'
    },
    {
      icon: FileText,
      title: 'Comprehensive Audit Logs',
      description: 'Track every action, login, and data change with detailed timestamps and user attribution.'
    },
    {
      icon: Key,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security with SMS, email, or authenticator app-based 2FA.'
    },
    {
      icon: Database,
      title: 'Encrypted Data Storage',
      description: 'All data encrypted at rest and in transit using industry-standard AES-256 encryption.'
    }
  ];

  const securityMeasures = [
    {
      category: 'Data Protection',
      measures: [
        'AES-256 encryption at rest',
        'TLS 1.3 encryption in transit',
        'Regular security audits',
        'GDPR compliance ready'
      ]
    },
    {
      category: 'Access Control',
      measures: [
        'Role-based permissions',
        'Multi-factor authentication',
        'Session management',
        'IP whitelisting'
      ]
    },
    {
      category: 'Monitoring',
      measures: [
        'Real-time threat detection',
        'Automated security alerts',
        'Comprehensive audit trails',
        'Anomaly detection'
      ]
    },
    {
      category: 'Compliance',
      measures: [
        'SOC 2 Type II certified',
        'ISO 27001 compliant',
        'PCI DSS Level 1',
        'HIPAA ready'
      ]
    }
  ];

  const certifications = [
    { name: 'SOC 2 Type II', icon: '🛡️' },
    { name: 'ISO 27001', icon: '🔒' },
    { name: 'PCI DSS', icon: '💳' },
    { name: 'GDPR Ready', icon: '🇪🇺' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Enterprise-Grade Security
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your business data is protected by military-grade security measures. We implement the highest standards of data protection, compliance, and access control.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Security Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Comprehensive Security Measures
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityMeasures.map((category, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-2">
                  {category.measures.map((measure, measureIndex) => (
                    <li key={measureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Security Certifications
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{cert.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Architecture */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Multi-Layered Security Architecture
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Network Security</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Firewall protection, DDoS mitigation, and secure network architecture
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Application Security</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Secure coding practices, regular penetration testing, and vulnerability assessments
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Security</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      End-to-end encryption, secure backups, and data loss prevention
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-8 rounded-2xl text-white">
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 mr-3" />
                <h3 className="text-2xl font-bold">Security Monitoring</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-1">🔍 Real-time Monitoring</p>
                  <p className="text-sm">24/7 security operations center monitoring all activities</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-1">⚡ Instant Alerts</p>
                  <p className="text-sm">Immediate notifications for any suspicious activities</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-1">📊 Security Reports</p>
                  <p className="text-sm">Regular security assessments and compliance reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Permissions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Granular User Permissions
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Role-Based Access</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Define custom roles with specific permissions for different team members
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Data Isolation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Each user can only access data they're authorized to see
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Audit Trail</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete log of who accessed what data and when
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Your Data Security is Our Priority
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Trust Zentra with your business data. We implement the highest security standards to keep your information safe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              See Security in Action
            </Link>
            <a
              href="#trial"
              className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Start Secure Trial
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecurityPage;