import {
  Card,
  Container,
  Button,
  Group,
  Popover,
  Table,
  Text,
  Flex,
  LoadingOverlay,
  createStyles,
  useMantineTheme,
  rem,
  em,
  getBreakpointValue,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'usehooks-ts';
import { DeviceInfo, IDevice, PackageStatus, PackageStatusCheckResult } from '../../utils/types';
import OAMStepper from '../../components/stepper';
import Anchor from '../../components/base/Anchor';
import Breadcrumbs from '../../components/base/Breadcrumbs';
import Checkbox from '../../components/base/Checkbox';
import TextInput from '../../components/base/TextInput';
import {
  DeleteIcon,
  ErrorIcon,
  PlusIcon,
  RenewIcon,
  SuccessIcon,
} from '../../components/base/icon';
import {
  useCheckSNMutation,
  useStepOneMutation,
  usePairStatusMutation,
  useCheckPincodeMutation,
  useStepTwoMutation,
  useStepThreeMutation,
  useCancelPairMutation,
} from '../../store/services';
import useExchangeToken from '../../hooks/useExchangeToken';
import CountDown from '../../components/base/CountDown';
import { useSelector } from '../../store';
import { selectOmsInfo, selectLicense } from '../../store/slices';
import { usePopup } from '../../providers/popupProvider';
import { oamNotifications } from '../../components/base/Notifications';
import { CustomLoader } from '../../components/customLoader';

const useStyles = createStyles(() => ({
  title: {
    marginBottom: rem(20),
    color: 'var(--b-2-b-primary-primary-415284, #415284)',
    fontFeatureSettings: 'clig off, liga off',
    fontSize: rem(18),
  },
  table: {
    thead: {
      background: 'var(--gray-f-2-f-2-f-2, #F2F2F2)',
    },
    tbody: {
      borderBottom: '0.0625rem solid #dee2e6',
    },
    'tbody, tfoot': {
      background: 'var(--gray-ffffff, #FFF)',
    },
    'tfoot tr td': {
      padding: rem(10),
    },
  },
  mobile: {
    marginBottom: rem(20),
    '> tbody tr:first-of-type td': {
      padding: `${rem(10)} ${rem(16)}`,
    },
  },
  delete: {
    padding: 0,
    width: rem(36),
    background: 'transparent',
    ':is([data-disabled])': {
      background: 'transparent',
      opacity: 0.2,
    },
  },
  addList: {
    ':hover': {
      background: 'var(--gray-f-8-f-8-f-8, #F8F8F8)',
    },
    ':focus': {
      background: 'var(--b-2-b-primary-variant-eaf-0-f-7, #EAF0F7)',
    },
  },
  add: {
    height: rem(56),
    marginBottom: rem(20),
    borderRadius: rem(6),
    border: '1px solid var(--gray-cccccc, #CCC)',
    background: 'var(--gray-ffffff, #FFF)',
    svg: {
      marginLeft: rem(10),
    },
  },
  inputWrapper: {
    color: 'var(--b-2-b-primary-primary-415284, #415284)',
    fontSize: rem(14),
    justifyContent: 'space-between',
    marginBottom: rem(20),
    ':last-child': {
      marginBottom: 0,
    },
  },
  textInput: {
    '.mantine-TextInput-wrapper': {
      marginBottom: 0,
    },
  },
}));

interface ItemData extends Omit<IDevice, 'addFrom' | 'gatewayId' | 'gatewayLocalIp' | 'ip'> {
  isSNValid?: boolean;
  pinCode?: string;
  pinCode_ExpireTime?: string;
  pinCodeStatus: 0 | 1 | 2 | 3; // 0: None, 1: Success, 2: Processing, 3: Failed
}

type CloudDeviceInfo = Omit<DeviceInfo, 'addFrom' | 'gatewayId' | 'gatewayLocalIp' | 'ip'>;

const initialDevice: CloudDeviceInfo = {
  id: '',
  sn: '',
  name: '',
  type: '',
  description: '',
  creatorId: '',
  model: '',
};

enum Step {
  ENTER_SN = 1,
  CONFIRM_PINCODE = 2,
  DEVICES_SETTING = 3,
  FINISH = 4,
}

const { ENTER_SN, CONFIRM_PINCODE, DEVICES_SETTING, FINISH } = Step;

function DevicesAdd() {
  const { classes, cx } = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)}`);
  const { message } = usePopup();
  const pairPooling = useRef<ReturnType<typeof setInterval>>();
  const paring = useRef(() => {});
  const [checkSN, _checkSNStatsus] = useCheckSNMutation();
  const [stepOne, stepOneStatus] = useStepOneMutation();
  const [pairStatus, _pairStatusStatus] = usePairStatusMutation();
  const [checkPincode, _checkPincodeStatus] = useCheckPincodeMutation();
  const [stepTwo, stepTwoStatus] = useStepTwoMutation();
  const [stepThree, stepThreeStatus] = useStepThreeMutation();
  const [cancelPair, cancelPairStatus] = useCancelPairMutation();
  const initStep = { active: ENTER_SN, next: ENTER_SN };
  const [step, setStep] = useState(initStep);
  const [deviceData, deviceDataAction] = useMap<number, ItemData>(
    new Map([
      [
        1,
        {
          ...initialDevice,
          pinCodeStatus: 0,
        },
      ],
    ]),
  );
  const flatData = Array.from(deviceData, ([key, value]) => ({ key, ...value }));
  const deviceSNs = flatData.map((deviceInfo) => deviceInfo.sn);
  const [checkedItems, setCheckedItems] = useState(
    Array.from(deviceData.keys()).map((key) => ({ id: key, checked: false })),
  );
  const checkedCounts = checkedItems.filter((item) => item.checked).length;
  const isAllChecked = deviceData.size > 0 && checkedItems.every((item) => item.checked);
  const indeterminate =
    deviceData.size > 0 && checkedItems.some((item) => item.checked) && !isAllChecked;
  const onAllChecked = () => {
    setCheckedItems(
      checkedItems.map((item) => {
        let checked;
        if (isAllChecked) {
          checked = false;
        } else {
          checked = true;
        }
        return { ...item, checked };
      }),
    );
  };

  const { isSuccess, isLoading, isError } = useExchangeToken();
  const { totalCount } = useSelector(selectOmsInfo);
  const { oms } = useSelector(selectLicense);

  const [deviceCheckResult, setDeviceCheckResult] = useState<PackageStatusCheckResult>({
    count: 0,
    limit: 0,
    status: PackageStatus.Normal,
  });

  useEffect(() => {
    let deviceStatus: PackageStatus;
    if (oms.deviceLimit === -1) {
      deviceStatus = PackageStatus.Expired;
    } else if (totalCount < oms.deviceLimit) {
      deviceStatus = PackageStatus.Normal;
    } else {
      deviceStatus = PackageStatus.ExceededLimit;
    }

    setDeviceCheckResult({
      count: totalCount,
      limit: oms.deviceLimit,
      status: deviceStatus,
    });
  }, [totalCount, oms.deviceLimit]);

  useEffect(() => {
    if (deviceCheckResult.status !== PackageStatus.Normal) {
      message.open({
        tit: t('Reach_limit_oms_plan'),
        msg: t('Reach_limit_oms_plan_device_content'),
        rightBtn: t('Ok'),
        rightBtnClick: async () => {
          router.push('/');
        },
      });
    }
  }, [deviceCheckResult]);

  const getDeviceInfo = (key: number) => deviceData.get(key) as ItemData;
  const getNextDevice = (
    key: number,
    nextItemProps?: { [key in keyof ItemData]?: ItemData[key] },
  ) => {
    const device = getDeviceInfo(key);
    const result = {
      ...device,
      ...nextItemProps,
    };
    return result;
  };

  function setNextDevice(key: number, nextItemProps?: { [key in keyof ItemData]?: ItemData[key] }) {
    deviceDataAction.set(key, getNextDevice(key, nextItemProps));
  }

  function isSNsValid() {
    return flatData.length > 0 && flatData.every(({ isSNValid }) => isSNValid);
  }
  const canNext = checkedCounts > 0 && isSNsValid() && Boolean(step.next > step.active);

  function isParing() {
    return flatData.every(({ pinCodeStatus }) => pinCodeStatus === 1);
  }

  function isFinal() {
    return flatData.every(({ name }) => name);
  }

  useEffect(() => {
    if (stepThreeStatus.isSuccess) router.push('/devices');
  }, [stepThreeStatus]);

  useEffect(() => {
    paring.current = async () => {
      const result = await pairStatus({ deviceSNs }).unwrap();

      result?.data?.forEach(({ deviceSN, resultCode }, index) => {
        // TODO update all at once
        if (deviceSN) {
          setNextDevice(index + 1, {
            pinCodeStatus: resultCode,
          });
        }
      });
    };
  }, [deviceData]);

  // TODO may remove the useEffect
  useEffect(() => {
    if (!checkedCounts) {
      setStep(initStep);
    }
    if (isSNsValid() && step.active === ENTER_SN) {
      setStep((prev) => ({ active: prev.active, next: CONFIRM_PINCODE }));
    }
    if (step.active === CONFIRM_PINCODE) {
      clearInterval(pairPooling.current);
      pairPooling.current = setInterval(paring.current, 5000);
    }
    if (isParing() && step.next === CONFIRM_PINCODE) {
      clearInterval(pairPooling.current);
      setStep((prev) => ({ active: prev.active, next: DEVICES_SETTING }));
    }
    if (isFinal() && step.next === DEVICES_SETTING) {
      clearInterval(pairPooling.current);
      setStep((prev) => ({ active: prev.active, next: FINISH }));
    }
    if (isError) setStep(initStep);
  }, [deviceData, checkedCounts, stepOneStatus, stepTwoStatus, stepThreeStatus]);

  const nextStepMap: Record<number, () => Promise<boolean>> = {
    [ENTER_SN]: async (): Promise<boolean> => {
      if (!isSNsValid()) return false;
      const result = await stepOne({ deviceSNs }).unwrap();
      if (result?.data.isSuccess) {
        result?.data.data?.forEach(({ pinCode, pinCode_ExpireTime }, index) =>
          setNextDevice(index + 1, {
            pinCode,
            pinCode_ExpireTime,
          }),
        );
        return true;
      }
      oamNotifications.show({
        title: `Error: ${result?.data.errorInfo}`,
      });
      return false;
    },
    [CONFIRM_PINCODE]: async (): Promise<boolean> => {
      if (!isSNsValid()) return false;
      try {
        await stepTwo({ deviceSNs });
        return true;
      } catch (error) {
        return false;
      }
    },
    [DEVICES_SETTING]: async (): Promise<boolean> => {
      const devices = flatData.map((deviceInfo) => {
        const { name: deviceAliasName, sn: deviceSN } = deviceInfo;
        return {
          deviceSN,
          deviceAliasName,
          deviceDescription: 'string',
          // TODO groupIds
          groupIds: [], // ['2d5a6ed9-236f-4d60-b44e-34158034342c'],
          // groupIds: [groupId],
          // TODO locationInfo
          // locationInfo: {
          //   locationId: 'locationId',
          //   cityId: 'cityId',
          //   buildingId: 'buildingId',
          //   floorId: 'floorId',
          //   roomId: 'roomId',
          // },}
        };
      });
      try {
        await stepThree({ devices });
        return true;
      } catch (error) {
        return false;
      }
    },
  };

  const handleAddListClick = () => {
    setNextDevice(deviceData.size + 1, {
      ...initialDevice,
      pinCodeStatus: 0,
    });
    setStep(initStep);
    setCheckedItems([...checkedItems, { id: checkedItems.length + 1, checked: false }]);
  };

  async function refreshPinCode(key: number) {
    const { sn: deviceSN } = getDeviceInfo(key) as CloudDeviceInfo;
    const result = await checkPincode({ deviceSN }).unwrap();
    // TODO check pinCode result
    if (result?.data?.pinCode) {
      const {
        data: { pinCode, pinCode_ExpireTime },
      } = result;
      deviceDataAction.set(
        key,
        getNextDevice(key, {
          pinCode,
          pinCode_ExpireTime,
        }),
      );
    }
  }

  const tableComponents = {
    headCheckbox: (
      <Checkbox
        checked={isAllChecked}
        indeterminate={indeterminate}
        transitionDuration={0}
        onChange={onAllChecked}
      />
    ),
    howToFind: (
      <Popover position="bottom" withArrow shadow="md">
        <Popover.Target>
          <Anchor>{t('How_to_find')}</Anchor>
        </Popover.Target>
        <Popover.Dropdown p={20}>
          <Text size={16} fw={500} mb={16}>
            {t('How_to_find_serial_number')}
          </Text>
          <Text size={14} fw={400}>
            1. {t('Projector')}
            <br />
            {t('Open_devices_OAM_app_and_enter_the_serial_number')}
            <br />
            <br />
            2. {t('Ifp')}
            <br />
            {t('Open_devices_OAM_app_and_enter_the_serial_number')}
          </Text>
        </Popover.Dropdown>
      </Popover>
    ),
    headDelete: () => (
      <Button
        variant="subtle"
        disabled={!canNext || deviceData.size <= 1}
        className={classes.delete}
        onClick={async () => {
          const deviceSNs = flatData.map((deviceInfo) => deviceInfo.sn);
          clearInterval(pairPooling.current);
          await cancelPair({ deviceSNs });
          if (step.active === 1) router.push('/devices');
          else setStep(initStep);
        }}
      >
        <DeleteIcon />
      </Button>
    ),
    bodyCheckbox: (key: number) => (
      <Checkbox
        checked={checkedItems[key - 1]?.checked}
        onChange={() => {
          setCheckedItems(
            checkedItems.map((item, index) => ({
              ...item,
              checked: index === key - 1 ? !checkedItems[key - 1]?.checked : item.checked,
            })),
          );
        }}
      />
    ),
    serialNumberInput: (key: number, style?: React.CSSProperties) => (
      <TextInput
        className={classes.textInput}
        defaultValue={getDeviceInfo(key).sn}
        onBlur={async (event) => {
          // TODO better check flow
          if (!event.target.value) return;
          const result = await checkSN({ deviceSN: event.target.value }).unwrap();
          if (result?.data) {
            setNextDevice(key, {
              isSNValid: result.data.isSuccess,
            });
          }
        }}
        onChange={(event) => {
          deviceDataAction.set(key, getNextDevice(key, { sn: event.target.value }));
        }}
        style={{ maxWidth: rem(220), ...style }}
        rightSection={
          step.active === ENTER_SN ? (
            <RenewIcon
              style={{
                marginLeft: rem(5),
              }}
              onClick={async () => {
                const result = await checkSN({ deviceSN: getDeviceInfo(key).sn }).unwrap();
                if (result?.data) {
                  setNextDevice(key, {
                    isSNValid: result.data.isSuccess,
                  });
                }
              }}
            />
          ) : null
        }
        disabled={step.active !== 1}
      />
    ),
    pinCodeInput: (props: { key: number; style?: React.CSSProperties }) => (
      <Flex>
        <TextInput
          className={classes.textInput}
          value={getDeviceInfo(props.key).pinCode || ''}
          style={props?.style}
          disabled
        />
      </Flex>
    ),
    nameInput: (key: number) => (
      <TextInput
        className={classes.textInput}
        value={getDeviceInfo(key).name}
        onChange={(event) => {
          deviceDataAction.set(key, getNextDevice(key, { name: event.target.value }));
        }}
      />
    ),
    bodyRemove: (key: number) => (
      <Button
        className={classes.delete}
        variant="subtle"
        disabled={(!!getDeviceInfo(key).sn && !canNext) || deviceData.size <= 1}
        onClick={async () => {
          const { sn } = getDeviceInfo(key);
          clearInterval(pairPooling.current);
          await cancelPair({ deviceSNs: [sn] });

          deviceDataAction.remove(key);
          if (step.active > ENTER_SN && !flatData.length) setStep(initStep);
          else pairPooling.current = setInterval(paring.current, 5000);
        }}
      >
        <DeleteIcon />
      </Button>
    ),
  };
  const renderCheckSNStatus = (key: number) => {
    const { isSNValid } = getDeviceInfo(key);

    return (
      <Group style={{ width: rem(160) }}>
        {isSNValid ? <SuccessIcon /> : isSNValid === false ? <ErrorIcon /> : <></>}
        {isSNValid ? t('Success') : isSNValid === false ? t('Failed') : ''}
      </Group>
    );
  };
  const renderStatus = (key: number) => {
    const { pinCodeStatus } = getDeviceInfo(key);
    const countDown = (
      <CountDown
        prefix={t('Pin_code_expired_in') as string}
        timeLeft={getDeviceInfo(key).pinCode_ExpireTime as string}
        onClick={() => refreshPinCode(key)}
      />
    );
    return (
      <Group>
        {pinCodeStatus === 0 ? countDown : pinCodeStatus === 1 ? <SuccessIcon /> : <ErrorIcon />}
        {pinCodeStatus === 0 ? '' : pinCodeStatus === 1 ? t('Success') : t('Failed')}
      </Group>
    );
  };

  const renderTable = (props: {
    className?: string;
    head?: React.ReactNode;
    body?: React.ReactNode;
    foot?: React.ReactNode;
  }) => (
    <Table verticalSpacing="xs" withBorder className={cx(classes.table, props.className)}>
      <thead>{props.head}</thead>
      <tbody>{props.body}</tbody>
      <tfoot>{props.foot}</tfoot>
    </Table>
  );

  const mobileComponent: Record<string, React.ReactNode> = {
    serialNumber: (
      <>
        {Array.from(deviceData, ([key], index) => (
          <div key={`${key}-${index}`}>
            {renderTable({
              className: classes.mobile,
              head: (
                <tr>
                  <td style={{ padding: rem(12) }}>{tableComponents.bodyCheckbox(key)}</td>
                  <td style={{ textAlign: 'right', width: '100%', paddingRight: rem(10) }}>
                    {tableComponents.bodyRemove(key)}
                  </td>
                </tr>
              ),
              body: (
                <tr>
                  <td colSpan={2}>
                    <Group className={classes.inputWrapper}>
                      {t('Serial_number')}
                      {tableComponents.serialNumberInput(key)}
                    </Group>
                    <Group className={classes.inputWrapper}>
                      <div> </div>
                      {renderCheckSNStatus(key)}
                    </Group>
                  </td>
                </tr>
              ),
            })}
          </div>
        ))}
        <Group className={cx(classes.add, classes.addList)} onClick={handleAddListClick}>
          <PlusIcon />
          {t('Add_list')}
        </Group>
      </>
    ),
    confirmPINCode: Array.from(deviceData, ([key], index) => (
      <div key={`${key}-${index}`}>
        {renderTable({
          className: classes.mobile,
          head: (
            <tr>
              <td style={{ padding: rem(12) }}>{tableComponents.bodyCheckbox(key)}</td>
              <td style={{ textAlign: 'right', width: '100%', paddingRight: rem(10) }}>
                {tableComponents.bodyRemove(key)}
              </td>
            </tr>
          ),
          body: (
            <tr>
              <td colSpan={2}>
                <Group className={classes.inputWrapper}>
                  {t('Serial_number')}
                  {tableComponents.serialNumberInput(key, { width: rem(182) })}
                </Group>
                <Group className={classes.inputWrapper}>
                  {t('Pin_code')}
                  {tableComponents.pinCodeInput({
                    key,
                    style: { width: rem(182) },
                  })}
                </Group>
                <Group className={classes.inputWrapper}>
                  <div> </div>
                  {renderStatus(key)}
                </Group>
              </td>
            </tr>
          ),
        })}
      </div>
    )),
    deviceSettings: Array.from(deviceData, ([key], index) => (
      <div key={`${key}-${index}`}>
        {renderTable({
          className: classes.mobile,
          body: (
            <tr>
              <td>
                <Group className={classes.inputWrapper}>
                  {t('Name')}
                  {tableComponents.nameInput(key)}
                </Group>
                <Group className={classes.inputWrapper}>
                  {t('Serial_number')}
                  <Text>{deviceData.get(key)?.sn || '123456'}</Text>
                </Group>
                <Group className={classes.inputWrapper}>{t('Device_type')}</Group>
              </td>
            </tr>
          ),
        })}
      </div>
    )),
  };

  return (
    <Container fluid px="lg" pb={60}>
      <LoadingOverlay
        overlayBlur={2}
        zIndex={1}
        loader={CustomLoader({ loadingText: t('Loading') })}
        visible={!isSuccess || isLoading || stepThreeStatus.isLoading}
      />
      <Breadcrumbs />
      <Text className={classes.title}>{t('Add_new_device')}</Text>
      <OAMStepper
        isAllChecked={isAllChecked}
        indeterminate={indeterminate}
        onAllChecked={onAllChecked}
        steps={[
          {
            title: t('Enter_serial_number'),
            description: [t('Enter_serial_number_content_1'), t('Enter_serial_number_content_2')],
            inputs: isMobile
              ? mobileComponent.serialNumber
              : renderTable({
                  head: (
                    <tr>
                      <th>{tableComponents.headCheckbox}</th>
                      <th style={{ width: '70%' }}>
                        {`${t('Serial_number')} (`} {tableComponents.howToFind} {' )'}
                      </th>
                      <th style={{ width: '30%' }} />
                      <th style={{ textAlign: 'right' }}>{tableComponents.headDelete()}</th>
                    </tr>
                  ),
                  body: Array.from(deviceData, ([key], index) => (
                    <tr key={`${key}-${index}`}>
                      <td> {tableComponents.bodyCheckbox(key)}</td>
                      <td>{tableComponents.serialNumberInput(key, { maxWidth: rem(220) })}</td>
                      <td style={{ textAlign: 'right' }}>{renderCheckSNStatus(key)}</td>
                      <td style={{ textAlign: 'right' }}>{tableComponents.bodyRemove(key)}</td>
                    </tr>
                  )),
                  foot: (
                    <tr className={classes.addList} onClick={handleAddListClick}>
                      <td>
                        <Group style={{ height: rem(36) }}>
                          <PlusIcon />
                        </Group>
                      </td>
                      <td>{t('Add_list')}</td>
                      <td> </td>
                      <td> </td>
                    </tr>
                  ),
                }),
          },
          {
            title: t('Confirm_pin_code'),
            description: [t('Confirm_the_pin_code'), t('Confirm_the_pin_code_on_the_device')],
            inputs: isMobile
              ? mobileComponent.confirmPINCode
              : renderTable({
                  head: (
                    <tr>
                      <th>{tableComponents.headCheckbox}</th>
                      <th style={{ width: '30%' }}>{t('Serial_number')}</th>
                      <th style={{ width: '30%' }}>{t('Pin_code')}</th>
                      <th style={{ width: '40%' }} />
                      <th style={{ textAlign: 'right' }}>{tableComponents.headDelete()}</th>
                    </tr>
                  ),
                  body: Array.from(deviceData, ([key], index) => (
                    <tr key={`${key}-${index}`}>
                      <td> {tableComponents.bodyCheckbox(key)}</td>
                      <td>{tableComponents.serialNumberInput(key, { maxWidth: rem(220) })}</td>
                      <td style={{ textAlign: 'right' }}>
                        {tableComponents.pinCodeInput({
                          key,
                          style: { maxWidth: rem(100) },
                        })}
                      </td>
                      <td style={{ textAlign: 'right' }}>{renderStatus(key)}</td>
                      <td style={{ textAlign: 'right' }}>{tableComponents.bodyRemove(key)}</td>
                    </tr>
                  )),
                }),
          },
          {
            title: t('Device_settings'),
            description: [],
            inputs: isMobile
              ? mobileComponent.deviceSettings
              : renderTable({
                  head: (
                    <tr>
                      <th>
                        <Text>{t('Name')}</Text>
                      </th>
                      <th>{t('Serial_number')}</th>
                      <th>{t('Device_type')}</th>
                    </tr>
                  ),
                  body: Array.from(deviceData, ([key], index) => (
                    <tr key={`${key}-${index}`}>
                      <td>{tableComponents.nameInput(key)}</td>
                      <td>{getDeviceInfo(key).sn}</td>
                      <td>{getDeviceInfo(key).type}</td>
                    </tr>
                  )),
                }),
          },
        ]}
        currentStep={step.active}
        setCurrentStep={(active) => setStep((prev) => ({ active, next: prev.next }))}
        prevStep={async () => {
          const deviceSNs = flatData.map((deviceInfo) => deviceInfo.sn);
          clearInterval(pairPooling.current);
          await cancelPair({ deviceSNs });
          router.push('/devices');
        }}
        nextStep={async () => {
          const isValidDevicesSuccess = await nextStepMap[step.active]();
          if (isValidDevicesSuccess) {
            setStep((prev) => ({
              active: prev.active < DEVICES_SETTING ? prev.active + 1 : prev.active,
              next: prev.next,
            }));
          }
        }}
        canNext={canNext}
      />
    </Container>
  );
}

export default DevicesAdd;

DevicesAdd.requireAuth = true;
