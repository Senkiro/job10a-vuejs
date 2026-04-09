export function convertToReiwa(yyyymmdd: string): string {
  if (!yyyymmdd || yyyymmdd.trim().length !== 8) {
    return "";
  }

  const year = Number(yyyymmdd.slice(0, 4));
  const month = Number(yyyymmdd.slice(4, 6));
  const day = Number(yyyymmdd.slice(6, 8));

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return "";
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "";
  }

  const reiwaStart = new Date(2019, 4, 1);
  if (date < reiwaStart) {
    return "";
  }

  const reiwaYear = year - 2018;
  return `令和${reiwaYear}年${month}月${day}日`;
}

export function convertToReiwaFromNumber(yyyymmdd: number): string {
  const value = String(yyyymmdd);

  if (value.length !== 8) {
    return "";
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return "";
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "";
  }

  const reiwaStart = new Date(2019, 4, 1);
  if (date < reiwaStart) {
    return "";
  }

  const reiwaYear = year - 2018;
  return `令和${reiwaYear}年${month}月${day}日`;
}
