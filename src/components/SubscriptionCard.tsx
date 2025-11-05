'use client';

import { Trash2, Edit2, Calendar } from 'lucide-react';
import { formatCurrency, calculateMonthlyCost } from '@/utils/calculations';
import { format } from 'date-fns';

interface SubscriptionCardProps {
  id: string;
  name: string;
  description?: string | null;
  amount: number;
  currency: string | null;
  billing_cycle: string;
  next_billing_date: string;
  category?: string | null;
  is_active: boolean | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SubscriptionCard({
  id,
  name,
  description,
  amount,
  currency,
  billing_cycle,
  next_billing_date,
  category,
  is_active,
  onEdit,
  onDelete,
}: SubscriptionCardProps) {
  const monthlyCost = calculateMonthlyCost(amount, billing_cycle);
  const formattedDate = format(new Date(next_billing_date), 'MMM dd, yyyy');

  const billingCycleDisplay: Record<string, string> = {
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {name}
          </h3>
          {category && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded">
              {category}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(id)}
            className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition"
            title="Edit subscription"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition"
            title="Delete subscription"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {billingCycleDisplay[billing_cycle]}
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(amount, currency || 'USD')}
          </span>
        </div>

        <div className="flex items-baseline justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Monthly equivalent</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {formatCurrency(monthlyCost, currency || 'USD')}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Next billing: <span className="font-medium text-gray-900 dark:text-white">{formattedDate}</span>
          </span>
        </div>
      </div>

      {!is_active && (
        <div className="mt-4 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-400 text-center">
          Inactive
        </div>
      )}
    </div>
  );
}
