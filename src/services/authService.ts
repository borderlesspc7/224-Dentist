import { auth, db, app } from "../lib/firebaseconfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type Unsubscribe,
} from "firebase/auth";
import { getAuth as getAuthFromApp } from "firebase/auth";
import { initializeApp, deleteApp } from "firebase/app";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type {
  LoginCredentials,
  RegisterCredentials,
  UserProfile,
} from "../types/user";

export const authService = {
  async logOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error("Failed to log out" + error);
    }
  },

  async login(credentials: LoginCredentials): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      const raw = userDoc.data();
      const userData: UserProfile = {
        uid: firebaseUser.uid,
        email: raw.email ?? firebaseUser.email ?? "",
        role: raw.role ?? "partial",
        allowedPaths: Array.isArray(raw.allowedPaths) ? raw.allowedPaths : [],
      };
      return userData;
    } catch (error) {
      throw new Error("Failed to login" + error);
    }
  },

  async register(credentials: RegisterCredentials): Promise<UserProfile> {
    const name = `secondary-${Date.now()}`; // Unique name for secondary app
    const secondaryApp = initializeApp(app.options, name);
    const secondaryAuth = getAuthFromApp(secondaryApp);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        credentials.email,
        credentials.password
      );
      const firebaseUser = userCredential.user;

      // Create user profile without password
      const userData: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? credentials.email,
        displayName: credentials.displayName,
        role: credentials.role,
        allowedPaths: credentials.allowedPaths || [],
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userData);
      return userData;
    } catch (error) {
      throw new Error(
        "Failed to register: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      // Ensure secondary app is signed out and deleted
      await signOut(secondaryAuth).catch(() => undefined);
      await deleteApp(secondaryApp).catch(() => undefined);
    }
  },

  observeAuthState(callback: (user: UserProfile | null) => void): Unsubscribe {
    try {
      return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Usuário está logado, busca dados completos no Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserProfile;
              callback(userData);
            } else {
              callback(null); // Usuário não encontrado no Firestore
            }
          } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            callback(null);
          }
        } else {
          // Usuário não está logado
          callback(null);
        }
      });
    } catch (error) {
      throw new Error("Erro ao observar estado de autenticação: " + error);
    }
  },
};
