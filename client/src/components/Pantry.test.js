// Pantry.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pantry from './Pantry';

//  Shared test data

const mockItems = [
    { id: '1', name: 'Eggs',   quantity: 12, unit: 'Unit' },
    { id: '2', name: 'Milk',   quantity: 2,  unit: 'L'    },
    { id: '3', name: 'Butter', quantity: 1,  unit: 'kg'   },
];

const defaultProps = {
    items:        mockItems,
    isLoading:    false,
    onAddItem:    jest.fn(),
    onUpdateItem: jest.fn(),
    onDeleteItem: jest.fn(),
};

const renderPantry = (overrides = {}) =>
    render(<Pantry {...defaultProps} {...overrides} />);

beforeEach(() => jest.clearAllMocks());


// 1. Basic rendering

describe('basic rendering', () =>
{
    test('renders all pantry items', () =>
    {
        renderPantry();
        expect(screen.getByText('Eggs')).toBeInTheDocument();
        expect(screen.getByText('Milk')).toBeInTheDocument();
        expect(screen.getByText('Butter')).toBeInTheDocument();
    });

    test('shows loading state when isLoading is true', () =>
    {
        renderPantry({ isLoading: true, items: [] });
        expect(screen.getByText(/loading pantry/i)).toBeInTheDocument();
    });

    test('shows empty state when items array is empty', () =>
    {
        renderPantry({ items: [] });
        expect(screen.getByText(/your pantry is empty/i)).toBeInTheDocument();
    });
});


// 2. Add item form

describe('add item form', () =>
{
    test('calls onAddItem with correct data when form is submitted', () =>
    {
        renderPantry();

        fireEvent.change(screen.getByLabelText('Ingredient Name'), {
            target: { value: 'Flour' },
        });
        fireEvent.change(screen.getByLabelText('Quantity'), {
            target: { value: '3' },
        });
        fireEvent.change(screen.getByLabelText('Unit'), {
            target: { value: 'kg' },
        });

        fireEvent.click(screen.getByText('Add to Pantry'));

        expect(defaultProps.onAddItem).toHaveBeenCalledWith({
            name:     'Flour',
            quantity: 3,
            unit:     'kg',
        });
    });

    test('does not call onAddItem when name is empty', () =>
    {
        renderPantry();
        fireEvent.click(screen.getByText('Add to Pantry'));
        expect(defaultProps.onAddItem).not.toHaveBeenCalled();
    });

    test('does not call onAddItem when name is only whitespace', () =>
    {
        renderPantry();
        fireEvent.change(screen.getByLabelText('Ingredient Name'), {
            target: { value: '   ' },
        });
        fireEvent.click(screen.getByText('Add to Pantry'));
        expect(defaultProps.onAddItem).not.toHaveBeenCalled();
    });

    test('quantity defaults to 0 when left blank', () =>
    {
        renderPantry();
        fireEvent.change(screen.getByLabelText('Ingredient Name'), {
            target: { value: 'Salt' },
        });
        // Leave quantity blank
        fireEvent.click(screen.getByText('Add to Pantry'));
        expect(defaultProps.onAddItem).toHaveBeenCalledWith(
            expect.objectContaining({ quantity: 0 })
        );
    });

    test('quantity is converted from string to number', () =>
    {
        renderPantry();
        fireEvent.change(screen.getByLabelText('Ingredient Name'), {
            target: { value: 'Rice' },
        });
        fireEvent.change(screen.getByLabelText('Quantity'), {
            target: { value: '5' },
        });
        fireEvent.click(screen.getByText('Add to Pantry'));
        expect(defaultProps.onAddItem).toHaveBeenCalledWith(
            expect.objectContaining({ quantity: 5 })
        );
        // Make sure it's actually a number, not the string "5"
        const calledWith = defaultProps.onAddItem.mock.calls[0][0];
        expect(typeof calledWith.quantity).toBe('number');
    });

    test('clears the form fields after a successful submit', () =>
    {
        renderPantry();
        const nameInput = screen.getByLabelText('Ingredient Name');

        fireEvent.change(nameInput, { target: { value: 'Pepper' } });
        fireEvent.click(screen.getByText('Add to Pantry'));

        expect(nameInput.value).toBe('');
    });
});


// 3. Delete item

describe('delete item', () =>
{
    test('calls onDeleteItem with correct id when confirmed', () =>
    {
        window.confirm = jest.fn(() => true);
        renderPantry();
        const deleteButtons = screen.getAllByTitle('Delete');
        fireEvent.click(deleteButtons[0]);
        expect(defaultProps.onDeleteItem).toHaveBeenCalledWith('1');
    });

    test('does not call onDeleteItem when cancelled', () =>
    {
        window.confirm = jest.fn(() => false);
        renderPantry();
        const deleteButtons = screen.getAllByTitle('Delete');
        fireEvent.click(deleteButtons[0]);
        expect(defaultProps.onDeleteItem).not.toHaveBeenCalled();
    });
});


// 4. Edit item

describe('edit item', () =>
{
    const clickEditOnFirst = () =>
    {
        const editButtons = screen.getAllByTitle('Edit');
        fireEvent.click(editButtons[0]);
    };

    test('clicking Edit shows pre-filled input with item name', () =>
    {
        renderPantry();
        clickEditOnFirst();
        expect(screen.getByDisplayValue('Eggs')).toBeInTheDocument();
    });

    test('clicking Edit shows pre-filled input with item quantity', () =>
    {
        renderPantry();
        clickEditOnFirst();
        expect(screen.getByDisplayValue('12')).toBeInTheDocument();
    });

    test('clicking Edit replaces action buttons with Save and Cancel', () =>
    {
        renderPantry();
        clickEditOnFirst();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('calls onUpdateItem with updated values when Save is clicked', () =>
    {
        renderPantry();
        clickEditOnFirst();

        fireEvent.change(screen.getByDisplayValue('Eggs'), {
            target: { value: 'Free Range Eggs' },
        });
        fireEvent.change(screen.getByDisplayValue('12'), {
            target: { value: '6' },
        });

        fireEvent.click(screen.getByText('Save'));

        expect(defaultProps.onUpdateItem).toHaveBeenCalledWith('1', {
            name:     'Free Range Eggs',
            quantity: 6,
            unit:     'Unit',
        });
    });

    test('Cancel returns the row to read-only view', () =>
    {
        renderPantry();
        clickEditOnFirst();
        fireEvent.click(screen.getByText('Cancel'));

        // Edit inputs should be gone, item name should be plain text again
        expect(screen.queryByDisplayValue('Eggs')).not.toBeInTheDocument();
        expect(screen.getByText('Eggs')).toBeInTheDocument();
    });

    test('Cancel does not call onUpdateItem', () =>
    {
        renderPantry();
        clickEditOnFirst();
        fireEvent.click(screen.getByText('Cancel'));
        expect(defaultProps.onUpdateItem).not.toHaveBeenCalled();
    });

    test('only one row is in edit mode at a time', () =>
    {
        renderPantry();
        const editButtons = screen.getAllByTitle('Edit');

        // Start editing first item, then click edit on second
        fireEvent.click(editButtons[0]);
        fireEvent.click(editButtons[1]);

        // Only the second item's name should be in an input now
        expect(screen.queryByDisplayValue('Eggs')).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('Milk')).toBeInTheDocument();
    });
});


// 5. Depleted items (quantity = 0)

describe('depleted items', () =>
{
    const depletedItems = [
        { id: '1', name: 'Eggs',   quantity: 0,  unit: 'Unit' },
        { id: '2', name: 'Butter', quantity: 2,  unit: 'tbsp' },
    ];

    test('shows the "Empty" pill for items with quantity 0', () =>
    {
        renderPantry({ items: depletedItems });
        expect(screen.getByText('Empty')).toBeInTheDocument();
    });

    test('does not show the "Empty" pill for items with quantity > 0', () =>
    {
        renderPantry({ items: depletedItems });
        // Butter has qty 2, so no second Empty pill
        const pills = screen.queryAllByText('Empty');
        expect(pills).toHaveLength(1);
    });

    test('adds row-depleted class to rows with quantity 0', () =>
    {
        renderPantry({ items: depletedItems });
        const rows = document.querySelectorAll('tbody tr.row-depleted');
        expect(rows).toHaveLength(1);
    });

    test('does not add row-depleted class to rows with quantity > 0', () =>
    {
        renderPantry({ items: depletedItems });
        const rows = document.querySelectorAll('tbody tr:not(.row-depleted)');
        // 1 row with qty > 0
        expect(rows).toHaveLength(1);
    });

    test('depleted item still renders Edit and Delete buttons', () =>
    {
        renderPantry({ items: [{ id: '1', name: 'Eggs', quantity: 0, unit: 'Unit' }] });
        expect(screen.getByTitle('Edit')).toBeInTheDocument();
        expect(screen.getByTitle('Delete')).toBeInTheDocument();
    });

    test('depleted item can still be edited to restore quantity', () =>
    {
        renderPantry({ items: [{ id: '1', name: 'Eggs', quantity: 0, unit: 'Unit' }] });
        fireEvent.click(screen.getByTitle('Edit'));

        // Should pre-fill with 0
        expect(screen.getByDisplayValue('0')).toBeInTheDocument();

        // Update to a real quantity
        fireEvent.change(screen.getByDisplayValue('0'), { target: { value: '6' } });
        fireEvent.click(screen.getByText('Save'));

        expect(defaultProps.onUpdateItem).toHaveBeenCalledWith('1', {
            name:     'Eggs',
            quantity: 6,
            unit:     'Unit',
        });
    });

    test('depleted item does not show Empty pill when in edit mode', () =>
    {
        renderPantry({ items: [{ id: '1', name: 'Eggs', quantity: 0, unit: 'Unit' }] });
        fireEvent.click(screen.getByTitle('Edit'));
        expect(screen.queryByText('Empty')).not.toBeInTheDocument();
    });

    test('item with exactly 0 quantity is treated as depleted, not normal', () =>
    {
        renderPantry({ items: [{ id: '1', name: 'Salt', quantity: 0, unit: 'tsp' }] });
        expect(screen.getByText('Empty')).toBeInTheDocument();
        expect(document.querySelector('tr.row-depleted')).toBeInTheDocument();
    });
});

// 6. Search bar

describe('search bar', () =>
{
    test('renders the search input', () =>
    {
        renderPantry();
        expect(screen.getByPlaceholderText(/search ingredients/i)).toBeInTheDocument();
    });

    test('shows all items when search is empty', () =>
    {
        renderPantry();
        expect(screen.getByText('Eggs')).toBeInTheDocument();
        expect(screen.getByText('Milk')).toBeInTheDocument();
        expect(screen.getByText('Butter')).toBeInTheDocument();
    });

    test('filters items by name substring match', () =>
    {
        renderPantry();
        fireEvent.change(screen.getByPlaceholderText(/search ingredients/i), {
            target: { value: 'mi' },
        });
        expect(screen.getByText('Milk')).toBeInTheDocument();
        expect(screen.queryByText('Eggs')).not.toBeInTheDocument();
        expect(screen.queryByText('Butter')).not.toBeInTheDocument();
    });

    test('search is case-insensitive', () =>
    {
        renderPantry();
        fireEvent.change(screen.getByPlaceholderText(/search ingredients/i), {
            target: { value: 'EGGS' },
        });
        expect(screen.getByText('Eggs')).toBeInTheDocument();
    });

    test('shows no-results message when nothing matches', () =>
    {
        renderPantry();
        fireEvent.change(screen.getByPlaceholderText(/search ingredients/i), {
            target: { value: 'zzznomatch' },
        });
        expect(screen.getByText(/no ingredients match/i)).toBeInTheDocument();
    });

    test('shows a clear-filters button in the no-results state', () =>
    {
        renderPantry();
        fireEvent.change(screen.getByPlaceholderText(/search ingredients/i), {
            target: { value: 'zzznomatch' },
        });
        expect(screen.getByText('Clear filters')).toBeInTheDocument();
    });

    test('clear-filters button resets the search and shows all items', () =>
    {
        renderPantry();
        fireEvent.change(screen.getByPlaceholderText(/search ingredients/i), {
            target: { value: 'zzznomatch' },
        });
        fireEvent.click(screen.getByText('Clear filters'));
        expect(screen.getByText('Eggs')).toBeInTheDocument();
    });

    test('shows clear (X) button inside the input when query is not empty', () =>
    {
        renderPantry();
        fireEvent.change(screen.getByPlaceholderText(/search ingredients/i), {
            target: { value: 'eggs' },
        });
        expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    test('clear (X) button resets the search', () =>
    {
        renderPantry();
        const input = screen.getByPlaceholderText(/search ingredients/i);
        fireEvent.change(input, { target: { value: 'eggs' } });
        fireEvent.click(screen.getByLabelText('Clear search'));
        expect(input.value).toBe('');
        expect(screen.getByText('Eggs')).toBeInTheDocument();
    });

    test('shows result count while a query is active', () =>
    {
        renderPantry();
        fireEvent.change(screen.getByPlaceholderText(/search ingredients/i), {
            target: { value: 'e' },
        });
        // "Eggs" and "Butter" both contain "e", count should show "2 of 3"
        expect(screen.getByText(/2 of 3/i)).toBeInTheDocument();
    });

    test('does not show result count when search is empty', () =>
    {
        renderPantry();
        expect(screen.queryByText(/of 3/i)).not.toBeInTheDocument();
    });

    test('does not show the "empty pantry" message during a no-results search', () =>
    {
        renderPantry();
        fireEvent.change(screen.getByPlaceholderText(/search ingredients/i), {
            target: { value: 'zzznomatch' },
        });
        expect(screen.queryByText(/your pantry is empty/i)).not.toBeInTheDocument();
    });
});


// 7. Tag filter framework

describe('tag filter framework', () =>
{
    test('renders the tag filter row', () =>
    {
        renderPantry();
        expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    test('renders placeholder tag pills when no tags exist', () =>
    {
        renderPantry();
        // At least one placeholder like "Dairy" should be visible
        expect(screen.getByText('Dairy')).toBeInTheDocument();
    });

    test('placeholder pills are not interactive (no click response)', () =>
    {
        renderPantry();
        // Clicking a placeholder pill should not trigger any filter change
        // (they are <span> not <button>, and CSS has pointer-events: none)
        const dairyPill = screen.getByText('Dairy');
        expect(dairyPill.tagName.toLowerCase()).toBe('span');
    });
});