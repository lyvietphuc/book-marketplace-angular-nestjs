// src/common/dates.ts
/** Datum als YYYY-MM-DD in deutscher Zeitzone (für Statistiken pro Tag) */
export function dayKey(date: Date): string {
  return date.toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' });
}

/** Liste der letzten `days` Tage als YYYY-MM-DD (älteste zuerst) */
export function lastDays(days: number, now = new Date()): string[] {
  const result: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    result.push(dayKey(new Date(now.getTime() - i * 86400000)));
  }
  return result;
}
