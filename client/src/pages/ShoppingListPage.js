import React, { useEffect, useState } from 'react';
import ShoppingList from '../components/ShoppingList';
import { apiGet, apiPost, apiPut, apiDelete } from '../api'; 

function ShoppingListPage()
{
    useEffect(() => { loadItems(); }, []);

    const [appState, setAppState] = useState({ loading: false, items: [] });
    const loadItems = () =>
    {
        setAppState({ loading: true, items: [] });
        apiGet('/api/shoppingList')
            .then((data) => setAppState({ loading: false, items: data }))
            .catch((err) =>
            {
                console.log('Failed to load shopping list', err);
                setAppState({ loading: false, items: [] });
            });
    };

    // API handlers, CRUD operations
    const handleAddItem = (newItem) =>
    {
        apiPost('/api/shoppingList', newItem)
            .then((data) => setAppState({ loading: false, items: data })) // POST returns array, this one is fine
            .catch((err) => console.log('Failed to add shopping item', err));
    };

    const handleDeleteItem = (id) =>
    {
        apiDelete(`/api/shoppingList/${id}`)
            .then((data) => setAppState({ loading: false, items: data.items })) // DELETE returns { msg, items }
            .catch((err) => console.log('Failed to delete shopping item', err));
    };

    const handleUpdateItem = (id, updatedFields) =>
    {
        apiPut(`/api/shoppingList/${id}`, updatedFields)
            .then((data) =>
            {
                const updatedItem = data.item; // PUT returns { msg, item }
                setAppState((prev) => ({
                    loading: prev.loading,
                    items: prev.items.map((i) => i.id === updatedItem.id ? updatedItem : i),
                }));
            })
            .catch((err) => console.log('Failed to update shopping item', err));
    };

    const handleClearCompleted = () =>
    {
        const completed = appState.items.filter((i) => i.completed);
        completed.forEach((i) => apiDelete(`/api/shoppingList/${i.id}`).catch((err) => console.log(err)));
        setAppState((prev) => ({ ...prev, items: prev.items.filter((i) => !i.completed) }));
    };

    const handleClearAll = () =>
    {
        if (!window.confirm('Clear your entire shopping list?')) return;
        appState.items.forEach((i) => apiDelete(`/api/shoppingList/${i.id}`).catch((err) => console.log(err)));
        setAppState((prev) => ({ ...prev, items: [] }));
    };

    const handleCopyList = () =>
    {
        if (!appState.items || appState.items.length === 0) return;

        const lines = appState.items.map((item) =>
        {
            const check = item.completed ? '✓' : '☐';
            const qty   = item.quantity ? ` x${item.quantity}` : '';
            const unit  = item.unit && item.unit !== 'Unit' ? ` ${item.unit}` : '';
            return `${check} ${item.name}${qty}${unit}`;
        });

        const text = `🛒 Shopping List\n${'─'.repeat(20)}\n${lines.join('\n')}`;

        navigator.clipboard.writeText(text)
            .then(() => window.alert('Shopping list copied!'))
            .catch(() => window.alert('Copy failed! try selecting and copying manually.'));
    };

    return (
        <ShoppingList
            isLoading={appState.loading}
            items={appState.items}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onClearCompleted={handleClearCompleted}
            onClearAll={handleClearAll}
            onCopyList={handleCopyList}
        />
    );
}

export default ShoppingListPage;