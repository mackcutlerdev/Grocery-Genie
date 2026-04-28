import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Recipes from '../components/Recipes';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';
import { namesLooselyMatch } from '../utils/matchingUtils';
import { matchInfo, getCoverage } from '../utils/recipeUtils';

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

        const { pct } = getCoverage(recipe, appState.pantryItems);

        if (pct < 1)
        {
            const proceed = window.confirm(
                `You don't have all the ingredients for "${recipe.name}".\n\n` +
                `Only ingredients you already have will be subtracted from your pantry. ` +
                `Are you sure you want to proceed?`
            );
            if (!proceed) return;
        }  
        else
        {
            if (!window.confirm(`Use pantry items to make "${recipe.name}"?`)) return;
        }

        const willDeplete = recipe.ingredients
            .filter((ing) => ing.quantity !== null && ing.quantity !== undefined)
            .reduce((acc, ing) =>
            {
                const match = appState.pantryItems.find((p) => namesLooselyMatch(p.name, ing.name));
                if (!match) return acc;
                const newQty = Math.max(0, Number(match.quantity) - Number(ing.quantity));
                if (newQty === 0 && Number(match.quantity) > 0)
                {
                    acc.push({ name: match.name, unit: match.unit, usedQty: Number(ing.quantity) });
                }
                return acc;
            }, []);

        let doRestock = false;
        if (willDeplete.length > 0)
        {
            const names = willDeplete.map((i) => i.name).join(', ');
            doRestock = window.confirm(`You'll use the last of: ${names}\n\nAdd to shopping list after?`);
        }

        apiGet('/api/tempItems')
            .then((pantryItems) =>
            {
                const itemsToUpdate = [];

                recipe.ingredients.forEach((recipeIng) =>
                {
                    if (recipeIng.quantity === null || recipeIng.quantity === undefined) return;
                    const match = pantryItems.find((item) => namesLooselyMatch(item.name, recipeIng.name));
                    if (!match) return;
                    const currentQty = Number(match.quantity) || 0;
                    const neededQty  = Number(recipeIng.quantity) || 0;
                    const newQty     = Math.max(0, currentQty - neededQty);
                    if (newQty !== currentQty)
                        itemsToUpdate.push({ id: match.id, name: match.name, quantity: newQty, unit: match.unit });
                });

                itemsToUpdate.forEach((item) =>
                {
                    apiPut(`/api/tempItems/${item.id}`, {
                        name: item.name, quantity: item.quantity, unit: item.unit,
                    }).catch((err) => console.log('Error updating pantry after make', err));
                });

                if (doRestock && willDeplete.length > 0)
                {
                    apiGet('/api/shoppingList')
                        .then((shoppingList) =>
                        {
                            willDeplete.forEach((item) =>
                            {
                                const existing = shoppingList.find((s) => namesLooselyMatch(s.name, item.name));
                                if (existing) return;
                                apiPost('/api/shoppingList', {
                                    name:     item.name,
                                    quantity: item.usedQty,
                                    unit:     item.unit,
                                }).catch((err) => console.log('Failed to restock prompt add', err));
                            });
                        })
                        .catch((err) => console.log('Failed to fetch shopping list for restock', err));
                }

                const updatedPantry = appState.pantryItems.map((p) =>
                {
                    const changed = itemsToUpdate.find((u) => u.id === p.id);
                    return changed ? { ...p, quantity: changed.quantity } : p;
                });
                setAppState((prev) => ({ ...prev, pantryItems: updatedPantry }));
            })
            .catch((err) => console.log('Failed to load pantry for Make Recipe', err));
    };

    const handleAddMissingToList = (recipe) =>
    {
        const { missingList } = matchInfo(recipe, appState.pantryItems);
        if (missingList.length === 0) return;

        // fetch current shopping list first, then merge
        apiGet('/api/shoppingList')
            .then((shoppingList) =>
            {
                missingList.forEach((ing) =>
                {
                    const existing = shoppingList.find((s) => namesLooselyMatch(s.name, ing.name));

                    if (existing)
                    {
                        // item already on list — bump the quantity
                        apiPut(`/api/shoppingList/${existing.id}`, {
                            name:     existing.name,
                            quantity: existing.quantity + (ing.needed || 0),
                            unit:     existing.unit,
                        }).catch((err) => console.log('Failed to update shopping list item', err));
                    }
                    else
                    {
                        // not on list — add it fresh
                        apiPost('/api/shoppingList', {
                            name:     ing.name,
                            quantity: ing.needed || 0,
                            unit:     ing.unit || 'Unit',
                        }).catch((err) => console.log('Failed to add to shopping list', err));
                    }
                });

                window.alert(`Added ${missingList.length} ingredient(s) to your shopping list!`);
            })
            .catch((err) => console.log('Failed to fetch shopping list for merge', err));
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
            onAddMissingToList={handleAddMissingToList}
        />
    );
}

export default RecipesPage;