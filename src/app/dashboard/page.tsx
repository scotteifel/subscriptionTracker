'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import SubscriptionCard from '@/components/SubscriptionCard';
import { useRouter } from 'next/navigation';
import { Plus, Crown, BarChart3, MessageSquare } from 'lucide-react';
import { getSubscriptions, createSubscription, deleteSubscription } from '@/lib/subscriptions';
import { getTotalMonthlyCost, getTotalYearlyCost, formatCurrency } from '@/utils/calculations';
import type { Database } from '@/types/database';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

function DashboardContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      const data = await getSubscriptions(user!.id);
      setSubscriptions(data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async (formData: any) => {
    await createSubscription({
      ...formData,
      user_id: user!.id,
    });
    await loadSubscriptions();
  };

  const handleDeleteSubscription = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      await deleteSubscription(id);
      await loadSubscriptions();
    }
  };

  const handleEditSubscription = (_id: string) => {
    // TODO: Implement edit functionality
    alert('Edit functionality coming soon!');
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleUpgradeToPro = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user!.id,
          email: user!.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const activeSubscriptions = subscriptions.filter(sub => sub.is_active);
  const monthlyCost = getTotalMonthlyCost(activeSubscriptions);
  const yearlyCost = getTotalYearlyCost(activeSubscriptions);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pro Upgrade Banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Crown size={28} />
                <h2 className="text-2xl font-bold">Upgrade to Pro</h2>
              </div>
              <p className="text-indigo-100 mb-4">
                Unlock powerful features to help you understand your subscription costs
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <div className="flex items-start gap-3">
                  <BarChart3 size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Analytics Dashboard</h3>
                    <p className="text-sm text-indigo-100">Visual charts and spending insights</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">SMS Notifications</h3>
                    <p className="text-sm text-indigo-100">Get reminders 2 days before renewals</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleUpgradeToPro}
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition shadow-md"
              >
                Upgrade Now - $4.99/month
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Total Subscriptions
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeSubscriptions.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Monthly Cost
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(monthlyCost)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Yearly Cost
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(yearlyCost)}
            </p>
          </div>
        </div>

        {/* Add Subscription Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Subscriptions
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            <Plus size={20} />
            Add Subscription
          </button>
        </div>

        {/* Subscriptions Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading subscriptions...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No subscriptions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by adding your first subscription!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              <Plus size={20} />
              Add Your First Subscription
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                {...sub}
                onEdit={handleEditSubscription}
                onDelete={handleDeleteSubscription}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Subscription Modal */}
      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSubscription}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
