import React from 'react';
import {
  UnstyledButton,
  Group,
  Text,
  Table,
  Center,
  Card,
  Grid,
  Pagination,
  TableProps,
  createStyles,
  useMantineTheme,
  rem,
  em,
  getBreakpointValue,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useMediaQuery, usePagination } from '@mantine/hooks';
import { IconSelector } from '@tabler/icons-react';
import Checkbox from '../base/Checkbox';
import { ListAscendingIcon, ListDescendingIcon } from '../base/icon';
import { IUsers } from '../../utils/types';
import { selectAccount } from '../../store/slices';
import { useSelector } from '../../store';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

type Users = IUsers;

export type UserData = Users & {
  key: string;
  checked: boolean;
  onChange: () => void;
};

interface UsersTable extends Omit<TableProps, 'placeholder'> {
  isAllChecked: boolean;
  indeterminate: boolean;
  checkAllDisabled: boolean;
  onAllChecked: () => void;
  sorted: boolean;
  reverseSortDirection: boolean;
  onSort: () => void;
  tableHead: React.ReactNode;
  tableBody: JSX.Element[];
  placeholder?: React.ReactNode;
  page: number;
  total: number;
  onChangePage: (page: number) => void;
  isLoading: boolean;
}

const background = 'var(--gray-f-2-f-2-f-2, #F2F2F2)';

const useStyles = createStyles((theme) => ({
  table: {
    'thead tr th': {
      padding: `${rem(5)} ${rem(16)}`,
    },
    'tbody tr td': {
      display: 'table-cell',
      padding: `${rem(10)} ${rem(16)}`,
    },
  },
  tableHead: {
    position: 'sticky',
    top: 0,
    height: rem(48),
    background,
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },
  placeholder: {
    padding: `${rem(50)} 0`,
    textAlign: 'center',
  },
  section: {
    padding: `${rem(10)} ${rem(16)}`,
  },
  icon: {
    width: rem(36),
    height: rem(36),
  },
  tableRow: {
    '&:hover': {
      backgroundColor: 'rgba(234, 240, 247, 0.4)',
    },
  },
}));

export function SortTh({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const icon = sorted ? (
    reversed ? (
      <ListAscendingIcon />
    ) : (
      <ListDescendingIcon />
    )
  ) : (
    <IconSelector size="0.9rem" stroke={1.5} />
  );
  return (
    <th>
      <UnstyledButton onClick={onSort}>
        <Group position="apart" spacing={0}>
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>{icon}</Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

const UsersTable = ({
  className,
  isAllChecked,
  indeterminate,
  checkAllDisabled,
  onAllChecked,
  sorted,
  reverseSortDirection,
  onSort,
  tableHead,
  tableBody,
  placeholder,
  page,
  total,
  onChangePage,
  isLoading,
}: UsersTable) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)}`);
  const pagination = usePagination({
    /** Page selected on initial render, defaults to 1 */
    initialPage: 1,
    /** Controlled active page number */
    page,
    /** Total amount of pages */
    total,
    /** Siblings amount on left/right side of selected page, defaults to 1 */
    siblings: 1,
    /** Amount of elements visible on left/right edges, defaults to 1  */
    boundaries: 1,
    /** Callback fired after change of each page */
    onChange: onChangePage,
  });

  const account = useSelector(selectAccount);

  const destopTable = (
    <div
      style={{
        padding: rem(1),
        border: `${rem(1)} solid var(--gray-cccccc, #CCC)`,
        borderRadius: rem(6),
      }}
    >
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} className={classes.table}>
        <thead>
          <tr className={classes.tableHead}>
            <th>
              <Checkbox
                checked={isAllChecked}
                indeterminate={indeterminate}
                onChange={onAllChecked}
                disabled={checkAllDisabled}
              />
            </th>
            <SortTh sorted={sorted} reversed={reverseSortDirection} onSort={onSort}>
              <span style={{ marginLeft: '7px' }}>{t('Name')}</span>
            </SortTh>
            {(tableHead as React.ReactNode[]).map((head, index) => (
              <th key={`head-${index + 1}`}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!tableBody.length && (
            <tr>
              <td colSpan={(tableHead as React.ReactNode[])!.length + 2}>
                <div className={classes.placeholder}>{placeholder}</div>
              </td>
            </tr>
          )}
          {!isLoading &&
            tableBody.length > 0 &&
            tableBody.map((item, index) => (
              <tr key={`tr-${index + 1}`} className={classes.tableRow}>
                {(tableBody as { props: { children: React.ReactNode[] } }[])[
                  index
                ].props.children!.map((body, bodyIndex) => (
                  <td key={`body-${bodyIndex + 1}`}>{body}</td>
                ))}
              </tr>
            ))}
          {isLoading && (
            <tr>
              <td style={{ padding: 0, border: 0, height: rem(140) }} />
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );

  const mobileTable = (
    <>
      {!tableBody.length && (
        <Card withBorder shadow="sm" radius="md">
          <Card.Section withBorder inheritPadding py="xs">
            <Center h={100}>
              <Text size="sm" color="dimmed">
                {placeholder}
              </Text>
            </Center>
          </Card.Section>
        </Card>
      )}
      {!isLoading &&
        tableBody.length > 0 &&
        tableBody.map((item, index) => (
          <Card withBorder shadow="sm" radius="md" key={`card-${index + 1}`} mb={20}>
            {(tableBody as { props: { children: React.ReactNode[] } }[]).length > 0 &&
              (tableBody as { props: { children: React.ReactNode[] } }[])![index].props.children
                .slice(0, -1)
                .map((content, contentIndex) => {
                  if (contentIndex === 0) {
                    return (
                      <Card.Section
                        withBorder
                        inheritPadding
                        py="xs"
                        bg={background}
                        key={`section-${contentIndex + 1}`}
                      >
                        <Group position="apart">
                          {content}
                          {(tableBody as { props: { children: React.ReactNode[] } }[]).length > 0 &&
                            (tableBody as { props: { children: React.ReactNode[] } }[])![
                              index
                            ].props.children.slice(-1)}
                        </Group>
                      </Card.Section>
                    );
                  }
                  return (
                    <Card.Section className={classes.section} key={`section-${contentIndex + 1}`}>
                      <Grid gutter={0} grow align="center">
                        <Grid.Col
                          span={5}
                          style={{ height: rem(36), display: 'flex', alignItems: 'center' }}
                        >
                          <Text fz="sm" fw={500}>
                            {contentIndex === 1
                              ? (t('Name') as string)
                              : (tableHead as React.ReactNode[])[contentIndex - 2]}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={6}> {content}</Grid.Col>
                      </Grid>
                    </Card.Section>
                  );
                })}
          </Card>
        ))}
      {isLoading && (
        <Card withBorder shadow="sm" radius="md">
          <Card.Section withBorder inheritPadding py="xs">
            <Grid gutter={0} grow align="center">
              <Grid.Col
                style={{
                  height: rem(140),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  whiteSpace: 'pre-wrap',
                }}
              />
            </Grid>
          </Card.Section>
        </Card>
      )}
    </>
  );

  return (
    <>
      <div className={className}>{isMobile ? mobileTable : destopTable}</div>
      <Pagination.Root
        total={total}
        boundaries={0}
        siblings={1}
        value={page}
        onChange={onChangePage}
        getItemProps={(page) => ({
          component: 'button',
          onClick: () => onChangePage(page),
        })}
        styles={(theme) => ({
          control: {
            '&[data-active]': {
              background: 'var(--b-2-b-primary-primary-415284, #415284)',
              ':not([data-disabled]):hover': {
                background: 'var(--b-2-b-primary-variant-01256-b, #01256B)',
              },
            },
          },
        })}
      >
        <Group spacing={7} position="center" mt="lg" mb="lg">
          <Pagination.First component="button" onClick={() => pagination.first()} />
          <Pagination.Previous component="button" onClick={() => pagination.previous()} />
          <Pagination.Items />
          <Pagination.Next component="button" onClick={() => pagination.next()} />
          <Pagination.Last component="button" onClick={() => pagination.last()} />
        </Group>
      </Pagination.Root>
    </>
  );
};

export default UsersTable;
