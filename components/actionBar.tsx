import React, { ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  Group,
  Flex,
  Menu,
  Overlay,
  createStyles,
  useMantineTheme,
  rem,
  em,
  getBreakpointValue,
  Text,
} from '@mantine/core';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import Button, { OAMButtonType } from './base/Button';
import SearchInput from './base/Search';
import { SearchIcon, FilterIcon, ArrowUpIcon, ArrowDownIcon } from './base/icon';
import Checkbox from './base/Checkbox';
import type { MenuOption } from './base/LeveledMenu';
import LeveledMenu from './base/LeveledMenu';

const useStyles = createStyles((theme) => ({
  functionBar: {
    position: 'relative',
    justifyContent: 'space-between',
    display: 'flex',
    align: 'center',
    marginTop: theme.spacing.md,
    marginBottom: rem(14),
    [`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)})`]: {
      flexDirection: 'column',
      gap: rem(14),
    },
  },

  overlay: {
    border: `${rem(1)} solid #000`,
    position: 'fixed',
    top: 0,
    left: 0,
  },

  iconButton: {
    width: rem(36),
    padding: 0,
  },
  dropDown: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
  },

  selectAll: {
    padding: 0,
    color: 'var(--gray-444444, #444)',
    /* Web/Body 14/Regular */
    fontSize: rem(14),
    fontWeight: 400,
  },

  searchBar: {
    display: 'flex',
    // flex:1,
    gap: rem(4),
    alignItems: 'center',
    marginRight: rem(10),
  },

  filter: {
    paddingLeft: rem(4),
    paddingRight: rem(4),
    ':hover': {
      backgroundColor: '#f8f8f8',
    },
  },

  apply: {
    display: 'flex',
    margin: `${rem(0)} ${rem(12)}`,
    // width: '-moz-available' /* WebKit-based browsers will ignore this. */,
    // width: '-webkit-fill-available' /* Mozilla-based browsers will ignore this. */,
    width: 'fill-available',
    div: {
      margin: '0 auto',
    },
  },

  search: {
    position: 'fixed',
    top: `calc(50vh + ${rem(50)})`,
    width: `calc(100% - ${rem(110)})`,
    zIndex: 201, // overlay z-index default: 200
    '.mantine-Input-wrapper': {
      width: '100%',
    },
    [theme.fn.smallerThan('768')]: {
      width: `calc(100% - ${rem(40)})`,
    },
  },

  btnGroup: {
    display: 'flex',
    gap: rem(10),
    justifyContent: 'center',
  },
}));

const ActionBar: React.FC<{
  haveButton?: boolean;
  searchValue: string;
  isAllChecked: boolean;
  indeterminate: boolean;
  checkAllDisabled: boolean;
  onAllChecked: () => void;
  onFilter?: () => void;
  onChangeSearch?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value: string) => void;
  onClearSearch?: () => void;
  filterItem?: JSX.Element[];
  actions: Array<{
    icon: JSX.Element;
    text: string;
    action: () => void;
    disabled?: boolean;
    dropdown?: MenuOption[];
    onDropdownItemClick?: (value: string) => void;
  }>;
}> = ({
  haveButton,
  searchValue,
  isAllChecked,
  indeterminate,
  checkAllDisabled,
  onAllChecked,
  onFilter = () => {},
  onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {},
  onSearch = (text: string) => {},
  onClearSearch = () => {},
  filterItem,
  actions,
}) => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)}`);
  const isDesktop = useMediaQuery(`(min-width: ${em(getBreakpointValue(theme.breakpoints.md))}`);
  const isSmallerDesktop = useMediaQuery(
    `(max-width: ${em(getBreakpointValue(theme.breakpoints.md) - 1)}`,
  );
  const { classes } = useStyles();
  const defaultPlaceholder = t('Search');
  const [isDropdownOpen, { toggle, close: closeDropdowm }] = useDisclosure(false);
  const [visible, { open, close }] = useDisclosure(false);

  const filterButton = filterItem && (
    <Group>
      <Menu
        transitionProps={{ transition: 'pop' }}
        withArrow
        position="bottom-end"
        withinPortal
        opened={isDropdownOpen}
      >
        {isDesktop ? (
          <Menu.Target>
            <Button
              className={classes.filter}
              pl={10}
              pr={9}
              bg={isDropdownOpen ? '#f8f8f8' : undefined}
              variant="default"
              onClick={toggle}
            >
              <Text fz={14} fw={400} mr={9}>
                {t('Filter')}
              </Text>
              {isDropdownOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </Button>
          </Menu.Target>
        ) : (
          <Menu.Target>
            <Button
              className={classes.filter}
              bg={isDropdownOpen ? '#f8f8f8' : undefined}
              variant="default"
              onClick={toggle}
            >
              <FilterIcon />
            </Button>
          </Menu.Target>
        )}
        <Menu.Dropdown className={classes.dropDown}>
          {/* {filterItem.map((item) => (
                <Menu.Item closeMenuOnClick={false} key={item.label}>
                  <Checkbox label={item.label} checked={item.checked} onChange={item.onChange} />
                </Menu.Item>
              ))} */}
          {filterItem}
          {haveButton ? (
            <Button
              className={classes.apply}
              customType={OAMButtonType.DARK}
              // fullWidth
              type="button"
              onClick={() => {
                onFilter();
                closeDropdowm();
              }}
            >
              {t('Apply')}
            </Button>
          ) : null}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );

  const mobileActions = (
    <Flex justify="flex-end" gap={10} sx={{ flex: 1 }}>
      {actions.map(({ icon, action, disabled, dropdown, onDropdownItemClick }, index) => {
        if (dropdown) {
          const menuButton = (
            <Button
              customType={OAMButtonType.LIGHT_OUTLINE}
              className={classes.iconButton}
              disabled={disabled}
            >
              {icon}
            </Button>
          );
          return (
            <LeveledMenu
              key={`key-${index}`}
              trigger={menuButton}
              options={dropdown}
              onClickItem={onDropdownItemClick}
            />
          );
        }
        return (
          <Button
            key={`key-${index}`}
            customType={index === 0 ? OAMButtonType.DARK : OAMButtonType.LIGHT_OUTLINE}
            className={classes.iconButton}
            onClick={action}
            disabled={disabled}
          >
            {icon}
          </Button>
        );
      })}
    </Flex>
  );

  const mobileSearchFilter = (
    <Flex justify="space-between" sx={{ flex: 1 }}>
      <Button variant="default" className={classes.selectAll}>
        <Checkbox
          label={t('Select_all')}
          styles={() => ({
            inner: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: rem(8),
            },
            input: {
              width: rem(14),
              height: rem(14),
              borderColor: '#666666',
            },
            label: {
              paddingLeft: rem(8),
              paddingRight: rem(16),
            },
          })}
          checked={isAllChecked}
          indeterminate={indeterminate}
          onChange={onAllChecked}
          disabled={checkAllDisabled}
        />
      </Button>
      <Group sx={{ gap: rem(10) }}>
        <Button className={classes.filter} onClick={() => open()}>
          <SearchIcon />
        </Button>
        {filterButton}
      </Group>
    </Flex>
  );

  const searchAndActions = (
    <>
      <div className={classes.searchBar}>
        <form
          onSubmit={(x) => {
            x.preventDefault();
            onSearch(searchValue);
          }}
        >
          <SearchInput
            placeholder={defaultPlaceholder}
            value={searchValue}
            onChange={onChangeSearch}
            onClear={onClearSearch}
          />
        </form>
        {filterButton}
      </div>
      {actions && (
        <div className={classes.btnGroup}>
          {actions.map(({ icon, text, action, disabled, dropdown, onDropdownItemClick }, index) => {
            const actionName = isSmallerDesktop ? text.split(' ')[0] : text;
            if (dropdown) {
              const menuButton = (
                <Button
                  customType={OAMButtonType.LIGHT_OUTLINE}
                  leftIcon={icon}
                  disabled={disabled}
                  styles={() => ({
                    leftIcon: {
                      marginRight: rem(1),
                    },
                    label: {
                      width: '100%',
                    },
                  })}
                >
                  {text}
                </Button>
              );
              return (
                <LeveledMenu
                  key={`key-${index}`}
                  trigger={menuButton}
                  options={dropdown}
                  onClickItem={onDropdownItemClick}
                />
              );
            }
            return (
              <Button
                key={`key-${index}`}
                customType={index === 0 ? OAMButtonType.DARK : OAMButtonType.LIGHT_OUTLINE}
                leftIcon={icon}
                onClick={action}
                disabled={disabled}
                styles={() => ({
                  leftIcon: {
                    marginRight: rem(1),
                  },
                  label: {
                    width: '100%',
                  },
                })}
              >
                {actionName}
              </Button>
            );
          })}
        </div>
      )}
    </>
  );
  return (
    <>
      {visible &&
        createPortal(
          <Overlay className={classes.overlay} color="#000" opacity={0.4} onClick={close} />,
          document.getElementById('__next')!,
        )}
      {visible ? (
        <form
          onSubmit={(x) => {
            x.preventDefault();
            onSearch(searchValue);
          }}
        >
          <SearchInput
            className={classes.search}
            placeholder={defaultPlaceholder}
            value={searchValue}
            onChange={onChangeSearch}
            onClear={onClearSearch}
            width="100vw"
          />
        </form>
      ) : null}
      <div className={classes.functionBar}>
        {isMobile ? (
          <>
            {mobileActions}
            {mobileSearchFilter}
          </>
        ) : (
          searchAndActions
        )}
      </div>
    </>
  );
};

export default ActionBar;
