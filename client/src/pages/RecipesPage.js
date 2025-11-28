// Dependencies
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Recipes from '../components/Recipes';

function RecipesPage()
{
    const location = useLocation(); // gives us access to ?recipeId=... in the URL
    const query = new URLSearchParams(location.search);
    const initialSelectedRecipeId = query.get('recipeId'); // used to auto-select a recipe when coming from Home

    // Data for this page (server-side recipes)
    const [appState, setAppState] = useState(
    {
        loading: false, // spinner / "Loading recipes..."
        recipes: [],
    });

    // Pull recipes from the server
    const loadRecipes = () =>
    {
        setAppState(
        {
            loading: true,
            recipes: [],
        });

        fetch('/api/tempRecipes')
            .then((res) => res.json())
            .then((data) =>
            {
                setAppState(
                {
                    loading: false,
                    recipes: data,
                });
            })
            .catch((err) =>
            {
                console.log("Failed to load recipes", err);
                setAppState(
                {
                    loading: false,
                    recipes: [],
                });
            });
    };

    // Load once on mount
    useEffect(() =>
    {
        loadRecipes();
    }, []);

    // COPIED FROM WCIM, CAUSE IM LAZY, this is so we can get the names to not only match but remove
    // leaving the comments though cause they no need to repeat
    const normalizeName = (name) =>
    {
        if (!name)
        {
            return '';
        }

        return name.trim().toLowerCase();
    };

    const tokenize = (name) =>
    {
        return normalizeName(name)
            .split(/[^a-z]+/)
            .filter(Boolean);
    };

    const namesLooselyMatch = (a, b) =>
    {
        const tokensA = tokenize(a);
        const tokensB = tokenize(b);

        if (tokensA.length === 0 || tokensB.length === 0)
        {
            return false;
        }

        if (tokensA.join(' ') === tokensB.join(' '))
        {
            return true;
        }

        const setB = new Set(tokensB);

        for (let i = 0; i < tokensA.length; i++)
        {
            if (setB.has(tokensA[i]))
            {
                return true;
            }
        }

        return false;
    };
    // END COPY

    // Called by Recipes component when user saves the "add recipe" form
    const handleAddRecipe = (newRecipe) =>
    {
        fetch('/api/tempRecipes',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecipe),
        })
            .then((res) => res.json())
            .then((data) =>
            {
                // server returns full updated recipes array
                setAppState(
                {
                    loading: false,
                    recipes: data,
                });
            })
            .catch((err) =>
            {
                console.log("Failed to add recipe", err);
            });
    };

    // Called by Recipes when user saves edits on a single recipe
    const handleUpdateRecipe = (id, updatedRecipe) =>
    {
        fetch(`/api/tempRecipes/${id}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRecipe),
        })
            .then((res) => res.json())
            .then((data) =>
            {
                const updated = data.recipe; // server sends back { msg, recipe }

                // Swap out just the one recipe that changed
                setAppState((prev) =>
                ({
                    loading: prev.loading,
                    recipes: prev.recipes.map((recipe) =>
                    {
                        if (recipe.id === updated.id)
                        {
                            return updated;
                        }
                        return recipe;
                    })
                }));
            })
            .catch((err) =>
            {
                console.log("Failed to update recipe", err);
            });
    };

    // Called by Recipes when user deletes a recipe
    const handleDeleteRecipe = (id) =>
    {
        fetch(`/api/tempRecipes/${id}`,
        {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((data) =>
            {
                // server returns { msg, recipes: [...] }
                setAppState(
                {
                    loading: false,
                    recipes: data.recipes,
                });
            })
            .catch((err) =>
            {
                console.log("Failed to delete recipe", err);
            });
    };

    // When user clicks "Make Recipe" on the Recipes page (after opening recipe)
    // This pulls the pantry from the server, subtracts ingredients, and PUTs (see what i did there) the updated stuff back
    const handleMakeRecipe = (recipe) =>
    {
        if (!recipe || !Array.isArray(recipe.ingredients))
        {
            return;
        }

        // grab the latest pantry from the server
        fetch('/api/tempItems')
            .then((res) => res.json())
            .then((pantryItems) =>
            {
                const itemsToUpdate = [];

                // For each ingredient in the recipe, try to find a pantry item and subtract
                recipe.ingredients.forEach((recipeIngredient) =>
                {
                    // If it's a "to taste" ingredient (null/undefined amt), skip subtracting, cause it's impossble and easier than converting to 0 
                    if (recipeIngredient.quantity === null || recipeIngredient.quantity === undefined)
                    {
                        return;
                    }

                    const matchingPantryItem = pantryItems.find((item) =>
                        namesLooselyMatch(item.name, recipeIngredient.name)
                    );

                    if (!matchingPantryItem)
                    {
                        // Pantry just doesn't have this ingredient so nothing to subtract so stop, pls, don't break
                        return;
                    }

                    const currentQty = Number(matchingPantryItem.quantity) || 0;
                    const neededQty = Number(recipeIngredient.quantity) || 0;

                    let newQty = currentQty - neededQty;
                    if (newQty < 0)
                    {
                        newQty = 0; // no negative food either, that would be weird
                    }

                    // Only bother updating if it actually changed
                    if (newQty !== currentQty)
                    {
                        itemsToUpdate.push(
                        {
                            id: matchingPantryItem.id,
                            name: matchingPantryItem.name,
                            quantity: newQty,
                            unit: matchingPantryItem.unit,
                        });
                    }
                });

                // Next, send PUTs for every pantry item that changed
                itemsToUpdate.forEach((item) =>
                {
                    fetch(`/api/tempItems/${item.id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(
                        {
                            name: item.name,
                            quantity: item.quantity,
                            unit: item.unit,
                        }),
                    })
                        .catch((err) =>
                        {
                            console.log("Error: Couldn't update pantry item after making recipe", err);
                        });
                });
            })
            .catch((err) =>
            {
                console.log("Failed to load pantry for Make Recipe", err);
            });
    };


    // Same pattern as PantryPage: page handles data + server,
    // Recipes component handles the UI and all the form states
    return (
        <Recipes
            isLoading={appState.loading}
            recipes={appState.recipes}
            onAddRecipe={handleAddRecipe}
            onUpdateRecipe={handleUpdateRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            initialSelectedRecipeId={initialSelectedRecipeId}
            onMakeRecipe={handleMakeRecipe}
        />
    );
}

export default RecipesPage;
