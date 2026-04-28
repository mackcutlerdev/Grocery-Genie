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

    test('redirects to /landing when no token exists', () => // NEW CODE UPDATED, was /login
    {
        render(
            <MemoryRouter initialEntries={['/pantry']}>
                <ProtectedRoute path="/pantry" component={DummyPage} />
                <Route path="/landing" render={() => <div>Landing Page</div>} /> 
            </MemoryRouter>
        );

        expect(screen.getByText('Landing Page')).toBeInTheDocument(); // NEW CODE UPDATED, was 'Login Page'
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
});