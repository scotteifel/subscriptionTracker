'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Here you could verify the session with Stripe and update user's pro status in database
    console.log('Checkout session ID:', sessionId);
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Pro!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your subscription has been activated successfully. You now have access to:
        </p>
        <ul className="text-left text-gray-700 dark:text-gray-300 mb-8 space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
            Analytics Dashboard with visual charts
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
            SMS notifications 2 days before renewals
          </li>
        </ul>
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <ProtectedRoute>
      <SuccessContent />
    </ProtectedRoute>
  );
}
