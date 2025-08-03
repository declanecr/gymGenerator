import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../api/users';
import { useAuth } from '../useAuth';

export function useGetMe() {
  const {isAuthenticated} =useAuth();
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: isAuthenticated, // only runs when the token is valid
  });
}