import React, { Fragment } from 'react';

const Roadmap = () =>
{
    return (
        <Fragment>
            <div className="gg-panel active" id="panel-roadmap">

                <div className="gg-kicker" style={{ marginBottom: '10px' }}>Development Status</div>
                <div className="gg-panel-heading" style={{ marginBottom: '4px' }}>
                    GroceryGenie <em>Roadmap</em>
                </div>
                <div className="gg-sub-heading" style={{ marginBottom: '28px' }}>
                    Current Version: v0.9.5
                </div>

                <div style={{ maxWidth: '740px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {/* Current status */}
                    <div className="gg-card" style={{ padding: '22px 26px' }}>
                        <div className="gg-roadmap-section-label accent-plain">Current Status</div>
                        <div style={{ fontFamily: 'var(--f-body)', fontSize: '15px', color: 'var(--text-dim)', lineHeight: '1.65' }}>
                            Core features are implemented and working, but data is still stored in-memory.
                            MongoDB persistence is planned for before the official v1.0 release.
                        </div>
                    </div>

                    {/* Upcoming features */}
                    <div className="gg-card" style={{ padding: '22px 26px' }}>
                        <div className="gg-roadmap-section-label accent-red">Upcoming Features — v1.0.0</div>
                        <div className="gg-roadmap-list">
                            <div className="gg-roadmap-item">Shopping List Page</div>
                            <div className="gg-roadmap-item">
                                Add Missing Ingredients to Shopping List: from the "What Can I Make?" page, instantly send missing ingredients to the shopping list.
                            </div>
                            <div className="gg-roadmap-item">
                                Post-Recipe Prompt: {' '}
                                <em style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontFamily: 'var(--f-body)' }}>
                                    "Add used ingredients to shopping list?"
                                </em>
                            </div>
                            <div className="gg-roadmap-item" style={{ color: 'var(--accent)' }}>
                                <i className="bi bi-database-fill-gear" style={{ fontSize: '11px', marginRight: '6px' }}></i>
                                <s>MongoDB Integration, full persistence</s>
                            </div>
                            <div className="gg-roadmap-item">Search &amp; Filter: recipes and pantry items, with category filtering</div>
                            <div className="gg-roadmap-item">Ingredient Persistence (Quantity = 0 but Saved): visually grayed out</div>
                            <div className="gg-roadmap-item">Ingredient &amp; Recipe Tags: poultry, seafood, frozen, main dish, etc.</div>
                        </div>
                    </div>

                    {/* Future ideas */}
                    <div className="gg-card" style={{ padding: '22px 26px' }}>
                        <div className="gg-roadmap-section-label accent-teal">Future Ideas 🟉 Post 1.0.0</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div className="gg-future-item">Export shopping list to PDF or phone-friendly view</div>
                            <div className="gg-future-item">AI-suggested recipes based on partial ingredients</div>
                            <div className="gg-future-item">Auto-detect duplicates in pantry: e.g. "milk" vs "2% milk"</div>
                            <div className="gg-future-item">Dark / Light / Cozy / Modern / Cyberpunk themes</div>
                            <div className="gg-future-item">Ingredient DB: press [+] on an ingredient instead of manual entry</div>
                            <div className="gg-future-item">Changelog system</div>
                        </div>
                    </div>

                    {/* Bugs */}
                    <div className="gg-card" style={{ padding: '22px 26px' }}>
                        <div className="gg-roadmap-section-label accent-plain">Known Bugs</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div className="gg-future-item" style={{ '--dot-color': 'var(--primary)' }}>On mobile view the navbar is too wide: no responsive design yet</div>
                            <div className="gg-future-item">Duplicate pantry entries possible</div>
                            <div className="gg-future-item">On mobile view in Recipes, the two columns collide</div>
                            <div className="gg-future-item">"Items in Pantry" counts items not total quantity</div>
                        </div>
                    </div>

                    {/* Documentation */}
                    <div className="gg-kicker" style={{ marginTop: '12px', marginBottom: '10px' }}>Documentation</div>
                    <div className="gg-panel-heading" style={{ fontSize: '26px', marginBottom: '20px' }}>
                        How to Use <em>GroceryGenie</em>
                    </div>

                    <div className="gg-card" style={{ padding: '22px 26px' }}>
                        <div className="gg-roadmap-section-label accent-plain">Pantry Page</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div className="gg-future-item">Click "Add to Pantry" to add ingredients</div>
                            <div className="gg-future-item">Enter name, quantity, and unit</div>
                            <div className="gg-future-item">Use the pencil icon to edit, trash to delete</div>
                        </div>
                    </div>

                    <div className="gg-card" style={{ padding: '22px 26px' }}>
                        <div className="gg-roadmap-section-label accent-plain">Recipe Book</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div className="gg-future-item">Click [+] in the recipe list to add a new recipe</div>
                            <div className="gg-future-item">Add ingredients with name, qty, unit, one per row</div>
                            <div className="gg-future-item">Type instructions, one step per line</div>
                            <div className="gg-future-item">Click "Make Recipe" to subtract used ingredients from pantry</div>
                        </div>
                    </div>

                    <div className="gg-card" style={{ padding: '22px 26px' }}>
                        <div className="gg-roadmap-section-label accent-plain">What Can I Make?</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div className="gg-future-item">Shows recipes you can make right now with current pantry</div>
                            <div className="gg-future-item">Also shows recipes you're missing stuff for, tells you what's needed</div>
                            <div className="gg-future-item">Use the filter pills to narrow the view</div>
                        </div>
                    </div>

                    <div className="gg-card" style={{ padding: '22px 26px' }}>
                        <div className="gg-roadmap-section-label accent-plain">How to Build &amp; Run</div>
                        <div style={{ fontFamily: 'var(--f-body)', fontSize: '15px', color: 'var(--text-dim)', lineHeight: '1.7' }}>
                            <p style={{ marginBottom: '10px' }}>You need Node.js installed (<code style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', background: 'var(--bg-1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--accent)' }}>node -v</code> to check).</p>
                            <div className="gg-roadmap-list">
                                <div className="gg-roadmap-item">Clone: <code style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', color: 'var(--teal)' }}>git clone https://github.com/mackcutlerdev/Grocery-Genie</code></div>
                                <div className="gg-roadmap-item">Client: <code style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', color: 'var(--teal)' }}>cd client && npm install</code></div>
                                <div className="gg-roadmap-item">Server: <code style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', color: 'var(--teal)' }}>cd ../server && npm install</code></div>
                                <div className="gg-roadmap-item">Run: <code style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', color: 'var(--teal)' }}>npm run dev</code></div>
                                <div className="gg-roadmap-item">Open <code style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', color: 'var(--teal)' }}>http://localhost:3000</code></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    );
};

export default Roadmap;