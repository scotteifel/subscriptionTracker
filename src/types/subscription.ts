export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly';

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  billing_cycle: BillingCycle;
  next_billing_date: Date;
  category?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionFormData {
  name: string;
  description?: string;
  amount: number;
  currency: string;
  billing_cycle: BillingCycle;
  next_billing_date: Date;
  category?: string;
}

export const SUBSCRIPTION_CATEGORIES = [
  'Entertainment',
  'Software',
  'Health & Fitness',
  'Education',
  'Cloud Storage',
  'Music',
  'Gaming',
  'News',
  'Other',
] as const;

export type SubscriptionCategory = typeof SUBSCRIPTION_CATEGORIES[number];
