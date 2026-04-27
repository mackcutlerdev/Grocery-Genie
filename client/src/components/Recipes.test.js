import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Recipes from './Recipes';

// ─── Shared test data ────
const mockRecipes = [
    {
        id: '1',
        name: 'Omelette',
        prep: '10 min',
        servings: 2,
        ingredients: [
            { name: 'Eggs',   quantity: 3,   unit: 'Unit' },
            { name: 'Butter', quantity: 1,   unit: 'tbsp' },
            { name: 'Milk',   quantity: 0.5, unit: 'cup'  },
        ],
        instructions: ['Crack eggs', 'Whisk', 'Cook'],
    },
    {
        id: '2',
        name: 'Toast',
        prep: '5 min',
        servings: 1,
        ingredients: [
            { name: 'Bread',  quantity: 2, unit: 'Unit' },
            { name: 'Butter', quantity: 1, unit: 'tbsp' },
        ],
        instructions: ['Toast bread', 'Add butter'],
    },
];

const mockPantryItems = [
    { id: 'p1', name: 'Eggs',   quantity: 6,   unit: 'Unit' },
    { id: 'p2', name: 'Butter', quantity: 2,   unit: 'tbsp' },
    { id: 'p3', name: 'Milk',   quantity: 1,   unit: 'cup'  },
    { id: 'p4', name: 'Bread',  quantity: 4,   unit: 'Unit' },
];

// Default props 
const defaultProps = {
    recipes: mockRecipes,
    isLoading: false,
    onAddRecipe: jest.fn(),
    onUpdateRecipe: jest.fn(),
    onDeleteRecipe: jest.fn(),
    onMakeRecipe: jest.fn(),
    pantryItems: mockPantryItems,
    initialSelectedRecipeId: null,
};

// Helper so each test gets a clean render without repeating props
const renderRecipes = (overrides = {}) =>
    render(<Recipes {...defaultProps} {...overrides} />);

// Reset mocks between tests so call counts don't bleed over
beforeEach(() => jest.clearAllMocks());


// ─── 1. Basic rendering ───
describe('basic rendering', () =>
{
    test('renders the recipe list', () =>
    {
        renderRecipes();
        expect(screen.getByText('Omelette')).toBeInTheDocument();
        expect(screen.getByText('Toast')).toBeInTheDocument();
    });

    test('shows loading state when isLoading is true', () =>
    {
        renderRecipes({ isLoading: true, recipes: [] });
        expect(screen.getByText(/loading recipes/i)).toBeInTheDocument();
    });

    test('shows empty state when there are no recipes', () =>
    {
        renderRecipes({ recipes: [] });
        expect(screen.getByText(/no recipes yet/i)).toBeInTheDocument();
    });

    test('shows placeholder when no recipe is selected', () =>
    {
        renderRecipes();
        expect(screen.getByText(/select a recipe to view details/i)).toBeInTheDocument();
    });
});


// ─── 2. Selecting a recipe ───
describe('selecting a recipe', () =>
{
    test('shows recipe detail when a recipe is clicked', () =>
    {
        renderRecipes();
        fireEvent.click(screen.getByText('Omelette'));
        expect(screen.getByText('Eggs')).toBeInTheDocument();
        expect(screen.getByText('Crack eggs')).toBeInTheDocument();
    });

    test('opens correct recipe when initialSelectedRecipeId is set', () =>
    {
        renderRecipes({ initialSelectedRecipeId: '2' });
        expect(screen.getByText('Toast bread')).toBeInTheDocument();
    });

    test('shows meta pills for prep time and servings', () =>
    {
        renderRecipes();
        fireEvent.click(screen.getByText('Omelette'));

        // Scope to the detail header to avoid matching the list item meta
        const detailHeader = document.querySelector('.gg-recipe-detail-header');
        expect(within(detailHeader).getByText(/10 min/i)).toBeInTheDocument();
        expect(within(detailHeader).getByText(/2 servings/i)).toBeInTheDocument();
    });
});


// ─── 3. Add recipe form ───

describe('add recipe form', () =>
{
    const openAddForm = () =>
    {
        // The [+] button in the recipe list header opens the modal
        fireEvent.click(screen.getByTitle('New Recipe'));
    };

    test('opens the add modal when the + button is clicked', () =>
    {
        renderRecipes();
        openAddForm();
        expect(screen.getByPlaceholderText(/mushroom omelette/i)).toBeInTheDocument();
    });

    test('closes the modal when Cancel is clicked', () =>
    {
        renderRecipes();
        openAddForm();
        fireEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByPlaceholderText(/mushroom omelette/i)).not.toBeInTheDocument();
    });

    test('calls onAddRecipe with correct data when form is submitted', () =>
    {
        renderRecipes();
        openAddForm();

        // Fill in recipe name
        fireEvent.change(screen.getByPlaceholderText(/mushroom omelette/i), {
            target: { value: 'Pancakes' },
        });

        // Fill in the first ingredient row
        const nameInputs = screen.getAllByPlaceholderText('Name');
        fireEvent.change(nameInputs[0], { target: { value: 'Flour' } });

        const qtyInputs = screen.getAllByPlaceholderText('Qty');
        fireEvent.change(qtyInputs[0], { target: { value: '2' } });

        // Fill in instructions
        fireEvent.change(screen.getByPlaceholderText(/one step per line/i), {
            target: { value: 'Mix ingredients\nCook on griddle' },
        });

        fireEvent.click(screen.getByText('Save Recipe'));

        expect(defaultProps.onAddRecipe).toHaveBeenCalledWith({
            name: 'Pancakes',
            ingredients: [{ name: 'Flour', quantity: 2, unit: 'Unit' }],
            instructions: ['Mix ingredients', 'Cook on griddle'],
        });
    });

    test('does not call onAddRecipe if recipe name is empty', () =>
    {
        renderRecipes();
        openAddForm();
        fireEvent.click(screen.getByText('Save Recipe'));
        expect(defaultProps.onAddRecipe).not.toHaveBeenCalled();
    });

    test('ingredients with empty name are filtered out before saving', () =>
    {
        renderRecipes();
        openAddForm();

        fireEvent.change(screen.getByPlaceholderText(/mushroom omelette/i), {
            target: { value: 'Test Recipe' },
        });

        // Leave the default ingredient row blank and save
        fireEvent.click(screen.getByText('Save Recipe'));

        expect(defaultProps.onAddRecipe).toHaveBeenCalledWith(
            expect.objectContaining({ ingredients: [] })
        );
    });

    test('instructions are split on newlines into an array', () =>
    {
        renderRecipes();
        openAddForm();

        fireEvent.change(screen.getByPlaceholderText(/mushroom omelette/i), {
            target: { value: 'Test Recipe' },
        });
        fireEvent.change(screen.getByPlaceholderText(/one step per line/i), {
            target: { value: 'Step one\nStep two\nStep three' },
        });

        fireEvent.click(screen.getByText('Save Recipe'));

        expect(defaultProps.onAddRecipe).toHaveBeenCalledWith(
            expect.objectContaining({
                instructions: ['Step one', 'Step two', 'Step three'],
            })
        );
    });
});


// ─── 4. Deleting a recipe ─

describe('deleting a recipe', () =>
{
    test('calls onDeleteRecipe when confirmed', () =>
    {
        window.confirm = jest.fn(() => true);
        renderRecipes();
        fireEvent.click(screen.getByText('Omelette'));
        fireEvent.click(screen.getByTitle('Delete recipe'));
        expect(defaultProps.onDeleteRecipe).toHaveBeenCalledWith('1');
    });

    test('does not call onDeleteRecipe when cancelled', () =>
    {
        window.confirm = jest.fn(() => false);
        renderRecipes();
        fireEvent.click(screen.getByText('Omelette'));
        fireEvent.click(screen.getByTitle('Delete recipe'));
        expect(defaultProps.onDeleteRecipe).not.toHaveBeenCalled();
    });

    test('clears the detail panel after deleting the selected recipe', () =>
    {
        window.confirm = jest.fn(() => true);
        renderRecipes();
        fireEvent.click(screen.getByText('Omelette'));
        fireEvent.click(screen.getByTitle('Delete recipe'));
        expect(screen.getByText(/select a recipe to view details/i)).toBeInTheDocument();
    });
});


// ─── 5. Edit form ─────────

describe('edit form', () =>
{
    const openEditForm = () =>
    {
        fireEvent.click(screen.getByText('Omelette'));
        fireEvent.click(screen.getByText('Edit'));
    };

    test('opens edit form with pre-filled recipe name', () =>
    {
        renderRecipes();
        openEditForm();
        expect(screen.getByDisplayValue('Omelette')).toBeInTheDocument();
    });

    test('calls onUpdateRecipe with updated name when saved', () =>
    {
        renderRecipes();
        openEditForm();

        fireEvent.change(screen.getByDisplayValue('Omelette'), {
            target: { value: 'Cheese Omelette' },
        });

        fireEvent.click(screen.getByText('Save Changes'));

        expect(defaultProps.onUpdateRecipe).toHaveBeenCalledWith(
            '1',
            expect.objectContaining({ name: 'Cheese Omelette' })
        );
    });

    test('cancel edit returns to read-only detail view', () =>
    {
        renderRecipes();
        openEditForm();
        fireEvent.click(screen.getByText('Cancel'));
        expect(screen.getByText('Make Recipe')).toBeInTheDocument();
    });
});


// ─── 6. Pantry coverage (getCoverage) ───────────────────────────────────────

describe('pantry coverage', () =>
{
    test('shows coverage gauge when a recipe is selected', () =>
    {
        renderRecipes();
        fireEvent.click(screen.getByText('Omelette'));
        expect(screen.getByText(/pantry coverage/i)).toBeInTheDocument();
    });

    test('shows correct matched count in the gauge', () =>
    {
        renderRecipes();
        fireEvent.click(screen.getByText('Omelette'));
        // Omelette has 3 ingredients, all in mockPantryItems
        expect(screen.getByText(/3 \/ 3 ingredients/i)).toBeInTheDocument();
    });

    test('shows partial coverage when only some ingredients are in pantry', () =>
    {
        renderRecipes({
            pantryItems: [{ id: 'p1', name: 'Eggs', quantity: 6, unit: 'Unit' }],
        });
        fireEvent.click(screen.getByText('Omelette'));
        // Only Eggs matched out of 3 ingredients
        expect(screen.getByText(/1 \/ 3 ingredients/i)).toBeInTheDocument();
    });

    test('ingredient rows show check icon when item is in pantry', () =>
    {
        renderRecipes();
        fireEvent.click(screen.getByText('Omelette'));
        // All ingredients are in pantry so all should have check icons
        const checks = document.querySelectorAll('.gg-detail-ing-check.have');
        expect(checks.length).toBe(3);
    });

    test('ingredient rows show x icon when item is missing from pantry', () =>
    {
        renderRecipes({ pantryItems: [] });
        fireEvent.click(screen.getByText('Omelette'));
        const missing = document.querySelectorAll('.gg-detail-ing-check.missing');
        expect(missing.length).toBe(3);
    });
});


// ─── 7. Make Recipe ───────

describe('make recipe', () =>
{
    test('calls onMakeRecipe when fully covered and confirmed', () =>
    {
        window.confirm = jest.fn(() => true);
        window.alert   = jest.fn();
        renderRecipes();
        fireEvent.click(screen.getByText('Omelette'));
        fireEvent.click(screen.getByText('Make Recipe'));
        expect(defaultProps.onMakeRecipe).toHaveBeenCalledWith(mockRecipes[0]);
    });

    test('does not call onMakeRecipe when confirm is cancelled', () =>
    {
        window.confirm = jest.fn(() => false);
        renderRecipes();
        fireEvent.click(screen.getByText('Omelette'));
        fireEvent.click(screen.getByText('Make Recipe'));
        expect(defaultProps.onMakeRecipe).not.toHaveBeenCalled();
    });

    test('shows partial ingredients warning when pantry is incomplete', () =>
    {
        window.confirm = jest.fn(() => false);
        renderRecipes({
            pantryItems: [{ id: 'p1', name: 'Eggs', quantity: 6, unit: 'Unit' }],
        });
        fireEvent.click(screen.getByText('Omelette'));
        fireEvent.click(screen.getByText('Make Recipe'));
        // The partial-coverage confirm message mentions "don't have all the ingredients"
        expect(window.confirm).toHaveBeenCalledWith(
            expect.stringContaining("don't have all the ingredients")
        );
    });
});

// ─── 8. Recipe search ────────────────────────────────────────────────────────

describe('recipe search', () =>
{
    test('renders the recipe search input', () =>
    {
        renderRecipes();
        expect(screen.getByPlaceholderText(/search recipes/i)).toBeInTheDocument();
    });

    test('shows all recipes when search is empty', () =>
    {
        renderRecipes();
        expect(screen.getByText('Omelette')).toBeInTheDocument();
        expect(screen.getByText('Toast')).toBeInTheDocument();
    });

    test('filters recipes by name substring match', () =>
    {
        renderRecipes();
        fireEvent.change(screen.getByPlaceholderText(/search recipes/i), {
            target: { value: 'omel' },
        });
        expect(screen.getByText('Omelette')).toBeInTheDocument();
        expect(screen.queryByText('Toast')).not.toBeInTheDocument();
    });

    test('search is case-insensitive', () =>
    {
        renderRecipes();
        fireEvent.change(screen.getByPlaceholderText(/search recipes/i), {
            target: { value: 'TOAST' },
        });
        expect(screen.getByText('Toast')).toBeInTheDocument();
    });

    test('shows no-match message when search returns nothing', () =>
    {
        renderRecipes();
        fireEvent.change(screen.getByPlaceholderText(/search recipes/i), {
            target: { value: 'zzznomatch' },
        });
        expect(screen.getByText(/no recipes match/i)).toBeInTheDocument();
    });

    test('shows a Clear button in the no-match state', () =>
    {
        renderRecipes();
        fireEvent.change(screen.getByPlaceholderText(/search recipes/i), {
            target: { value: 'zzznomatch' },
        });
        expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    test('Clear button in no-match state resets the search', () =>
    {
        renderRecipes();
        fireEvent.change(screen.getByPlaceholderText(/search recipes/i), {
            target: { value: 'zzznomatch' },
        });
        fireEvent.click(screen.getByText('Clear'));
        expect(screen.getByText('Omelette')).toBeInTheDocument();
        expect(screen.getByText('Toast')).toBeInTheDocument();
    });

    test('shows clear (X) button inside the input when query is not empty', () =>
    {
        renderRecipes();
        fireEvent.change(screen.getByPlaceholderText(/search recipes/i), {
            target: { value: 'omel' },
        });
        expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    test('clear (X) button inside input resets the search', () =>
    {
        renderRecipes();
        const input = screen.getByPlaceholderText(/search recipes/i);
        fireEvent.change(input, { target: { value: 'omel' } });
        fireEvent.click(screen.getByLabelText('Clear search'));
        expect(input.value).toBe('');
        expect(screen.getByText('Toast')).toBeInTheDocument();
    });

    test('filtered list still selects and shows recipe details correctly', () =>
    {
        renderRecipes();
        fireEvent.change(screen.getByPlaceholderText(/search recipes/i), {
            target: { value: 'toast' },
        });
        fireEvent.click(screen.getByText('Toast'));
        expect(screen.getByText('Toast bread')).toBeInTheDocument();
    });

    test('does not show the "no recipes yet" message during a no-match search', () =>
    {
        renderRecipes();
        fireEvent.change(screen.getByPlaceholderText(/search recipes/i), {
            target: { value: 'zzznomatch' },
        });
        expect(screen.queryByText(/no recipes yet/i)).not.toBeInTheDocument();
    });
});