import React, { Fragment } from 'react';

const HomeDashboard = (props) =>
{
    const { isLoading, stats, makeableRecipes, onOpenRecipe, onReload } = props;

    return (
        <Fragment>
            <div className="gg-panel active" id="panel-dashboard">

                {/* Stat cards */}
                <div className="gg-dash-stats">

                    <div className="gg-stat-card accent-red">
                        <div className="gg-stat-label">Items in Pantry</div>
                        <div className="gg-stat-num col-accent">{stats.pantryCount}</div>
                        <div className="gg-stat-sub">ingredients tracked</div>
                        <div className="gg-stat-glyph">◈</div>
                    </div>

                    <div className="gg-stat-card">
                        <div className="gg-stat-label">Total Recipes</div>
                        <div className="gg-stat-num col-warm">{stats.recipeCount}</div>
                        <div className="gg-stat-sub">in your book</div>
                        <div className="gg-stat-glyph">❦</div>
                    </div>

                    <div className="gg-stat-card accent-teal">
                        <div className="gg-stat-label">Recipes You Can Make Now</div>
                        <div className="gg-stat-num col-teal">{stats.makeableCount}</div>
                        <div className="gg-stat-sub">ready to cook tonight</div>
                        <div className="gg-stat-glyph">🟉</div>
                    </div>
                </div>

                {/* Section header */}
                <div className="gg-kicker" style={{ marginBottom: '12px' }}>Tonight's options</div>
                <div className="gg-dash-section-title">
                    What Can I Make <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Today?</em>
                </div>
                <div className="gg-sub-heading" style={{ marginBottom: '18px' }}>
                    Recipes fully covered by your current pantry
                </div>

                {/* Reload button, subtle ghost */}
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={onReload} className="gg-btn-ghost">
                        <i className="bi bi-arrow-clockwise"></i> Refresh
                    </button>
                </div>

                {isLoading && (
                    <div className="gg-dash-empty">Loading data…</div>
                )}

                {/* Cookable recipe list */}
                {!isLoading && (
                    <div className="gg-dash-cookable-list">
                        {(!makeableRecipes || makeableRecipes.length === 0) && (
                            <div className="gg-dash-empty">
                                No recipes are fully makeable yet, add more ingredients to your pantry!
                            </div>
                        )}

                        {makeableRecipes && makeableRecipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="gg-dash-recipe-row"
                                onClick={() => onOpenRecipe(recipe.id)}
                            >
                                <div style={{ flex: 1 }}>
                                    <div className="gg-dash-recipe-name">{recipe.name}</div>
                                    <div className="gg-dash-recipe-meta">
                                        {recipe.prep || '–'} · {recipe.servings || '–'} servings
                                    </div>
                                </div>
                                <span className="gg-cookable-pill">✦ Ready</span>
                                <button
                                    className="gg-btn-ghost"
                                    onClick={(e) => { e.stopPropagation(); onOpenRecipe(recipe.id); }}
                                    style={{ marginLeft: '4px' }}
                                >
                                    Open Recipe
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default HomeDashboard;