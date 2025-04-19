export type FirestoreQueryState<T> = {
  data: T | null | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
};

export type FirestoreQueryAction<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; payload: string };
