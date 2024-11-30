import { create } from 'zustand';
import { createAuthSlice } from './authSlice';
import { AuthSlice } from './authTypes';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

export const useAuthStore = create<AuthSlice>()((...args) => ({
  ...createAuthSlice(...args)
}));

// Initialize auth state listener
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    useAuthStore.setState({ user: null, loading: false });
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      useAuthStore.setState({ 
        user: userDoc.data() as AuthSlice['user'],
        loading: false 
      });
    } else {
      useAuthStore.setState({ 
        error: 'User profile not found',
        loading: false 
      });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    useAuthStore.setState({ 
      error: 'Failed to load user data',
      loading: false 
    });
  }
});

export type { AuthSlice };