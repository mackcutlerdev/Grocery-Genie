import { namesLooselyMatch } from './matchingUtils';

export const canMakeRecipe = (recipe, pantryItems) => {
    if (!recipe || !Array.isArray(recipe.ingredients)) return false;
    return recipe.ingredients.every((ing) => {
        const match = pantryItems.find((p) => namesLooselyMatch(p.name, ing.name));
        if (!match) return false;
        if (ing.quantity === null || ing.quantity === undefined) return true;
        return match.quantity >= ing.quantity;
    });
};

export const getMissingIngredients = (recipe, pantryItems) => {
    const missing = [];
    recipe.ingredients.forEach((ing) => {
        const match = pantryItems.find((p) => namesLooselyMatch(p.name, ing.name));
        if (!match) {
            missing.push({ name: ing.name, needed: ing.quantity ?? null, unit: ing.unit || '' });
            return;
        }
        if (ing.quantity !== null && ing.quantity !== undefined)
            if (match.quantity < ing.quantity)
                missing.push({ name: ing.name, needed: ing.quantity - match.quantity, unit: ing.unit || '' });
    });
    return missing;
};

export const matchInfo = (recipe, pantryItems) => {
    const total = recipe.ingredients ? recipe.ingredients.length : 0;
    const missingList = getMissingIngredients(recipe, pantryItems);
    const matched = total - missingList.length;
    return { total, matched, missingList };
};

export const buildMeta = (recipe) => {
    const parts = [];
    if (recipe.prep) parts.push(recipe.prep);
    const ingCount = Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0;
    if (ingCount > 0) parts.push(`${ingCount} ing.`);
    return parts.join(' · ');
};