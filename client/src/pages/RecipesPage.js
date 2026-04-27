import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Recipes from '../components/Recipes';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';
import { namesLooselyMatch } from '../utils/matchingUtils';

function RecipesPage()
{
    const location = useLocation();
    const query    = new URLSearchParams(location.search);
    const initialSelectedRecipeId = query.get('recipeId');

    const [appState, setAppState] = useState({
        loading:     false,
        recipes:     [],
        pantryItems: [],
    });

    const loadData = () =>
    {
        setAppState({ loading: true, recipes: [], pantryItems: [] });

        Promise.all([
            apiGet('/api/tempRecipes'),
            apiGet('/api/tempItems'),
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

    const handleAddRecipe = (newRecipe) =>
    {
        apiPost('/api/tempRecipes', newRecipe)
            .then((data) => setAppState((prev) => ({ ...prev, loading: false, recipes: data })))
            .catch((err) => console.log('Failed to add recipe', err));
    };

    const handleUpdateRecipe = (id, updatedRecipe) =>
    {
        apiPut(`/api/tempRecipes/${id}`, updatedRecipe)
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
        apiDelete(`/api/tempRecipes/${id}`)
            .then((data) => setAppState((prev) => ({ ...prev, loading: false, recipes: data.recipes })))
            .catch((err) => console.log('Failed to delete recipe', err));
    };

    const handleMakeRecipe = (recipe) =>
    {
        if (!recipe || !Array.isArray(recipe.ingredients)) return;

        apiGet('/api/tempItems')
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
                        itemsToUpdate.push({
                            id:       match.id,
                            name:     match.name,
                            quantity: newQty,
                            unit:     match.unit,
                        });
                });

                itemsToUpdate.forEach((item) =>
                {
                    apiPut(`/api/tempItems/${item.id}`, {
                        name: item.name, quantity: item.quantity, unit: item.unit,
                    }).catch((err) => console.log('Error updating pantry after make', err));
                });

                // Update local pantry state so gauge/dots refresh immediately
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
            pantryItems={appState.pantryItems}
            onAddRecipe={handleAddRecipe}
            onUpdateRecipe={handleUpdateRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            initialSelectedRecipeId={initialSelectedRecipeId}
            onMakeRecipe={handleMakeRecipe}
        />
    );
}

export default RecipesPage;