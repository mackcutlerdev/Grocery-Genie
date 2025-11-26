import React, { Fragment, useState, useEffect } from 'react';

const Recipes = () =>
{
    // Basic data states
    const [recipes, setRecipes] = useState([]);          // list of recipes
    const [selectedRecipeId, setSelectedRecipeId] = useState(null); // which recipe is focused

    // Add form states
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRecipeName, setNewRecipeName] = useState("");
    const [newRecipeIngredients, setNewRecipeIngredients] = useState([
        { name: "", quantity: "", unit: "Unit" }
    ]);
    const [newRecipeInstructions, setNewRecipeInstructions] = useState("");

    // Edit form states
    const [editingId, setEditingId] = useState(null);
    const [editRecipeName, setEditRecipeName] = useState("");
    const [editRecipeIngredients, setEditRecipeIngredients] = useState([]);
    const [editRecipeInstructions, setEditRecipeInstructions] = useState("");

    // Load recipes on first render
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
            });
    }, []);

    // Derived selected recipe
    const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId) || null;

    // === Helper: parse instructions textarea -> array ===

    const parseInstructionsText = (text) =>
    {
        return text
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line !== '');
    };

    // === Add form ingredient handlers ===

    const handleNewIngredientChange = (index, field, value) =>
    {
        setNewRecipeIngredients((prev) =>
        {
            const updated = [...prev];
            updated[index] =
            {
                ...updated[index],
                [field]: value
            };
            return updated;
        });
    };

    const addIngredientRow = () =>
    {
        setNewRecipeIngredients((prev) =>
        [
            ...prev,
            { name: "", quantity: "", unit: "Unit" }
        ]);
    };

    const removeIngredientRow = (index) =>
    {
        setNewRecipeIngredients((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // === Edit form ingredient handlers ===

    const handleEditIngredientChange = (index, field, value) =>
    {
        setEditRecipeIngredients((prev) =>
        {
            const updated = [...prev];
            updated[index] =
            {
                ...updated[index],
                [field]: value
            };
            return updated;
        });
    };

    const addEditIngredientRow = () =>
    {
        setEditRecipeIngredients((prev) =>
        [
            ...prev,
            { name: "", quantity: "", unit: "Unit" }
        ]);
    };

    const removeEditIngredientRow = (index) =>
    {
        setEditRecipeIngredients((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // === Main handlers ===

    const handleSelectRecipe = (id) =>
    {
        setSelectedRecipeId(id);

        if (editingId && editingId !== id)
        {
            cancelEditing();
        }
    };

    const handleToggleAddForm = () =>
    {
        setShowAddForm(!showAddForm);
        setNewRecipeName("");
        setNewRecipeInstructions("");
        setNewRecipeIngredients([
            { name: "", quantity: "", unit: "Unit" }
        ]);
    };

    const handleAddRecipe = (e) =>
    {
        e.preventDefault();

        if (!newRecipeName.trim())
        {
            return;
        }

        // Clean up ingredients: drop empty names, convert quantity to number/null
        const ingredientsArray = newRecipeIngredients
            .filter((ing) => ing.name.trim() !== "")
            .map((ing) =>
            {
                const trimmedName = ing.name.trim();
                const qtyText = String(ing.quantity).trim();
                const qtyValue = qtyText === "" ? null : Number(qtyText);

                return {
                    name: trimmedName,
                    quantity: qtyValue,
                    unit: ing.unit || ""
                };
            });

        const instructionsArray = parseInstructionsText(newRecipeInstructions);

        fetch('/api/tempRecipes',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
            {
                name: newRecipeName,
                ingredients: ingredientsArray,
                instructions: instructionsArray
            }),
        })
            .then((res) => res.json())
            .then((data) =>
            {
                setRecipes(data);
                setNewRecipeName("");
                setNewRecipeInstructions("");
                setNewRecipeIngredients([
                    { name: "", quantity: "", unit: "Unit" }
                ]);
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

        if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0)
        {
            setEditRecipeIngredients(
                recipe.ingredients.map((ing) =>
                ({
                    name: ing.name || "",
                    quantity:
                        ing.quantity === undefined || ing.quantity === null
                            ? ""
                            : ing.quantity,
                    unit: ing.unit || "Unit"
                }))
            );
        }
        else
        {
            setEditRecipeIngredients([
                { name: "", quantity: "", unit: "Unit" }
            ]);
        }

        if (Array.isArray(recipe.instructions))
        {
            setEditRecipeInstructions(recipe.instructions.join('\n'));
        }
        else
        {
            setEditRecipeInstructions(recipe.instructions || "");
        }
    };

    const cancelEditing = () =>
    {
        setEditingId(null);
        setEditRecipeName("");
        setEditRecipeIngredients([]);
        setEditRecipeInstructions("");
    };

    const handleEditRecipe = (e, id) =>
    {
        e.preventDefault();

        const ingredientsArray = editRecipeIngredients
            .filter((ing) => ing.name.trim() !== "")
            .map((ing) =>
            {
                const trimmedName = ing.name.trim();
                const qtyText = String(ing.quantity).trim();
                const qtyValue = qtyText === "" ? null : Number(qtyText);

                return {
                    name: trimmedName,
                    quantity: qtyValue,
                    unit: ing.unit || ""
                };
            });

        const instructionsArray = parseInstructionsText(editRecipeInstructions);

        fetch(`/api/tempRecipes/${id}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
            {
                name: editRecipeName,
                ingredients: ingredientsArray,
                instructions: instructionsArray
            }),
        })
            .then((res) => res.json())
            .then((data) =>
            {
                const updatedRecipe = data.recipe;

                setRecipes((prev) =>
                    prev.map((recipe) =>
                    {
                        if (recipe.id === updatedRecipe.id)
                        {
                            return updatedRecipe;
                        }
                        return recipe;
                    })
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

        if (!ok)
        {
            return;
        }

        fetch(`/api/tempRecipes/${id}`,
        {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((data) =>
            {
                setRecipes(data.recipes);

                if (selectedRecipeId === id)
                {
                    setSelectedRecipeId(null);
                }

                if (editingId === id)
                {
                    cancelEditing();
                }
            })
            .catch((err) =>
            {
                console.log("Failed to delete recipe", err);
            });
    };

    // === Render helpers ===

    const renderIngredients = (ingredients) =>
    {
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0)
        {
            return <p>No ingredients listed.</p>;
        }

        return (
            <ul>
                {ingredients.map((ing, index) =>
                {
                    const qty = ing.quantity !== undefined && ing.quantity !== null
                        ? ing.quantity
                        : '';
                    const unit = ing.unit ? ` ${ing.unit}` : '';
                    const name = ing.name || '';

                    return (
                        <li key={index}>
                            {`${qty}${unit} ${name}`.trim()}
                        </li>
                    );
                })}
            </ul>
        );
    };

    const renderInstructions = (instructions) =>
    {
        if (!instructions || !Array.isArray(instructions) || instructions.length === 0)
        {
            return <p>No instructions provided.</p>;
        }

        return (
            <ol>
                {instructions.map((step, index) =>
                (
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

                            <div style={{ marginTop: '1rem' }}>
                                <h3>Ingredients</h3>

                                {newRecipeIngredients.map((ing, index) =>
                                (
                                    <div key={index} style={{ marginBottom: '0.5rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={ing.name}
                                            onChange={(e) =>
                                                handleNewIngredientChange(index, 'name', e.target.value)
                                            }
                                        />

                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            step="0.25"
                                            value={ing.quantity}
                                            onChange={(e) =>
                                                handleNewIngredientChange(index, 'quantity', e.target.value)
                                            }
                                            style={{ marginLeft: '0.5rem', width: '80px' }}
                                        />

                                        <select
                                            value={ing.unit}
                                            onChange={(e) =>
                                                handleNewIngredientChange(index, 'unit', e.target.value)
                                            }
                                            style={{ marginLeft: '0.5rem' }}
                                        >
                                            <option value="Unit">Unit</option>
                                            <option value="g">g</option>
                                            <option value="kg">kg</option>
                                            <option value="ml">ml</option>
                                            <option value="L">L</option>
                                            <option value="cup">cup</option>
                                            <option value="tbsp">tbsp</option>
                                            <option value="tsp">tsp</option>
                                        </select>

                                        <button
                                            type="button"
                                            onClick={() => removeIngredientRow(index)}
                                            style={{ marginLeft: '0.5rem' }}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}

                                <button type="button" onClick={addIngredientRow}>
                                    + Add Ingredient
                                </button>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
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

                        {recipes.map((recipe) =>
                        (
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

                                <div style={{ marginTop: '1rem' }}>
                                    <h3>Ingredients</h3>

                                    {editRecipeIngredients.map((ing, index) =>
                                    (
                                        <div key={index} style={{ marginBottom: '0.5rem' }}>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={ing.name}
                                                onChange={(e) =>
                                                    handleEditIngredientChange(index, 'name', e.target.value)
                                                }
                                            />

                                            <input
                                                type="number"
                                                placeholder="Qty"
                                                step="0.25"
                                                value={ing.quantity}
                                                onChange={(e) =>
                                                    handleEditIngredientChange(index, 'quantity', e.target.value)
                                                }
                                                style={{ marginLeft: '0.5rem', width: '80px' }}
                                            />

                                            <select
                                                value={ing.unit}
                                                onChange={(e) =>
                                                    handleEditIngredientChange(index, 'unit', e.target.value)
                                                }
                                                style={{ marginLeft: '0.5rem' }}
                                            >
                                                <option value="Unit">Unit</option>
                                                <option value="g">g</option>
                                                <option value="kg">kg</option>
                                                <option value="ml">ml</option>
                                                <option value="L">L</option>
                                                <option value="cup">cup</option>
                                                <option value="tbsp">tbsp</option>
                                                <option value="tsp">tsp</option>
                                            </select>

                                            <button
                                                type="button"
                                                onClick={() => removeEditIngredientRow(index)}
                                                style={{ marginLeft: '0.5rem' }}
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}

                                    <button type="button" onClick={addEditIngredientRow}>
                                        + Add Ingredient
                                    </button>
                                </div>

                                <div style={{ marginTop: '1rem' }}>
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