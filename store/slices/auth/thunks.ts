import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { apiAuthLogin, apiPasswordForgetConfirm } from '../../../utils/apis';

// The function below is called a thunk and allows us to perform async logic.
export const authLogin = createAppAsyncThunk(
  'accountInfo/authLogin',
  async (data: { email: string; password: string }) => {
    const response = await apiAuthLogin(data);

    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);

export const authResetPassword = createAppAsyncThunk(
  'accountInfo/resetPassword',
  async (data: { password: string; token: string }) => {
    const response = await apiPasswordForgetConfirm(data);

    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);
