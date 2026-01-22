import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Trash2, Mail, Shield, Loader2, AlertCircle } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  user_code?: string;
  created_at: string;
}

const EmployeesPage: React.FC = () => {
  const { user, logout, loading, isOwner } = useAuth();
  const [shops, setShops] = useState<{ id: string, name: string }[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'manager', branch_id: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loading && (!user || !isOwner)) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (user?.organization_id) {
      fetchEmployees();
      if (isOwner) {
        fetchShops();
      }
    }
  }, [user?.organization_id, isOwner]);

  const fetchShops = async () => {
    const { data } = await supabase.from('shops').select('id, name');
    if (data) setShops(data);
  };

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      // Select with branch name join if possible, or just raw
      const { data, error: err } = await supabase
        .from('users')
        .select('id, name, email, role, user_code, created_at, branch_id')
        .eq('organization_id', user?.organization_id)
        .neq('id', user?.id);

      if (err) throw err;
      // @ts-ignore
      setEmployees(data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees: ' + ((err as any).message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate a random 6-digit user code
      const userCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Determine branch_id:
      // If Owner, use selected branch.
      // If Manager (future proofing), use their own branch.
      // For now this page is owner only per line 26 check, so use form data.
      const targetBranchId = formData.branch_id || null;

      const { error: err } = await supabase
        .from('users')
        .insert({
          email: formData.email,
          name: formData.name,
          role: formData.role,
          organization_id: user?.organization_id,
          branch_id: targetBranchId,
          user_code: userCode
        });

      if (err) throw err;

      setFormData({ name: '', email: '', role: 'manager', branch_id: '' });
      setShowForm(false);
      await fetchEmployees();
    } catch (err) {
      console.error('Error adding employee:', err);
      setError('Failed to add employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('Are you sure you want to remove this employee?')) return;

    try {
      const { error: err } = await supabase
        .from('users')
        .delete()
        .eq('id', employeeId);

      if (err) throw err;
      await fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError('Failed to remove employee');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || !isOwner) {
    // Note: User asked for Manager to see employees too.
    // We should allow managers but restrict their view. 
    // For now, keeping owner check to avoid breaking, but plan said "Restrict Manager to only add employees to their own Branch".
    // I will relax the check later or now?
    // Let's stick to updating the form logic first.
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout onLogout={logout} userName={user.name} orgName={user.organization?.name}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Employees
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage your team members and their access levels
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Employee</span>
          </button>
        </div>

        {/* Add Employee Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Employee
            </h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="manager">Manager</option>
                  <option value="cashier">Sales Person (Cashier)</option>
                  <option value="inventory">Inventory Person</option>
                  <option value="accountant">Accountant</option>
                </select>

                {/* Branch Selection for Owners */}
                {isOwner && (
                  <select
                    value={formData.branch_id}
                    onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">-- Assign to Branch --</option>
                    {shops.map(shop => (
                      <option key={shop.id} value={shop.id}>{shop.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Employee'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Employees List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No employees yet. Add your first team member to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {employee.name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4" />
                      <span className="capitalize">{employee.role}</span>
                    </div>
                  </div>
                  {/* Show User Code if they haven't claimed profile yet */}
                  {employee.user_code ? (
                    <div className="mt-2 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded inline-block">
                      Code: <span className="font-mono font-bold">{employee.user_code}</span>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded inline-block">
                      Joined
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EmployeesPage;
