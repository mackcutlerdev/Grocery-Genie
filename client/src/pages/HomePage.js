import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import HomeDashboard from '../components/HomeDashboard';
import { apiGet } from '../api';
import { canMakeRecipe } from '../utils/recipeUtils';

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

    const makeableRecipes = appState.recipes.filter((r) => canMakeRecipe(r, appState.pantryItems));

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