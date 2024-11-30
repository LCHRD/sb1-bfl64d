export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  firstName: string;
  useCase: UseCase;
  interests: string[];
  subscriptionTier: SubscriptionTier;
  createdAt: Date;
}

export type UseCase = 
  | 'marketing'
  | 'short_form_social'
  | 'long_form_social'
  | 'blogging'
  | 'journalism'
  | 'school'
  | 'digital_essays';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  useCase: UseCase;
  interests: string[];
}