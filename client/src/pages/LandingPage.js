import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// Fake review data 
const REVIEWS = [
    {
        name: 'Conner J.',
        handle: '@epicteddy',
        text: 'Really saves time, I was getting sick of searching my kitchen every night to figure out what I can make. Now I can just see what I can make.',
        stars: 5,
    },
    {
        name: 'Tony N.',
        handle: '@ton',
        text: 'Its super nice to be able to have all my recipes in one place, and make a shopping list from what I dont have automatically.',
        stars: 5,
    },
    {
        name: 'Jenny N.',
        handle: '@ruppert',
        text: 'I really love it! Its so pretty to look at and use! Excited to see where it goes.',
        stars: 5,
    },
    {
        name: 'Maple P.',
        handle: '@pearlmaple',
        text: 'Clean interface. Doesnt feel like another clunky food app. Its fast, its nice to look at, and it actually works.',
        stars: 5,
    },
];

// Features data
const FEATURES = [
    {
        icon: 'bi-basket2',
        title: 'Smart Pantry',
        desc: 'Track every ingredient you own with quantities and units. Items at zero stay visible so you know what to restock.',
    },
    {
        icon: 'bi-journal-bookmark',
        title: 'Recipe Book',
        desc: 'Store your own recipes with ingredients and step-by-step instructions. Tag them by diet, meal type, or whatever you need.',
    },
    {
        icon: 'bi-magic',
        title: 'What Can I Make?',
        desc: 'The matching engine cross-references your pantry and recipes in real time. It understands variants: "2% Milk" satisfies "Milk".',
    },
    {
        icon: 'bi-cart3',
        title: 'Shopping List',
        desc: 'Add missing ingredients straight from a recipe with one click. Smart merge means no duplicates, just bumped quantities.',
    },
];

// Logo orb
function LogoOrb({ size = 48 })
{
    return (
        <div style={{
            width: size, height: size,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 32% 28%, #E8845A, #852030 55%, #5C2230)',
            boxShadow: '0 0 0 1px rgba(240,222,200,0.12) inset, 0 6px 20px rgba(133,32,48,0.55)',
            position: 'relative',
            flexShrink: 0,
        }}>
            <span style={{
                position: 'absolute', top: -6, right: -5,
                fontSize: size * 0.24, color: '#E8845A',
                textShadow: '0 0 8px #E8845A',
            }}>🟉</span>
            <div style={{
                position: 'absolute', inset: size * 0.18,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, rgba(240,222,200,0.55), transparent 55%)',
            }} />
        </div>
    );
}

// Star row 
function Stars({ count = 5 })
{
    return (
        <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
            {Array.from({ length: count }).map((_, i) => (
                <i key={i} className="bi bi-star-fill" style={{ fontSize: 11, color: '#E8845A' }}></i>
            ))}
        </div>
    );
}

// Review card
function ReviewCard({ review, delay = 0 })
{
    return (
        <div className="gg-land-review-card" style={{ animationDelay: `${delay}ms` }}>
            <Stars count={review.stars} />
            <p className="gg-land-review-text">"{review.text}"</p>
            <div className="gg-land-review-author">
                <span className="gg-land-review-name">{review.name}</span>
                <span className="gg-land-review-handle">{review.handle}</span>
            </div>
        </div>
    );
}

// Feature card 
function FeatureCard({ feature, delay = 0 })
{
    return (
        <div className="gg-land-feature-card" style={{ animationDelay: `${delay}ms` }}>
            <div className="gg-land-feature-icon">
                <i className={`bi ${feature.icon}`}></i>
            </div>
            <div className="gg-land-feature-title">{feature.title}</div>
            <div className="gg-land-feature-desc">{feature.desc}</div>
        </div>
    );
}

// Fake app screenshot
// Renders a simplified mockup of the pantry table so there's something visual
function AppMockup()
{
    const rows = [
        { name: 'Yukon Gold Potato', qty: '4',   unit: 'UNIT',    depleted: false },
        { name: '2% Milk',           qty: '2',   unit: 'L',       depleted: false },
        { name: 'Unsalted Butter',   qty: '0',   unit: 'G',       depleted: true  },
        { name: 'Kraft Dinner',      qty: '4',   unit: 'PACKAGE', depleted: false },
        { name: 'Becel Margarine',   qty: '452', unit: 'G',       depleted: false },
    ];

    return (
        <div className="gg-land-mockup">
            {/* Mockup top bar */}
            <div className="gg-land-mockup-bar">
                <div className="gg-land-mockup-dot" style={{ background: '#852030' }} />
                <div className="gg-land-mockup-dot" style={{ background: '#E8845A', opacity: 0.5 }} />
                <div className="gg-land-mockup-dot" style={{ background: '#3D8C8C', opacity: 0.4 }} />
                <span className="gg-land-mockup-title"><em>Pantry</em></span>
            </div>

            {/* Fake search + tags */}
            <div className="gg-land-mockup-search">
                <i className="bi bi-search" style={{ fontSize: 10, color: 'var(--text-faint)', marginRight: 6 }}></i>
                <span style={{ color: 'var(--text-faint)', fontSize: 11, fontFamily: 'var(--f-body)' }}>Search ingredients…</span>
            </div>
            <div className="gg-land-mockup-tags">
                {['Produce', 'Dairy', 'Meat', 'Frozen', 'Favourite'].map((t, i) => (
                    <span key={t} className="gg-land-mockup-tag" style={i === 1 ? { borderColor: 'rgba(61,140,140,0.5)', color: 'var(--teal)', background: 'rgba(61,140,140,0.1)' } : {}}>{t}</span>
                ))}
            </div>

            {/* Fake table */}
            <div className="gg-land-mockup-table">
                <div className="gg-land-mockup-thead">
                    <span>Name</span><span>Qty</span><span>Unit</span>
                </div>
                {rows.map((row) => (
                    <div key={row.name} className={`gg-land-mockup-row${row.depleted ? ' depleted' : ''}`}>
                        <span>{row.name}{row.depleted && <span className="gg-land-mockup-empty">Empty</span>}</span>
                        <span style={{ color: row.depleted ? 'var(--text-faint)' : 'var(--accent)', fontFamily: 'var(--f-mono)', fontSize: 12 }}>{row.qty}</span>
                        <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.1em' }}>{row.unit}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Main landing page
function LandingPage()
{
    return (
        <div className="gg-land-root">

            {/* Ambient blobs (same as app body::before) */}
            <div className="gg-land-blobs" />

            {/* Grain overlay */}
            <div className="gg-land-grain" />

            {/* Nav */}
            <nav className="gg-land-nav">
                <div className="gg-land-nav-inner">
                    <div className="gg-land-nav-logo">
                        <LogoOrb size={34} />
                        <div>
                            <div className="gg-logo-grocery">Grocery</div>
                            <div className="gg-logo-genie">Genie</div>
                        </div>
                    </div>
                    <Link to="/login" className="gg-land-nav-cta">
                        Sign In <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="gg-land-hero">
                <div className="gg-land-hero-inner">
                    <div className="gg-land-hero-text">
                        <div className="gg-land-kicker">
                            <span className="gg-land-kicker-line" />
                            Smart Pantry Management
                        </div>
                        <h1 className="gg-land-hero-heading">
                            Stop throwing out<br />
                            food you <em>forgot</em> you had.
                        </h1>
                        <p className="gg-land-hero-sub">
                            GroceryGenie tracks your pantry, matches it against your recipes,
                            and tells you exactly what you can cook right now;
                            no guessing, no waste.
                        </p>
                        <div className="gg-land-hero-actions">
                            <Link to="/login" className="gg-land-btn-primary">
                                Get Started, it's free!
                                <i className="bi bi-arrow-right"></i>
                            </Link>
                            <a href="#features" className="gg-land-btn-ghost">
                                See how it works
                            </a>
                        </div>
                        <div className="gg-land-hero-note">
                            No credit card. No nonsense. Just your pantry, organized.
                        </div>
                    </div>

                    <div className="gg-land-hero-visual">
                        <AppMockup />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="gg-land-section" id="features">
                <div className="gg-land-section-inner">
                    <div className="gg-land-section-kicker">
                        <span className="gg-land-kicker-line" />
                        What it does
                    </div>
                    <h2 className="gg-land-section-heading">
                        Everything you need.<br /><em>Nothing you don't.</em>
                    </h2>
                    <div className="gg-land-features-grid">
                        {FEATURES.map((f, i) => (
                            <FeatureCard key={f.title} feature={f} delay={i * 80} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="gg-land-section gg-land-section-alt">
                <div className="gg-land-section-inner">
                    <div className="gg-land-section-kicker">
                        <span className="gg-land-kicker-line" />
                        Three steps
                    </div>
                    <h2 className="gg-land-section-heading">
                        Simple by design.
                    </h2>
                    <div className="gg-land-steps">
                        <div className="gg-land-step">
                            <div className="gg-land-step-num">01</div>
                            <div className="gg-land-step-title">Add your pantry</div>
                            <div className="gg-land-step-desc">Type in what you have at home: name, quantity, unit. Done in two minutes.</div>
                        </div>
                        <div className="gg-land-step-arrow"><i className="bi bi-arrow-right"></i></div>
                        <div className="gg-land-step">
                            <div className="gg-land-step-num">02</div>
                            <div className="gg-land-step-title">Save your recipes</div>
                            <div className="gg-land-step-desc">Add your go-to meals with ingredients and instructions. Tag them however you like.</div>
                        </div>
                        <div className="gg-land-step-arrow"><i className="bi bi-arrow-right"></i></div>
                        <div className="gg-land-step">
                            <div className="gg-land-step-num">03</div>
                            <div className="gg-land-step-title">Cook with confidence</div>
                            <div className="gg-land-step-desc">Hit "What Can I Make?" and see exactly what's cookable right now. Missing something? Add it to your list.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews */}
            <section className="gg-land-section">
                <div className="gg-land-section-inner">
                    <div className="gg-land-section-kicker">
                        <span className="gg-land-kicker-line" />
                        From real users
                    </div>
                    <h2 className="gg-land-section-heading">
                        People actually <em>use</em> it.
                    </h2>
                    <div className="gg-land-reviews-grid">
                        {REVIEWS.map((r, i) => (
                            <ReviewCard key={r.handle} review={r} delay={i * 80} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA (Call to Action) */}
            <section className="gg-land-section gg-land-cta-section">
                <div className="gg-land-cta-inner">
                    <div className="gg-land-cta-orb">
                        <LogoOrb size={64} />
                    </div>
                    <h2 className="gg-land-cta-heading">
                        Your pantry is waiting.
                    </h2>
                    <p className="gg-land-cta-sub">
                        Join GroceryGenie and stop wasting food, money, and mental energy on "what's for dinner?".
                    </p>
                    <Link to="/login" className="gg-land-btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                        Create your free account
                        <i className="bi bi-arrow-right"></i>
                    </Link>
                    <div className="gg-land-hero-note" style={{ marginTop: 14 }}>Already have an account? <Link to="/login" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Sign in</Link></div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="gg-land-footer">
                <div className="gg-land-footer-inner">
                    <div className="gg-land-footer-logo">
                        <LogoOrb size={24} />
                        <span style={{ fontFamily: 'var(--f-display)', fontSize: 15, fontStyle: 'italic', color: 'var(--accent)' }}>GroceryGenie</span> <div className="gg-land-footer-note">· by Mack Cutler</div>
                    </div>
                    <div className="gg-land-footer-note">v0.9.5 · Beta · Built with React &amp; MongoDB</div>
                </div>
            </footer>

        </div>
    );
}

export default LandingPage;