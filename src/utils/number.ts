export const toNumberOrNull = (
  value: string | null | undefined,
): number | null =>
  value != null && value !== "" && !Number.isNaN(+value) ? +value : null;


