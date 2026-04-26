import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// A simple component to render if the route is accessible
const DummyPage = () => <div>Protected Content</div>;

beforeEach(() => localStorage.clear());


describe('ProtectedRoute', () =>
{
    test('renders the component when a token exists', () =>
    {
        localStorage.setItem('gg-token', 'fake-token');

        render(
            <MemoryRouter initialEntries={['/pantry']}>
                <ProtectedRoute path="/pantry" component={DummyPage} />
            </MemoryRouter>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    test('redirects to /login when no token exists', () =>
    {
        render(
            <MemoryRouter initialEntries={['/pantry']}>
                <ProtectedRoute path="/pantry" component={DummyPage} />
                <Route path="/login" render={() => <div>Login Page</div>} />
            </MemoryRouter>
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
});