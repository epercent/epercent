import { EVENT_TYPES, events } from '../data/events.js';

const eventRegistry = new Map(events.map((event) => [event.id, event]));

export function listEvents() {
  return Array.from(eventRegistry.values());
}

export function getEventById(id) {
  return eventRegistry.get(id) ?? null;
}

export function listEventTypes() {
  return Array.from(EVENT_TYPES);
}
