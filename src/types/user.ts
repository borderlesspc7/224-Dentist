export interface LoginCredentials {
  email: string;
  password: string; // Mantém obrigatório para login
}

export interface RegisterCredentials {
  email: string;
  password: string; // Mantém obrigatório para criar usuário
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
  // Não inclui password aqui - nunca salva no Firestore
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
