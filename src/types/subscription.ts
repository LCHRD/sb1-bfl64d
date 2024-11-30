import { UserProfile } from './user';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  generationsPerTool: number;
}

export interface UsageStats {
  scriptAnalysis: number;
  videoAnalysis: number;
  coCreate: number;
  periodStart: Date;
  periodEnd: Date;
}

export interface SubscriptionState {
  currentPlan: SubscriptionPlan;
  usage: UsageStats;
  loading: boolean;
  error: string | null;
  updateSubscription: (plan: SubscriptionPlan) => Promise<void>;
  trackUsage: (tool: keyof UsageStats) => Promise<void>;
  canUseService: (tool: keyof UsageStats) => boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '5 generations per tool',
      'Basic analysis metrics',
      'Standard support'
    ],
    generationsPerTool: 5
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    features: [
      '20 generations per tool',
      'All analysis metrics',
      'Email support',
      'History access'
    ],
    generationsPerTool: 20
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 7.99,
    features: [
      '10,000 generations per tool',
      'Advanced analytics',
      'Priority support',
      'Custom templates',
      'Team collaboration'
    ],
    generationsPerTool: 10000
  }
];