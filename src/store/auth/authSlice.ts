import { StateCreator } from 'zustand';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { AuthSlice } from './authTypes';
import { UserProfile } from '../../types/user';

const googleProvider = new GoogleAuthProvider();

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      set({ user: userDoc.data() as UserProfile, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        const newUser: UserProfile = {
          uid: result.user.uid,
          email: result.user.email!,
          username: '',
          firstName: '',
          useCase: 'marketing',
          interests: [],
          subscriptionTier: 'free',
          createdAt: new Date()
        };
        
        await setDoc(doc(db, 'users', result.user.uid), newUser);
        set({ user: newUser, loading: false });
        return;
      }

      set({ user: userDoc.data() as UserProfile, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signUp: async (userData) => {
    try {
      set({ loading: true, error: null });
      const result = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        useCase: userData.useCase,
        interests: userData.interests,
        subscriptionTier: 'free',
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', result.user.uid), userProfile);
      set({ user: userProfile, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, loading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No user logged in');

      set({ loading: true, error: null });
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, data);
      
      const updatedDoc = await getDoc(userRef);
      if (!updatedDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      set({ 
        user: updatedDoc.data() as UserProfile,
        loading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  clearError: () => set({ error: null })
});