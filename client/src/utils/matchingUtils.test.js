import { namesLooselyMatch } from "./matchingUtils";

// Returns true, smart matching brain
test('matches when one token overlaps', () => {
    expect(namesLooselyMatch('2% Milk', 'Milk')).toBe(true);
});

// Returns false, does not match at all
test('does not match unrelated names', () => {
    expect(namesLooselyMatch('Butter', 'Milk')).toBe(false);
});