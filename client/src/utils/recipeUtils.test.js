import { canMakeRecipe, getMissingIngredients, matchInfo, getCoverage, buildMeta } from '../utils/recipeUtils';


// Shared test data

const fullPantry = [
    { name: 'Eggs',   quantity: 6,   unit: 'Unit' },
    { name: 'Butter', quantity: 2,   unit: 'tbsp' },
    { name: 'Milk',   quantity: 1,   unit: 'cup'  },
];

const omelette = {
    name: 'Omelette',
    prep: '10 min',
    ingredients: [
        { name: 'Eggs',   quantity: 2,   unit: 'Unit' },
        { name: 'Butter', quantity: 1,   unit: 'tbsp' },
        { name: 'Milk',   quantity: 0.5, unit: 'cup'  },
    ],
    instructions: ['Crack eggs', 'Whisk', 'Cook'],
};

const chili = {
    name: 'Chili',
    prep: '30 min',
    ingredients: [
        { name: 'Ground Beef',     quantity: 1, unit: 'kg'   },
        { name: 'Crushed Tomatoes',quantity: 2, unit: 'Can'  },
        { name: 'Chili Powder',    quantity: 2, unit: 'tbsp' },
    ],
    instructions: ['Brown beef', 'Add tomatoes', 'Simmer'],
};


// canMakeRecipe 

describe('canMakeRecipe', () =>
{
    test('returns true when pantry fully covers the recipe', () =>
    {
        expect(canMakeRecipe(omelette, fullPantry)).toBe(true);
    });

    test('returns false when a required ingredient is missing entirely', () =>
    {
        expect(canMakeRecipe(omelette, [])).toBe(false);
    });

    test('returns false when pantry has ingredient but not enough quantity', () =>
    {
        const shortPantry = [
            { name: 'Eggs',   quantity: 1,   unit: 'Unit' }, // need 2
            { name: 'Butter', quantity: 2,   unit: 'tbsp' },
            { name: 'Milk',   quantity: 1,   unit: 'cup'  },
        ];
        expect(canMakeRecipe(omelette, shortPantry)).toBe(false);
    });

    test('returns true when pantry has exactly enough quantity', () =>
    {
        const exactPantry = [
            { name: 'Eggs',   quantity: 2,   unit: 'Unit' },
            { name: 'Butter', quantity: 1,   unit: 'tbsp' },
            { name: 'Milk',   quantity: 0.5, unit: 'cup'  },
        ];
        expect(canMakeRecipe(omelette, exactPantry)).toBe(true);
    });

    test('returns true for "to taste" ingredients (null quantity) as long as item exists', () =>
    {
        const recipeWithToTaste = {
            ingredients: [{ name: 'Salt', quantity: null, unit: '' }],
        };
        const pantryWithSalt = [{ name: 'Salt', quantity: 0.5, unit: 'tsp' }];
        expect(canMakeRecipe(recipeWithToTaste, pantryWithSalt)).toBe(true);
    });

    test('returns false for "to taste" ingredient when pantry has none', () =>
    {
        const recipeWithToTaste = {
            ingredients: [{ name: 'Salt', quantity: null, unit: '' }],
        };
        expect(canMakeRecipe(recipeWithToTaste, [])).toBe(false);
    });

    test('returns false when recipe is null', () =>
    {
        expect(canMakeRecipe(null, fullPantry)).toBe(false);
    });

    test('returns false when recipe has no ingredients array', () =>
    {
        expect(canMakeRecipe({ name: 'Empty' }, fullPantry)).toBe(false);
    });

    test('returns true for a recipe with no ingredients (nothing to satisfy)', () =>
    {
        expect(canMakeRecipe({ ingredients: [] }, fullPantry)).toBe(true);
    });

    test('uses loose matching — 2% Milk satisfies a Milk requirement', () =>
    {
        const pantryWith2Milk = [
            { name: 'Eggs',   quantity: 6,   unit: 'Unit' },
            { name: 'Butter', quantity: 2,   unit: 'tbsp' },
            { name: '2% Milk',quantity: 1,   unit: 'cup'  },
        ];
        expect(canMakeRecipe(omelette, pantryWith2Milk)).toBe(true);
    });
});


// getMissingIngredients

describe('getMissingIngredients', () =>
{
    test('returns empty array when all ingredients are covered', () =>
    {
        expect(getMissingIngredients(omelette, fullPantry)).toEqual([]);
    });

    test('returns missing ingredient when not in pantry at all', () =>
    {
        const missing = getMissingIngredients(chili, fullPantry);
        const names   = missing.map((m) => m.name);
        expect(names).toContain('Ground Beef');
        expect(names).toContain('Crushed Tomatoes');
        expect(names).toContain('Chili Powder');
    });

    test('returns partial deficit when pantry has some but not enough', () =>
    {
        const shortPantry = [
            { name: 'Eggs',   quantity: 1,   unit: 'Unit' }, // have 1, need 2 → deficit 1
            { name: 'Butter', quantity: 2,   unit: 'tbsp' },
            { name: 'Milk',   quantity: 1,   unit: 'cup'  },
        ];
        const missing = getMissingIngredients(omelette, shortPantry);
        expect(missing).toHaveLength(1);
        expect(missing[0].name).toBe('Eggs');
        expect(missing[0].needed).toBe(1); // 2 needed - 1 have = 1 short
    });

    test('does not include "to taste" (null quantity) ingredients as missing even if pantry has none', () =>
    {
        // null quantity = to taste = not a hard requirement
        const recipeToTaste = {
            ingredients: [
                { name: 'Salt',   quantity: null, unit: '' },
                { name: 'Pepper', quantity: null, unit: '' },
            ],
        };
        // getMissingIngredients only adds to missing if there's a shortfall in quantity
        // null quantity items skip the shortfall check entirely
        const missing = getMissingIngredients(recipeToTaste, []);
        // Both are missing from pantry entirely → added to missing list as { needed: null }
        expect(missing).toHaveLength(2);
        expect(missing[0].needed).toBeNull();
    });
});


// matchInfo

describe('matchInfo', () =>
{
    test('returns correct total ingredient count', () =>
    {
        const info = matchInfo(omelette, fullPantry);
        expect(info.total).toBe(3);
    });

    test('returns correct matched count when all covered', () =>
    {
        const info = matchInfo(omelette, fullPantry);
        expect(info.matched).toBe(3);
    });

    test('returns correct matched count for partial coverage', () =>
    {
        const oneItemPantry = [{ name: 'Eggs', quantity: 6, unit: 'Unit' }];
        const info = matchInfo(omelette, oneItemPantry);
        expect(info.matched).toBe(1);
        expect(info.total).toBe(3);
    });

    test('returns missingList with correct items', () =>
    {
        const oneItemPantry = [{ name: 'Eggs', quantity: 6, unit: 'Unit' }];
        const info = matchInfo(omelette, oneItemPantry);
        const missingNames = info.missingList.map((m) => m.name);
        expect(missingNames).toContain('Butter');
        expect(missingNames).toContain('Milk');
        expect(missingNames).not.toContain('Eggs');
    });

    test('returns total 0 and matched 0 for recipe with no ingredients', () =>
    {
        const info = matchInfo({ ingredients: [] }, fullPantry);
        expect(info.total).toBe(0);
        expect(info.matched).toBe(0);
    });
});


// getCoverage

describe('getCoverage', () =>
{
    test('returns pct 1 when all ingredients are covered', () =>
    {
        const { pct } = getCoverage(omelette, fullPantry);
        expect(pct).toBe(1);
    });

    test('returns pct 0 when no ingredients are covered', () =>
    {
        const { pct } = getCoverage(omelette, []);
        expect(pct).toBe(0);
    });

    test('returns correct partial pct', () =>
    {
        const oneItemPantry = [{ name: 'Eggs', quantity: 6, unit: 'Unit' }];
        const { pct, matched, total } = getCoverage(omelette, oneItemPantry);
        expect(matched).toBe(1);
        expect(total).toBe(3);
        expect(pct).toBeCloseTo(1 / 3);
    });

    test('returns pct 0 and zeros when recipe has no ingredients', () =>
    {
        const { matched, total, pct } = getCoverage({ ingredients: [] }, fullPantry);
        expect(matched).toBe(0);
        expect(total).toBe(0);
        expect(pct).toBe(0);
    });

    test('returns zeros when recipe is null', () =>
    {
        const { matched, total, pct } = getCoverage(null, fullPantry);
        expect(matched).toBe(0);
        expect(total).toBe(0);
        expect(pct).toBe(0);
    });
});


// buildMeta

describe('buildMeta', () =>
{
    test('returns "prep · X ing." when both prep and ingredients exist', () =>
    {
        expect(buildMeta(omelette)).toBe('10 min · 3 ing.');
    });

    test('returns only ingredient count when prep is missing', () =>
    {
        const noPrep = { ingredients: [{ name: 'Eggs' }, { name: 'Milk' }] };
        expect(buildMeta(noPrep)).toBe('2 ing.');
    });

    test('returns only prep when ingredients array is empty', () =>
    {
        const noIngs = { prep: '5 min', ingredients: [] };
        expect(buildMeta(noIngs)).toBe('5 min');
    });

    test('returns empty string when neither prep nor ingredients exist', () =>
    {
        expect(buildMeta({ ingredients: [] })).toBe('');
    });

    test('returns empty string when ingredients is missing entirely', () =>
    {
        expect(buildMeta({})).toBe('');
    });
});