// Dependencies
import React, { useState, Fragment } from 'react';

// Pantry component = the UI and form states (local)
// All the real data is pulled from the page calling the server then passed through props
const Pantry = (props) =>
{
    // Destructured props
    // {items in pantry, if the page is loading, POST, PUT, DELETE}
    const { items, isLoading, onAddItem, onUpdateItem, onDeleteItem } = props;

    // States for the forms for when the user tries to add a new item to the pantry
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newUnit, setNewUnit] = useState('Unit');

    // States for editing an existing item in the inventory
    const [editingId, setEditingId] = useState(null);   // Null means nothing is being edited
    const [editName, setEditName] = useState('');
    const [editQuantity, setEditQuantity] = useState('');
    const [editUnit, setEditUnit] = useState('Unit');

    // Toggle the add form open/closed and RESET the inputs when toggled
    const handleAddToggle = () =>
    {
        setShowAddForm(!showAddForm);
        setNewName("");
        setNewQuantity("");
        setNewUnit("Unit");
    };

    // Handle when teh submit actually happens
    const handleAddSubmit = (e) =>
    {
        e.preventDefault(); // tbh I still don't relaly know what this does but it its in all the profs verions

        // Don't allow empty names cause wtf is that
        if (!newName.trim())
        {
            return;
        }

        // Builds the new item that matches the data struct
        const newItem =
        {
            name: newName,
            quantity: Number(newQuantity) || 0, // Basically there needs to be a quantity, so if none then it still has to be a num so 0
            unit: newUnit,
        };

        // Let the page handle the actual POST + state update
        onAddItem(newItem);

        // Reset UI to deafults
        setNewName("");
        setNewQuantity("");
        setNewUnit("Unit");
        setShowAddForm(false);
    };

    // When user clicks "Delete" on a row
    const handleDelete = (id) =>
    {
        // Safety check, found on StackOverflow, very useful
        const ok = window.confirm('Delete this item?');
        if (!ok)
        {
            return;
        }

        // Page does DELETE + state update
        onDeleteItem(id);
    };

    // When the user clliks "Edit" on a row, load the rows data into the form fields
    const startEditing = (item) =>
    {
        setEditingId(item.id);
        setEditName(item.name);
        setEditQuantity(item.quantity);
        setEditUnit(item.unit || 'Unit');
    };


    // If the user cancels editing then reset the form data to the default emptiness
    const cancelEditing = () =>
    {
        setEditingId(null);
        setEditName('');
        setEditQuantity('');
        setEditUnit('Unit');
    };

    // Handle the submit of the inline edit form for a single row
    const handleEditSubmit = (e, id) =>
    {
        e.preventDefault();

        // Only send the fields the server expects
        const updatedFields =
        {
            name: editName,
            quantity: Number(editQuantity) || 0,
            unit: editUnit,
        };

        // Page does PUT + state update
        onUpdateItem(id, updatedFields);

        // Leaving editing mode otherwise page gets stuck and you cry
        cancelEditing();
    };

    return (
        <Fragment>
            <div className="container">
                <h1 className="mb-4">Pantry</h1>

                {/* If the page is loading still */}
                {isLoading && <p>Loading pantry...</p>}

                {/* God I love ternaary operators */}
                <button onClick={handleAddToggle} className="btn btn-primary mb-3">
                    {showAddForm ? 'Cancel' : 'Add New Item'}
                </button>

                {/* The form to add new items and it only shows when showAddForm is true */}
                {showAddForm && 
                (
                    <form onSubmit={handleAddSubmit} className="pantry-add-form mb-4">
                        <div className="mb-3">
                            <label className="form-label">
                                Name:{' '}
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Quantity:{' '}
                                <input
                                    type="number"
                                    className="form-control"
                                    value={newQuantity}
                                    onChange={(e) => setNewQuantity(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Unit
                            </label>
                            <select
                                className="form-select"
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
                        </div>
                        <button type="submit" className="btn btn-success">
                            Save
                        </button>
                    </form>
                )}

                <table className="pantry-table table table-striped table-hover align-middle">
                    <thead>
                        <tr>
                            <th align="left">Name</th>
                            <th align="left">Quantity</th>
                            <th align="left">Unit</th>
                            <th align="left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!items || items.length === 0) && !isLoading && 
                        (
                            <tr>
                                <td colSpan="4">No items in pantry yet.</td>
                            </tr>
                        )}

                        {items && items.map((item) => 
                        (
                            <tr key={item.id}>
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
                                            <option value="Box">Box</option>
                                        </select>
                                    ) : (
                                        item.unit || 'Unit'
                                    )}
                                </td>
                                <td>
                                    {editingId === item.id ? (
                                        <>
                                            <button 
                                                onClick={(e) => handleEditSubmit(e, item.id)}
                                                className="btn btn-sm btn-success"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="btn btn-sm btn-secondary ms-2"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEditing(item)}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="btn btn-sm btn-outline-danger ms-2"
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
