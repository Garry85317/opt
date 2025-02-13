import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OAMSearchInput from '../components/base/Search';

test('contain assigned values', () => {
  const value = 'test';
  const onChangeMock = jest.fn();

  render(<OAMSearchInput value={value} onChange={onChangeMock} rightSection={value} />);
  const input = screen.getByPlaceholderText('Search');
  expect(input).toHaveValue('test');
});
