// Dependencies
import React, { useEffect, useState } from 'react';
import WhatCanIMake from '../components/WhatCanIMake';

function WhatCanIMakePage()
{
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
        />
    );
}

export default WhatCanIMakePage;
