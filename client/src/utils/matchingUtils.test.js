import { normalizeName, tokenize, namesLooselyMatch } from './matchingUtils';


// normalizeName

describe('normalizeName', () =>
{
    test('lowercases the input', () =>
    {
        expect(normalizeName('Milk')).toBe('milk');
    });

    test('trims leading and trailing whitespace', () =>
    {
        expect(normalizeName('  Eggs  ')).toBe('eggs');
    });

    test('returns empty string for null', () =>
    {
        expect(normalizeName(null)).toBe('');
    });

    test('returns empty string for undefined', () =>
    {
        expect(normalizeName(undefined)).toBe('');
    });

    test('returns empty string for empty string', () =>
    {
        expect(normalizeName('')).toBe('');
    });
});


// tokenize

describe('tokenize', () =>
{
    test('splits on spaces', () =>
    {
        expect(tokenize('Whole Milk')).toEqual(['whole', 'milk']);
    });

    test('splits on special characters', () =>
    {
        expect(tokenize('2% Milk')).toEqual(['milk']);
    });

    test('filters out empty strings from result', () =>
    {
        expect(tokenize('  Eggs  ')).toEqual(['eggs']);
    });

    test('returns empty array for empty string', () =>
    {
        expect(tokenize('')).toEqual([]);
    });

    test('handles hyphenated names', () =>
    {
        expect(tokenize('Sun-dried Tomatoes')).toEqual(['sun', 'dried', 'tomatoes']);
    });
});


// namesLooselyMatch

describe('namesLooselyMatch', () =>
{
    // Exact matches 

    test('matches identical names', () =>
    {
        expect(namesLooselyMatch('Milk', 'Milk')).toBe(true);
    });

    test('matches regardless of case', () =>
    {
        expect(namesLooselyMatch('MILK', 'milk')).toBe(true);
    });

    test('matches with different whitespace', () =>
    {
        expect(namesLooselyMatch('  Eggs  ', 'Eggs')).toBe(true);
    });

    // Token overlap matches

    test('matches when pantry name contains the recipe ingredient word', () =>
    {
        expect(namesLooselyMatch('2% Milk', 'Milk')).toBe(true);
    });

    test('matches when recipe name contains the pantry item word', () =>
    {
        expect(namesLooselyMatch('Milk', '2% Milk')).toBe(true);
    });

    test('matches Yukon Gold Potato against Potato', () =>
    {
        expect(namesLooselyMatch('Yukon Gold Potato', 'Potato')).toBe(true);
    });

    test('matches Unsalted Butter against Butter', () =>
    {
        expect(namesLooselyMatch('Unsalted Butter', 'Butter')).toBe(true);
    });

    test('matches whole milk against milk', () =>
    {
        expect(namesLooselyMatch('Whole Milk', 'Milk')).toBe(true);
    });

    // The critical non-match: salt vs unsalted

    test('does NOT match Salt against Unsalted Butter', () =>
    {
        // "salt" is a substring of "unsalted" but NOT a whole token
        // tokenize("Unsalted Butter") = ["unsalted", "butter"]
        // tokenize("Salt") = ["salt"]
        // "salt" !== "unsalted" so this correctly returns false
        expect(namesLooselyMatch('Salt', 'Unsalted Butter')).toBe(false);
    });

    test('does NOT match unrelated names', () =>
    {
        expect(namesLooselyMatch('Butter', 'Milk')).toBe(false);
    });

    test('does NOT match completely different ingredients', () =>
    {
        expect(namesLooselyMatch('Flour', 'Sugar')).toBe(false);
    });

    // Edge cases

    test('returns false when first name is empty', () =>
    {
        expect(namesLooselyMatch('', 'Milk')).toBe(false);
    });

    test('returns false when second name is empty', () =>
    {
        expect(namesLooselyMatch('Milk', '')).toBe(false);
    });

    test('returns false when both names are empty', () =>
    {
        expect(namesLooselyMatch('', '')).toBe(false);
    });

    test('returns false when first name is null', () =>
    {
        expect(namesLooselyMatch(null, 'Milk')).toBe(false);
    });

    test('returns false when second name is null', () =>
    {
        expect(namesLooselyMatch('Milk', null)).toBe(false);
    });

    // Numbers in names

    test('matches names that share a numeric token', () =>
    {
        // "2% Milk" tokenizes to ["2","milk"], "2 Litre Milk" to ["2","litre","milk"]
        // They share "2" and "milk" so should match
        expect(namesLooselyMatch('2% Milk', '2 Litre Milk')).toBe(true);
    });
});