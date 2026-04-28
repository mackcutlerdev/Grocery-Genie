// api.js — central fetch wrapper for all shit
//
// Every API call in the app goes through one of these two functions
// instead of calling fetch() directly. This means:
//   1. The Authorization header is added automatically from localStorage
//   2. If any request gets a 401 back (token expired/invalid), the user is logged out and sent to /login automatically
//   3. There's one place to change if I ever rename an endpoint
//
// Usage:
//   import { apiGet, apiPost, apiPut, apiDelete } from '../api';
//   const items = await apiGet('/api/tempItems');
//   const result = await apiPost('/api/tempItems', { name: 'Egg', quantity: 12, unit: 'Unit' });

const getToken = () => localStorage.getItem('gg-token');

// Central 401 handler: clears storage and redirects to login
const handleUnauthorized = () =>
{
    localStorage.removeItem('gg-token');
    localStorage.removeItem('gg-user');
    window.location.href = '/login';
};

// Base fetch wrapper: attaches token, handles 401, returns parsed JSON
const apiFetch = async (url, options = {}) =>
{
    const token = getToken();

    const res = await fetch(url,
    {
        ...options,
        headers:
        {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    // Token expired or invalid so log the user out globally
    if(res.status === 401)
    {
        handleUnauthorized();
        throw new Error('Unauthorized');
    }

    return res.json();
};

// CRUD helper functions for each method, all funnel through apiFetch
export const apiGet = (url) => apiFetch(url, { method: 'GET' });
export const apiPost = (url, body) => apiFetch(url, { method: 'POST', body: JSON.stringify(body) });
export const apiPut = (url, body) => apiFetch(url, { method: 'PUT', body: JSON.stringify(body) });
export const apiDelete = (url) => apiFetch(url, { method: 'DELETE' });