// Dependencies
const express = require('express');
const router = express.Router();
const items = require('../../tempItems'); // temp in-memory "database" of pantry items
const uuid = require('uuid');

// GET all item objects
router.get('/', (req, res) => 
{
    // Just dump the whole items array as JSON
    res.json(items);
});

// GET single item object by id
router.get('/:id', (req, res) => 
{
    // Check if any item has this id
    const found = items.some(item => item.id === req.params.id);

    if (found)
    {
        // Filter returns an array, even though it should be just one item
        res.json(items.filter(item => item.id === req.params.id));
    }
    else
    {
        // 404 if it doesn't exist
        res.status(404).json({ msg: `No item with the id of ${req.params.id}` });
    }
});

// POST to create a new item object
router.post('/', (req, res) => 
{
    // Build a new item from the body, plus a fresh uuid
    const newItem = {
        id: uuid.v4(),
        name: req.body.name,
        quantity: req.body.quantity,
        unit: req.body.unit || "Unit" // default unit if none is sent
    };

    // No nameless items allowed
    if (!newItem.name)
    {
        return res.status(404).json({ msg: "Please include an item name" });
    }

    // Push into the in-memory array and send back the full list
    items.push(newItem);
    res.json(items);
});

// PUT to update / change an item object
router.put('/:id', (req, res) => 
{
    // First, see if the item exists
    const found = items.some(item => item.id === req.params.id);

    if (found)
    {
        const updateItem = req.body;

        // Loop the array and patch the one that matches
        items.forEach(item => 
        {
            if (item.id === req.params.id)
            {
                // Only overwrite the fields that were sent in
                item.name = updateItem.name ? updateItem.name : item.name;
                item.quantity = updateItem.quantity ? updateItem.quantity : item.quantity;
                item.unit = updateItem.unit ? updateItem.unit : item.unit;

                // Send back the updated item
                res.json({ msg: "Item updated", item });
            }
        });
    }
    else
    {
        res.status(404).json({ msg: `No item with the id of ${req.params.id}` });
    }
});

// DELETE to delete an item
router.delete('/:id', (req, res) => 
{
    // Check if an item with this id even exists first
    const found = items.some(item => item.id === req.params.id);

    if (found)
    {
        // Remove it from the original array
        const index = items.findIndex(item => item.id === req.params.id);
        items.splice(index, 1);

        // Also return a filtered copy just to be extra clear in the response
        res.json({ 
            msg: "Item deleted",
            items: items.filter(item => item.id !== req.params.id)
        });
    }
    else
    {
        res.status(404).json({ msg: `No item with the id of ${req.params.id}` });
    }
});

module.exports = router;
