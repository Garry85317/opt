import { em, getBreakpointValue, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export default function useIsMobileUI() {
  const theme = useMantineTheme();
  return useMediaQuery(`(max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)}`);
}
