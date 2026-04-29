import { useQuery } from '@tanstack/react-query';
import authService, { type User } from '../services/auth.service';

export const useAuth = () => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    retry: false,
  });
};
