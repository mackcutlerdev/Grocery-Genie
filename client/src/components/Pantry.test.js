// Pantry.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pantry from './Pantry';

// Shared test data

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