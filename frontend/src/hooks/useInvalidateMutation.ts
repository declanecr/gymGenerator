import { useMutation, useQueryClient, UseMutationOptions, QueryKey } from '@tanstack/react-query';

// custom type guard
function isQueryKeyArray(x: QueryKey | QueryKey[]): x is QueryKey[] {
  return Array.isArray(x);
}

/**
 * Wrapper around useMutation that invalidates provided query keys on success.
 * Allows keeping mutation hooks concise and consistent.
 */
export function useInvalidateMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: (vars: TVariables) => Promise<TData>,
  getKeys:   (vars: TVariables, data: TData) => QueryKey | QueryKey[],
  // ⚠️ only omit `mutationFn` here:
  options?:  Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>
) {
  const qc = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    ...options,
    onSuccess(data, variables, context) {

      // 1. run getKeys
      const rawKeys = getKeys(variables, data);
      const keys = isQueryKeyArray(rawKeys)
        ? rawKeys
        : [rawKeys];

      // 2. invalidate each one
      keys.forEach(key => 
        qc.invalidateQueries({ queryKey: key })
      );

      // 3. finally chain the user’s onSuccess
      return options?.onSuccess?.(data, variables, context);
    },
  });
}