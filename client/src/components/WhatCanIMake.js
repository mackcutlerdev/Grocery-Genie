import React, { Fragment, useState } from 'react';
import { canMakeRecipe, matchInfo, buildMeta } from '../utils/recipeUtils';

const WhatCanIMake = (props) =>
{
    const { pantryItems, recipes, isLoading, onReload, onOpenRecipe } = props;

    // 'all' | 'ready' | 'missing'
    const [filterMode, setFilterMode] = useState('all');

    const makeableRecipes = recipes.filter((r) => canMakeRecipe(r, pantryItems));
    const missingRecipes  = recipes.filter((r) => !canMakeRecipe(r, pantryItems));

    // Sort missing by % matched descending (closest to ready first)
    missingRecipes.sort((a, b) =>
    {
        const mA = matchInfo(a, pantryItems), mB = matchInfo(b, pantryItems);
        return (mB.matched / (mB.total || 1)) - (mA.matched / (mA.total || 1));
    });

    const showReady   = filterMode !== 'missing';
    const showMissing = filterMode !== 'ready';

    return (
        <Fragment>
            <div className="gg-panel active" id="panel-cook">

                {/* Intro */}
                <div style={{ marginBottom: '24px' }}>
                    <div className="gg-kicker" style={{ marginBottom: '8px' }}>Pantry Intelligence</div>
                    <p style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', color: 'var(--text-dim)', fontSize: '16px', maxWidth: '680px', lineHeight: '1.6', margin: 0 }}>
                        Based on your current pantry and saved recipes, here's what you can cook right now.
                        The matching engine understands ingredient variants: {' '}
                        <em style={{ color: 'var(--accent)' }}>"2% Milk"</em> counts as{' '}
                        <em style={{ color: 'var(--accent)' }}>"Milk"</em>.
                    </p>
                </div>

                {/* Filter bar */}
                <div className="gg-wcim-filter-bar">
                    <button
                        className={`gg-wcim-filter-btn${filterMode === 'all' ? ' active teal' : ''}`}
                        onClick={() => setFilterMode('all')}
                    >
                        All Recipes
                    </button>
                    <button
                        className={`gg-wcim-filter-btn${filterMode === 'ready' ? ' active teal' : ''}`}
                        onClick={() => setFilterMode('ready')}
                    >
                        🟉 Can Fully Make
                    </button>
                    <button
                        className={`gg-wcim-filter-btn${filterMode === 'missing' ? ' active' : ''}`}
                        onClick={() => setFilterMode('missing')}
                    >
                        Missing Ingredients
                    </button>
                    <button className="gg-btn-ghost" onClick={onReload} style={{ marginLeft: 'auto' }}>
                        <i className="bi bi-arrow-clockwise"></i> Reload
                    </button>
                </div>

                {isLoading && (
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '24px' }}>
                        Loading pantry and recipes…
                    </div>
                )}

                {!isLoading && recipes.length === 0 && (
                    <div className="gg-empty-state">
                        <div className="big-glyph">✦</div>
                        <p>Add pantry items and recipes to see what you can cook</p>
                    </div>
                )}

                {/* ── Can Fully Make ── */}
                {showReady && recipes.length > 0 && (
                    <div id="wcim-ready-section">
                        <div className="gg-wcim-section-title">
                            Can fully make
                            <span className="gg-badge-count">{makeableRecipes.length}</span>
                        </div>

                        {makeableRecipes.length === 0 ? (
                            <div className="gg-dash-empty">
                                No recipes are fully covered by your pantry yet.
                            </div>
                        ) : (
                            makeableRecipes.map((recipe) =>
                            {
                                const meta = buildMeta(recipe);
                                return (
                                    <div
                                        key={recipe.id}
                                        className="gg-wcim-recipe-card"
                                        onClick={() => onOpenRecipe(recipe.id)}
                                    >
                                        <div className="gg-wcim-card-stripe"></div>
                                        <div className="gg-wcim-card-body">
                                            <div style={{ flex: 1 }}>
                                                <div className="gg-wcim-recipe-name">{recipe.name}</div>
                                                {meta && (
                                                    <div className="gg-wcim-recipe-meta">{meta}</div>
                                                )}
                                            </div>
                                            <button
                                                className="gg-wcim-open-btn"
                                                onClick={(e) => { e.stopPropagation(); onOpenRecipe(recipe.id); }}
                                            >
                                                Open Recipe
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* ── Missing Ingredients ── */}
                {showMissing && recipes.length > 0 && (
                    <div id="wcim-missing-section" style={{ marginTop: showReady ? '32px' : '0' }}>
                        <div className="gg-wcim-section-title">
                            Missing Ingredients
                            <span className="gg-badge-count orange">{missingRecipes.length}</span>
                        </div>

                        {missingRecipes.length === 0 ? (
                            <div className="gg-dash-empty" style={{ borderColor: 'rgba(232,132,90,0.15)' }}>
                                🟉 You have all ingredients for every saved recipe!
                            </div>
                        ) : (
                            missingRecipes.map((recipe) =>
                            {
                                const m    = matchInfo(recipe, pantryItems);
                                const meta = buildMeta(recipe);
                                return (
                                    <div key={recipe.id} className="gg-wcim-missing-card">
                                        <div
                                            className="gg-wcim-missing-header"
                                            onClick={() => onOpenRecipe(recipe.id)}
                                        >
                                            <div>
                                                <div className="gg-wcim-missing-name">{recipe.name}</div>
                                                {meta && (
                                                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.12em', color: 'var(--text-faint)', marginTop: '3px' }}>
                                                        {meta}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="gg-wcim-match-info">{m.matched} / {m.total} have</span>
                                        </div>

                                        <div className="gg-wcim-missing-body">
                                            {m.missingList.map((ing, index) => (
                                                <div key={index} className="gg-missing-ing-item">
                                                    <div className="gg-missing-dot"></div>
                                                    <span>{ing.name}</span>
                                                    <span className="gg-missing-ing-qty">
                                                        {ing.needed !== null && ing.needed !== undefined ? ing.needed : ''}
                                                        {ing.unit ? ` ${ing.unit}` : ''}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

            </div>
        </Fragment>
    );
};

export default WhatCanIMake;