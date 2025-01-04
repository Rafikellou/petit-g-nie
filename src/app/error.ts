export interface AppError extends Error {
  digest?: string;
  message: string;
}

export interface ErrorLog {
  message: string;
  stack?: string;
  digest?: string;
  timestamp: string;
}
