const express = require('express');
const router  = express.Router();
const Item    = require('../../models/Item');

// GET all items
// Returns every item in the collection (Phase 3 will filter by userId)
router.get('/', async (req, res) =>
{
    try
    {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    }
    catch (err)
    {
        console.error('GET /items error:', err.message);
        res.status(500).json({ msg: 'Server error fetching items' });
    }
});

// GET single item by MongoDB _id
router.get('/:id', async (req, res) =>
{
    try
    {
        const item = await Item.findById(req.params.id);

        if (!item)
        {
            return res.status(404).json({ msg: `No item with id ${req.params.id}` });
        }

        res.json(item);
    }
    catch (err)
    {
        // findById throws a CastError if the id format is invalid
        console.error('GET /items/:id error:', err.message);
        res.status(500).json({ msg: 'Server error fetching item' });
    }
});

// POST — create a new item
router.post('/', async (req, res) =>
{
    const { name, quantity, unit } = req.body;

    if (!name || !name.trim())
    {
        return res.status(400).json({ msg: 'Please include an item name' });
    }

    try
    {
        const item = new Item(
        {
            name:     name.trim(),
            quantity: Number(quantity) || 0,
            unit:     unit || 'Unit',
        });

        await item.save();

        // Return the full updated list (same shape the client already expects)
        const allItems = await Item.find().sort({ createdAt: -1 });
        res.json(allItems);
    }
    catch (err)
    {
        console.error('POST /items error:', err.message);
        res.status(500).json({ msg: 'Server error creating item' });
    }
});

// PUT — update an item by id
router.put('/:id', async (req, res) =>
{
    const { name, quantity, unit } = req.body;

    try
    {
        // findByIdAndUpdate with { new: true } returns the updated doc, not the old one
        const updated = await Item.findByIdAndUpdate(
            req.params.id,
            {
                ...(name     !== undefined && { name:     name.trim() }),
                ...(quantity !== undefined && { quantity: Number(quantity) }),
                ...(unit     !== undefined && { unit }),
            },
            { new: true, runValidators: true }
        );

        if (!updated)
        {
            return res.status(404).json({ msg: `No item with id ${req.params.id}` });
        }

        // Same shape as the old route: { msg, item }
        res.json({ msg: 'Item updated', item: updated });
    }
    catch (err)
    {
        console.error('PUT /items/:id error:', err.message);
        res.status(500).json({ msg: 'Server error updating item' });
    }
});

// DELETE — remove an item by id
router.delete('/:id', async (req, res) =>
{
    try
    {
        const deleted = await Item.findByIdAndDelete(req.params.id);

        if (!deleted)
        {
            return res.status(404).json({ msg: `No item with id ${req.params.id}` });
        }

        // Same shape as old route: { msg, items: [...] }
        const remaining = await Item.find().sort({ createdAt: -1 });
        res.json({ msg: 'Item deleted', items: remaining });
    }
    catch (err)
    {
        console.error('DELETE /items/:id error:', err.message);
        res.status(500).json({ msg: 'Server error deleting item' });
    }
});

module.exports = router;