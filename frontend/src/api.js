const API_BASE = (import.meta.env.VITE_API_URL || 'https://backend-pied-one-94.vercel.app').replace(/\/+$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    });
  } catch {
    throw new Error(`Could not reach the Pulse backend at ${API_BASE}.`);
  }
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : null;
  if (!response.ok) {
    const details = body?.error || (response.status === 404 ? 'This API route is not deployed yet.' : `The backend returned ${response.status}.`);
    throw new Error(details);
  }
  return body;
}

export const api = {
  baseUrl: API_BASE,
  events: () => request('/api/events'),
  users: () => request('/api/users'),
  registrations: userId => request(`/api/me/registrations?user_id=${encodeURIComponent(userId)}`),
  register: (userId, eventId) => request('/api/registrations', {
    method: 'POST', body: JSON.stringify({ user_id: userId, event_id: eventId }),
  }),
  createEvent: data => request('/api/events', { method: 'POST', body: JSON.stringify(data) }),
};

export function eventTitle(event) {
  return event.title || event.name || 'Campus event';
}

export function eventCategory(event) {
  return event.category || event.type || 'Campus life';
}

export function eventLocation(event) {
  return event.location || event.venue || 'On campus';
}

export function eventDate(event) {
  const value = event.date || event.starts_at || event.event_date;
  if (!value) return 'Date to be announced';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Date to be announced' : new Intl.DateTimeFormat(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(parsed);
}
