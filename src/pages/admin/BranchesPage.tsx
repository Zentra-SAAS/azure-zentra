import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Trash2, MapPin, Users, Loader2, AlertCircle } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  manager_id: string;
  created_at: string;
}

const BranchesPage: React.FC = () => {
  const { user, logout, loading, isOwner } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loading && (!user || !isOwner)) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (user?.id) {
      fetchBranches();
    }
  }, [user?.id]);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('shops')
        .select('id, name, manager_id, created_at')
        .eq('manager_id', user?.id);

      if (err) throw err;
      setBranches(data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error: err } = await supabase
        .from('shops')
        .insert({
          name: formData.name,
          manager_id: user?.id
        });

      if (err) throw err;

      setFormData({ name: '' });
      setShowForm(false);
      await fetchBranches();
    } catch (err) {
      console.error('Error adding branch:', err);
      setError('Failed to add branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      return;
    }

    try {
      const { error: err } = await supabase
        .from('shops')
        .delete()
        .eq('id', branchId);

      if (err) throw err;
      await fetchBranches();
    } catch (err) {
      console.error('Error deleting branch:', err);
      setError('Failed to delete branch');
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
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout onLogout={logout} userName={user.name} orgName={user.organization?.name}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Branches / Locations
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage your shop locations and branches
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Branch</span>
          </button>
        </div>

        {/* Add Branch Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Branch
            </h2>
            <form onSubmit={handleAddBranch} className="space-y-4">
              <input
                type="text"
                placeholder="Branch Name (e.g., Downtown Store, Airport Mall)"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Branch'}
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

        {/* Branches List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : branches.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No branches yet. Create your first location to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <button
                    onClick={() => handleDeleteBranch(branch.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {branch.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>Created {new Date(branch.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BranchesPage;
