import { useEffect, useState } from 'react';
import ChatLayout from './components/chat/ChatLayout';
import LoginPage, { type LoginUser } from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import { navigate, usePathname } from './lib/navigation';
import { SessionExpiredError } from './services/apiClient';
import { authApi } from './services/authApi';

export default function App() {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    void authApi.currentUser().then(({ user: currentUser }) => {
      if (active) setUser(currentUser);
    }).catch((error: unknown) => {
      if (active && !(error instanceof SessionExpiredError)) {
        console.error('Could not restore the authenticated session.', error);
      }
    }).finally(() => {
      if (active) setIsCheckingSession(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (isCheckingSession) return;
    if (user && pathname !== '/chat') navigate('/chat', true);
    else if (!user && pathname === '/chat') navigate('/login', true);
  }, [isCheckingSession, pathname, user]);

  if (isCheckingSession) {
    return <main className="grid min-h-screen place-items-center bg-[#F8FAFC]" role="status"><span className="h-8 w-8 animate-spin border-[3px] border-slate-200 border-t-[#2563EB]" /><span className="sr-only">Restoring your session</span></main>;
  }

  if (user) {
    return <ChatLayout user={user} onSessionExpired={() => { setUser(null); navigate('/login', true); }} onLogout={() => { setUser(null); navigate('/login', true); }} />;
  }

  if (pathname === '/register') {
    return <RegisterPage onRegistered={() => navigate('/login', true)} />;
  }

  return <LoginPage onLoginSuccess={(authenticatedUser) => { setUser(authenticatedUser); navigate('/chat', true); }} />;
}
