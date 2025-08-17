import { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useAuthGuard(requiredRole) {
  const { user } = useContext(AuthContext);
  const ok = useMemo(() => {
    if (!user) return false;
    if (!requiredRole) return true;
    return user.role === requiredRole || (Array.isArray(requiredRole) && requiredRole.includes(user.role));
  }, [user, requiredRole]);

  return { user, ok };
}
