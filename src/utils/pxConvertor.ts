export const pixelToVH = (value: number): string => {
    return `${((100 * value) / window.innerHeight).toFixed(4)}vh`;
}

export const pixelToVW = (value: number): string  => {
    return `${((100 * value) / window.innerWidth).toFixed(4)}vw`;
}

export const vwToPx = (vw: number) => {
    return (window.innerWidth * vw) / 100;
};

export const vhToPx = (vh: number) => {
    return (window.innerHeight * vh) / 100;
};