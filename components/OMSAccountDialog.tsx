import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { rem, createStyles, Textarea, Text } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import getValue from 'lodash/get';
import { setDateFormat } from '../store/slices';
import OAMDialog, { OAMDialogType } from './dialog';
import OAMSelect from './base/Select';
import OAMTextInput, { OAMTextInputType } from './base/TextInput';
import { timeZoneOptions } from '../utils/timezone';
import { DEFAULT_DATE_TEMPLATE, timeFormatOptions } from '../utils/date';
import OAMCheckbox from './base/Checkbox';
import { LocationInput } from './input/Location';
import { StateInput } from './input/State';
import { timezoneFilter } from '../utils/filter.model';
import useIsMobileUI from '../hooks/useIsMobileUI';

const ALL_FIELDS = new Set(['timezoneCode', 'dateFormat', 'location', 'state', 'city', 'address']);
const NON_OWNER_FIELDS = new Set(['timezoneCode', 'dateFormat']);
const getSubmittableFields = (isOwner: boolean) => (isOwner ? ALL_FIELDS : NON_OWNER_FIELDS);

const useStyles = createStyles(() => ({
  title: {
    marginBottom: rem(16),
    color: 'var(--gray-000000, #000)',
    /* Web/Body L 16/Medium */
    fontSize: rem(16),
    fontWeight: 500,
  },
  form: {
    marginBottom: rem(16),
  },
  checkbox: {
    margin: `${rem(20)} 0`,
    color: 'var(--gray-666666, #666)',
    /* Web/Body 14/Regular */
    fontSize: rem(14),
    fontWeight: 400,
  },
}));

type OMSAccountInfo = {
  timezoneCode: string;
  dateFormat?: string;
  location: string;
  state: string;
  city: string;
  address: string;
  isMarketingPromo: boolean;
};

interface OMSAccountDialog {
  data: Omit<OMSAccountInfo, 'isMarketingPromo'>;
  opened: boolean;
  onClose: () => void;
  onSubmit: (omsAccountInfo: { omsAccountInfo: OMSAccountInfo }) => void;
  isOwner: boolean;
}

const OMSAccountDialog = ({ data, opened, onClose, onSubmit, isOwner }: OMSAccountDialog) => {
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const { t } = useTranslation();
  const validateLocation = useCallback(
    (value: string) => {
      if (!getSubmittableFields(isOwner).has('location')) {
        return null;
      }
      return isNotEmpty()(value);
    },
    [isOwner],
  );
  const form = useForm({
    initialValues: {
      timezoneCode: data.timezoneCode,
      dateFormat: data.dateFormat || DEFAULT_DATE_TEMPLATE,
      location: data.location,
      state: data.state,
      city: data.city,
      address: data.address,
      isMarketingPromo: false,
    },
    validateInputOnBlur: true,
    validate: {
      timezoneCode: isNotEmpty(),
      dateFormat: isNotEmpty(),
      location: validateLocation,
      // state: isNotEmpty(),
    },
  });
  const isMobile = useIsMobileUI();

  useEffect(() => {
    form.setValues(data);
  }, [data]);

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    const omsAccountInfo = Array.from(ALL_FIELDS).reduce(
      (acc, field) => ({ ...acc, [field]: getValue(form.values, field) || '' }),
      { isMarketingPromo: false } as OMSAccountInfo,
    );
    dispatch(setDateFormat(form.values.dateFormat));
    onSubmit({
      omsAccountInfo,
    });
    onClose();
  };

  const availableFields = getSubmittableFields(isOwner);
  return (
    <OAMDialog
      lockScroll={isMobile !== undefined ? !isMobile : true}
      customType={OAMDialogType.FORM}
      opened={opened}
      onClose={onClose}
      title={t('We_need_more_info_to_access_OMS_service')}
      rightButton={t('Save')}
      onRightClick={() => {
        handleSubmit();
      }}
      formSubmit={form.onSubmit(() => {})}
    >
      <Text mb={16}>{t('For_precise_and_tailored_assistance')}</Text>
      {availableFields.has('timezoneCode') && (
        <OAMSelect
          required
          data={timeZoneOptions}
          id="Timezone"
          label={t('Timezone')}
          onBlurCapture={() => form.validate()}
          placeholder="UTC +00:00"
          {...form.getInputProps('timezoneCode')}
          searchable
          filter={timezoneFilter}
          withinPortal
        />
      )}
      {availableFields.has('dateFormat') && (
        <OAMSelect
          required
          data={timeFormatOptions}
          id="DateFormat"
          label={t('Date_format')}
          onBlurCapture={() => form.validate()}
          {...form.getInputProps('dateFormat')}
          withinPortal
          autoMaxItems
        />
      )}
      {availableFields.has('location') && (
        <LocationInput
          hasLabel
          id="Location"
          onBlurCapture={() => form.validate()}
          {...form.getInputProps('location')}
          withinPortal
        />
      )}
      {availableFields.has('state') && (
        <StateInput
          hasLabel
          location={form.values.location}
          required={false}
          id="State"
          onBlurCapture={() => form.validate()}
          {...form.getInputProps('state')}
        />
      )}
      {availableFields.has('city') && (
        <OAMTextInput
          customType={OAMTextInputType.BORDER}
          label={t('City')}
          placeholder=""
          onBlurCapture={() => form.validate()}
          {...form.getInputProps('city')}
        />
      )}
      {availableFields.has('address') && (
        <Textarea
          styles={{
            label: {
              color: 'var(--b-2-b-primary-primary-415284, #415284)',
              marginBottom: rem(7),
            },
          }}
          label={t('Address')}
          placeholder=""
          {...form.getInputProps('address')}
        />
      )}
      <OAMCheckbox
        className={classes.checkbox}
        checked={form.values.isMarketingPromo}
        label={t('Please_send_me_Optoma_marketing_messages')}
        {...form.getInputProps('isMarketingPromo')}
      />
    </OAMDialog>
  );
};

export default OMSAccountDialog;
