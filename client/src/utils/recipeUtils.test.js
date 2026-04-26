import { canMakeRecipe } from '../utils/recipeUtils';

// Returns true if the pantry has enough of all ingredients needed
test('returns true when pantry covers all ingredients', () => {
    const pantry = [{ name: 'Eggs', quantity: 3 }];
    const recipe = { ingredients: [{ name: 'Eggs', quantity: 2 }] };
    expect(canMakeRecipe(recipe, pantry)).toBe(true);
});