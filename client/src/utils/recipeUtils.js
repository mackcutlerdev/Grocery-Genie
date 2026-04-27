import { namesLooselyMatch } from './matchingUtils';

// Returns true if all recipe ingredients are satisfied by the pantry
export const canMakeRecipe = (recipe, pantryItems) =>
{
    if (!recipe || !Array.isArray(recipe.ingredients)) return false;
    return recipe.ingredients.every((ing) =>
    {
        const match = pantryItems.find((p) => namesLooselyMatch(p.name, ing.name));
        if (!match) return false;
        if (ing.quantity === null || ing.quantity === undefined) return true;
        return match.quantity >= ing.quantity;
    });
};

// Returns an array of ingredients the pantry can't fully satisfy
export const getMissingIngredients = (recipe, pantryItems) =>
{
    const missing = [];
    recipe.ingredients.forEach((ing) =>
    {
        const match = pantryItems.find((p) => namesLooselyMatch(p.name, ing.name));
        if (!match)
        {
            missing.push({ name: ing.name, needed: ing.quantity ?? null, unit: ing.unit || '' });
            return;
        }
        if (ing.quantity !== null && ing.quantity !== undefined)
            if (match.quantity < ing.quantity)
                missing.push({ name: ing.name, needed: ing.quantity - match.quantity, unit: ing.unit || '' });
    });
    return missing;
};

// Returns { total, matched, missingList } — used by WCIM for the "X / Y have" display
export const matchInfo = (recipe, pantryItems) =>
{
    const total       = recipe.ingredients ? recipe.ingredients.length : 0;
    const missingList = getMissingIngredients(recipe, pantryItems);
    const matched     = total - missingList.length;
    return { total, matched, missingList };
};

// Returns { matched, total, pct } — used by Recipes for the coverage gauge and dot colour
export const getCoverage = (recipe, pantryItems) =>
{
    if (!recipe || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0)
        return { matched: 0, total: 0, pct: 0 };

    const total   = recipe.ingredients.length;
    const matched = recipe.ingredients.filter((ing) =>
    {
        const p = pantryItems.find((pi) => namesLooselyMatch(pi.name, ing.name));
        if (!p) return false;
        if (ing.quantity === null || ing.quantity === undefined) return true;
        return p.quantity >= ing.quantity;
    }).length;

    return { matched, total, pct: total > 0 ? matched / total : 0 };
};

// Builds the "30 min · 6 ing." meta string shown under recipe names
export const buildMeta = (recipe) =>
{
    const parts = [];
    if (recipe.prep) parts.push(recipe.prep);
    const ingCount = Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0;
    if (ingCount > 0) parts.push(`${ingCount} ing.`);
    return parts.join(' · ');
};