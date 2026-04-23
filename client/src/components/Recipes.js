import React, { Fragment, useState, useEffect } from 'react';

const Recipes = (props) =>
{
    const {
        recipes,
        isLoading,
        onAddRecipe,
        onUpdateRecipe,
        onDeleteRecipe,
        initialSelectedRecipeId,
        onMakeRecipe
    } = props;

    const [selectedRecipeId,       setSelectedRecipeId]       = useState(null);
    const [showAddForm,            setShowAddForm]            = useState(false);
    const [newRecipeName,          setNewRecipeName]          = useState('');
    const [newRecipeIngredients,   setNewRecipeIngredients]   = useState([{ name: '', quantity: '', unit: 'Unit' }]);
    const [newRecipeInstructions,  setNewRecipeInstructions]  = useState('');

    const [editingId,              setEditingId]              = useState(null);
    const [editRecipeName,         setEditRecipeName]         = useState('');
    const [editRecipeIngredients,  setEditRecipeIngredients]  = useState([]);
    const [editRecipeInstructions, setEditRecipeInstructions] = useState('');

    useEffect(() =>
    {
        if (initialSelectedRecipeId) setSelectedRecipeId(initialSelectedRecipeId);
    }, [initialSelectedRecipeId]);

    const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId) || null;

    const UNITS = ['Unit','g','kg','ml','L','cup','tbsp','tsp','Box','oz','Package'];

    const parseInstructionsText = (text) =>
        text.split('\n').map((l) => l.trim()).filter((l) => l !== '');

    /* ── New ingredient helpers ── */
    const handleNewIngChange = (index, field, value) =>
        setNewRecipeIngredients((prev) => { const u=[...prev]; u[index]={...u[index],[field]:value}; return u; });

    const addIngRow    = () => setNewRecipeIngredients((p) => [...p, { name:'', quantity:'', unit:'Unit' }]);
    const removeIngRow = (i) => setNewRecipeIngredients((p) => p.filter((_,idx) => idx !== i));

    /* ── Edit ingredient helpers ── */
    const handleEditIngChange = (index, field, value) =>
        setEditRecipeIngredients((prev) => { const u=[...prev]; u[index]={...u[index],[field]:value}; return u; });

    const addEditIngRow    = () => setEditRecipeIngredients((p) => [...p, { name:'', quantity:'', unit:'Unit' }]);
    const removeEditIngRow = (i) => setEditRecipeIngredients((p) => p.filter((_,idx) => idx !== i));

    /* ── Selection ── */
    const handleSelectRecipe = (id) =>
    {
        setSelectedRecipeId(id);
        if (editingId && editingId !== id) cancelEditing();
    };

    /* ── Add form ── */
    const handleToggleAddForm = () =>
    {
        setShowAddForm(!showAddForm);
        setNewRecipeName('');
        setNewRecipeIngredients([{ name:'', quantity:'', unit:'Unit' }]);
        setNewRecipeInstructions('');
    };

    const handleAddRecipeSubmit = (e) =>
    {
        e.preventDefault();
        if (!newRecipeName.trim()) return;

        const ingredients = newRecipeIngredients
            .filter((ing) => ing.name.trim() !== '')
            .map((ing) => ({
                name:     ing.name.trim(),
                quantity: String(ing.quantity).trim() === '' ? null : Number(ing.quantity),
                unit:     ing.unit || '',
            }));

        onAddRecipe({
            name:         newRecipeName,
            ingredients,
            instructions: parseInstructionsText(newRecipeInstructions),
        });

        setNewRecipeName('');
        setNewRecipeIngredients([{ name:'', quantity:'', unit:'Unit' }]);
        setNewRecipeInstructions('');
        setShowAddForm(false);
    };

    /* ── Edit form ── */
    const startEditing = (recipe) =>
    {
        setEditingId(recipe.id);
        setEditRecipeName(recipe.name || '');
        setEditRecipeIngredients(
            Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
                ? recipe.ingredients.map((ing) => ({
                    name:     ing.name || '',
                    quantity: ing.quantity === undefined || ing.quantity === null ? '' : ing.quantity,
                    unit:     ing.unit || 'Unit',
                }))
                : [{ name:'', quantity:'', unit:'Unit' }]
        );
        setEditRecipeInstructions(
            Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : recipe.instructions || ''
        );
    };

    const cancelEditing = () =>
    {
        setEditingId(null);
        setEditRecipeName('');
        setEditRecipeIngredients([]);
        setEditRecipeInstructions('');
    };

    const handleEditSubmit = (e, id) =>
    {
        e.preventDefault();
        const ingredients = editRecipeIngredients
            .filter((ing) => ing.name.trim() !== '')
            .map((ing) => ({
                name:     ing.name.trim(),
                quantity: String(ing.quantity).trim() === '' ? null : Number(ing.quantity),
                unit:     ing.unit || '',
            }));

        onUpdateRecipe(id, {
            name:         editRecipeName,
            ingredients,
            instructions: parseInstructionsText(editRecipeInstructions),
        });
        cancelEditing();
    };

    const handleDeleteRecipe = (id) =>
    {
        if (!window.confirm('Delete this recipe?')) return;
        onDeleteRecipe(id);
        if (selectedRecipeId === id) setSelectedRecipeId(null);
        if (editingId === id) cancelEditing();
    };

    /* ── Add-form modal overlay (renders above the split pane) ── */
    const renderAddFormModal = () => !showAddForm ? null : (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(17,12,20,0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
        }}>
            <div style={{
                background: 'linear-gradient(160deg, var(--bg-3) 0%, var(--bg-1) 100%)',
                border: '1px solid var(--hairline-mid)',
                borderRadius: 'var(--r-xl)',
                width: '100%', maxWidth: '600px', maxHeight: '85vh',
                display: 'flex', flexDirection: 'column',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Shimmer top line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(232,132,90,0.4), transparent)' }}></div>

                {/* Header */}
                <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: '24px', fontWeight: 500, fontStyle: 'italic' }}>
                        New <em style={{ color: 'var(--accent)' }}>Recipe</em>
                    </div>
                    <button className="gg-btn-icon" onClick={handleToggleAddForm} style={{ fontSize: '16px' }}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleAddRecipeSubmit} style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '0' }}>

                    {/* Name / Prep / Servings row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', marginBottom: '16px' }}>
                        <div>
                            <label className="gg-label" htmlFor="m-name">Recipe Name</label>
                            <input className="gg-input" id="m-name" placeholder="e.g. Mushroom Omelette"
                                value={newRecipeName} onChange={(e) => setNewRecipeName(e.target.value)} />
                        </div>
                    </div>

                    <div className="gg-divider"></div>

                    {/* Ingredients */}
                    <div className="gg-detail-section-label" style={{ marginBottom: '12px' }}>Ingredients</div>

                    {newRecipeIngredients.map((ing, index) => (
                        <div key={index} className="gg-modal-ing-item">
                            <input className="gg-input gg-modal-ing-name" type="text" placeholder="Name"
                                style={{ flex: 1 }}
                                value={ing.name} onChange={(e) => handleNewIngChange(index, 'name', e.target.value)} />
                            <input className="gg-input" type="number" placeholder="Qty" step="0.25"
                                style={{ width: '70px' }}
                                value={ing.quantity} onChange={(e) => handleNewIngChange(index, 'quantity', e.target.value)} />
                            <select className="gg-input" style={{ width: '80px' }}
                                value={ing.unit} onChange={(e) => handleNewIngChange(index, 'unit', e.target.value)}>
                                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                            <button type="button" className="gg-btn-icon" onClick={() => removeIngRow(index)}>
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                    ))}

                    <button type="button" className="gg-btn-ghost" onClick={addIngRow} style={{ marginBottom: '4px', alignSelf: 'flex-start' }}>
                        <i className="bi bi-plus-lg"></i> Add Ingredient
                    </button>

                    <div className="gg-divider"></div>

                    {/* Instructions */}
                    <div className="gg-detail-section-label" style={{ marginBottom: '12px' }}>Instructions</div>
                    <textarea
                        className="gg-input"
                        rows={6}
                        placeholder="One step per line…"
                        value={newRecipeInstructions}
                        onChange={(e) => setNewRecipeInstructions(e.target.value)}
                        style={{ resize: 'vertical' }}
                    />

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '20px' }}>
                        <button type="button" className="gg-btn-ghost" onClick={handleToggleAddForm}>Cancel</button>
                        <button type="submit" className="gg-btn-primary">
                            <i className="bi bi-floppy"></i><span>Save Recipe</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    /* ── Ingredient check dot (for read-only detail view — no pantry data here, just display) ── */
    const renderDetailIngredients = (ingredients) =>
    {
        if (!ingredients || ingredients.length === 0)
            return <div style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontSize: '14px' }}>No ingredients listed.</div>;

        return ingredients.map((ing, index) =>
        {
            const qty  = ing.quantity !== undefined && ing.quantity !== null ? ing.quantity : '';
            const unit = ing.unit ? ` ${ing.unit}` : '';
            return (
                <div key={index} className="gg-detail-ing-row">
                    <div className="gg-detail-ing-check have"><i className="bi bi-check"></i></div>
                    <div className="gg-detail-ing-name">{ing.name}</div>
                    <div className="gg-detail-ing-qty">{`${qty}${unit}`.trim()}</div>
                </div>
            );
        });
    };

    const renderDetailSteps = (instructions) =>
    {
        if (!instructions || instructions.length === 0)
            return <div style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontSize: '14px' }}>No instructions provided.</div>;

        return instructions.map((step, index) => (
            <div key={index} className="gg-detail-step">
                <div className="gg-detail-step-num">{index + 1}</div>
                <div className="gg-detail-step-text">{step}</div>
            </div>
        ));
    };

    return (
        <Fragment>
            {/* Add-recipe modal */}
            {renderAddFormModal()}

            <div className="gg-panel active" id="panel-recipes">
                <div className="gg-recipe-layout">

                    {/* ── Left: recipe list ─────────────── */}
                    <div className="gg-recipe-list-col">
                        <div className="gg-recipe-list-header">
                            <div className="gg-recipe-list-title">All Recipes</div>
                            <button
                                className="gg-btn-icon"
                                title="New Recipe"
                                onClick={handleToggleAddForm}
                                style={{ borderColor: 'var(--hairline-mid)', color: 'var(--accent)' }}
                            >
                                <i className="bi bi-plus-lg"></i>
                            </button>
                        </div>

                        <div className="gg-recipe-items-scroll">
                            {isLoading && (
                                <div style={{ padding: '20px 14px', fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                                    Loading recipes…
                                </div>
                            )}
                            {!isLoading && (!recipes || recipes.length === 0) && (
                                <div style={{ padding: '20px 14px', fontFamily: 'var(--f-body)', fontStyle: 'italic', fontSize: '14px', color: 'var(--text-faint)' }}>
                                    No recipes yet.
                                </div>
                            )}
                            {recipes && recipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className={`gg-recipe-list-item${selectedRecipeId === recipe.id ? ' selected' : ''}`}
                                    onClick={() => handleSelectRecipe(recipe.id)}
                                >
                                    <div className="gg-recipe-not-dot"></div>
                                    <div>
                                        <div className="gg-recipe-item-name">{recipe.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: detail / edit ──────────── */}
                    <div className="gg-recipe-detail-col">

                        {/* Nothing selected */}
                        {!selectedRecipe && editingId === null && (
                            <div className="gg-recipe-detail-empty">
                                <div className="gg-recipe-detail-empty-inner">
                                    <div className="gg-recipe-detail-empty-icon">❦</div>
                                    <div>Select a recipe to view details</div>
                                </div>
                            </div>
                        )}

                        {/* Edit mode */}
                        {editingId && selectedRecipe && editingId === selectedRecipe.id && (
                            <form
                                onSubmit={(e) => handleEditSubmit(e, selectedRecipe.id)}
                                className="gg-recipe-edit-form"
                            >
                                <div className="gg-recipe-edit-title">Edit <em style={{ color: 'var(--accent)' }}>Recipe</em></div>

                                <div>
                                    <label className="gg-label">Recipe Name</label>
                                    <input className="gg-input" type="text" value={editRecipeName}
                                        onChange={(e) => setEditRecipeName(e.target.value)} />
                                </div>

                                <div>
                                    <div className="gg-detail-section-label" style={{ marginBottom: '10px' }}>Ingredients</div>
                                    {editRecipeIngredients.map((ing, index) => (
                                        <div key={index} className="gg-modal-ing-item">
                                            <input className="gg-input gg-modal-ing-name" type="text" placeholder="Name"
                                                style={{ flex: 1 }}
                                                value={ing.name} onChange={(e) => handleEditIngChange(index, 'name', e.target.value)} />
                                            <input className="gg-input" type="number" placeholder="Qty" step="0.25"
                                                style={{ width: '70px' }}
                                                value={ing.quantity} onChange={(e) => handleEditIngChange(index, 'quantity', e.target.value)} />
                                            <select className="gg-input" style={{ width: '80px' }}
                                                value={ing.unit} onChange={(e) => handleEditIngChange(index, 'unit', e.target.value)}>
                                                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                            </select>
                                            <button type="button" className="gg-btn-icon" onClick={() => removeEditIngRow(index)}>
                                                <i className="bi bi-x"></i>
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" className="gg-btn-ghost" onClick={addEditIngRow} style={{ alignSelf: 'flex-start' }}>
                                        <i className="bi bi-plus-lg"></i> Add Ingredient
                                    </button>
                                </div>

                                <div>
                                    <label className="gg-label">Instructions (one step per line)</label>
                                    <textarea className="gg-input" rows={6}
                                        value={editRecipeInstructions}
                                        onChange={(e) => setEditRecipeInstructions(e.target.value)}
                                        style={{ resize: 'vertical' }} />
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="gg-btn-primary">
                                        <i className="bi bi-floppy"></i><span>Save Changes</span>
                                    </button>
                                    <button type="button" className="gg-btn-ghost" onClick={cancelEditing}>Cancel</button>
                                </div>
                            </form>
                        )}

                        {/* Read-only detail */}
                        {selectedRecipe && (!editingId || editingId !== selectedRecipe.id) && (
                            <>
                                {/* Header */}
                                <div className="gg-recipe-detail-header">
                                    <div className="gg-recipe-detail-title">{selectedRecipe.name}</div>
                                    <div className="gg-recipe-detail-meta">
                                        {selectedRecipe.prep && (
                                            <span className="gg-recipe-meta-pill">
                                                <i className="bi bi-clock"></i> {selectedRecipe.prep}
                                            </span>
                                        )}
                                        {selectedRecipe.servings && (
                                            <span className="gg-recipe-meta-pill">
                                                <i className="bi bi-people"></i> {selectedRecipe.servings} servings
                                            </span>
                                        )}
                                        {selectedRecipe.ingredients && (
                                            <span className="gg-recipe-meta-pill">
                                                <i className="bi bi-list-ul"></i> {selectedRecipe.ingredients.length} ingredients
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="gg-recipe-detail-body">
                                    <div className="gg-detail-section-label" style={{ marginBottom: '10px' }}>Ingredients</div>
                                    {renderDetailIngredients(selectedRecipe.ingredients)}

                                    <div style={{ height: '20px' }}></div>

                                    <div className="gg-detail-section-label" style={{ marginBottom: '12px' }}>Instructions</div>
                                    {renderDetailSteps(selectedRecipe.instructions)}
                                </div>

                                {/* Footer */}
                                <div className="gg-recipe-detail-footer">
                                    {onMakeRecipe && (
                                        <button
                                            className="gg-btn-teal"
                                            onClick={() =>
                                            {
                                                if (!window.confirm(`Use pantry items to make "${selectedRecipe.name}"?`)) return;
                                                onMakeRecipe(selectedRecipe);
                                                window.alert('Ingredients removed from pantry!');
                                            }}
                                        >
                                            <i className="bi bi-fire"></i><span>Make Recipe</span>
                                        </button>
                                    )}
                                    <button
                                        className="gg-btn-ghost"
                                        onClick={() => startEditing(selectedRecipe)}
                                    >
                                        <i className="bi bi-pencil"></i> Edit
                                    </button>
                                    <button
                                        className="gg-btn-icon"
                                        onClick={() => handleDeleteRecipe(selectedRecipe.id)}
                                        title="Delete recipe"
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Recipes;