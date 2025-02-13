import React from 'react';
import { useRouter } from 'next/router';
import { PairType } from '../utils/types';
import {
  useUserCloudQuery,
  useLazyPairGoogleDriveQuery,
  useLazyPairGoogleClassroomQuery,
  useLazyPairOneDriveQuery,
  useUnpairGoogleDriveMutation,
  useUnpairGoogleClassroomMutation,
  useUnpairOneDriveMutation,
} from '../store/services';
import { selectCloud } from '../store/slices/cloud/selectors';
import { useSelector } from '../store';

function useCloudPair() {
  const router = useRouter();
  const cloud = useSelector(selectCloud);
  useUserCloudQuery();
  const [pairGoogleDrive, _pairGoogleDriveStatus] = useLazyPairGoogleDriveQuery();
  const [pairGoogleClassroom, _pairGoogleClassroomStatus] = useLazyPairGoogleClassroomQuery();
  const [pairOneDrive, _pairOneDriveStatus] = useLazyPairOneDriveQuery();
  const [unpairGoogleDrive, _unpairGoogleDriveStatus] = useUnpairGoogleDriveMutation();
  const [unpairGoogleClassroom, _unpairGoogleClassroomStatus] = useUnpairGoogleClassroomMutation();
  const [unpairOneDrive, _unpairOneDriveStatus] = useUnpairOneDriveMutation();

  const PairAPIMap = {
    [PairType.GoogleDrive]: pairGoogleDrive, // api_user_cloud_pair_google_drive,
    [PairType.GoogleClassroom]: pairGoogleClassroom, // api_user_cloud_pair_google_classroom,
    [PairType.OneDrive]: pairOneDrive, // api_user_cloud_pair_one_drive,
  };
  const UnpairAPIMap = {
    [PairType.GoogleDrive]: unpairGoogleDrive,
    [PairType.GoogleClassroom]: unpairGoogleClassroom,
    [PairType.OneDrive]: unpairOneDrive,
  };
  const pair = async (type: PairType) => {
    const { data } = await PairAPIMap[type]().unwrap();
    router.push(data.redirectURL);
  };
  const unpair = async (type: PairType) => {
    await UnpairAPIMap[type]();
  };
  const pairEmail = (type: PairType) => {
    if (cloud[type]) return cloud[type];
    return '';
  };

  return {
    cloud,
    pair,
    unpair,
    pairEmail,
  };
}

export default useCloudPair;
