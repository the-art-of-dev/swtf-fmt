export const isNumeric = (x: string): boolean => {
    return /^-?\d+$/.test(x);
};