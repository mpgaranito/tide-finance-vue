import * as React from "react";

export interface UseApiState<T> {
  readonly data?: T;
  readonly loading: boolean;
  readonly error?: string;
}

export function useApi<T>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  deps: React.DependencyList = []
): UseApiState<T> {
  const [state, setState] = React.useState<UseApiState<T>>({
    loading: true,
  });

  React.useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      const result = await apiCall();
      if (mounted) {
        setState({
          data: result.data,
          loading: false,
          error: result.error,
        });
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
  }, deps);

  return state;
}
