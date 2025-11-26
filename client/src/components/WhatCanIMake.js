import React, { Fragment, useState, useEffect } from 'react';

const WhatCanIMake = () =>
{
    const [pantryItems, setPantryItems] = useState([]);
    const [recipes, setRecipes] = useState([]);

    const [showOnlyMakeable, setShowOnlyMakeable] = useState(false);

    // Load pantry + recipes on mount
    // ---- NEW: shared loader function ----
    const loadData = () =>
    {
        // Fetch pantry items
        fetch('/api/tempItems')
            .then((res) => res.json())
            .then((data) =>
            {
                setPantryItems(data);
            })
            .catch((err) =>
            {
                console.log('Failed to load pantry items', err);
            });

        // Fetch recipes
        fetch('/api/tempRecipes')
            .then((res) => res.json())
            .then((data) =>
            {
                setRecipes(data);
            })
            .catch((err) =>
            {
                console.log('Failed to load recipes', err);
            });
    };

    // Run once on mount
    useEffect(() =>
    {
        loadData();
    }, []);


    // === Helper: normalize names for matching ===
    const normalizeName = (name) =>
    {
        if (!name)
        {
            return '';
        }

        return name.trim().toLowerCase();
    };

    // === Helper: Names that ALMOST match, we count ===
    const nameAlmostMatch = (a, b) =>
    {
        const an = normalizeName(a);
        const bn = normalizeName(b);

        if(!an || !bn)
        {
            return false;
        }

        if(an === bn)
        {
            return true;
        }

        return an.includes(bn) || bn.includes(an);

    }

    // === Check if a single recipe can be fully made from pantry ===
    const canMakeRecipe = (recipe) =>
    {
        if (!recipe || !Array.isArray(recipe.ingredients))
        {
            return false;
        }

        return recipe.ingredients.every((ing) =>
        {
            const pantryItem = pantryItems.find((item) =>
                nameAlmostMatch(item.name, ing.name) 
            );

            // If we don't even have this ingredient by name
            if (!pantryItem)
            {
                return false;
            }

            // If quantity is null, treat it as "to taste" → as long as we have it, it's fine
            if (ing.quantity === null || ing.quantity === undefined)
            {
                return true;
            }

            // Otherwise, check pantry quantity
            return pantryItem.quantity >= ing.quantity;
        });
    };

    // === Compute what is missing for a recipe ===
    const getMissingIngredients = (recipe) =>
    {
        if (!recipe || !Array.isArray(recipe.ingredients))
        {
            return [];
        }

        const missing = [];

        recipe.ingredients.forEach((ing) =>
        {
            const pantryItem = pantryItems.find((item) =>
                nameAlmostMatch(item.name, ing.name) 
            );

            // No matching pantry item at all
            if (!pantryItem)
            {
                missing.push(
                {
                    name: ing.name,
                    needed: ing.quantity || ing.quantity === 0 ? ing.quantity : null,
                    unit: ing.unit || ''
                });
                return;
            }

            // We have the item; check quantity if required
            if (ing.quantity !== null && ing.quantity !== undefined)
            {
                if (pantryItem.quantity < ing.quantity)
                {
                    missing.push(
                    {
                        name: ing.name,
                        needed: ing.quantity - pantryItem.quantity,
                        unit: ing.unit || ''
                    });
                }
            }
        });

        return missing;
    };

    const makeableRecipes = recipes.filter((recipe) => canMakeRecipe(recipe));
    const otherRecipes = recipes.filter((recipe) => !canMakeRecipe(recipe));

    // === Render ===

    return (
        <Fragment>
            <div className="container">
                <h1>What Can I Make?</h1>
                <p>
                    Based on your current pantry and saved recipes, here&apos;s what you can cook right now.
                </p>

                <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={showOnlyMakeable}
                            onChange={(e) => setShowOnlyMakeable(e.target.checked)}
                            style={{ marginRight: '0.5rem' }}
                        />
                        Show only recipes I can fully make
                    </label>
                </div>

                {/* Makeable recipes */}
                <div style={{ marginTop: '1.5rem' }}>
                    <h2>✅ You can make these now</h2>

                    {makeableRecipes.length === 0 && (
                        <p>No recipes are fully makeable with your current pantry.</p>
                    )}

                    <ul>
                        {makeableRecipes.map((recipe) =>
                        (
                            <li key={recipe.id} style={{ marginBottom: '0.75rem' }}>
                                <strong>{recipe.name}</strong>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Recipes that are missing ingredients */}
                {!showOnlyMakeable && (
                    <div style={{ marginTop: '2rem' }}>
                        <h2>❌ Missing Ingredients</h2>

                        {otherRecipes.length === 0 && (
                            <p>All recipes are fully makeable (or you have no recipes yet).</p>
                        )}

                        {otherRecipes.map((recipe) =>
                        {
                            const missing = getMissingIngredients(recipe);

                            return (
                                <div key={recipe.id} style={{ marginBottom: '1.5rem' }}>
                                    <strong>{recipe.name}</strong>

                                    {missing.length === 0 && (
                                        <p style={{ marginLeft: '1rem' }}>
                                            This *should* be makeable, but something is off with the data.
                                        </p>
                                    )}

                                    {missing.length > 0 && (
                                        <ul style={{ marginLeft: '1.5rem' }}>
                                            {missing.map((m, index) =>
                                            {
                                                const qtyText =
                                                    m.needed === null || m.needed === undefined
                                                        ? ''
                                                        : m.needed;

                                                const unitText = m.unit ? ` ${m.unit}` : '';

                                                return (
                                                    <li key={index}>
                                                        {qtyText !== '' ? `${qtyText}${unitText} ` : ''}
                                                        {m.name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default WhatCanIMake;
