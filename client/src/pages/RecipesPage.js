import React, { Fragment, useState, useEffect } from 'react';

const Recipes = () =>
{
    // Basic data states
    const [recipes, setRecipes] = useState([]);          // list of recipes
    const [selectedRecipeId, setSelectedRecipeId] = useState(null); // which recipe is "open" / focused
    // Add form states
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRecipeName, setNewRecipeName] = useState("");
    const [newRecipeIngredients, setNewRecipeIngredients] = useState("");
    const [newRecipeInstructions, setNewRecipeInstructions] = useState("");
    // Edit form states
    const [editingId, setEditingId] = useState(null);
    const [editRecipeName, setEditRecipeName] = useState("");
    const [editRecipeIngredients, setEditRecipeIngredients] = useState("");
    const [editRecipeInstructions, setEditRecipeInstructions] = useState("");

    // useEffect
    useEffect(() =>
    {
        fetch('/api/tempRecipes')
            .then((res) => res.json())
            .then((data) => 
            {
                setRecipes(data);
            })
            .catch((err) => 
            {
                console.log("Failed to load recipes", err);
            })
    }, []);

    // Derived selected recipe
    const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId) || null;

    // === Handlers ===

    const handleSelectRecipe = (id) =>
    {
        setSelectedRecipeId(id);
        // If we were editing something else, cancel that edit cause otherwise it gets fucky
        if (editingId && editingId !== id) {
            cancelEditing();
        }
    };

    const handleToggleAddForm = () =>
    {
        setShowAddForm(!showAddForm);
        setNewRecipeName("");
        setNewRecipeIngredients("");
        setNewRecipeInstructions("");
    };

    const handleAddRecipe = (e) =>
    {
        e.preventDefault();
        if (!newRecipeName.trim())
        {
            return;
        }

        fetch('/api/tempRecipes',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
            {
                name: newRecipeName,
                // For now these are just strings; server will store them as-is
                ingredients: newRecipeIngredients,
                instructions: newRecipeInstructions
            }),
        })
        .then((res) => res.json())
        .then((data) =>
        {
            // POST returns the full updated array
            setRecipes(data);
            setNewRecipeName("");
            setNewRecipeIngredients("");
            setNewRecipeInstructions("");
            setShowAddForm(false);
        })
        .catch((err) =>
        {
            console.log("Failed to add recipe", err);
        });
    };

    const startEditing = (recipe) =>
    {
        setEditingId(recipe.id);
        setEditRecipeName(recipe.name || "");
        // If existing recipe has arrays, you can stringify them for now
        if (Array.isArray(recipe.ingredients)) {
            setEditRecipeIngredients(recipe.ingredients.map((ing) => {
                // try to display name + quantity + unit
                if (typeof ing === 'string') return ing;
                const qty = ing.quantity !== undefined && ing.quantity !== null ? ing.quantity : '';
                const unit = ing.unit ? ` ${ing.unit}` : '';
                return `${qty}${unit} ${ing.name}`.trim();
            }).join('\n'));
        } else {
            setEditRecipeIngredients(recipe.ingredients || "");
        }

        if (Array.isArray(recipe.instructions)) {
            setEditRecipeInstructions(recipe.instructions.join('\n'));
        } else {
            setEditRecipeInstructions(recipe.instructions || "");
        }
    };

    const cancelEditing = () =>
    {
        setEditingId(null);
        setEditRecipeName("");
        setEditRecipeIngredients("");
        setEditRecipeInstructions("");
    };

    const handleEditRecipe = (e, id) =>
    {
        e.preventDefault();

        fetch(`/api/tempRecipes/${id}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
            {
                name: editRecipeName,
                ingredients: editRecipeIngredients,
                instructions: editRecipeInstructions
            }),
        })
        .then((res) => res.json())
        .then((data) =>
        {
            // PUT returns { msg, recipe }
            const updatedRecipe = data.recipe;

            setRecipes((prev) =>
                prev.map((recipe) =>
                    recipe.id === updatedRecipe.id ? updatedRecipe : recipe
                )
            );

            cancelEditing();
        })
        .catch((err) =>
        {
            console.log("Failed to update recipe", err);
        });
    };

    const handleDeleteRecipe = (id) =>
    {
        const ok = window.confirm('Delete this recipe?');
        if (!ok) return;

        fetch(`/api/tempRecipes/${id}`,
        {
            method: 'DELETE',
        })
        .then((res) => res.json())
        .then((data) =>
        {
            // DELETE returns { msg, recipes: [...] }
            setRecipes(data.recipes);

            if (selectedRecipeId === id) {
                setSelectedRecipeId(null);
            }
            if (editingId === id) {
                cancelEditing();
            }
        })
        .catch((err) =>
        {
            console.log("Failed to delete recipe", err);
        });
    };

    // Helper to render ingredients in details view
    const renderIngredients = (ingredients) =>
    {
        if (!ingredients) return <p>No ingredients listed.</p>;

        // If it's already an array (your tempRecipes), render nicely
        if (Array.isArray(ingredients)) {
            return (
                <ul>
                    {ingredients.map((ing, index) => {
                        if (typeof ing === 'string') {
                            return <li key={index}>{ing}</li>;
                        }
                        const qty = ing.quantity !== undefined && ing.quantity !== null ? ing.quantity : '';
                        const unit = ing.unit ? ` ${ing.unit}` : '';
                        return (
                            <li key={index}>
                                {`${qty}${unit} ${ing.name}`.trim()}
                            </li>
                        );
                    })}
                </ul>
            );
        }

        // If it's a string (from the add/edit text areas)
        return <p>{ingredients}</p>;
    };

    // Helper to render instructions in details view
    const renderInstructions = (instructions) =>
    {
        if (!instructions) return <p>No instructions provided.</p>;

        if (Array.isArray(instructions)) {
            return (
                <ol>
                    {instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            );
        }

        // If it's a string, split by newlines for nicer display
        const lines = instructions.split('\n').filter((line) => line.trim() !== '');
        return (
            <ol>
                {lines.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        );
    };

    // === Render ===

    return (
        <Fragment>
            <div className="container">
                <h1>Recipes</h1>

                {/* Add recipe controls */}
                <div className="recipes-controls">
                    <button onClick={handleToggleAddForm}>
                        {showAddForm ? 'Cancel' : 'Add New Recipe'}
                    </button>

                    {showAddForm && (
                        <form onSubmit={handleAddRecipe} style={{ marginTop: '1rem' }}>
                            <div>
                                <label>
                                    Name:{' '}
                                    <input
                                        type="text"
                                        value={newRecipeName}
                                        onChange={(e) => setNewRecipeName(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Ingredients (text for now):{' '}
                                    <textarea
                                        rows="4"
                                        value={newRecipeIngredients}
                                        onChange={(e) => setNewRecipeIngredients(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Instructions (one step per line):{' '}
                                    <textarea
                                        rows="6"
                                        value={newRecipeInstructions}
                                        onChange={(e) => setNewRecipeInstructions(e.target.value)}
                                    />
                                </label>
                            </div>

                            <button type="submit" style={{ marginTop: '0.5rem' }}>
                                Save Recipe
                            </button>
                        </form>
                    )}
                </div>

                {/* Layout: list on left, details / edit on right */}
                <div className="recipes-layout" style={{ display: 'flex', marginTop: '2rem' }}>
                    {/* Left: list of recipes */}
                    <div className="recipes-list" style={{ flex: 1, marginRight: '1rem' }}>
                        {recipes.length === 0 && <p>No recipes yet.</p>}

                        {recipes.map((recipe) => (
                            <div key={recipe.id} style={{ marginBottom: '0.5rem' }}>
                                <button onClick={() => handleSelectRecipe(recipe.id)}>
                                    {recipe.name}
                                </button>
                                <button
                                    onClick={() => startEditing(recipe)}
                                    style={{ marginLeft: '0.5rem' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteRecipe(recipe.id)}
                                    style={{ marginLeft: '0.5rem' }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Right: selected recipe details / edit form */}
                    <div className="recipes-details" style={{ flex: 2 }}>
                        {!selectedRecipe && editingId === null && (
                            <p>Select a recipe to view details.</p>
                        )}

                        {/* Edit mode */}
                        {editingId && selectedRecipe && editingId === selectedRecipe.id && (
                            <form onSubmit={(e) => handleEditRecipe(e, selectedRecipe.id)}>
                                <h2>Edit Recipe</h2>

                                <div>
                                    <label>
                                        Name:{' '}
                                        <input
                                            type="text"
                                            value={editRecipeName}
                                            onChange={(e) => setEditRecipeName(e.target.value)}
                                        />
                                    </label>
                                </div>

                                <div>
                                    <label>
                                        Ingredients (text for now):{' '}
                                        <textarea
                                            rows="4"
                                            value={editRecipeIngredients}
                                            onChange={(e) => setEditRecipeIngredients(e.target.value)}
                                        />
                                    </label>
                                </div>

                                <div>
                                    <label>
                                        Instructions (one step per line):{' '}
                                        <textarea
                                            rows="6"
                                            value={editRecipeInstructions}
                                            onChange={(e) => setEditRecipeInstructions(e.target.value)}
                                        />
                                    </label>
                                </div>

                                <button type="submit" style={{ marginTop: '0.5rem' }}>
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    style={{ marginLeft: '0.5rem' }}
                                >
                                    Cancel
                                </button>
                            </form>
                        )}

                        {/* Read-only details mode */}
                        {selectedRecipe && (!editingId || editingId !== selectedRecipe.id) && (
                            <div>
                                <h2>{selectedRecipe.name}</h2>

                                <h3>Ingredients</h3>
                                {renderIngredients(selectedRecipe.ingredients)}

                                <h3>Instructions</h3>
                                {renderInstructions(selectedRecipe.instructions)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Recipes;