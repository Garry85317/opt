import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { apiChangePassword } from '../../../utils/apis';
import {} from './selectors';

//TODO: rtk query is also written in store/auth
export const userChangePassword = createAppAsyncThunk(
  'OMSuser/changePassword',
  async (data: { oldPassword: string; newPassword: string }, props) => {
    const { token } = props.getState().auth;
    const res = await apiChangePassword({ ...data }, token);
    console.log('userChangeToken', token);
    return res.data;
  },
);
