import { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEY } from '../utils/constants.js';
import client from '../api/client.js';
import { listUsers } from '../api/users.js';

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
  const [user, setUser] = useState(null); // full user object with UserID
  const [loading, setLoading] = useState(false);

  // Attempt to hydrate user object (UserID) if we have credentials but not user yet
  async function hydrateUserByEmail(e) {
    if (!e) return;
    try {
      const all = await listUsers(); // returns array of users
      const found = (all || []).find(u => u.Email?.toLowerCase() === e.toLowerCase());
      if (found) {
        setUser(found);
        return found;
      }
    } catch {
      // silent; pages will retry
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email && parsed.password) {
          setEmail(parsed.email);
          setPassword(parsed.password);
          currentAuth = { email: parsed.email, password: parsed.password };
          // Hydrate user object asynchronously
          hydrateUserByEmail(parsed.email);
        }
      } catch {
        // ignore corrupt storage
      }
    }
  }, []);

  async function login({ email: e, password: p, remember }) {
    setLoading(true);
    try {
      // Temporarily set credentials for authorization probe
      const prev = currentAuth;
      currentAuth = { email: e, password: p };

      // Probe a protected endpoint (expects Basic Auth)
      let authorized = false;
      try {
        await client.post('/reports', {}); // will likely produce validation error but indicates auth ok
        authorized = true;
      } catch (err) {
        const code = err?.error || err?.code;
        const status = err?.status || err?.statusCode;
        const message = err?.message || '';
        if (code === 'VALIDATION_ERROR' || status === 400 || /validation/i.test(message)) {
          authorized = true;
        }
      }

      if (!authorized) {
        currentAuth = prev;
        throw new Error('Invalid email or password');
      }

      setEmail(e);
      setPassword(p);
      if (remember) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: e, password: p }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }

      // Fetch and store the full user object (with UserID) so nested endpoints work
      const hydrated = await hydrateUserByEmail(e);
      if (!hydrated) {
        // If user not found, keep minimal object; creation of user might be required before nested ops.
        setUser({ Email: e });
      }
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

