import { create } from 'zustand';
import { AuthSlice } from './auth/authTypes';
import { SubscriptionState } from '../types/subscription';
import { createAuthSlice } from './auth/authSlice';
import { createSubscriptionSlice } from './subscription/subscriptionSlice';

interface RootState extends AuthSlice, SubscriptionState {}

export const useStore = create<RootState>()((...args) => ({
  ...createAuthSlice(...args),
  ...createSubscriptionSlice(...args)
}));