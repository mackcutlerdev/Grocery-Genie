const express = require('express');
const router  = express.Router();
const Recipe  = require('../../models/Recipe');
const auth    = require('../../middleware/auth');

// All recipe routes require a valid JWT.
router.use(auth);

// GET all recipes belonging to the logged-in user
router.get('/', async (req, res) =>
{
    try
    {
        const recipes = await Recipe.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(recipes);
    }
    catch (err)
    {
        console.error('GET /recipes error:', err.message);
        res.status(500).json({ msg: 'Server error fetching recipes' });
    }
});

// GET single recipe — must belong to the logged-in user
router.get('/:id', async (req, res) =>
{
    try
    {
        const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.userId });

        if (!recipe)
            return res.status(404).json({ msg: `No recipe with id ${req.params.id}` });

        res.json(recipe);
    }
    catch (err)
    {
        console.error('GET /recipes/:id error:', err.message);
        res.status(500).json({ msg: 'Server error fetching recipe' });
    }
});

// POST — create a new recipe owned by the logged-in user
router.post('/', async (req, res) =>
{
    const { name, ingredients, instructions, prep, servings } = req.body;

    if (!name || !name.trim())
        return res.status(400).json({ msg: 'Please include a recipe name' });

    try
    {
        const recipe = new Recipe({
            userId:       req.userId,
            name:         name.trim(),
            ingredients:  ingredients  || [],
            instructions: instructions || [],
            prep:         prep         || '',
            servings:     servings     || null,
        });

        await recipe.save();

        const allRecipes = await Recipe.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(allRecipes);
    }
    catch (err)
    {
        console.error('POST /recipes error:', err.message);
        res.status(500).json({ msg: 'Server error creating recipe' });
    }
});

// PUT — update a recipe, only if it belongs to the logged-in user
router.put('/:id', async (req, res) =>
{
    const { name, ingredients, instructions, prep, servings } = req.body;

    try
    {
        const updated = await Recipe.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            {
                ...(name         !== undefined && { name: name.trim() }),
                ...(ingredients  !== undefined && { ingredients }),
                ...(instructions !== undefined && { instructions }),
                ...(prep         !== undefined && { prep }),
                ...(servings     !== undefined && { servings }),
            },
            { new: true, runValidators: true }
        );

        if (!updated)
            return res.status(404).json({ msg: `No recipe with id ${req.params.id}` });

        res.json({ msg: 'Recipe updated', recipe: updated });
    }
    catch (err)
    {
        console.error('PUT /recipes/:id error:', err.message);
        res.status(500).json({ msg: 'Server error updating recipe' });
    }
});

// DELETE — remove a recipe, only if it belongs to the logged-in user
router.delete('/:id', async (req, res) =>
{
    try
    {
        const deleted = await Recipe.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!deleted)
            return res.status(404).json({ msg: `No recipe with id ${req.params.id}` });

        const remaining = await Recipe.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ msg: 'Recipe deleted', recipes: remaining });
    }
    catch (err)
    {
        console.error('DELETE /recipes/:id error:', err.message);
        res.status(500).json({ msg: 'Server error deleting recipe' });
    }
});

module.exports = router;