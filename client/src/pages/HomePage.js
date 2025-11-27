// Dependencies
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import HomeDashboard from '../components/HomeDashboard';

function HomePage()
{
    // All the data this page cares about (pulled from server)
    const [appState, setAppState] = useState(
    {
        loading: false, // spinner (if i get to it) / "Loading..." text
        pantryItems: [],
        recipes: [],
    });

    const history = useHistory(); // used to push the user to /recipes with a selected id

    // Get the server and load pantry + recipes
    const loadData = () =>
    {
        // turn loading on and clear old data
        setAppState(
        {
            loading: true,
            pantryItems: [],
            recipes: [],
        });

        // Fetch pantry first, then recipes (keeping it simple, i like fetch)
        fetch('/api/tempItems')
            .then((res) => res.json())
            .then((itemsData) =>
            {
                fetch('/api/tempRecipes')
                    .then((res) => res.json())
                    .then((recipesData) =>
                    {
                        setAppState(
                        {
                            loading: false,
                            pantryItems: itemsData,
                            recipes: recipesData,
                        });
                    });
            })
            .catch((err) =>
            {
                console.log('Failed to load data for Home', err);

                // if it blows up, just stop loading and show empty stuff
                setAppState(
                {
                    loading: false,
                    pantryItems: [],
                    recipes: [],
                });
            });
    };

    // load once on mount
    useEffect(() =>
    {
        loadData();
    }, []);

    // Normalizes names for the loose matching
    const normalizeName = (name) =>
    {
        if (!name)
        {
            return '';
        }

        return name.trim().toLowerCase();
    };

    // Splits a name into simple words/tokens
    const tokenize = (name) =>
    {
        return normalizeName(name)
            .split(/[^a-z0-9]+/)
            .filter(Boolean);
    };

    // Returns true if two ingredient names are "close enough"
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

    // Same logic as WCIM: check if all ingredients are covered by the pantry
    const canMakeRecipe = (recipe) =>
    {
        if (!recipe || !Array.isArray(recipe.ingredients))
        {
            return false;
        }

        return recipe.ingredients.every((ing) =>
        {
            const pantryItem = appState.pantryItems.find((item) =>
                namesLooselyMatch(item.name, ing.name)
            );

            if (!pantryItem)
            {
                return false;
            }

            // null/undefined = "to taste", just need to have it
            if (ing.quantity === null || ing.quantity === undefined)
            {
                return true;
            }

            // ignore units here, only checking numbers
            return pantryItem.quantity >= ing.quantity;
        });
    };

    const makeableRecipes = appState.recipes.filter((recipe) => canMakeRecipe(recipe));

    // Stats for the little cards on the dashboard
    const stats =
    {
        pantryCount: appState.pantryItems.length,
        recipeCount: appState.recipes.length,
        makeableCount: makeableRecipes.length,
    };

    const handleOpenRecipe = (id) =>
    {
        // Go to Recipes page and pass which one should be opened
        history.push(`/recipes?recipeId=${id}`);
    };

    // This page just gathers data + wiring, HomeDashboard does the actual UI
    return (
        <HomeDashboard
            isLoading={appState.loading}
            stats={stats}
            makeableRecipes={makeableRecipes}
            onOpenRecipe={handleOpenRecipe}
            onReload={loadData}
        />
    );
}

export default HomePage;
