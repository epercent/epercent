import { EVENT_TYPES, events } from '../data/events.js';
import { findRecordById, listRecords } from './storage-service.js';

export function listEvents() {
  return listRecords('events', events);
}

export function getEventById(id) {
  return findRecordById('events', id, events);
}

export function listEventTypes() {
  return listRecords(
    'event-types',
    EVENT_TYPES.map((type) => ({ id: type, type }))
  ).map((record) => record.type);
}
