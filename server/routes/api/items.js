const express = require('express');
const router = express.Router();
const items = require('../../tempItems');
const uuid = require('uuid');

// GET all item objects
router.get('/', (req, res) => 
{
    res.json(items);
});

// GET single item object by id
router.get('/:id', (req, res) => 
{
    const found = items.some(item => item.id === req.params.id);
    if(found)
    {
        res.json(items.filter(item => item.id === req.params.id));
    }
    else
    {
        res.status(404).json({ msg: `No item with the id of ${req.params.id}` });
    }
});

// POST to create a new item object
router.post('/', (req, res) => 
{
    const newItem = {
        id: uuid.v4(),
        name: req.body.name,
        quantity: req.body.quantity,
        unit: req.body.unit || "Unit"
    };

    if(!newItem.name)
    {
        return res.status(404).json({ msg: 'Please include an item name'})
    }

    items.push(newItem);
    res.json(items);
})

// PUT to update / change an item object
router.put('/:id', (req, res) => 
{
    const found = items.some(item => item.id === req.params.id);
    if(found)
    {
        const updateItem = req.body;
        items.forEach(item => 
        {
            if(item.id === req.params.id)
            {
                item.name = updateItem.name ? updateItem.name : item.name;
                item.quantity = updateItem.quantity ? updateItem.quantity : item.quantity;
                item.unit = updateItem.unit ? updateItem.unit : item.unit;

                res.json({ msg: 'Item updated', item});
            }
        })
    }
    else
    {
        res.status(404).json({ msg: `No item with the id of ${req.params.id}` });
    }
});

// DELETE to delete an item
router.delete('/:id', (req, res) => 
{
    const found = items.some(item => item.id === req.params.id);
    if(found)
    {
        const index = items.findIndex(item => item.id === req.params.id);
        items.splice(index, 1);

        res.json({ 
            msg: "Item deleted",
            items: items.filter(item => item.id !== req.params.id)
        })
    }
    else
    {
        res.status(404).json({ msg: `No item with the id of ${req.params.id}` });
    }
});

module.exports = router;