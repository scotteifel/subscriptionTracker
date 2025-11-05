import type { BillingCycle } from '@/types/subscription';

export function calculateMonthlyCost(amount: number, billingCycle: BillingCycle): number {
  switch (billingCycle) {
    case 'weekly':
      return amount * 4.33; // Average weeks per month
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'yearly':
      return amount / 12;
    default:
      return 0;
  }
}

export function calculateYearlyCost(amount: number, billingCycle: BillingCycle): number {
  return calculateMonthlyCost(amount, billingCycle) * 12;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getTotalMonthlyCost(subscriptions: Array<{ amount: number; billing_cycle: BillingCycle; is_active: boolean }>): number {
  return subscriptions
    .filter(sub => sub.is_active)
    .reduce((total, sub) => total + calculateMonthlyCost(sub.amount, sub.billing_cycle), 0);
}

export function getTotalYearlyCost(subscriptions: Array<{ amount: number; billing_cycle: BillingCycle; is_active: boolean }>): number {
  return getTotalMonthlyCost(subscriptions) * 12;
}
