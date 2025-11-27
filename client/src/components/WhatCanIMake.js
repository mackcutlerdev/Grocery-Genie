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
        const tokensBSet = new Set(tokensB);
        for(let i = 0; i < tokensA.length; i++)
        {
            if(tokensBSet.has(tokensA[i]))
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
        return recipe.ingredients.every((recipeIngredient) =>
        {
            const matchingPantryItem = pantryItems.find((item) =>
                namesLooselyMatch(item.name, recipeIngredient.name)
            );

            if (!matchingPantryItem)
            {
                return false;
            }

            // If quantity is null/undefined, treat as "to taste", as long as we have it to some capacity, it's fine
            if (recipeIngredient.quantity === null || recipeIngredient.quantity === undefined)
            {
                return true;
            }

            // We’re not checking units here, just comparing numeric quantities, doing units is more complex than I have time for because it would require conversion
            return matchingPantryItem.quantity >= recipeIngredient.quantity;
        });
    };

    // For x recipe, find out what ingredients are not matching or not enough of said ing
    const getMissingIngredients = (recipe) =>
    {

        const missingIngredients = [];

        // If the recipe needs a specific amount, check if we're short that amount
        recipe.ingredients.forEach((recipeIngredient) =>
        {
            const matchingPantryItem = pantryItems.find((item) =>
                namesLooselyMatch(item.name, recipeIngredient.name)
            );

            // We don't have this ingredient at all
            if(!matchingPantryItem)
            {
                missingIngredients.push(
                {
                    name: recipeIngredient.name,
                    needed: recipeIngredient.quantity || recipeIngredient.quantity === 0 ? recipeIngredient.quantity : null,
                    unit: recipeIngredient.unit || ''
                });
                return;
            }

            // We *do* have it, but maybe not enough
            if(recipeIngredient.quantity !== null && recipeIngredient.quantity !== undefined)
            {
                if (matchingPantryItem.quantity < recipeIngredient.quantity)
                {
                    missingIngredients.push(
                    {
                        name: recipeIngredient.name,
                        // How much more we need to hit the amount needed for recipe
                        needed: recipeIngredient.quantity - matchingPantryItem.quantity,
                        unit: recipeIngredient.unit || ''
                    });
                }
            }
        });

        return missingIngredients;
    };

    // Calculate the lists for the numbers
    const makeableRecipes = recipes.filter((recipe) => canMakeRecipe(recipe));
    const otherRecipes = recipes.filter((recipe) => !canMakeRecipe(recipe));

    return (
        <Fragment>
            <div className="container">
                <h1>What Can I Make?</h1>
                <p>
                    Based on your current pantry and saved recipes, here's what you can cook right now.
                </p>

                {isLoading && <p>Loading pantry and recipes...</p>}

                <div className="wcim-reload-row">
                    <button onClick={onReload}>
                        Reload ingredients
                    </button>
                </div>

                <div className="wcim-toggle-row">
                    <label>
                        <input
                            type="checkbox"
                            checked={showOnlyMakeable}
                            onChange={(e) => setShowOnlyMakeable(e.target.checked)}
                            className="wcim-toggle-checkbox"
                        />
                        Show only recipes I can fully make
                    </label>
                </div>

                {/* Makeable recipes */}
                <div className="wcim-section-makeable">
                    <h2>Can fully make</h2>

                    {makeableRecipes.length === 0 && !isLoading && (
                        <p>No recipes are fully makeable with your current pantry.</p>
                    )}

                    <ul>
                        {makeableRecipes.map((recipe) =>
                        (
                            <li key={recipe.id} className="wcim-makeable-item">
                                <strong>{recipe.name}</strong>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Recipes that are missing ingredients */}
                {!showOnlyMakeable && (
                    <div className="wcim-section-missing">
                        <h2>Missing Ingredients</h2>

                        {otherRecipes.length === 0 && !isLoading && (
                            <p>All recipes are fully makeable (or you have no recipes yet).</p>
                        )}

                        {otherRecipes.map((recipe) =>
                        {
                            const missingIngredients = getMissingIngredients(recipe);

                            return (
                                <div key={recipe.id} className="wcim-missing-recipe">
                                    <strong>{recipe.name}</strong>

                                    {missingIngredients.length > 0 && (
                                        <ul className="wcim-missing-list">
                                            {missingIngredients.map((missingIngredient, index) =>
                                            {
                                                const neededAmountText =
                                                    missingIngredient.needed === null || missingIngredient.needed === undefined
                                                        ? ''
                                                        : missingIngredient.needed;

                                                const unitLabel = missingIngredient.unit ? ` ${missingIngredient.unit}` : '';

                                                return (
                                                    <li key={index}>
                                                        {neededAmountText !== '' ? `${neededAmountText}${unitLabel} ` : ''}
                                                        {missingIngredient.name}
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
