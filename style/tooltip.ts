import { rem } from '@mantine/core';

export default () => ({
  tooltip: {
    color: '#000',
    borderRadius: rem(6),
    border: `${rem(1)} solid var(--gray-cccccc, #CCC)`,
    background: 'var(--gray-ffffff, #FFF)',
    /* Shadow/Level 1 */
    boxShadow: `0 ${rem(1)} ${rem(2)} 0 rgba(0, 0, 0, 0.16)`,
  },
});
