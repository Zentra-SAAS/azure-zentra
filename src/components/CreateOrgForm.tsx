import React, { useState } from 'react';
import { azureApi } from '../lib/api';
import { Loader2, ArrowRight } from 'lucide-react';

interface CreateOrgFormProps {
    userId: string;
}

export const CreateOrgForm: React.FC<CreateOrgFormProps> = ({ userId }) => {
    const [orgName, setOrgName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orgName.trim()) return;
        setLoading(true);
        setError('');
        try {
            const { error } = await azureApi.createShop(orgName);
            if (error) throw new Error(error);
            window.location.reload();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create organization. Please try again.';
            console.error('Error creating organization:', err);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleCreateOrg} className="max-w-md mx-auto">
            <div className="space-y-4">
                <div>
                    <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Organization Name
                    </label>
                    <input
                        id="orgName"
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="e.g. My Awesome Business"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading || !orgName.trim()}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium rounded-lg disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <span>Create Organization</span>
                            <ArrowRight className="h-5 w-5" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};
