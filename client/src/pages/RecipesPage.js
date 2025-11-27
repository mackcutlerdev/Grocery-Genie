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
                console.log('Failed to load recipes', err);
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
                console.log('Failed to add recipe', err);
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
                console.log('Failed to update recipe', err);
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
                console.log('Failed to delete recipe', err);
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
        />
    );
}

export default RecipesPage;
