// Dependencies
import React, { useEffect, useState } from 'react';
import Pantry from '../components/Pantry';

function PantryPage()
{
    // Data for this page (server-side pantry)
    const [appState, setAppState] = useState(
    {
        loading: false, // spinner / "Loading pantry..." text
        items: [],
    });

    // On first load, pull pantry items from the server
    useEffect(() =>
    {
        loadItems();
    }, []);

    // GET all items from the API and stash them in state
    const loadItems = () =>
    {
        setAppState(
        {
            loading: true,
            items: [],
        });

        fetch('/api/tempItems')
            .then((res) => res.json())
            .then((data) =>
            {
                setAppState(
                {
                    loading: false,
                    items: data,
                });
            })
            .catch((err) =>
            {
                console.log("Failed to load pantry items", err);
                setAppState(
                {
                    loading: false,
                    items: [],
                });
            });
    };

    // Called by Pantry when user adds a new item
    const handleAddItem = (newItem) =>
    {
        fetch('/api/tempItems',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem),
        })
            .then((res) => res.json())
            .then((data) =>
            {
                // server returns full updated items array
                setAppState(
                {
                    loading: false,
                    items: data,
                });
            })
            .catch((err) =>
            {
                console.log("Failed to add item", err);
            });
    };

    // Called by Pantry when user saves an edit on an item
    const handleUpdateItem = (id, updatedFields) =>
    {
        fetch(`/api/tempItems/${id}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFields),
        })
            .then((res) => res.json())
            .then((data) =>
            {
                const updatedItem = data.item;

                // Replace just the one item that changed, keep the rest the same
                setAppState((prev) =>
                ({
                    loading: prev.loading,
                    items: prev.items.map((item) =>
                    {
                        if (item.id === updatedItem.id)
                        {
                            return updatedItem;
                        }
                        return item;
                    }),
                }));
            })
            .catch((err) =>
            {
                console.log("Failed to update item", err);
            });
    };

    // Called by Pantry when user deletes an item
    const handleDeleteItem = (id) =>
    {
        fetch(`/api/tempItems/${id}`,
        {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((data) =>
            {
                // server returns { msg, items: [...] }
                setAppState(
                {
                    loading: false,
                    items: data.items,
                });
            })
            .catch((err) =>
            {
                console.log("Failed to delete item", err);
            });
    };

    // This page = wiring + server calls
    // Pantry component = actual UI + forms
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
