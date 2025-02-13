// Import necessary testing libraries and dependencies
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActionsMenu from '../components/actionBar';
import { OverflowMenuIcon } from '../components/base/icon';

describe('ActionsMenu component', () => {
  test('action, label and text work', () => {
    const actions = [
      { icon: <OverflowMenuIcon />, text: 'Action 1', action: jest.fn(), label: 'test' },
    ];

    render(<ActionsMenu searchValue="" onSearch={() => {}} actions={actions} />);
    fireEvent.click(screen.getByText('Action 1'));
    expect(actions[0].action).toHaveBeenCalled();
    expect(actions[0].label).toBe('test');
    expect(screen.getByText('Action 1')).toBeInTheDocument();
  });
});

  test('handles click on disabled action', () => {
    const actions = [{ disabled: true, icon: <OverflowMenuIcon />, text: 'Action 1', action: jest.fn() }];
    render(<ActionsMenu actions={actions} searchValue="" onSearch={() => {}} />);
    fireEvent.click(screen.getByText('Action 1'));
    expect(actions[0].action).not.toHaveBeenCalled();
  });
