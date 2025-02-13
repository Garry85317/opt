import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { apiOrganizationsUsersPassword } from '../../../utils/apis';

// The function below is called a thunk and allows us to perform async logic.
export const organizationsUsersPassword = createAppAsyncThunk(
  'organization/authLogin',
  async (data: { token: string; password: string }) => {
    const response = await apiOrganizationsUsersPassword(data);

    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);
