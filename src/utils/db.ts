import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, collections } from '../config/firebase';
import { UserProfile } from '../types/user';
import { UsageStats } from '../types/subscription';

export async function createUserProfile(userId: string, data: UserProfile) {
  try {
    await setDoc(doc(db, collections.users, userId), {
      ...data,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
}

export async function initializeUsageStats(userId: string) {
  try {
    const initialStats: UsageStats = {
      scriptAnalysis: 0,
      videoAnalysis: 0,
      coCreate: 0,
      periodStart: new Date(),
      periodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1))
    };
    
    await setDoc(doc(db, collections.usage, userId), initialStats);
    return initialStats;
  } catch (error) {
    console.error('Error initializing usage stats:', error);
    throw new Error('Failed to initialize usage stats');
  }
}

export async function getUserProfile(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, collections.users, userId));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  try {
    await updateDoc(doc(db, collections.users, userId), data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

export async function getUsageStats(userId: string) {
  try {
    const usageDoc = await getDoc(doc(db, collections.usage, userId));
    if (!usageDoc.exists()) {
      return await initializeUsageStats(userId);
    }
    return usageDoc.data() as UsageStats;
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    throw new Error('Failed to fetch usage stats');
  }
}

export async function updateUsageStats(userId: string, data: Partial<UsageStats>) {
  try {
    await updateDoc(doc(db, collections.usage, userId), data);
  } catch (error) {
    console.error('Error updating usage stats:', error);
    throw new Error('Failed to update usage stats');
  }
}