export interface ResponseActionTypes<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}
