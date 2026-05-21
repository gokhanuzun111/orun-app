import { apiFetch } from "./api";

export interface EventRsvp {
  eventId: string;
  rsvpedAt: string;
}

export interface EventsRsvpsResponse {
  rsvps: EventRsvp[];
}

export async function getMyRsvps(): Promise<EventsRsvpsResponse> {
  return apiFetch<EventsRsvpsResponse>("/events/me/rsvps");
}

export async function rsvpEvent(
  eventId: string,
): Promise<{ rsvped: boolean; rsvpedAt: string }> {
  return apiFetch(`/events/${encodeURIComponent(eventId)}/rsvp`, { method: "POST" });
}

export async function unrsvpEvent(eventId: string): Promise<void> {
  await apiFetch(`/events/${encodeURIComponent(eventId)}/rsvp`, { method: "DELETE" });
}
