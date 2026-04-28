import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import WhatCanIMake from '../components/WhatCanIMake';
import { apiGet, apiPut, apiPost } from '../api';
import { matchInfo } from '../utils/recipeUtils';
import { namesLooselyMatch } from '../utils/matchingUtils';

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
                            // item already on list, bump the quantity
                            apiPut(`/api/shoppingList/${existing.id}`, {
                                name:     existing.name,
                                quantity: existing.quantity + (ing.needed || 0),
                                unit:     existing.unit,
                            }).catch((err) => console.log('Failed to update shopping list item', err));
                        }
                        else
                        {
                            // not on list, add it fresh
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
        <WhatCanIMake
            isLoading={appState.loading}
            pantryItems={appState.pantryItems}
            recipes={appState.recipes}
            onReload={loadData}
            onOpenRecipe={handleOpenRecipe}
            onAddMissingToList={handleAddMissingToList}
        />
    );
}

export default WhatCanIMakePage;