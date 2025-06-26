import { useQuery } from '@tanstack/react-query';
import { fetchExamples } from '../api/example';

export const useExample = () => {
  return useQuery({ queryKey: ['example'], queryFn: fetchExamples });
};
