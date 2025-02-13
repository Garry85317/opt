import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

export const API_UNAUTHORIZED_EVENT = 'api-unauthorized';
export const API_ERROR_EVENT = 'api-error';

declare global {
  interface DocumentEventMap {
    [API_UNAUTHORIZED_EVENT]: CustomEvent;
    [API_ERROR_EVENT]: CustomEvent;
  }
}

type ErrorResponse = {
  message?: string;
  version?: string;
};

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError) => {
  if (!('data' in error)) {
    return 'error' in error ? error.error : 'message' in error ? error.message : '';
  }
  let errorMessage: string | undefined = '';
  if (typeof error.data === 'string') {
    try {
      errorMessage = JSON.parse(error.data).message;
    } catch (e) {}
  } else {
    errorMessage = (error.data as ErrorResponse).message;
  }
  return errorMessage;
};

export const getErrorStatus = (responseError: FetchBaseQueryError | SerializedError) => {
  if (!('data' in responseError)) {
    return;
  }
  return responseError.status;
};

export const makeAPIErrorEvent = (name: string, message?: string) => {
  return new CustomEvent(name, {
    detail: {
      message: message || 'Unknown error',
    },
  });
};

export const dispatchErrorEvent = (error: FetchBaseQueryError, eventName: string) => {
  document.dispatchEvent(makeAPIErrorEvent(eventName, getErrorMessage(error)));
};
