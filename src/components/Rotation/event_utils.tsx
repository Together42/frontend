let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  { title: 'hi', start: '2023-01-28' },
  { title: 'hi', start: '2023-01-28' },
];

export function createEventId() {
  return String(eventGuid++);
}
