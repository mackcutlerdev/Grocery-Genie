import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

// LoginPage uses useHistory which needs a router
const renderLoginPage = () =>
    render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    );

beforeEach(() =>
{
    localStorage.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn(); // mock fetch so no real network calls happen
});


// 1. Basic rendering

describe('basic rendering', () =>
{
    test('renders the username and password fields', () =>
    {
        renderLoginPage();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    test('renders the Sign In button by default', () =>
    {
        renderLoginPage();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    test('switches to register mode when Create Account is clicked', () =>
    {
        renderLoginPage();
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    test('switches back to login mode from register mode', () =>
    {
        renderLoginPage();
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        fireEvent.click(screen.getByText('Sign In Instead'));
        expect(screen.queryByLabelText('Confirm Password')).not.toBeInTheDocument();
    });
});


// 2. Login validation

describe('login validation', () =>
{
    test('shows error when submitting empty fields', async () =>
    {
        renderLoginPage();
        fireEvent.click(screen.getByText('Sign In'));
        expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
    });

    test('shows error when only username is filled', async () =>
    {
        renderLoginPage();
        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: 'john' },
        });
        fireEvent.click(screen.getByText('Sign In'));
        expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
    });
});


// 3. Register validation

describe('register validation', () =>
{
    const switchToRegister = () => fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    const fillForm = (username, password, confirm) =>
    {
        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: username },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: password },
        });
        fireEvent.change(screen.getByLabelText('Confirm Password'), {
            target: { value: confirm },
        });
    };

    test('shows error when passwords do not match', async () =>
    {
        renderLoginPage();
        switchToRegister();
        fillForm('john', 'Password1', 'Password2');
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    });

    test('shows error when password is too short', async () =>
    {
        renderLoginPage();
        switchToRegister();
        fillForm('john', 'Ab1', 'Ab1');
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
    });

    test('shows error when password has no uppercase letter', async () =>
    {
        renderLoginPage();
        switchToRegister();
        fillForm('john', 'password1', 'password1');
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        expect(await screen.findByText(/uppercase letter/i)).toBeInTheDocument();
    });

    test('shows error when password has no number', async () =>
    {
        renderLoginPage();
        switchToRegister();
        fillForm('john', 'Password', 'Password');
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        expect(await screen.findByText(/one number/i)).toBeInTheDocument();
    });
});


// 4. Successful login

describe('successful login', () =>
{
    test('stores token in localStorage on successful login', async () =>
    {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    token: 'fake-jwt-token',
                    user:  { username: 'john' },
                }),
            })
        );

        renderLoginPage();

        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: 'john' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'Password1' },
        });
        fireEvent.click(screen.getByText('Sign In'));

        await waitFor(() =>
        {
            expect(localStorage.getItem('gg-token')).toBe('fake-jwt-token');
        });
    });

    test('shows server error message when login fails', async () =>
    {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok:   false,
                json: () => Promise.resolve({ msg: 'Invalid credentials' }),
            })
        );

        renderLoginPage();

        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: 'john' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'Password1' },
        });
        fireEvent.click(screen.getByText('Sign In'));

        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });

    test('shows fallback error when server cannot be reached', async () =>
    {
        global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

        renderLoginPage();

        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: 'john' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'Password1' },
        });
        fireEvent.click(screen.getByText('Sign In'));

        expect(await screen.findByText(/could not reach the server/i)).toBeInTheDocument();
    });
});