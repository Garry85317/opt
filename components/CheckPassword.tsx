import { useState } from 'react';
import { IconEyeCheck, IconEyeOff } from '@tabler/icons-react';
import { Progress, Text, Popover, Box, rem } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { DefaultTFuncReturn } from 'i18next';
import OAMTextInput, { OAMTextInputType } from './base/TextInput';

function PasswordRequirement({ meets, label }: { meets: boolean; label: DefaultTFuncReturn }) {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      {meets ? (
        <IconEyeOff style={{ width: rem(14), height: rem(14), marginRight: rem(15) }} />
      ) : (
        <IconEyeCheck style={{ width: rem(14), height: rem(14), marginRight: rem(15) }} />
      )}{' '}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes_number' },
  { re: /[a-z]/, label: 'Includes_lowercase_letter' },
  { re: /[A-Z]/, label: 'Includes_uppercase_letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes_special_symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export default function CheckPassword(props: {
  value: string;
  onChange: (value: string | React.ChangeEvent<any> | null | undefined) => void;
}) {
  const { t } = useTranslation();
  const [popoverOpened, setPopoverOpened] = useState(false);
  const labelColor = 'var(--b-2-b-primary-primary-415284, #415284)';
  const { value, onChange } = props;
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={t(requirement.label)}
      meets={requirement.re.test(value)}
    />
  ));
  const strength = getStrength(value);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  return (
    <Popover
      opened={popoverOpened}
      position="bottom"
      width="target"
      transitionProps={{ transition: 'pop' }}
    >
      <Popover.Target>
        <div
          onFocusCapture={() => setPopoverOpened(true)}
          onBlurCapture={() => setPopoverOpened(false)}
        >
          <OAMTextInput
            {...props}
            customType={OAMTextInputType.BORDER}
            type="password"
            withAsterisk
            required
            label={t('Password')}
            placeholder={`${t('Password')}`}
            radius="md"
            value={value}
            onChange={onChange} //{(event) => setValue(event.currentTarget.value)}
          />
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <Progress color={color} value={strength} size={5} mb="xs" />
        <PasswordRequirement
          label={t('Between_a_to_b_characters_long', { min: 10, max: 128 })}
          meets={value.length >= 10 && value.length <= 128}
        />
        {checks}
      </Popover.Dropdown>
    </Popover>
  );
}
