import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import type { DecodedToken } from "../types/DecodedToken";
import { auth } from "../firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  role: string | null;
}


const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  login: async () => { },
  logout: async () => { },
  loginWithGoogle: function (): Promise<void> {
    throw new Error("Function not implemented.");
  }
});



export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const decoded = jwtDecode<DecodedToken>(token);
        setRole(decoded.role);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loginWithGoogle, role }}>
      {children}
    </AuthContext.Provider>

  );
};
