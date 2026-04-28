const express = require('express');
const router  = express.Router();
const ShoppingItem    = require('../../models/ShoppingItem');
const auth    = require('../../middleware/auth');

// All item routes require a valid JWT.
// auth middleware adds req.userId so every query is scoped to the owner.
router.use(auth);

// GET all items belonging to the logged-in user
router.get('/', async (req, res) =>
{
    try
    {
        const items = await ShoppingItem.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(items);
    }
    catch (err)
    {
        console.error('GET /shoppingList error:', err.message);
        res.status(500).json({ msg: 'Server error fetching items' });
    }
});

// GET single item, must belong to the logged-in user
router.get('/:id', async (req, res) =>
{
    try
    {
        const item = await ShoppingItem.findOne({ _id: req.params.id, userId: req.userId });

        if (!item)
            return res.status(404).json({ msg: `No item with id ${req.params.id}` });

        res.json(item);
    }
    catch (err)
    {
        console.error('GET /shoppingList/:id error:', err.message);
        res.status(500).json({ msg: 'Server error fetching item' });
    }
});

// POST: create a new item owned by the logged-in user
router.post('/', async (req, res) =>
{
    const { name, quantity, unit, completed } = req.body;

    if (!name || !name.trim())
        return res.status(400).json({ msg: 'Please include an item name' });

    try
    {
        const item = new ShoppingItem({
            userId:   req.userId,
            name:     name.trim(),
            quantity: Number(quantity) || 0,
            unit:     unit || 'Unit',
            completed: Boolean(completed) || false,
        });

        await item.save();

        const allItems = await ShoppingItem.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(allItems);
    }
    catch (err)
    {
        console.error('POST /shoppingList error:', err.message);
        res.status(500).json({ msg: 'Server error creating item' });
    }
});

// PUT: update an item, only if it belongs to the logged-in user
router.put('/:id', async (req, res) =>
{
    const { name, quantity, unit, completed } = req.body;

    try
    {
        const updated = await ShoppingItem.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            {
                ...(name     !== undefined && { name:     name.trim() }),
                ...(quantity !== undefined && { quantity: Number(quantity) }),
                ...(unit     !== undefined && { unit }),
                ...(completed !== undefined && { completed: Boolean(completed) }),
            },
            { new: true, runValidators: true }
        );

        if (!updated)
            return res.status(404).json({ msg: `No item with id ${req.params.id}` });

        res.json({ msg: 'Item updated', item: updated });
    }
    catch (err)
    {
        console.error('PUT /shoppingList/:id error:', err.message);
        res.status(500).json({ msg: 'Server error updating item' });
    }
});

// DELETE: remove an item, only if it belongs to the logged-in user
router.delete('/:id', async (req, res) =>
{
    try
    {
        const deleted = await ShoppingItem.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!deleted)
            return res.status(404).json({ msg: `No item with id ${req.params.id}` });

        const remaining = await ShoppingItem.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ msg: 'Item deleted', items: remaining });
    }
    catch (err)
    {
        console.error('DELETE /shoppingList/:id error:', err.message);
        res.status(500).json({ msg: 'Server error deleting item' });
    }
});

module.exports = router;