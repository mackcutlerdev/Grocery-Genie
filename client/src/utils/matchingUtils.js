export const normalizeName = (name) => (!name ? '' : name.trim().toLowerCase());

export const tokenize = (name) => normalizeName(name).split(/[^a-z]+/).filter(Boolean);

export const namesLooselyMatch = (a, b) => {
    const tokA = tokenize(a), tokB = tokenize(b);
    if (!tokA.length || !tokB.length) return false;
    if (tokA.join(' ') === tokB.join(' ')) return true;
    const setB = new Set(tokB);
    return tokA.some((t) => setB.has(t));
};