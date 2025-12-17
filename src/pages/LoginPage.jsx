import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../utils/validators.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: process.env.REACT_APP_DEMO_EMAIL || '',
      password: process.env.REACT_APP_DEMO_PASSWORD || '',
      remember: true
    }
  });

  async function onSubmit(values) {
    const res = await login(values);
    if (res.success) {
      toast.push('success', 'Logged in');
      navigate('/');
    } else {
      toast.push('error', 'Login failed');
    }
  }

  return (
    <div className="container">
      <div className="panel" style={{ maxWidth: 420, margin: '0 auto' }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label>Email
            <input type="email" {...register('email')} />
            {errors.email && <div className="form-error">{errors.email.message}</div>}
          </label>
          <div className="spacer" />
          <label>Password
            <input type="password" {...register('password')} />
            {errors.password && <div className="form-error">{errors.password.message}</div>}
          </label>
          <div className="spacer" />
            <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <input type="checkbox" {...register('remember')} /> Remember
            </label>
          <div className="spacer" />
          <button disabled={loading} type="submit">{loading ? 'Loading...' : 'Login'}</button>
        </form>
        <p style={{ marginTop: '0.75rem', fontSize: '.8rem' }}>
          Demo user: {process.env.REACT_APP_DEMO_EMAIL || ''} / {process.env.REACT_APP_DEMO_PASSWORD || ''}
        </p>
      </div>
    </div>
  );
}

