export function doRangesOverlap(a_start: Date, a_end: Date, b_start: Date, b_end: Date) {
    return (
        (a_start >= b_start && a_start <= b_end) ||
        (b_start >= a_start && b_start <= a_end)
    );
}