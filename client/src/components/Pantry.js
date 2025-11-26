import React, { useEffect, useState, Fragment } from 'react';

const Pantry = () =>
{
    // States for the items (ingredients) in the users inventory/ pantry
    const [items, setItems] = useState([]);

    // States for the forms for when the user tries to add a new item to the pantry
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newUnit, setNewUnit] = useState('Unit');

    // States for editing an existing item in the inventory
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editQuantity, setEditQuantity] = useState('');
    const [editUnit, setEditUnit] = useState('Unit')

    // Load the saved items on mount, using fetch() to pull from the api
    useEffect(() => 
    {
        fetch('/api/tempItems')
            .then((res) => res.json())
            .then((data) => 
            {
                setItems(data);
            })
            .catch((err) => 
            {
                console.log("Failed to load pantry items", err);
            })
    }, []); 

    const handleAddToggle = () => 
    {
        setShowAddForm(!showAddForm);
        setNewName("");
        setNewQuantity("");
        setNewUnit("Unit");
    };

    const handleAddSubmit = (e) =>
    {
        e.preventDefault();
        if(!newName.trim())
        {
            return;
        }

        fetch('/api/tempItems', 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
            {
                name: newName,
                quantity: Number(newQuantity) || 0,
                unit: newUnit,
            }),
        })

        .then((res) => res.json())
        .then((data) => 
        {
            // POST returns the full updated array
            setItems(data);
            setNewName("");
            setNewQuantity("");
            setNewUnit("Unit");
            setShowAddForm(false);
        })

        .catch((err) => 
        {
            console.log("Failed to add item", err);
        });
    };

    const handleDelete = (id) => 
    {
        const ok = window.confirm('Delete this item?');
        if (!ok) return;

        fetch(`/api/tempItems/${id}`, 
        {
            method: 'DELETE',
        })

        .then((res) => res.json())
        .then((data) => 
        {
            // DELETE returns { msg, items: [...] }
            setItems(data.items);
        })
        .catch((err) => 
        {
            console.log('Failed to delete item', err);
        });
    };

    const startEditing = (item) => 
    {
        setEditingId(item.id);
        setEditName(item.name);
        setEditQuantity(item.quantity);
        setEditUnit(item.unit || 'Unit');
    };

    const cancelEditing = () => 
    {
        setEditingId(null);
        setEditName('');
        setEditQuantity('');
        setEditUnit('Unit');
    };

    const handleEditSubmit = (e, id) => 
    {
        e.preventDefault();

        fetch(`/api/tempItems/${id}`, 
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
            {
                name: editName,
                quantity: Number(editQuantity) || 0,
                unit: editUnit,
            }),
        })

        .then((res) => res.json())
        .then((data) => 
        {
            // PUT returns { msg, item }
            const updatedItem = data.item;

            setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
                )
            );

            cancelEditing();
        })

        .catch((err) => 
        {
            console.log('Failed to update item', err);
        });
  };

  return (
    <Fragment>
        <div className="container">
            <h1>Pantry</h1>

            <button onClick={handleAddToggle}>
                {showAddForm ? 'Cancel' : 'Add New Item'}
            </button>

            {showAddForm && (
            <form onSubmit={handleAddSubmit} style={{ marginTop: '1rem' }}>
            <div>
                <label>
                    Name:{' '}
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Quantity:{' '}
                    <input
                        type="number"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Unit:{' '}
                    <select
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                    >
                        <option value="Unit">Unit</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="L">L</option>
                        <option value="cup">cup</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                    </select>
                </label>
            </div>
            <button type="submit" style={{ marginTop: '0.5rem' }}>
                Save
            </button>
          </form>
        )}

        <table style={{ width: '100%', marginTop: '2rem' }}>
            <thead>
                <tr>
                    <th align="left">Name</th>
                    <th align="left">Quantity</th>
                    <th align="left">Unit</th>
                    <th align="left">Actions</th>
                </tr>
            </thead>
            <tbody>
                {items.length === 0 && (
                    <tr>
                        <td colSpan="3">No items in pantry yet.</td>
                    </tr>
                )}

                {items.map((item) => (
                    <tr key={item.id}>
                        {/* NAME OPTION */}
                        <td>
                            {editingId === item.id ? (
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            ) : (
                                item.name
                            )}
                        </td>
                        {/* QUANTITY OPTION */}
                        <td>
                            {editingId === item.id ? (
                            <input
                                type="number"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(e.target.value)}
                            />
                            ) : (
                                item.quantity
                            )}
                        </td>
                        {/* UNIT OPTION */}
                        <td>
                            {editingId === item.id ? (
                                <select
                                    value={editUnit}
                                    onChange={(e) => setEditUnit(e.target.value)}
                                >
                                    <option value="Unit">Unit</option>
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="ml">ml</option>
                                    <option value="L">L</option>
                                    <option value="cup">cup</option>
                                    <option value="tbsp">tbsp</option>
                                    <option value="tsp">tsp</option>
                                </select>
                            ) : (
                                item.unit || 'Unit'
                            )}
                        </td>
                        {/* USER ACTIONS */}
                        <td>
                            {editingId === item.id ? (
                            <>
                            <button onClick={(e) => handleEditSubmit(e, item.id)}>
                                Save
                            </button>
                            <button
                                onClick={cancelEditing}
                                style={{ marginLeft: '0.5rem' }}
                            >
                                Cancel
                            </button>
                            </>
                            ) : (
                            <>
                            <button onClick={() => startEditing(item)}>Edit</button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                style={{ marginLeft: '0.5rem' }}
                            >
                                Delete
                            </button>
                            </>
                            )}
                         </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    </Fragment>
    );
};

export default Pantry;