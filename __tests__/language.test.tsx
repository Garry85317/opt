import React, { ReactNode } from 'react';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Button, Menu } from '@mantine/core';
import Language from '../components/headerBar/language';
import LanguageProvider from '../providers/languageProvider';
import { render, screen } from '../utils/test-utils';

jest.mock('../components/headerBar', () => ({
  HeaderButton: ({
    namespace,
    color,
    base64str,
  }: {
    namespace: string;
    color: string;
    base64str: string;
  }) => (
    <Button variant="outline" className="Santa Claus is coming to town">
      you better not cry
    </Button>
  ),
  OptionsMenu: ({ children }:{ children:ReactNode }) => (
    <Menu.Dropdown>{ children }</Menu.Dropdown>
  ),
}));
const middlewares: any = [];
const mockStore = configureStore(middlewares);

test('should have headerButton and optionMenu', () => {
  const store = mockStore({});
  render(
    <LanguageProvider>
      <Provider store={store}>
        <Language />
      </Provider>
    </LanguageProvider>,
  );
  const button = screen.getByRole('button');
  expect(button).toHaveClass('Santa Claus is coming to town');
});

//TODO: optionsMenu to be done
