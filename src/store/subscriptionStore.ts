import { create } from 'zustand';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { SubscriptionState, SUBSCRIPTION_PLANS, UsageStats } from '../types/subscription';
import { useAuthStore } from './authStore';

const initializeUsageStats = (): UsageStats => ({
  scriptAnalysis: 0,
  videoAnalysis: 0,
  coCreate: 0,
  periodStart: new Date(),
  periodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1))
});

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  currentPlan: SUBSCRIPTION_PLANS[0],
  usage: initializeUsageStats(),
  loading: false,
  error: null,

  updateSubscription: async (plan) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ error: 'User must be logged in to update subscription' });
      return;
    }

    try {
      set({ loading: true, error: null });
      
      // Update user profile with new subscription
      await updateDoc(doc(db, 'users', user.uid), {
        subscriptionTier: plan.id
      });

      // Initialize usage stats if they don't exist
      const usageRef = doc(db, 'usage', user.uid);
      const usageDoc = await getDoc(usageRef);
      
      if (!usageDoc.exists()) {
        await setDoc(usageRef, initializeUsageStats());
      }

      set({
        currentPlan: plan,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      set({ 
        error: 'Failed to update subscription. Please try again.',
        loading: false 
      });
    }
  },

  trackUsage: async (tool) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ error: 'User must be logged in to track usage' });
      return;
    }

    try {
      set({ loading: true, error: null });
      const usageRef = doc(db, 'usage', user.uid);
      
      // Get current usage or initialize if it doesn't exist
      const usageDoc = await getDoc(usageRef);
      const currentUsage = usageDoc.exists() 
        ? usageDoc.data() as UsageStats
        : initializeUsageStats();

      const updatedUsage = {
        ...currentUsage,
        [tool]: (currentUsage[tool] || 0) + 1
      };

      await setDoc(usageRef, updatedUsage);
      set({ 
        usage: updatedUsage, 
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error tracking usage:', error);
      set({ 
        error: 'Failed to track usage. Please try again.',
        loading: false 
      });
    }
  },

  canUseService: (tool) => {
    const { currentPlan, usage } = get();
    return (usage[tool] || 0) < currentPlan.generationsPerTool;
  },

  resetError: () => set({ error: null })
}));

// Initialize subscription data when auth state changes
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    useSubscriptionStore.setState({
      currentPlan: SUBSCRIPTION_PLANS[0],
      usage: initializeUsageStats(),
      error: null
    });
    return;
  }

  try {
    // Get user's subscription data
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === userData.subscriptionTier) || SUBSCRIPTION_PLANS[0];
      
      // Get or initialize usage stats
      const usageRef = doc(db, 'usage', user.uid);
      const usageDoc = await getDoc(usageRef);
      
      if (!usageDoc.exists()) {
        await setDoc(usageRef, initializeUsageStats());
      }

      useSubscriptionStore.setState({ 
        currentPlan: plan,
        usage: usageDoc.exists() ? usageDoc.data() as UsageStats : initializeUsageStats(),
        error: null
      });
    }
  } catch (error) {
    console.error('Error initializing subscription data:', error);
    useSubscriptionStore.setState({ 
      error: 'Failed to load subscription data',
      loading: false 
    });
  }
});