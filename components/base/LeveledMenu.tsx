import type { ReactElement, JSXElementConstructor } from 'react';
import { Menu, MenuItem, SubMenu } from '@szhsin/react-menu';
import { Tooltip } from '@mantine/core';

import styles from './style/LeveledMenu.module.css';
import tooltipStyles from '../../style/tooltip';

export type MenuOption = {
  label: string;
  value: string;
  subMenu?: MenuOption[];
  disabled?: boolean;
  tip?: string;
};

interface LeveledMenuProps {
  options: MenuOption[];
  trigger: ReactElement<any, string | JSXElementConstructor<any>>;
  onClickItem?: (value: string) => any;
}

const menuItemClassName = ({ hover, disabled }: { hover: boolean; disabled: boolean }) =>
  disabled ? styles.menuItemDisabled : hover ? styles.menuItemHover : styles.menuItem;

function renderMenuItem(option: MenuOption, valuePath: string[]) {
  if (option.subMenu) {
    valuePath.push(option.value);
    const rendered = (
      <SubMenu
        key={option.value}
        label={option.label}
        menuClassName={styles.menu}
        itemProps={{ className: menuItemClassName }}
      >
        {option.subMenu.map((subOption) => renderMenuItem(subOption, valuePath))}
      </SubMenu>
    );
    valuePath.pop();
    return rendered;
  }
  const itemValue = JSON.stringify([...valuePath, option.value]);
  if (!option.tip) {
    return (
      <MenuItem
        key={option.value}
        value={itemValue}
        disabled={!!option.disabled}
        className={menuItemClassName}
      >
        {option.label}
      </MenuItem>
    );
  }
  return (
    <Tooltip key={option.value} label={option.tip} position="top" styles={tooltipStyles()}>
      <MenuItem value={itemValue} disabled={!!option.disabled} className={menuItemClassName}>
        {option.label}
      </MenuItem>
    </Tooltip>
  );
}

const ANCHOR_MENU_GAP = 12;

export default function LeveledMenu(props: LeveledMenuProps) {
  const valuePath: string[] = [];
  return (
    <Menu
      menuButton={props.trigger}
      onItemClick={(event) => {
        props.onClickItem && props.onClickItem(event.value);
      }}
      menuClassName={styles.menu}
      gap={ANCHOR_MENU_GAP}
    >
      {props.options.map((someOption) => renderMenuItem(someOption, valuePath))}
    </Menu>
  );
}
