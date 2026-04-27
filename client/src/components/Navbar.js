import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

const Navbar = () =>
{
    const history = useHistory();

    const [theme,    setTheme]    = useState(() => localStorage.getItem('gg-theme') || 'dark');
    const [username, setUsername] = useState('');

    // Apply theme token to <html> on change
    useEffect(() =>
    {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('gg-theme', theme);
    }, [theme]);

    // Read the stored username so we can display it in the sidebar
    useEffect(() =>
    {
        const stored = localStorage.getItem('gg-user');
        if (stored)
        {
            try { setUsername(JSON.parse(stored).username || ''); }
            catch {}
        }
    }, []);

    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    const isDark      = theme === 'dark';

    const handleLogout = () =>
    {
        localStorage.removeItem('gg-token');
        localStorage.removeItem('gg-user');
        history.push('/login');
    };

    return (
        <aside id="gg-sidebar">

            {/* Logo */}
            <NavLink exact to="/" className="gg-sidebar-logo" style={{ textDecoration: 'none' }}>
                <div className="gg-logo-orb"></div>
                <div className="gg-logo-wordmark">
                    <div className="gg-logo-grocery">Grocery</div>
                    <div className="gg-logo-genie">Genie</div>
                </div>
            </NavLink>

            {/* Nav links */}
            <nav className="gg-sidebar-nav">
                <NavLink exact to="/"           className="gg-nav-item" activeClassName="active">
                    <span className="gg-nav-icon"><i className="bi bi-grid-1x2"></i></span>
                    <span className="gg-nav-label">Dashboard</span>
                </NavLink>
                <NavLink to="/pantry"           className="gg-nav-item" activeClassName="active">
                    <span className="gg-nav-icon"><i className="bi bi-basket"></i></span>
                    <span className="gg-nav-label">Pantry</span>
                </NavLink>
                <NavLink to="/recipes"          className="gg-nav-item" activeClassName="active">
                    <span className="gg-nav-icon"><i className="bi bi-journal-richtext"></i></span>
                    <span className="gg-nav-label">Recipe Book</span>
                </NavLink>
                <NavLink to="/whatcanimake"     className="gg-nav-item" activeClassName="active">
                    <span className="gg-nav-icon"><i className="bi bi-stars"></i></span>
                    <span className="gg-nav-label">What Can I Make?</span>
                </NavLink>
                <NavLink to="/roadmap"          className="gg-nav-item" activeClassName="active">
                    <span className="gg-nav-icon"><i className="bi bi-map"></i></span>
                    <span className="gg-nav-label">Roadmap</span>
                </NavLink>
                <NavLink to="/sources"          className="gg-nav-item" activeClassName="active">
                    <span className="gg-nav-icon"><i className="bi bi-bookmark-star"></i></span>
                    <span className="gg-nav-label">Sources</span>
                </NavLink>
            </nav>

            {/* Footer — username, theme toggle, logout */}
            <div className="gg-sidebar-footer">

                {/* Logged-in user */}
                {username && (
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="bi bi-person-circle" style={{ fontSize: '11px' }}></i>
                        <span className="gg-nav-label">{username}</span>
                    </div>
                )}

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="gg-btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', marginBottom: '6px' }}
                    title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                >
                    <i className={`bi bi-${isDark ? 'sun' : 'moon-stars'}`}></i>
                    <span className="gg-nav-label" style={{ marginLeft: '6px' }}>{isDark ? 'Light' : 'Dark'}</span>
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="gg-btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', marginBottom: '10px' }}
                >
                    <i className="bi bi-box-arrow-left"></i>
                    <span className="gg-nav-label" style={{ marginLeft: '6px' }}>Logout</span>
                </button>

                <div className="gg-version-tag">v<em>0.9.75</em> · prototype</div>
            </div>
        </aside>
    );
};

export default Navbar;