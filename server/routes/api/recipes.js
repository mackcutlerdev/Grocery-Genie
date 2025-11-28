// Dependencies
const express = require('express');
const router = express.Router();
const recipes = require('../../tempRecipes'); // temp in-memory "database" of recipes
const uuid = require('uuid');

// GET all recipe objects
router.get('/', (req, res) => 
{
    // Just send the whole recipes array back
    res.json(recipes);
});

// GET single recipe object by id
router.get('/:id', (req, res) => 
{
    // Check if any recipe has this id
    const found = recipes.some(recipe => recipe.id === req.params.id);

    if (found)
    {
        // Again using filter so it returns an array with that one recipe
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
    // Build a new recipe from body + generate a uuid
    const newrecipe = {
        id: uuid.v4(),
        name: req.body.name,
        ingredients: req.body.ingredients,       // expecting an array of { name, quantity, unit }
        instructions: req.body.instructions      // expecting an array of strings (steps)
    };

    // No nameless recipes, that's illegal here
    if (!newrecipe.name)
    {
        return res.status(404).json({ msg: "Please include a recipe name" });
    }

    // Push into in-memory array and return the full updated list
    recipes.push(newrecipe);
    res.json(recipes);
});

// PUT to update / change a recipe object
router.put('/:id', (req, res) => 
{
    // First see if a recipe with that id exists
    const found = recipes.some(recipe => recipe.id === req.params.id);

    if (found)
    {
        const updaterecipe = req.body;

        // Loop through and patch the one that matches
        recipes.forEach(recipe => 
        {
            if (recipe.id === req.params.id)
            {
                // Only overwrite fields that were actually sent
                recipe.name = updaterecipe.name ? updaterecipe.name : recipe.name;
                recipe.ingredients = updaterecipe.ingredients ? updaterecipe.ingredients : recipe.ingredients;
                recipe.instructions = updaterecipe.instructions ? updaterecipe.instructions : recipe.instructions;

                // Send back the updated recipe
                res.json({ msg: "recipe updated", recipe });
            }
        });
    }
    else
    {
        res.status(404).json({ msg: `No recipe with the id of ${req.params.id}` });
    }
});

// DELETE to delete a recipe
router.delete('/:id', (req, res) => 
{
    // Make sure it exists first
    const found = recipes.some(recipe => recipe.id === req.params.id);

    if (found)
    {
        // Remove it from the original array
        const index = recipes.findIndex(recipe => recipe.id === req.params.id);
        recipes.splice(index, 1);

        // Also return a filtered copy even though we already spliced it out
        res.json({ 
            msg: "recipe deleted",
            recipes: recipes.filter(recipe => recipe.id !== req.params.id)
        });
    }
    else
    {
        res.status(404).json({ msg: `No recipe with the id of ${req.params.id}` });
    }
});

module.exports = router;
