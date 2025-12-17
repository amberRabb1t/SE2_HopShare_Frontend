import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext.jsx';

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

test('login stores credentials', async () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  await act(async () => {
    await result.current.login({ email: 'test@example.com', password: 'pw', remember: false });
  });
  expect(result.current.email).toBe('test@example.com');
  expect(result.current.password).toBe('pw');
});

