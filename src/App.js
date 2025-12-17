import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import AppRouter from './router/AppRouter.jsx';
import NavBar from './components/NavBar.jsx';
import ToastStack from './components/ToastStack.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <NavBar />
          <AppRouter />
          <ToastStack />
          <footer className="footer">HopShare © {new Date().getFullYear()} • Carpooling made simple</footer>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

