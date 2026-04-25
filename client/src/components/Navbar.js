import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () =>
{
    // Read initial theme from localStorage so it persists across reloads
    const [theme, setTheme] = useState(() =>
        localStorage.getItem('gg-theme') || 'dark'
    );

    // Write data-theme onto <html> whenever it changes — that one attribute
    // triggers all the CSS token overrides in index.css automatically
    useEffect(() =>
    {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('gg-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

    const isDark = theme === 'dark';
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

            {/* Footer — version + theme toggle */}
            <div className="gg-sidebar-footer">
                {/* Theme toggle button */}
                <button
                    onClick={toggleTheme}
                    className="gg-btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', marginBottom: '10px' }}
                    title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                >
                    <i className={`bi bi-${isDark ? 'sun' : 'moon-stars'}`}></i>
                    <span style={{ marginLeft: '6px' }}>{isDark ? 'Light' : 'Dark'}</span>
                </button>
                <div className="gg-version-tag">v<em>0.9.1</em> · prototype</div>
            </div>
        </aside>
    );
};

export default Navbar;