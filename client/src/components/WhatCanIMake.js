// Dependencies
import React, { Fragment, useState } from 'react';

// WCIM component, takes the current pantry and recipes and matches
const WhatCanIMake = (props) =>
{
    // Destructured
    // {list of pantry items, list of recipes, loading flag, on server reload}
    const { pantryItems, recipes, isLoading, onReload } = props;

    // If true, we only show the "you can make this stuff" and not all the recipes
    const [showOnlyMakeable, setShowOnlyMakeable] = useState(false);

    // Clean up a name so it's easy to compare
    const normalizeName = (name) =>
    {
        if (!name)
        {
            return '';
        }

        return name.trim().toLowerCase();
    };

    // Allow loose matches like "Milk" vs "2% Milk", "Potato" vs "Yukon Gold Potato"
    const tokenize = (name) =>
    {
        // This tokenize was suggested on Reddit, because I was getting issues with words in words being ticked off as that ingredient, like salt in "unsalted butter"
        // lowercase, then split on anything that is not a-z or 0-9
        // So salt != Unsalt now
        return normalizeName(name)
            .split(/[^a-z0-9]+/)
            .filter(Boolean); // remove empty strings
    };

    // Returns true if 2 ingredient names are close enough but still using tokens. So like Potato = Yukon Potato, but Salt != Unsalt
    const namesLooselyMatch = (a, b) =>
    {
        // Params are tokenized which also normalized thems
        const tokensA = tokenize(a);
        const tokensB = tokenize(b);

        if(tokensA.length === 0 || tokensB.length === 0)
        {
            return false;
        }

        // Exact same tokens (e.g., "milk" vs "milk", "yukon gold potato" vs same)
        if (tokensA.join(' ') === tokensB.join(' '))
        {
            return true;
        }

        // If they share at least one WHOLE word, we consider it a match
        const setB = new Set(tokensB);
        for(let i = 0; i < tokensA.length; i++)
        {
            if(setB.has(tokensA[i]))
            {
                return true;
            }
        }

        return false;
    };

    // Check if the user can make a given recipe with the current inventory
    const canMakeRecipe = (recipe) =>
    {
        if (!recipe || !Array.isArray(recipe.ingredients))
        {
            return false;
        }

        // Every ingredient has to be "satisfed"
        return recipe.ingredients.every((ing) =>
        {
            const pantryItem = pantryItems.find((item) =>
                namesLooselyMatch(item.name, ing.name)
            );

            if (!pantryItem)
            {
                return false;
            }

            // If quantity is null/undefined, treat as "to taste", as long as we have it to some capacity, it's fine
            if (ing.quantity === null || ing.quantity === undefined)
            {
                return true;
            }

            // We’re not checking units here, just comparing numeric quantities, doing units is more complex than I have time for because it would require conversion
            return pantryItem.quantity >= ing.quantity;
        });
    };

    // For x recipe, find out what ingredients are not matching or not enough of said ing
    const getMissingIngredients = (recipe) =>
    {
        if(!recipe || !Array.isArray(recipe.ingredients))
        {
            return [];
        }

        const missing = [];

        // If the recipe needs a specific amount, check if we're short that amoutn
        recipe.ingredients.forEach((ing) =>
        {
            const pantryItem = pantryItems.find((item) =>
                namesLooselyMatch(item.name, ing.name)
            );

            if(!pantryItem)
            {
                missing.push(
                {
                    name: ing.name,
                    needed: ing.quantity || ing.quantity === 0 ? ing.quantity : null,
                    unit: ing.unit || ''
                });
                return;
            }

            if(ing.quantity !== null && ing.quantity !== undefined)
            {
                if (pantryItem.quantity < ing.quantity)
                {
                    missing.push(
                    {
                        name: ing.name,
                        // How much more we need to hit the amoutn needed for recipe
                        needed: ing.quantity - pantryItem.quantity,
                        unit: ing.unit || ''
                    });
                }
            }
        });

        return missing;
    };

    // Calculate the lists for the numbers
    const makeableRecipes = recipes.filter((recipe) => canMakeRecipe(recipe));
    const otherRecipes = recipes.filter((recipe) => !canMakeRecipe(recipe));

    return (
        <Fragment>
            <div className="container">
                <h1>What Can I Make?</h1>
                <p>
                    Based on your current pantry and saved recipes, here&apos;s what you can cook right now.
                </p>

                {isLoading && <p>Loading pantry and recipes...</p>}

                <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                    <button onClick={onReload}>
                        Reload ingredients
                    </button>
                </div>

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
                    <h2>You can make these now</h2>

                    {makeableRecipes.length === 0 && !isLoading && (
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
                        <h2>Missing Ingredients</h2>

                        {otherRecipes.length === 0 && !isLoading && (
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
                                            This seems makeable, but something is broken.
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
