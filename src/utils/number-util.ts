export function roundPrice(value: number): number {
    return Math.round(value * 100) / 100;
}