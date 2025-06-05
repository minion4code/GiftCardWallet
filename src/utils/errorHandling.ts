import { Alert } from 'react-native';

export type ErrorType = 
  | 'NETWORK_ERROR'
  | 'STORAGE_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

interface ErrorConfig {
  title: string;
  message: string;
  action?: () => void;
}

const ERROR_MESSAGES: Record<ErrorType, ErrorConfig> = {
  NETWORK_ERROR: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
  },
  STORAGE_ERROR: {
    title: 'Storage Error',
    message: 'Unable to save your data. Please try again.',
  },
  VALIDATION_ERROR: {
    title: 'Invalid Input',
    message: 'Please check your input and try again.',
  },
  UNKNOWN_ERROR: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
};

export const handleError = (
  error: Error | unknown,
  type: ErrorType = 'UNKNOWN_ERROR',
  customMessage?: string
) => {
  console.error(`[${type}]`, error);

  const errorConfig = ERROR_MESSAGES[type];
  
  Alert.alert(
    errorConfig.title,
    customMessage || errorConfig.message,
    [
      {
        text: 'OK',
        style: 'default',
      },
      ...(errorConfig.action ? [{
        text: 'Retry',
        onPress: errorConfig.action,
      }] : []),
    ]
  );
};

export const isNetworkError = (error: any): boolean => {
  return error?.message?.includes('Network Error') || 
         error?.message?.includes('network') ||
         error?.message?.includes('timeout');
};

export const isStorageError = (error: any): boolean => {
  return error?.message?.includes('storage') ||
         error?.message?.includes('AsyncStorage');
}; 