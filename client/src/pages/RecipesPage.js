// Dependencies
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Recipes from '../components/Recipes';

function RecipesPage()
{
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const initialSelectedRecipeId = query.get('recipeId');

    const [appState, setAppState] = useState(
    {
        loading: false,
        recipes: [],
        pantryItems: [],   // ← NEW: needed for ingredient coverage gauge + dot colours
    });

    // Pull both recipes AND pantry in one go
    const loadData = () =>
    {
        setAppState({ loading: true, recipes: [], pantryItems: [] });

        Promise.all([
            fetch('/api/tempRecipes').then((r) => r.json()),
            fetch('/api/tempItems').then((r) => r.json()),
        ])
            .then(([recipesData, itemsData]) =>
            {
                setAppState({ loading: false, recipes: recipesData, pantryItems: itemsData });
            })
            .catch((err) =>
            {
                console.log('Failed to load recipes/pantry', err);
                setAppState({ loading: false, recipes: [], pantryItems: [] });
            });
    };

    useEffect(() => { loadData(); }, []);

    // ── Loose name matching (same as WCIM / HomePage) ──────────────────────
    const normalizeName = (name) => (!name ? '' : name.trim().toLowerCase());

    const tokenize = (name) =>
        normalizeName(name).split(/[^a-z]+/).filter(Boolean);

    const namesLooselyMatch = (a, b) =>
    {
        const tokensA = tokenize(a);
        const tokensB = tokenize(b);
        if (tokensA.length === 0 || tokensB.length === 0) return false;
        if (tokensA.join(' ') === tokensB.join(' ')) return true;
        const setB = new Set(tokensB);
        for (let i = 0; i < tokensA.length; i++)
            if (setB.has(tokensA[i])) return true;
        return false;
    };

    // ── CRUD handlers ──────────────────────────────────────────────────────
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
                setAppState((prev) => ({ ...prev, loading: false, recipes: data }));
            })
            .catch((err) => console.log('Failed to add recipe', err));
    };

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
                const updated = data.recipe;
                setAppState((prev) => ({
                    ...prev,
                    recipes: prev.recipes.map((r) => (r.id === updated.id ? updated : r)),
                }));
            })
            .catch((err) => console.log('Failed to update recipe', err));
    };

    const handleDeleteRecipe = (id) =>
    {
        fetch(`/api/tempRecipes/${id}`, { method: 'DELETE' })
            .then((res) => res.json())
            .then((data) =>
            {
                setAppState((prev) => ({ ...prev, loading: false, recipes: data.recipes }));
            })
            .catch((err) => console.log('Failed to delete recipe', err));
    };

    const handleMakeRecipe = (recipe) =>
    {
        if (!recipe || !Array.isArray(recipe.ingredients)) return;

        fetch('/api/tempItems')
            .then((res) => res.json())
            .then((pantryItems) =>
            {
                const itemsToUpdate = [];

                recipe.ingredients.forEach((recipeIng) =>
                {
                    if (recipeIng.quantity === null || recipeIng.quantity === undefined) return;

                    const match = pantryItems.find((item) =>
                        namesLooselyMatch(item.name, recipeIng.name)
                    );
                    if (!match) return;

                    const currentQty = Number(match.quantity) || 0;
                    const neededQty  = Number(recipeIng.quantity) || 0;
                    const newQty     = Math.max(0, currentQty - neededQty);

                    if (newQty !== currentQty)
                        itemsToUpdate.push({ id: match.id, name: match.name, quantity: newQty, unit: match.unit });
                });

                itemsToUpdate.forEach((item) =>
                {
                    fetch(`/api/tempItems/${item.id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: item.name, quantity: item.quantity, unit: item.unit }),
                    }).catch((err) => console.log('Error updating pantry after make', err));
                });

                // Refresh pantry state so dots/gauge update immediately
                const updatedPantry = appState.pantryItems.map((p) =>
                {
                    const changed = itemsToUpdate.find((u) => u.id === p.id);
                    return changed ? { ...p, quantity: changed.quantity } : p;
                });
                setAppState((prev) => ({ ...prev, pantryItems: updatedPantry }));
            })
            .catch((err) => console.log('Failed to load pantry for Make Recipe', err));
    };

    return (
        <Recipes
            isLoading={appState.loading}
            recipes={appState.recipes}
            pantryItems={appState.pantryItems}        // ← NEW prop
            onAddRecipe={handleAddRecipe}
            onUpdateRecipe={handleUpdateRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            initialSelectedRecipeId={initialSelectedRecipeId}
            onMakeRecipe={handleMakeRecipe}
        />
    );
}

export default RecipesPage;