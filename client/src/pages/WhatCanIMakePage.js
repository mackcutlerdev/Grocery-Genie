// Dependencies
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import WhatCanIMake from '../components/WhatCanIMake';

function WhatCanIMakePage()
{
    // For the [Open Recipe] button
    const history = useHistory();

    // Data this page needs: pantry + recipes from the server
    const [appState, setAppState] = useState(
    {
        loading: false, // spinner (if i ever get to it) / "Loading pantry and recipes..."
        pantryItems: [],
        recipes: [],
    });

    // Pull pantry + recipes from the API
    const loadData = () =>
    {
        // turn loading on and clear everything while we fetch
        setAppState(
        {
            loading: true,
            pantryItems: [],
            recipes: [],
        });

        // First fetch pantry, then recipes  (nesting is bad except when its good)
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
                console.log('Failed to load data for WhatCanIMake', err);
            });
    };

    // For the Open Recipe button
    const handleOpenRecipe = (id) =>
    {
        // go to Recipes page and auto-select this recipe
        history.push(`/recipes?recipeId=${id}`);
    };

    // load everything once on mount
    useEffect(() =>
    {
        loadData();
    }, []);

    // WCIM state stating
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
