export interface LoginCredentials {
  email: string;
  password: string;
}

// export interface RegisterCredentials extends LoginCredentials {

// }

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
