import React, { useEffect, useState } from 'react';
import Pantry from '../components/Pantry';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';

function PantryPage()
{
    const [appState, setAppState] = useState({ loading: false, items: [] });

    useEffect(() => { loadItems(); }, []);

    const loadItems = () =>
    {
        setAppState({ loading: true, items: [] });

        apiGet('/api/tempItems')
            .then((data) => setAppState({ loading: false, items: data }))
            .catch((err) =>
            {
                console.log('Failed to load pantry items', err);
                setAppState({ loading: false, items: [] });
            });
    };

    const handleAddItem = (newItem) =>
    {
        apiPost('/api/tempItems', newItem)
            .then((data) => setAppState({ loading: false, items: data }))
            .catch((err) => console.log('Failed to add item', err));
    };

    const handleUpdateItem = (id, updatedFields) =>
    {
        apiPut(`/api/tempItems/${id}`, updatedFields)
            .then((data) =>
            {
                const updatedItem = data.item;
                setAppState((prev) => ({
                    loading: prev.loading,
                    items: prev.items.map((item) =>
                        item.id === updatedItem.id ? updatedItem : item
                    ),
                }));
            })
            .catch((err) => console.log('Failed to update item', err));
    };

    const handleDeleteItem = (id) =>
    {
        apiDelete(`/api/tempItems/${id}`)
            .then((data) => setAppState({ loading: false, items: data.items }))
            .catch((err) => console.log('Failed to delete item', err));
    };

    return (
        <Pantry
            isLoading={appState.loading}
            items={appState.items}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
        />
    );
}

export default PantryPage;