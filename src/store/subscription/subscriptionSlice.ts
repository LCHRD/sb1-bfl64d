import { StateCreator } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { SubscriptionState, SUBSCRIPTION_PLANS } from '../../types/subscription';
import { getUsageStats, initializeUsageStats, updateUsageStats } from '../../utils/db';

export const createSubscriptionSlice: StateCreator<SubscriptionState> = (set, get) => ({
  currentPlan: SUBSCRIPTION_PLANS[0],
  usage: {
    scriptAnalysis: 0,
    videoAnalysis: 0,
    coCreate: 0,
    periodStart: new Date(),
    periodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1))
  },
  loading: false,
  error: null,

  updateSubscription: async (plan) => {
    const { user } = get();
    if (!user?.uid) return;

    try {
      set({ loading: true, error: null });
      await updateUsageStats(user.uid, { subscriptionTier: plan.id });
      set({ currentPlan: plan, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  trackUsage: async (tool) => {
    const { user } = get();
    if (!user?.uid) return;

    try {
      set({ loading: true, error: null });
      const stats = await getUsageStats(user.uid);
      const updatedStats = {
        ...stats,
        [tool]: (stats[tool] || 0) + 1
      };
      await updateUsageStats(user.uid, updatedStats);
      set({ usage: updatedStats, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  canUseService: (tool) => {
    const { currentPlan, usage } = get();
    return (usage[tool] || 0) < currentPlan.generationsPerTool;
  },

  resetError: () => set({ error: null })
});