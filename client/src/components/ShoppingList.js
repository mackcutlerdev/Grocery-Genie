import React, { useState, Fragment } from 'react';

const ShoppingList = (props) =>
{
    const { items, isLoading, onAddItem, onUpdateItem, onDeleteItem, onClearCompleted, onClearAll, onCopyList } = props;

    const UNITS = ['Unit','g','kg','ml','L','cup','tbsp','tsp','Box','oz','Package'];

    const hasItems = items && items.length > 0;

    // Add form state
    const [newName, setNewName] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newUnit, setNewUnit] = useState('Unit');

    const handleAddSubmit = (e) =>
    {
        e.preventDefault();
        if(!newName.trim()) return; // Don't add if name is empty
        onAddItem({
            name: newName,
            quantity: Number(newQuantity) || 0,
            unit: newUnit
        });
        setNewName('');
        setNewQuantity('');
        setNewUnit('Unit');
    };

    return (
        <Fragment>
            <div className="gg-panel active" id="panel-sources">
                {/* Clear buttons */}
                {hasItems && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <button className="gg-btn-ghost" onClick={onCopyList}>
                            <i className="bi bi-clipboard"></i> Copy List
                        </button>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="gg-btn-ghost" onClick={onClearCompleted}>
                                <i className="bi bi-check2-all"></i> Clear Completed
                            </button>
                            <button className="gg-btn-ghost" onClick={onClearAll}>
                                <i className="bi bi-trash3"></i> Clear All
                            </button>
                        </div>
                    </div>
                )}
                {/* Table */}
                <div className="gg-table-wrap">
                    <table className="gg-table">
                        <thead>
                            <tr>
                                <th>&nbsp;✔</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>{/* delete col */}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Quick-add row, always visible */}
                            <tr className="gg-sl-add-row">
                                <td>{/* Checkbox cell, empty, no checkbox needed for the add row */}</td>
                                <td>
                                    <input 
                                        className="gg-edit-input"
                                        type="text"
                                        placeholder="Add an item..."
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubmit(e); }}
                                    />
                                </td>
                                <td>
                                    <input 
                                        className="gg-edit-input"
                                        type="number"
                                        placeholder="Qty"
                                        value={newQuantity}
                                        onChange={(e) => setNewQuantity(e.target.value)}
                                        style={{ width: '70px' }}
                                    />
                                </td>
                                <td>
                                    <select className="gg-edit-input" style={{ width: '90px' }} value={newUnit} onChange={(e) => setNewUnit(e.target.value)}>
                                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </td>
                                <td>
                                    <button className="gg-btn-teal" onClick={handleAddSubmit} style={{ padding: '5px 12px', fontSize: '12px' }}>
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                </td>
                            </tr>

                            {/* Loading state */}
                            {isLoading && (
                                <tr>
                                    <td colSpan="5">
                                        <div style={{ padding: '24px', color: 'var(--text-faint)', fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                            Loading shopping list...
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* True empty, shopping list has no items at all */}
                            {!isLoading && !hasItems && (
                                <tr>
                                    <td colSpan="5">
                                        <div className="gg-table-empty">
                                            <div className="gg-table-empty-icon">🛒</div>
                                            Your shopping list is empty.
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Items */}
                            {hasItems && console.log(items)}
                            {hasItems && items.map((item) => (
                                <tr key={item.id} style={{ opacity: item.completed ? 0.45 : 1, transition: 'opacity 0.2s' }}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={() => onUpdateItem(item.id, { completed: !item.completed })}
                                            style={{ accentColor: item.completed ? '#5C3F38' : '' }}
                                        />
                                    </td>
                                    <td style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'var(--text-faint)' : 'inherit' }}>
                                        {item.name}
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unit}</td>
                                    <td>
                                        <button
                                            className="gg-btn-icon"
                                            title="Remove"
                                            onClick={() => onDeleteItem(item.id)}
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );
}

export default ShoppingList;