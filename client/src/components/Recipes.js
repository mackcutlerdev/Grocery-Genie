// Dependencies
import React, { Fragment, useState, useEffect } from 'react';

// Recipes component = the UI and form states for creating/editing recipes
const Recipes = (props) =>
{
    // Destructured props
    // {recipes from server, if page is loading, POST, PUT, DELETE, id from ?recipeId=...}
    const 
    {
        recipes,
        isLoading,
        onAddRecipe,
        onUpdateRecipe,
        onDeleteRecipe,
        initialSelectedRecipeId
    } = props;

    // Which recipe is focused / selected (shows on the right side)
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);

    // States for the add recipe form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRecipeName, setNewRecipeName] = useState("");
    const [newRecipeIngredients, setNewRecipeIngredients] = useState([
        { name: "", quantity: "", unit: "Unit" }   // start with 1 blank ingredient row
    ]);
    const [newRecipeInstructions, setNewRecipeInstructions] = useState("");

    // States for editing an existing recipe
    const [editingId, setEditingId] = useState(null); // null = not editing
    const [editRecipeName, setEditRecipeName] = useState("");
    const [editRecipeIngredients, setEditRecipeIngredients] = useState([]);
    const [editRecipeInstructions, setEditRecipeInstructions] = useState("");

    // If the page passed in a recipeId from the URL, auto-select that one
    useEffect(() => 
    {
        if(initialSelectedRecipeId)
        {
            setSelectedRecipeId(initialSelectedRecipeId);
        }
    }, [initialSelectedRecipeId]);

    // Find the currently selected recipe (or null if nothing selected)
    const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId) || null;

    // Takes a big text box of instructions and makes it into an array of clean strings
    const parseInstructionsText = (text) =>
    {
        return text
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line !== '');
    };

    // Handle typing into any new ingredient field (name/quantity/unit)
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

    // Add another blank ingredient row for a new recipe
    const addIngredientRow = () =>
    {
        setNewRecipeIngredients((prev) =>
        [
            ...prev,
            { name: "", quantity: "", unit: "Unit" }
        ]);
    };

    // Remove an ingredient row from the new recipe form
    const removeIngredientRow = (index) =>
    {
        setNewRecipeIngredients((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // Same as above but for the edit form
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

    // Add a blank ingredient row when editing a recipe
    const addEditIngredientRow = () =>
    {
        setEditRecipeIngredients((prev) =>
        [
            ...prev,
            { name: "", quantity: "", unit: "Unit" }
        ]);
    };

    // Remove an ingredient row from the edit form
    const removeEditIngredientRow = (index) =>
    {
        setEditRecipeIngredients((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // When a recipe button is clicked on the left, make that the selected one
    const handleSelectRecipe = (id) =>
    {
        setSelectedRecipeId(id);

        // If I'm editing something else and you click another recipe, leave edit mode
        if (editingId && editingId !== id)
        {
            cancelEditing();
        }
    };

    // Toggle the add form on/off and reset all the add fields
    const handleToggleAddForm = () =>
    {
        setShowAddForm(!showAddForm);
        setNewRecipeName("");
        setNewRecipeIngredients([
            { name: "", quantity: "", unit: "Unit" }
        ]);
        setNewRecipeInstructions("");
    };

    // When the add recipe form actually submits
    const handleAddRecipeSubmit = (e) =>
    {
        e.preventDefault();

        // No nameless recipes
        if (!newRecipeName.trim())
        {
            return;
        }

        // Clean up the ingredient rows into the format the server expects
        const ingredientsArray = newRecipeIngredients
            .filter((ing) => ing.name.trim() !== "") // ignore totally blank rows
            .map((ing) =>
            {
                const trimmedName = ing.name.trim();
                const qtyText = String(ing.quantity).trim();
                const qtyValue = qtyText === "" ? null : Number(qtyText); // blank = null (to taste like for salt)

                return {
                    name: trimmedName,
                    quantity: qtyValue,
                    unit: ing.unit || ""
                };
            });

        // Turn multiline instructions into an array of steps, but only works line-by-line
        const instructionsArray = parseInstructionsText(newRecipeInstructions);

        // The final new recipe object
        const newRecipe =
        {
            name: newRecipeName,
            ingredients: ingredientsArray,
            instructions: instructionsArray
        };

        // Let RecipesPage do the POST + state stuff
        onAddRecipe(newRecipe);

        // Reset the add form back to clean defaults
        setNewRecipeName("");
        setNewRecipeIngredients([
            { name: "", quantity: "", unit: "Unit" }
        ]);
        setNewRecipeInstructions("");
        setShowAddForm(false);
    };

    // When the user clicks "Edit" for a recipe
    const startEditing = (recipe) =>
    {
        setEditingId(recipe.id);
        setEditRecipeName(recipe.name || "");

        // If the recipe has ingredients, map them into editable fields
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
        // If it somehow has none, just give a single blank row
        else
        {
            setEditRecipeIngredients([
                { name: "", quantity: "", unit: "Unit" }
            ]);
        }

        // Instructions: if it's an array, join with newlines, else just use the string
        if (Array.isArray(recipe.instructions))
        {
            setEditRecipeInstructions(recipe.instructions.join('\n'));
        }
        else
        {
            setEditRecipeInstructions(recipe.instructions || "");
        }
    };

    // Cancel editing and wipe out the edit sttae
    const cancelEditing = () =>
    {
        setEditingId(null);
        setEditRecipeName("");
        setEditRecipeIngredients([]);
        setEditRecipeInstructions("");
    };

    // When the edit form submits for a specific recipe
    const handleEditRecipeSubmit = (e, id) =>
    {
        e.preventDefault();

        // Clean the edit ingredient rows the same way as the add form
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

        const updatedRecipe =
        {
            name: editRecipeName,
            ingredients: ingredientsArray,
            instructions: instructionsArray
        };

        // Page does PUT stuff
        onUpdateRecipe(id, updatedRecipe);

        // Exit edit mode so it doesn't get stuck forever
        cancelEditing();
    };

    // When the user deletes a recipe
    const handleDeleteRecipe = (id) =>
    {
        // Same confirm trick as Pantry
        const ok = window.confirm('Delete this recipe?');

        if (!ok)
        {
            return;
        }

        onDeleteRecipe(id);

        // If you were looking at that recipe, unselect it
        if (selectedRecipeId === id)
        {
            setSelectedRecipeId(null);
        }

        // If you were editing that recipe, also reset the edit state
        if (editingId === id)
        {
            cancelEditing();
        }
    };

    // Render the ingredient list for the details panel
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

    // Render the instructions as an ordered (numbered) list
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

    return (
        <Fragment>
            <div className="container">
                <h1>Recipes</h1>

                {/* If the page is still loading recipes from the server */}
                {isLoading && <p>Loading recipes...</p>}

                {/* Add button + add form (if open) */}
                <div className="recipes-controls">
                    <button onClick={handleToggleAddForm}>
                        {showAddForm ? 'Cancel' : 'Add New Recipe'}
                    </button>

                    {/* Add new recipe form, only visible when showAddForm is true */}
                    {showAddForm && (
                        <form onSubmit={handleAddRecipeSubmit} style={{ marginTop: '1rem' }}>
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

                                {/* All the ingredient rows for the new recipe */}
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

                {/* Recipe list on the left, details/edit on the right */}
                <div className="recipes-layout" style={{ display: 'flex', marginTop: '2rem' }}>
                    {/* Left: list of all recipes with buttons */}
                    <div className="recipes-list" style={{ flex: 1, marginRight: '1rem' }}>
                        {(!recipes || recipes.length === 0) && !isLoading && (
                            <p>No recipes yet.</p>
                        )}

                        {recipes && recipes.map((recipe) =>
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

                    {/* Right: either edit form or read-only recipe details */}
                    <div className="recipes-details" style={{ flex: 2 }}>
                        {/* Nothing selected and not editing = prompt the user */}
                        {!selectedRecipe && editingId === null && (
                            <p>Select a recipe to view details.</p>
                        )}

                        {/* Edit mode for the selected recipe */}
                        {editingId && selectedRecipe && editingId === selectedRecipe.id && (
                            <form onSubmit={(e) => handleEditRecipeSubmit(e, selectedRecipe.id)}>
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

                        {/* Read-only details for the selected recipe (if we’re not in edit mode) */}
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
