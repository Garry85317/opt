import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import isUndefined from 'lodash/isUndefined';

import { useApi } from '../providers/apiProvider';
import { usePopup } from '../providers/popupProvider';
import { useDispatch } from '../store';
import { clearAuthInfo } from '../store/actions';
import { AccessControlModel, OMSRole, OAMRole, Role, omsRoleLabelMap } from '../utils/role';

export type TransferResponse = {
  proceed: boolean;
  itemSetNeedTransfer?: Set<string>;
  transferToId?: string;
};

type TransferrableDeletableUser = { id: string; omsRole: OMSRole; emailConfirm?: boolean };

export default function useUserDataTransfer() {
  const { apiUserTransferOwner } = useApi();
  const { message, userDataTransferPopup, useOwnerDelete, powerUserDelete, userDelete } =
    usePopup();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onTransferOwner = useCallback(
    async (newOwnerId: string, oldOwnerId: string, ownerOmsRole: string) => {
      try {
        await apiUserTransferOwner({ newOwnerId, oldOwnerId, ownerOmsRole });
        message.open({
          tit: t('Access_expired'),
          msg: t('Access_expired_content'),
          rightBtn: t('Ok'),
          rightBtnClick: () => {
            dispatch(clearAuthInfo());
          },
        });
      } catch (error: any) {
        message.open({
          tit: t('Error'),
          msg: error.response.data.message,
          rightBtn: t('Ok'),
          rightBtnClick: () => {},
        });
      }
    },
    [t, apiUserTransferOwner],
  );

  const askTransferOwner = useCallback(
    (
      newOwnerId: string,
      userName: string,
      oldOwnerId: string,
      ownerOmsRole: string,
      onBeforeTransfer?: () => Promise<any>,
    ) => {
      message.open({
        tit: t('Transfer_ownership'),
        msg: t('Transfer_ownership_content', { username: userName }),
        rightBtn: t('Transfer'),
        rightBtnClick: () => {
          if (!onBeforeTransfer) {
            onTransferOwner(newOwnerId, oldOwnerId, ownerOmsRole);
            return;
          }
          onBeforeTransfer().then((error) => {
            if (error && error.message) {
              message.open({
                tit: t('Error'),
                msg: error.message,
                rightBtn: t('Ok'),
                rightBtnClick: () => {},
              });
              return;
            }
            onTransferOwner(newOwnerId, oldOwnerId, ownerOmsRole);
          });
        },
        leftBtn: t('Cancel'),
      });
    },
    [t, onTransferOwner],
  );

  const maybeAskTransfer = useCallback(
    (itemList: { id: string; omsRole: OMSRole }[], newItemList: { omsRole: OMSRole }[]) =>
      new Promise<TransferResponse>((resolve) => {
        const itemsNeedTransfer = itemList.filter((item, i) =>
          AccessControlModel.isItemDataTransferNeeded(item.omsRole, newItemList[i].omsRole),
        );
        const itemSetNeedTransfer = new Set(itemsNeedTransfer.map((item) => item.id));
        if (itemSetNeedTransfer.size < 1) {
          resolve({ proceed: true });
          return;
        }
        userDataTransferPopup.open({
          okClick: (id: string) =>
            resolve({ proceed: true, itemSetNeedTransfer, transferToId: id }),
          cancel: () => resolve({ proceed: false }),
          candidateBlacklist: new Set(itemList.map((item) => item.id)),
          tit: t('Change_role'),
          msg: t('Change_role_content'),
          rightBtn: t('Change_directly'),
        });
      }),
    [t],
  );

  const maybeAskTransferDeleteStep2 = useCallback(
    (itemList: TransferrableDeletableUser[]) =>
      new Promise<TransferResponse>((resolve) => {
        const itemsNeedTransfer = itemList.filter(
          (item) =>
            AccessControlModel.itemContainsOmsData(item.omsRole) &&
            (!isUndefined(item.emailConfirm) ? item.emailConfirm : true),
        );
        const itemSetNeedTransfer = new Set(itemsNeedTransfer.map((item) => item.id));
        if (itemSetNeedTransfer.size < 1) {
          resolve({ proceed: true });
          return;
        }
        userDataTransferPopup.open({
          okClick: (id: string) =>
            resolve({ proceed: true, itemSetNeedTransfer, transferToId: id }),
          cancel: () => resolve({ proceed: false }),
          candidateBlacklist: new Set(itemList.map((item) => item.id)),
          tit: t('Delete_user'),
          msg: t('Delete_account_content_power_user'),
          rightBtn: t('Delete_directly'),
        });
      }),
    [t],
  );

  const maybeAskTransferDelete = useCallback(
    (users: TransferrableDeletableUser[]) =>
      new Promise<TransferResponse>((resolve) => {
        message.open({
          tit: t('Delete_user'),
          msg: t('Are_you_sure_to_delete_the_user', {
            user: t('The_user', { count: users.length }),
            account: t('This_account', { count: users.length }),
          }),
          rightBtn: t('Delete'),
          rightBtnClick: () => maybeAskTransferDeleteStep2(users).then(resolve),
          leftBtn: t('Cancel'),
          leftBtnClick: () => resolve({ proceed: false }),
        });
      }),
    [t, maybeAskTransferDeleteStep2],
  );

  const makeDummyResolve = (resolve: (value: TransferResponse) => void) => () =>
    resolve({ proceed: false });

  const askDeleteSelf = useCallback(
    (oamRole: OAMRole, omsRole?: OMSRole, userId?: string) =>
      new Promise<TransferResponse>((resolve) => {
        // direct deletion is handled by popup
        const dummyResolve = makeDummyResolve(resolve);
        if (oamRole === Role.OAM_ROLE_OWNER) {
          useOwnerDelete.open({
            okClick: (alreadyHandled: boolean) => {
              resolve({ proceed: !alreadyHandled });
            },
            cancel: dummyResolve,
          });
          return;
        }
        if (omsRole && AccessControlModel.itemContainsOmsData(omsRole)) {
          powerUserDelete.open({
            okClick: (transferToId) => {
              resolve({ proceed: true, transferToId });
            },
            cancel: dummyResolve,
            candidateBlacklist: userId ? new Set([userId]) : undefined,
            msg: t('Delete_account_content_transfer_first', {
              role: t(omsRoleLabelMap[omsRole].label),
            }),
          });
          return;
        }
        userDelete.open({
          okClick: () => {
            resolve({ proceed: true });
          },
          cancel: dummyResolve,
        });
      }),
    [],
  );

  return { askTransferOwner, maybeAskTransfer, maybeAskTransferDelete, askDeleteSelf };
}
