import { getEventById, listEvents, listEventTypes } from '../services/event-service.js';

export function listEventRegistry(_request, response) {
  const events = listEvents();

  response.status(200).json({
    capability: 'EOS-CAP-0007',
    eventModel: 'EOS Events',
    eventTypes: listEventTypes(),
    count: events.length,
    events
  });
}

export function getEvent(request, response) {
  const event = getEventById(request.params.id);

  if (!event) {
    return response.status(404).json({
      error: 'EOS Event not found',
      id: request.params.id
    });
  }

  return response.status(200).json(event);
}
