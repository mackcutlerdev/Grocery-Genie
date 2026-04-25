import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import WhatCanIMake from '../components/WhatCanIMake';
import { apiGet } from '../api';

function WhatCanIMakePage()
{
    const history = useHistory();

    const [appState, setAppState] = useState({
        loading: false,
        pantryItems: [],
        recipes: [],
    });

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
                console.log('Failed to load data for WhatCanIMake', err);
                setAppState({ loading: false, pantryItems: [], recipes: [] });
            });
    };

    useEffect(() => { loadData(); }, []);

    const handleOpenRecipe = (id) => history.push(`/recipes?recipeId=${id}`);

    return (
        <WhatCanIMake
            isLoading={appState.loading}
            pantryItems={appState.pantryItems}
            recipes={appState.recipes}
            onReload={loadData}
            onOpenRecipe={handleOpenRecipe}
        />
    );
}

export default WhatCanIMakePage;