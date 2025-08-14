export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  displayName: string;
  role: "admin" | "partial";
  allowedPaths?: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "partial";
  allowedPaths?: string[];
}
export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
