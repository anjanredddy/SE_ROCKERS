import { toast } from 'react-toastify';

export const handleAxiosError = (error) => {
  let errorMessage = 'An error occurred. Please try again.';

  if (error.response) {
    // Server responded with error
    if (error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.status === 401) {
      errorMessage = 'Session expired. Please login again.';
      // Optionally trigger logout here
    } else if (error.response.status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (error.response.status === 404) {
      errorMessage = 'Resource not found.';
    } else if (error.response.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }
  } else if (error.request) {
    // Request made but no response
    errorMessage = 'Unable to connect to server. Please check your internet connection.';
  }

  toast.error(errorMessage);
  return errorMessage;
};

export const showSuccess = (message) => {
  toast.success(message);
};

export const showInfo = (message) => {
  toast.info(message);
};

export const showWarning = (message) => {
  toast.warning(message);
};
