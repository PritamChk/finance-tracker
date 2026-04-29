import { useQuery, useQueryClient } from '@tanstack/react-query';
import authService, { type User } from '../services/auth.service';

const useAuth = () => {
  const queryClient = useQueryClient();
  const query = useQuery<User>({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    throwOnError: false,
  });

  const clearAuth = () => {
    queryClient.removeQueries({ queryKey: ['user'] });
  };

  return { ...query, clearAuth };
};

export default useAuth;
