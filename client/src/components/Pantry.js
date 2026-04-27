import React, { useState, Fragment } from 'react';

const Pantry = (props) =>
{
    const { items, isLoading, onAddItem, onUpdateItem, onDeleteItem } = props;

    // Add form state
    const [newName,     setNewName]     = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newUnit,     setNewUnit]     = useState('Unit');

    // Inline-edit state
    const [editingId,    setEditingId]    = useState(null);
    const [editName,     setEditName]     = useState('');
    const [editQuantity, setEditQuantity] = useState('');
    const [editUnit,     setEditUnit]     = useState('Unit');

    // Search & filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag,   setActiveTag]   = useState(null);   // null = no tag filter active

    // ── Tag filter framework ──────────────────────────────────────────────
    // Tags will be populated here once the Ingredient & Recipe Tags feature lands.
    // Shape: [{ label: 'Poultry', value: 'poultry' }, ...]
    // For now the array is empty — the pill row renders placeholder pills.
    const AVAILABLE_TAGS = [];

    const handleTagFilter = (tagValue) =>
    {
        setActiveTag((prev) => (prev === tagValue ? null : tagValue));
    };

    // ── Filtering logic ───────────────────────────────────────────────────
    const q = searchQuery.trim().toLowerCase();

    const filteredItems = (items || []).filter((item) =>
    {
        const matchesSearch = !q || item.name.toLowerCase().includes(q);
        // Tag filter hook: when tags exist, item.tags (array) would be checked here.
        // const matchesTag = !activeTag || (Array.isArray(item.tags) && item.tags.includes(activeTag));
        const matchesTag = !activeTag; // placeholder — always passes until tags exist
        return matchesSearch && matchesTag;
    });

    const hasItems   = items && items.length > 0;
    const hasResults = filteredItems.length > 0;
    const isFiltered = q.length > 0 || activeTag !== null;

    // ── Add form ──────────────────────────────────────────────────────────
    const resetAddForm = () => { setNewName(''); setNewQuantity(''); setNewUnit('Unit'); };

    const handleAddSubmit = (e) =>
    {
        e.preventDefault();
        if (!newName.trim()) return;
        onAddItem({ name: newName, quantity: Number(newQuantity) || 0, unit: newUnit });
        resetAddForm();
    };

    // ── Edit ──────────────────────────────────────────────────────────────
    const handleDelete = (id) =>
    {
        if (!window.confirm('Delete this item?')) return;
        onDeleteItem(id);
    };

    const startEditing = (item) =>
    {
        setEditingId(item.id);
        setEditName(item.name);
        setEditQuantity(item.quantity);
        setEditUnit(item.unit || 'Unit');
    };

    const cancelEditing = () =>
    {
        setEditingId(null);
        setEditName(''); setEditQuantity(''); setEditUnit('Unit');
    };

    const handleEditSubmit = (e, id) =>
    {
        e.preventDefault();
        onUpdateItem(id, { name: editName, quantity: Number(editQuantity) || 0, unit: editUnit });
        cancelEditing();
    };

    const UNITS = ['Unit','g','kg','ml','L','cup','tbsp','tsp','Box','oz','Package'];

    // Placeholder pills — shown only while AVAILABLE_TAGS is empty, non-interactive
    const PLACEHOLDER_TAGS = ['Poultry', 'Seafood', 'Dairy', 'Produce', 'Frozen', 'Favorite'];

    return (
        <Fragment>
            <div className="gg-panel active" id="panel-pantry">
                <div className="gg-pantry-layout">

                    {/* ── Left: search + filter + table ── */}
                    <div>

                        {/* Search bar */}
                        <div className="gg-pantry-search-row">
                            <div className="gg-search-wrap">
                                <i className="bi bi-search gg-search-icon"></i>
                                <input
                                    className="gg-input gg-search-input"
                                    type="text"
                                    placeholder="Search ingredients…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search pantry items"
                                />
                                {searchQuery && (
                                    <button
                                        className="gg-search-clear"
                                        onClick={() => setSearchQuery('')}
                                        title="Clear search"
                                        aria-label="Clear search"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                )}
                            </div>

                            {/* Result count — only shown while a query is active */}
                            {q && (
                                <div className="gg-search-count">
                                    {filteredItems.length} of {items ? items.length : 0}
                                </div>
                            )}
                        </div>

                        {/* Tag filter row — framework ready, pills disabled until Tags feature ships */}
                        <div className="gg-tag-filter-row">
                            <span className="gg-tag-filter-label">Tags</span>

                            {/* Live tags — this map populates once tags exist on items */}
                            {AVAILABLE_TAGS.map((tag) => (
                                <button
                                    key={tag.value}
                                    className={`gg-tag-pill${activeTag === tag.value ? ' active' : ''}`}
                                    onClick={() => handleTagFilter(tag.value)}
                                >
                                    {tag.label}
                                </button>
                            ))}

                            {/* Placeholder pills — visible preview while feature is pending */}
                            {AVAILABLE_TAGS.length === 0 && PLACEHOLDER_TAGS.map((label) => (
                                <span
                                    key={label}
                                    className="gg-tag-pill gg-tag-pill-soon"
                                    title="Tag filtering coming soon — assign tags to your ingredients first"
                                >
                                    {label}
                                </span>
                            ))}

                            {/* Clear active tag button */}
                            {activeTag && (
                                <button
                                    className="gg-tag-clear"
                                    onClick={() => setActiveTag(null)}
                                >
                                    <i className="bi bi-x"></i> Clear
                                </button>
                            )}
                        </div>

                        {/* Table */}
                        <div className="gg-table-wrap">
                            <table className="gg-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th>Unit</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading && (
                                        <tr>
                                            <td colSpan="4">
                                                <div style={{ padding: '24px', color: 'var(--text-faint)', fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                                    Loading pantry…
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {/* True empty — pantry has no items at all */}
                                    {!isLoading && !hasItems && (
                                        <tr>
                                            <td colSpan="4">
                                                <div className="gg-table-empty">
                                                    <div className="gg-table-empty-icon">🧺</div>
                                                    Your pantry is empty — add some ingredients to get started.
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {/* Items exist but search/filter returned nothing */}
                                    {!isLoading && hasItems && !hasResults && (
                                        <tr>
                                            <td colSpan="4">
                                                <div className="gg-table-empty">
                                                    <div className="gg-table-empty-icon" style={{ fontSize: '1.4rem' }}>🔍</div>
                                                    No ingredients match{' '}
                                                    {q && <em style={{ color: 'var(--accent)' }}>"{searchQuery}"</em>}
                                                    {activeTag && <> with tag <em style={{ color: 'var(--teal)' }}>{activeTag}</em></>}
                                                    <div style={{ marginTop: '10px' }}>
                                                        <button
                                                            className="gg-btn-ghost"
                                                            style={{ fontSize: '10px', padding: '5px 12px' }}
                                                            onClick={() => { setSearchQuery(''); setActiveTag(null); }}
                                                        >
                                                            Clear filters
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {filteredItems.map((item) =>
                                    {
                                        const isDepleted = Number(item.quantity) === 0 && editingId !== item.id;
                                        return (
                                        <tr key={item.id} className={isDepleted ? 'row-depleted' : ''}>
                                            <td>
                                                {editingId === item.id ? (
                                                    <input
                                                        className="gg-edit-input"
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                    />
                                                ) : (
                                                    <>
                                                        {item.name}
                                                        {isDepleted && (
                                                            <span className="gg-depleted-pill">Empty</span>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                            <td className="td-qty">
                                                {editingId === item.id ? (
                                                    <input
                                                        className="gg-edit-input"
                                                        type="number"
                                                        value={editQuantity}
                                                        onChange={(e) => setEditQuantity(e.target.value)}
                                                        style={{ width: '80px' }}
                                                    />
                                                ) : (
                                                    item.quantity
                                                )}
                                            </td>
                                            <td className="td-unit">
                                                {editingId === item.id ? (
                                                    <select
                                                        className="gg-edit-input"
                                                        value={editUnit}
                                                        onChange={(e) => setEditUnit(e.target.value)}
                                                        style={{ width: '90px' }}
                                                    >
                                                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                                    </select>
                                                ) : (
                                                    item.unit || 'Unit'
                                                )}
                                            </td>
                                            <td className="td-actions">
                                                <div className="td-actions-wrap">
                                                    {editingId === item.id ? (
                                                        <>
                                                            <button
                                                                className="gg-btn-teal"
                                                                style={{ padding: '5px 14px', fontSize: '12px' }}
                                                                onClick={(e) => handleEditSubmit(e, item.id)}
                                                            >
                                                                <i className="bi bi-floppy"></i> Save
                                                            </button>
                                                            <button
                                                                className="gg-btn-ghost"
                                                                style={{ padding: '5px 12px', fontSize: '10px' }}
                                                                onClick={cancelEditing}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="gg-btn-icon edit"
                                                                title="Edit"
                                                                onClick={() => startEditing(item)}
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button
                                                                className="gg-btn-icon"
                                                                title="Delete"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <i className="bi bi-trash3"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Right: add-item form card ── */}
                    <div className="gg-add-form-card">
                        <div className="gg-add-form-title">
                            Add <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>New Item</em>
                        </div>

                        <form onSubmit={handleAddSubmit}>
                            <div className="gg-add-form-row">
                                <label className="gg-label" htmlFor="p-name">Ingredient Name</label>
                                <input
                                    className="gg-input"
                                    id="p-name"
                                    type="text"
                                    placeholder="e.g. Whole Milk"
                                    autoComplete="off"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>

                            <div className="gg-add-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <label className="gg-label" htmlFor="p-qty">Quantity</label>
                                    <input
                                        className="gg-input"
                                        id="p-qty"
                                        type="text"
                                        placeholder="e.g. 2"
                                        value={newQuantity}
                                        onChange={(e) => setNewQuantity(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="gg-label" htmlFor="p-unit">Unit</label>
                                    <select
                                        className="gg-input"
                                        id="p-unit"
                                        value={newUnit}
                                        onChange={(e) => setNewUnit(e.target.value)}
                                    >
                                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="gg-btn-primary"
                                style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
                            >
                                <i className="bi bi-plus-lg"></i>
                                <span>Add to Pantry</span>
                            </button>
                        </form>

                        <div className="gg-divider"></div>
                        <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)', lineHeight: '1.7' }}>
                            🟉 Smart matching means "2% Milk" will satisfy a recipe calling for "Milk", no exact names needed.
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    );
};

export default Pantry;