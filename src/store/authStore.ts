import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AuthState, SignUpData, UserProfile } from '../types/user';

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      const userData = userDoc.data() as UserProfile;
      set({ user: userData, loading: false });
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

      const userData = userDoc.data() as UserProfile;
      set({ user: userData, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signUp: async (userData: SignUpData) => {
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

  updateProfile: async (data: Partial<UserProfile>) => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error('No user logged in');

      set({ loading: true, error: null });
      await updateDoc(doc(db, 'users', currentUser.uid), data);
      set({ 
        user: { ...currentUser, ...data },
        loading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));

// Listen to auth state changes
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    useAuthStore.setState({ user: null, loading: false });
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      useAuthStore.setState({ 
        user: userDoc.data() as UserProfile,
        loading: false 
      });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    useAuthStore.setState({ 
      error: 'Error fetching user data',
      loading: false 
    });
  }
});