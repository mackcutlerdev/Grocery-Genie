import React, { useState, Fragment } from 'react';

const Pantry = (props) =>
{
    const { items, isLoading, onAddItem, onUpdateItem, onDeleteItem } = props;

    // Add form state
    const [newName,     setNewName]     = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newUnit,     setNewUnit]     = useState('Unit');

    // Inline-edit state
    const [editingId,   setEditingId]   = useState(null);
    const [editName,    setEditName]    = useState('');
    const [editQuantity,setEditQuantity]= useState('');
    const [editUnit,    setEditUnit]    = useState('Unit');

    const resetAddForm = () =>
    {
        setNewName(''); setNewQuantity(''); setNewUnit('Unit');
    };

    const handleAddSubmit = (e) =>
    {
        e.preventDefault();
        if (!newName.trim()) return;

        onAddItem({
            name:     newName,
            quantity: Number(newQuantity) || 0,
            unit:     newUnit,
        });

        resetAddForm();
    };

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
        onUpdateItem(id, {
            name:     editName,
            quantity: Number(editQuantity) || 0,
            unit:     editUnit,
        });
        cancelEditing();
    };

    const UNITS = ['Unit','g','kg','ml','L','cup','tbsp','tsp','Box','oz','Package'];

    return (
        <Fragment>
            <div className="gg-panel active" id="panel-pantry">
                <div className="gg-pantry-layout">

                    {/* ── Left: table ───────────────────── */}
                    <div>
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

                                    {!isLoading && (!items || items.length === 0) && (
                                        <tr>
                                            <td colSpan="4">
                                                <div className="gg-table-empty">
                                                    <div className="gg-table-empty-icon">🧺</div>
                                                    Your pantry is empty — add some ingredients to get started.
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {items && items.map((item) =>
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

                    {/* ── Right: add-item form card ─────── */}
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