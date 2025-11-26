import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEY } from '../utils/constants.js';
import client from '../api/client.js';

let currentAuth = null;
export function getAuth() {
  return currentAuth;
}

const AuthContext = createContext({
  user: null,
  email: null,
  password: null,
  login: async () => {},
  logout: () => {},
  loading: false,
  setUser: () => {}
});

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load persisted credentials (email+password stored if remember=true)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email && parsed.password) {
          setEmail(parsed.email);
          setPassword(parsed.password);
          currentAuth = { email: parsed.email, password: parsed.password };
        }
      } catch {
        // ignore
      }
    }
  }, []);

  async function login({ email: e, password: p, remember }) {
    setLoading(true);
    try {
      // Temporarily set provided creds so axios interceptor attaches Authorization
      const prev = currentAuth;
      currentAuth = { email: e, password: p };

      // Probe a protected endpoint with an invalid body.
      // If creds are valid -> server responds 400 VALIDATION_ERROR.
      // If creds are invalid -> server responds 401/403.
      let authorized = false;
      try {
        await client.post('/reports', {}); // unexpected 2xx, still consider authorized
        authorized = true;
      } catch (err) {
        const code = err?.error || err?.code;
        const status = err?.status || err?.statusCode;
        const message = err?.message || '';
        if (code === 'VALIDATION_ERROR' || status === 400 || /validation/i.test(message)) {
          authorized = true; // credentials accepted, body invalid
        } else {
          authorized = false;
        }
      }

      if (!authorized) {
        currentAuth = prev;
        throw new Error('Invalid email or password');
      }

      // Persist credentials
      setEmail(e);
      setPassword(p);
      if (remember) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: e, password: p }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      setUser({ Email: e });
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    currentAuth = null;
    setEmail(null);
    setPassword(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = {
    user,
    email,
    password,
    login,
    logout,
    loading,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}