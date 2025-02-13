import { useDispatch, useSelector } from '../store';
import {
  useGuardianConfirmStatusMutation,
  useSendGuardianConfirmMutation,
} from '../store/services';
import { selectGuardianStatus } from '../store/slices/guardian/selectors';
import { closeGuardian } from '../store/slices';

function useCheckGuardian() {
  const dispatch = useDispatch();
  const { approved, closed } = useSelector(selectGuardianStatus);
  const [guardianConfirmStatus] = useGuardianConfirmStatusMutation();
  const [sendGuardianConfirm] = useSendGuardianConfirmMutation();
  const close = () => dispatch(closeGuardian());

  const isOpened = !approved && !closed;
  return {
    guardianConfirmStatus,
    sendGuardianConfirm,
    isOpened,
    close,
  };
}

export default useCheckGuardian;
