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

      let userData: UserProfile;

      if (!userDoc.exists()) {
        // Create user document in Firestore
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? "",
          role: "admin", // Give admin role to new users for testing
          allowedPaths: ["admin"], // Allow access to admin area
        };

        // Save user document to Firestore
        await setDoc(doc(db, "users", firebaseUser.uid), userData);
      } else {
        const raw = userDoc.data();
        userData = {
          uid: firebaseUser.uid,
          email: raw.email ?? firebaseUser.email ?? "",
          role: raw.role ?? "partial",
          allowedPaths: Array.isArray(raw.allowedPaths) ? raw.allowedPaths : [],
        };
      }
      return userData;
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific Firebase Auth errors
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            throw new Error("No user found with this email address");
          case 'auth/wrong-password':
            throw new Error("Incorrect password");
          case 'auth/invalid-email':
            throw new Error("Invalid email address");
          case 'auth/user-disabled':
            throw new Error("This user account has been disabled");
          case 'auth/too-many-requests':
            throw new Error("Too many failed attempts. Please try again later");
          case 'auth/network-request-failed':
            throw new Error("Network error. Please check your connection");
          default:
            throw new Error(`Authentication failed: ${error.message}`);
        }
      }

      throw new Error(`Login failed: ${error.message || error}`);
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
