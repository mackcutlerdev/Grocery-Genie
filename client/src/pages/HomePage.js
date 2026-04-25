import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import HomeDashboard from '../components/HomeDashboard';
import { apiGet } from '../api';

function HomePage()
{
    const [appState, setAppState] = useState({
        loading: false,
        pantryItems: [],
        recipes: [],
    });

    const history = useHistory();

    const loadData = () =>
    {
        setAppState({ loading: true, pantryItems: [], recipes: [] });

        Promise.all([
            apiGet('/api/tempItems'),
            apiGet('/api/tempRecipes'),
        ])
            .then(([itemsData, recipesData]) =>
            {
                setAppState({ loading: false, pantryItems: itemsData, recipes: recipesData });
            })
            .catch((err) =>
            {
                console.log('Failed to load data for Home', err);
                setAppState({ loading: false, pantryItems: [], recipes: [] });
            });
    };

    useEffect(() => { loadData(); }, []);

    const normalizeName     = (name) => (!name ? '' : name.trim().toLowerCase());
    const tokenize          = (name) => normalizeName(name).split(/[^a-z]+/).filter(Boolean);
    const namesLooselyMatch = (a, b) =>
    {
        const tokA = tokenize(a), tokB = tokenize(b);
        if (!tokA.length || !tokB.length) return false;
        if (tokA.join(' ') === tokB.join(' ')) return true;
        const setB = new Set(tokB);
        return tokA.some((t) => setB.has(t));
    };

    const canMakeRecipe = (recipe) =>
    {
        if (!recipe || !Array.isArray(recipe.ingredients)) return false;
        return recipe.ingredients.every((ing) =>
        {
            const match = appState.pantryItems.find((item) =>
                namesLooselyMatch(item.name, ing.name)
            );
            if (!match) return false;
            if (ing.quantity === null || ing.quantity === undefined) return true;
            return match.quantity >= ing.quantity;
        });
    };

    const makeableRecipes = appState.recipes.filter((r) => canMakeRecipe(r));

    const stats = {
        pantryCount:   appState.pantryItems.length,
        recipeCount:   appState.recipes.length,
        makeableCount: makeableRecipes.length,
    };

    const handleOpenRecipe = (id) => history.push(`/recipes?recipeId=${id}`);

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