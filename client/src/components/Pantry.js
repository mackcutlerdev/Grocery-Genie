import React, { useState, Fragment } from 'react';

const Pantry = (props) =>
{
    const { items, isLoading, onAddItem, onUpdateItem, onDeleteItem } = props;

    // Add form state
    const [newName,     setNewName]     = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newUnit,     setNewUnit]     = useState('Unit');
    const [newTags,     setNewTags]     = useState([]);      
    const [newTagInput, setNewTagInput] = useState('');     

    // Inline-edit state
    const [editingId,    setEditingId]    = useState(null);
    const [editName,     setEditName]     = useState('');
    const [editQuantity, setEditQuantity] = useState('');
    const [editUnit,     setEditUnit]     = useState('Unit');
    const [editTags,     setEditTags]     = useState([]);     
    const [editTagInput, setEditTagInput] = useState('');     

    // Search & filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag,   setActiveTag]   = useState(null);

    // default tags + collect all tags in use across items
    const DEFAULT_TAGS = ['Produce', 'Dairy', 'Meat', 'Seafood', 'Frozen', 'Pantry Staple', 'Spice', 'Beverage', 'Snack', 'Bakery', 'Favorite'];

    // build the full tag pool: defaults + any custom tags the user has already used
    const usedTags = [...new Set((items || []).flatMap((item) => item.tags || []))];
    const allTags  = [...new Set([...DEFAULT_TAGS, ...usedTags])];


    const handleTagFilter = (tagValue) =>
    {
        setActiveTag((prev) => (prev === tagValue ? null : tagValue));
    };

    // Filtering logic 
    const q = searchQuery.trim().toLowerCase();

    const filteredItems = (items || []).filter((item) =>
    {
        const matchesSearch = !q || item.name.toLowerCase().includes(q);
        const matchesTag    = !activeTag || (Array.isArray(item.tags) && item.tags.includes(activeTag)); // was placeholder, now real
        return matchesSearch && matchesTag;
    });

    const hasItems   = items && items.length > 0;
    const hasResults = filteredItems.length > 0;

    // Add form
    const resetAddForm = () =>
    {
        setNewName(''); setNewQuantity(''); setNewUnit('Unit');
        setNewTags([]); setNewTagInput(''); // reset tags too
    };

    const handleAddSubmit = (e) =>
    {
        e.preventDefault();
        if (!newName.trim()) return;
        onAddItem({ name: newName, quantity: Number(newQuantity) || 0, unit: newUnit, tags: newTags }); // pass tags
        resetAddForm();
    };

    const handleNewTagKeyDown = (e) =>
    {
        if (e.key !== 'Enter' && e.key !== ',') return;
        e.preventDefault();
        const tag = newTagInput.trim();
        if (tag && !newTags.includes(tag)) setNewTags((prev) => [...prev, tag]);
        setNewTagInput('');
    };

    const removeNewTag = (tag) => setNewTags((prev) => prev.filter((t) => t !== tag));
    const toggleNewTag = (tag) => setNewTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

    // Edit 
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
        setEditTags(Array.isArray(item.tags) ? [...item.tags] : []); // load existing tags
        setEditTagInput('');
        setEditTagPickerOpen(false); 
    };

    const cancelEditing = () =>
    {
        setEditingId(null);
        setEditName(''); setEditQuantity(''); setEditUnit('Unit');
        setEditTags([]); setEditTagInput(''); // reset tags
        setEditTagPickerOpen(false); 
    };

    const handleEditSubmit = (e, id) =>
    {
        e.preventDefault();
        onUpdateItem(id, { name: editName, quantity: Number(editQuantity) || 0, unit: editUnit, tags: editTags }); // pass tags
        cancelEditing();
    };

    const handleEditTagKeyDown = (e) =>
    {
        if (e.key !== 'Enter' && e.key !== ',') return;
        e.preventDefault();
        const tag = editTagInput.trim();
        if (tag && !editTags.includes(tag)) setEditTags((prev) => [...prev, tag]);
        setEditTagInput('');
    };

    const removeEditTag = (tag) => setEditTags((prev) => prev.filter((t) => t !== tag));
    const toggleEditTag = (tag) => setEditTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

    // controls whether the tag pill grid is expanded in the edit row
    const [editTagPickerOpen, setEditTagPickerOpen] = useState(false);

    const UNITS = ['Unit','g','kg','ml','L','cup','tbsp','tsp','Box','oz','Package'];

    return (
        <Fragment>
            <div className="gg-panel active" id="panel-pantry">
                <div className="gg-pantry-layout">

                    {/* Left: search + filter + table */}
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
                            {q && (
                                <div className="gg-search-count">
                                    {filteredItems.length} of {items ? items.length : 0}
                                </div>
                            )}
                        </div>

                        {/* Tag filter row, now uses real allTags */}
                        <div className="gg-tag-filter-row">
                            <span className="gg-tag-filter-label">Tags</span>
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    className={`gg-tag-pill${activeTag === tag ? ' active' : ''}`}
                                    onClick={() => handleTagFilter(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                            {activeTag && (
                                <button className="gg-tag-clear" onClick={() => setActiveTag(null)}>
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
                                                    <>
                                                        <input
                                                            className="gg-edit-input"
                                                            type="text"
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                        />
                                                        <div className="gg-item-tag-editor">
                                                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                                                                {editTags.map((tag) => (
                                                                    <span key={tag} className="gg-item-tag-active">
                                                                        {tag}
                                                                        <button type="button" onClick={() => removeEditTag(tag)} className="gg-item-tag-remove">×</button>
                                                                    </span>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    className="gg-tag-pill"
                                                                    style={{ fontSize: '8px', padding: '2px 8px' }}
                                                                    onClick={() => setEditTagPickerOpen((prev) => !prev)}
                                                                >
                                                                    {editTagPickerOpen ? '− tags' : '+ tags'}
                                                                </button>
                                                            </div>
                                                            {editTagPickerOpen && (
                                                                <div style={{ marginTop: '6px' }}>
                                                                    <div className="gg-item-tag-defaults">
                                                                        {allTags.filter((t) => !editTags.includes(t)).map((tag) => (
                                                                            <button
                                                                                key={tag}
                                                                                type="button"
                                                                                className="gg-tag-pill"
                                                                                style={{ fontSize: '8px', padding: '2px 8px' }}
                                                                                onClick={() => toggleEditTag(tag)}
                                                                            >
                                                                                + {tag}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                    <input
                                                                        className="gg-edit-input"
                                                                        type="text"
                                                                        placeholder="Custom tag, press Enter…"
                                                                        value={editTagInput}
                                                                        onChange={(e) => setEditTagInput(e.target.value)}
                                                                        onKeyDown={handleEditTagKeyDown}
                                                                        style={{ marginTop: '6px', fontSize: '12px' }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {item.name}
                                                        {isDepleted && (
                                                            <span className="gg-depleted-pill">Empty</span>
                                                        )}
                                                        {Array.isArray(item.tags) && item.tags.length > 0 && (
                                                            <span style={{ marginLeft: '8px' }}>
                                                                {item.tags.map((tag) => (
                                                                    <span key={tag} className="gg-item-tag">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </span>
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

                    {/* Right: add-item form card */}
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

                            <div className="gg-add-form-row">
                                <label className="gg-label">Tags</label>
                                {newTags.length > 0 && (
                                    <div className="gg-item-tag-pills" style={{ marginBottom: '6px' }}>
                                        {newTags.map((tag) => (
                                            <span key={tag} className="gg-item-tag-active">
                                                {tag}
                                                <button type="button" onClick={() => removeNewTag(tag)} className="gg-item-tag-remove">×</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="gg-item-tag-defaults" style={{ marginBottom: '6px' }}>
                                    {DEFAULT_TAGS.filter((t) => !newTags.includes(t)).map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            className="gg-tag-pill"
                                            style={{ fontSize: '8px', padding: '2px 8px' }}
                                            onClick={() => toggleNewTag(tag)}
                                        >
                                            + {tag}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    className="gg-input"
                                    type="text"
                                    placeholder="Custom tag, press Enter…"
                                    value={newTagInput}
                                    onChange={(e) => setNewTagInput(e.target.value)}
                                    onKeyDown={handleNewTagKeyDown}
                                    style={{ fontSize: '13px' }}
                                />
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