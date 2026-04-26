import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import WhatCanIMake from './WhatCanIMake';

// ─── Shared test data ────────────────────────────────────────────────────────

const mockPantryItems = [
    { id: 'p1', name: 'Eggs',   quantity: 6,  unit: 'Unit' },
    { id: 'p2', name: 'Butter', quantity: 2,  unit: 'tbsp' },
    { id: 'p3', name: 'Milk',   quantity: 1,  unit: 'cup'  },
];

const mockRecipes = [
    {
        id: 'r1',
        name: 'Omelette',
        prep: '10 min',
        ingredients: [
            { name: 'Eggs',   quantity: 2, unit: 'Unit' },
            { name: 'Butter', quantity: 1, unit: 'tbsp' },
        ],
    },
    {
        id: 'r2',
        name: 'Pancakes',
        prep: '20 min',
        ingredients: [
            { name: 'Flour', quantity: 2, unit: 'cup' }, // not in pantry
            { name: 'Eggs',  quantity: 1, unit: 'Unit' },
        ],
    },
];

const defaultProps = {
    pantryItems:  mockPantryItems,
    recipes:      mockRecipes,
    isLoading:    false,
    onReload:     jest.fn(),
    onOpenRecipe: jest.fn(),
};

const renderWCIM = (overrides = {}) =>
    render(<WhatCanIMake {...defaultProps} {...overrides} />);

beforeEach(() => jest.clearAllMocks());


// ─── 1. Basic rendering ──────────────────────────────────────────────────────

describe('basic rendering', () =>
{
    test('shows empty state when there are no recipes', () =>
    {
        renderWCIM({ recipes: [] });
        expect(screen.getByText(/add pantry items and recipes/i)).toBeInTheDocument();
    });

    test('shows loading text when isLoading is true', () =>
    {
        renderWCIM({ isLoading: true });
        expect(screen.getByText(/loading pantry and recipes/i)).toBeInTheDocument();
    });

    test('renders both sections by default', () =>
    {
        renderWCIM();
        const filterBar = document.querySelector('.gg-wcim-filter-bar');
        expect(within(filterBar).getByText(/can fully make/i)).toBeInTheDocument();
        expect(within(filterBar).getByText(/missing ingredients/i)).toBeInTheDocument();
    });
});


// ─── 2. Recipe matching ──────────────────────────────────────────────────────

describe('recipe matching', () =>
{
    test('shows makeable recipe in the ready section', () =>
    {
        renderWCIM();
        expect(screen.getByText('Omelette')).toBeInTheDocument();
    });

    test('shows recipe with missing ingredients in the missing section', () =>
    {
        renderWCIM();
        expect(screen.getByText('Pancakes')).toBeInTheDocument();
    });

    test('shows correct count badge for makeable recipes', () =>
    {
        renderWCIM();
        // Omelette is fully makeable, Pancakes is not
        const readySection = document.querySelector('#wcim-ready-section');
        expect(readySection.querySelector('.gg-badge-count').textContent).toBe('1');
    });

    test('shows correct count badge for missing recipes', () =>
    {
        renderWCIM();
        const missingSection = document.querySelector('#wcim-missing-section');
        expect(missingSection.querySelector('.gg-badge-count').textContent).toBe('1');
    });

    test('shows the missing ingredient name in the missing card', () =>
    {
        renderWCIM();
        expect(screen.getByText('Flour')).toBeInTheDocument();
    });
});


// ─── 3. Filter buttons ───────────────────────────────────────────────────────

describe('filter buttons', () =>
{
    test('clicking "Can Fully Make" hides the missing section', () =>
    {
        renderWCIM();
        fireEvent.click(screen.getByText('🟉 Can Fully Make'));
        expect(document.querySelector('#wcim-missing-section')).not.toBeInTheDocument();
    });

    test('clicking "Missing Ingredients" hides the ready section', () =>
    {
        renderWCIM();
        const filterBar = document.querySelector('.gg-wcim-filter-bar');
        fireEvent.click(within(filterBar).getByText('Missing Ingredients'));
        expect(document.querySelector('#wcim-ready-section')).not.toBeInTheDocument();
    });

    test('clicking "All Recipes" shows both sections', () =>
    {
        renderWCIM();
        // Go to a filtered view first, then back to all
        fireEvent.click(screen.getByText('🟉 Can Fully Make'));
        fireEvent.click(screen.getByText('All Recipes'));
        expect(document.querySelector('#wcim-ready-section')).toBeInTheDocument();
        expect(document.querySelector('#wcim-missing-section')).toBeInTheDocument();
    });
});


// ─── 4. Interactions ─────────────────────────────────────────────────────────

describe('interactions', () =>
{
    test('calls onReload when Reload button is clicked', () =>
    {
        renderWCIM();
        fireEvent.click(screen.getByText(/reload/i));
        expect(defaultProps.onReload).toHaveBeenCalledTimes(1);
    });

    test('calls onOpenRecipe with recipe id when a ready recipe card is clicked', () =>
    {
        renderWCIM();
        fireEvent.click(screen.getByText('Omelette'));
        expect(defaultProps.onOpenRecipe).toHaveBeenCalledWith('r1');
    });

    test('calls onOpenRecipe when Open Recipe button is clicked', () =>
    {
        renderWCIM();
        fireEvent.click(screen.getByText('Open Recipe'));
        expect(defaultProps.onOpenRecipe).toHaveBeenCalledWith('r1');
    });
});