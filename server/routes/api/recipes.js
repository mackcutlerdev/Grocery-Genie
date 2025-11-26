const express = require('express');
const router = express.Router();
const recipes = require('../../tempRecipes');
const uuid = require('uuid');

// GET all recipe objects
router.get('/', (req, res) => 
{
    res.json(recipes);
});

// GET single recipe object by id
router.get('/:id', (req, res) => 
{
    const found = recipes.some(recipe => recipe.id === req.params.id);
    if(found)
    {
        res.json(recipes.filter(recipe => recipe.id === req.params.id));
    }
    else
    {
        res.status(404).json({ msg: `No recipe with the id of ${req.params.id}` });
    }
});

// POST to create a new recipe object
router.post('/', (req, res) => 
{
    const newrecipe = {
        id: uuid.v4(),
        name: req.body.name,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
    };

    if(!newrecipe.name)
    {
        return res.status(404).json({ msg: 'Please include an recipe name'})
    }

    recipes.push(newrecipe);
    res.json(recipes);
})

// PUT to update / change an recipe object
router.put('/:id', (req, res) => 
{
    const found = recipes.some(recipe => recipe.id === req.params.id);
    if(found)
    {
        const updaterecipe = req.body;
        recipes.forEach(recipe => 
        {
            if(recipe.id === req.params.id)
            {
                recipe.name = updaterecipe.name ? updaterecipe.name : recipe.name;
                recipe.ingredients = updaterecipe.ingredients ? updaterecipe.ingredients : recipe.ingredients;
                recipe.instructions = updaterecipe.instructions ? updaterecipe.instructions : recipe.instructions;

                res.json({ msg: 'recipe updated', recipe});
            }
        })
    }
    else
    {
        res.status(404).json({ msg: `No recipe with the id of ${req.params.id}` });
    }
});

// DELETE to delete an recipe
router.delete('/:id', (req, res) => 
{
    const found = recipes.some(recipe => recipe.id === req.params.id);
    if(found)
    {
        const index = recipes.findIndex(recipe => recipe.id === req.params.id);
        recipes.splice(index, 1);

        res.json({ 
            msg: "recipe deleted",
            recipes: recipes.filter(recipe => recipe.id !== req.params.id)
        })
    }
    else
    {
        res.status(404).json({ msg: `No recipe with the id of ${req.params.id}` });
    }
});

module.exports = router;