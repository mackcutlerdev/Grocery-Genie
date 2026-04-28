import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function LoginPage()
{
    const history = useHistory();

    const [mode, setMode] = useState('login');      // 'login' | 'register'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');     // only used in register mode
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isRegister = mode === 'register';

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setError('');

        if(!username.trim() || !password)
        {
            setError('Please fill in all fields');
            return;
        }

        if(isRegister && password !== confirm)
        {
            setError('Passwords do not match');
            return;
        }

        /* Password validation */
        if(isRegister) 
        {
            if (password.trim().length === 0) 
            {
                setError('Password cannot be empty or spaces only');
                return;
            }

            if(password.length < 6) 
            {
                setError('Password must be at least 6 characters');
                return;
            }

            if(!/[A-Z]/.test(password)) 
            {
                setError('Include at least one uppercase letter');
                return;
            }

            if(!/[0-9]/.test(password)) 
            {
                setError('Include at least one number');
                return;
            }
        }

        setLoading(true);

        try
        {
            const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

            const res = await fetch(endpoint,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password }),
            });

            const data = await res.json();

            if(!res.ok)
            {
                setError(data.msg || 'Something went wrong');
                setLoading(false);
                return;
            }

            // Store token and user info, api.js will pick these up for every future request
            localStorage.setItem('gg-token', data.token);
            localStorage.setItem('gg-user', JSON.stringify(data.user));

            // Send the user to the dashboard
            history.push('/');
        }
        catch(err)
        {
            setError('Could not reach the server. Try again.');
            setLoading(false);
        }
    };

    const switchMode = () =>
    {
        setMode(isRegister ? 'login' : 'register');
        setError('');
        setPassword('');
        setConfirm('');
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            background: 'var(--bg-0)',
        }}>
            <div style={{
                width: '100%', maxWidth: '420px',
                background: 'linear-gradient(160deg, var(--bg-3) 0%, var(--bg-1) 100%)',
                border: '1px solid var(--hairline-mid)',
                borderRadius: 'var(--r-xl)',
                overflow: 'hidden',
                position: 'relative',
            }}>
                {/* Shimmer top line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(232,132,90,0.5), transparent)' }}></div>

                <div style={{ padding: '40px 36px 36px' }}>

                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
                        <div className="gg-logo-orb"></div>
                        <div className="gg-logo-wordmark">
                            <div className="gg-logo-grocery">Grocery</div>
                            <div className="gg-logo-genie">Genie</div>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="gg-kicker" style={{ marginBottom: '8px' }}>
                        {isRegister ? 'Create Account' : 'Welcome Back'} 
                    </div>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: '30px', fontWeight: 500, fontStyle: 'italic', marginBottom: '28px', lineHeight: 1.1 }}>
                        {isRegister ? <>Start your <em style={{ color: 'var(--accent)' }}>kitchen</em></> : <>Sign <em style={{ color: 'var(--accent)' }}>in</em></>}
                    </div>

                    {/* Error message */}
                    {error && (
                        <div style={{
                            background: 'rgba(133,32,48,0.15)',
                            border: '1px solid rgba(133,32,48,0.35)',
                            borderRadius: 'var(--r-sm)',
                            padding: '10px 14px',
                            marginBottom: '18px',
                            fontFamily: 'var(--f-body)',
                            fontSize: '14px',
                            color: 'var(--accent)',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                        <div>
                            <label className="gg-label" htmlFor="lp-username">Username</label>
                            <input
                                className="gg-input"
                                id="lp-username"
                                type="text"
                                placeholder="e.g. johndoe"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="gg-label" htmlFor="lp-password">Password</label>
                            <input
                                className="gg-input"
                                id="lp-password"
                                type="password"
                                placeholder="6+ characters"
                                autoComplete={isRegister ? 'new-password' : 'current-password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {isRegister && (
                            <div>
                                <label className="gg-label" htmlFor="lp-confirm">Confirm Password</label>
                                <input
                                    className="gg-input"
                                    id="lp-confirm"
                                    type="password"
                                    placeholder="Same password again"
                                    autoComplete="new-password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="gg-btn-primary"
                            disabled={loading}
                            style={{ width: '100%', justifyContent: 'center', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading
                                ? <><i className="bi bi-hourglass-split"></i><span>Please wait…</span></>
                                : isRegister
                                    ? <><i className="bi bi-person-plus"></i><span>Create Account</span></>
                                    : <><i className="bi bi-box-arrow-in-right"></i><span>Sign In</span></>
                            }
                        </button>
                    </form>

                    {/* Mode switcher */}
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '8px' }}>
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}
                        </div>
                        <button
                            onClick={switchMode}
                            className="gg-btn-ghost"
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {isRegister ? 'Sign In Instead' : 'Create Account'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LoginPage;