const express = require('express');
const router  = express.Router();
const Recipe  = require('../../models/Recipe');

// GET all recipes
router.get('/', async (req, res) =>
{
    try
    {
        const recipes = await Recipe.find().sort({ createdAt: -1 });
        res.json(recipes);
    }
    catch (err)
    {
        console.error('GET /recipes error:', err.message);
        res.status(500).json({ msg: 'Server error fetching recipes' });
    }
});

// GET single recipe by id
router.get('/:id', async (req, res) =>
{
    try
    {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe)
        {
            return res.status(404).json({ msg: `No recipe with id ${req.params.id}` });
        }

        res.json(recipe);
    }
    catch (err)
    {
        console.error('GET /recipes/:id error:', err.message);
        res.status(500).json({ msg: 'Server error fetching recipe' });
    }
});

// POST — create a new recipe
router.post('/', async (req, res) =>
{
    const { name, ingredients, instructions, prep, servings } = req.body;

    if (!name || !name.trim())
    {
        return res.status(400).json({ msg: 'Please include a recipe name' });
    }

    try
    {
        const recipe = new Recipe(
        {
            name:         name.trim(),
            ingredients:  ingredients  || [],
            instructions: instructions || [],
            prep:         prep         || '',
            servings:     servings     || null,
        });

        await recipe.save();

        // Return full updated list (same shape client expects)
        const allRecipes = await Recipe.find().sort({ createdAt: -1 });
        res.json(allRecipes);
    }
    catch (err)
    {
        console.error('POST /recipes error:', err.message);
        res.status(500).json({ msg: 'Server error creating recipe' });
    }
});

// PUT — update a recipe
router.put('/:id', async (req, res) =>
{
    const { name, ingredients, instructions, prep, servings } = req.body;

    try
    {
        const updated = await Recipe.findByIdAndUpdate(
            req.params.id,
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
        {
            return res.status(404).json({ msg: `No recipe with id ${req.params.id}` });
        }

        // Same shape as old route: { msg, recipe }
        res.json({ msg: 'Recipe updated', recipe: updated });
    }
    catch (err)
    {
        console.error('PUT /recipes/:id error:', err.message);
        res.status(500).json({ msg: 'Server error updating recipe' });
    }
});

// DELETE — remove a recipe
router.delete('/:id', async (req, res) =>
{
    try
    {
        const deleted = await Recipe.findByIdAndDelete(req.params.id);

        if (!deleted)
        {
            return res.status(404).json({ msg: `No recipe with id ${req.params.id}` });
        }

        const remaining = await Recipe.find().sort({ createdAt: -1 });
        res.json({ msg: 'Recipe deleted', recipes: remaining });
    }
    catch (err)
    {
        console.error('DELETE /recipes/:id error:', err.message);
        res.status(500).json({ msg: 'Server error deleting recipe' });
    }
});

module.exports = router;