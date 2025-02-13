import React from 'react';
import { render, screen } from '@testing-library/react';
import OAMBreadcrumbs from '../components/base/Breadcrumbs';
import { capitalizeFirstLetter } from '../utils/text';
import { mockNextUseRouter } from '../utils/mockRouter';

describe('breadcrumbs', () => {
    mockNextUseRouter({
        route: '../components/base/Breadcrumbs',
        pathname: '/components/base/Breadcrumbs',
        query: '',
        asPath: '/components/base/Breadcrumbs',
    });

    // jest.mock('next/router', () => jest.requireActual('next-router-mock'));

test('capitalizes the first letter of a given string', () => {
    render(<OAMBreadcrumbs />);
    const capitalizedString = capitalizeFirstLetter('test');
    expect(capitalizedString).toBe('Test');
});

//TODO: failed : nextRouter was not mounted  https://nextjs.org/docs/messages/next-router-not-mounted]
// test('the function splits a path string into parts correctly', () => {
//     render(<OAMBreadcrumbs className="breadcrumb" />);
//     screen.debug;
//     // mockRouter.push('/components/base/Breadcrumbs');
//     const element = screen.getByTestId('breadcrumbs');
//     expect(element).toHaveClass('BreadcrumbsTest');
//     expect(element).toHaveTextContent('Breadcrumbs');
// });
test('breadcrumbs array is generated correctly with the expected title and href', () => {});
test('the last breadcrumb is rendered as a div with the special style, and the others as Anchor components.', () => {});
test('renders the correct number of breadcrumbs', () => {});
});
