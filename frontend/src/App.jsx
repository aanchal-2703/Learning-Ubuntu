import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, eventCategory, eventDate, eventLocation, eventTitle } from './api.js';

const icon = name => <span className="material-symbols-outlined" aria-hidden="true">{name}</span>;
const categories = ['All events', 'Tech & Hackathon', 'Nightlife & Concert', 'Arts & Culture', 'Career & Alumni', 'Wellness'];
const coverImages = [
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85',
];
const normalize = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const saved = (key, fallback = '') => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };

function EventCard({ event, index, isRegistered, canRegister, userChosen, onRegister, registering }) {
  const capacity = Number(event.capacity) || 0;
  const going = Number(event.registered_count) || 0;
  const remaining = Math.max(0, capacity - going);
  const closed = event.status && !['open', 'published/open'].includes(String(event.status).toLowerCase());
  const image = event.image || event.image_url || event.banner_url || coverImages[index % coverImages.length];
  return <article className="event-card">
    <div className="event-image" style={{ backgroundImage: `url("${image}")` }}>
      <span className="tag">{eventCategory(event)}</span>
      {remaining > 0 && remaining <= 15 && <span className="urgency-tag">Almost full</span>}
    </div>
    <div className="event-body">
      <div className="event-meta">{eventDate(event)}</div>
      <h3>{eventTitle(event)}</h3>
      <p>{event.description || 'Good people, big ideas, and a reason to get out on campus.'}</p>
      <div className="event-details">
        <span>{icon('location_on')}{eventLocation(event)}</span>
        <span>{icon('groups')}{capacity ? `${going} going` : 'Open to campus'}</span>
      </div>
      {capacity > 0 && <div className="capacity">
        <div className="capacity-top"><span>{going} going</span><span>{remaining} spots left</span></div>
        <div className="bar"><i style={{ width: `${Math.min(100, Math.round(going / capacity * 100))}%` }} /></div>
      </div>}
      <div className="card-actions">
        <span className="attending">{isRegistered ? 'You’re on the list' : closed ? 'Registration closed' : 'Save your spot'}</span>
        {canRegister && <button className={isRegistered ? 'registered' : ''} disabled={isRegistered || closed || !userChosen || registering} onClick={() => onRegister(event)}>
          {isRegistered ? 'Registered' : registering ? 'Saving…' : !userChosen ? 'Choose an ID' : closed ? 'Closed' : 'Get a pass'}
        </button>}
      </div>
    </div>
  </article>;
}

function App() {
  const [role, setRole] = useState(() => saved('pulse-role', 'student'));
  const [userId, setUserId] = useState(() => saved('pulse-user-id'));
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [view, setView] = useState('feed');
  const [category, setCategory] = useState('All events');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [eventsError, setEventsError] = useState('');
  const [toast, setToast] = useState('');
  const [registeringId, setRegisteringId] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const registeredIds = useMemo(() => new Set(registrations.map(item => String(item.event_id))), [registrations]);
  const selectedUser = users.find(user => String(user.id) === String(userId));
  const canRegister = role === 'student' || role === 'organizer';

  const refresh = useCallback(async () => {
    setLoading(true);
    const [eventsResult, usersResult] = await Promise.allSettled([api.events(), api.users()]);
    if (eventsResult.status === 'fulfilled' && Array.isArray(eventsResult.value)) {
      setEvents(eventsResult.value);
      setEventsError('');
    } else {
      setEvents([]);
      setEventsError(eventsResult.reason?.message || 'Unable to load campus events.');
    }
    if (usersResult.status === 'fulfilled' && Array.isArray(usersResult.value)) {
      const rows = usersResult.value;
      setUsers(rows);
      setUsersError('');
      const savedIdExists = rows.some(user => String(user.id) === String(userId));
      const nextId = savedIdExists ? userId : (rows[0]?.id ? String(rows[0].id) : '');
      if (nextId !== userId) setUserId(nextId);
    } else {
      setUsers([]);
      setUserId('');
      setUsersError(usersResult.reason?.message || 'Unable to load campus IDs.');
    }
    setLoading(false);
  }, [userId, refreshToken]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { try { localStorage.setItem('pulse-role', role); } catch { /* Storage may be unavailable in private browsing. */ } }, [role]);
  useEffect(() => {
    if (!userId) { setRegistrations([]); return; }
    try { localStorage.setItem('pulse-user-id', userId); } catch { /* Storage is optional. */ }
    let active = true;
    api.registrations(userId).then(rows => {
      if (active) setRegistrations(Array.isArray(rows) ? rows : []);
    }).catch(() => {
      if (active) setRegistrations([]);
    });
    return () => { active = false; };
  }, [userId]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function changeRole(nextRole) {
    setRole(nextRole);
    if (nextRole === 'admin') setView('reports');
    else if (view === 'reports' || view === 'create') setView('feed');
  }

  function navigate(nextView) {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function register(event) {
    if (!userId) { setToast('Choose a campus ID from the top right to register.'); return; }
    setRegisteringId(String(event.id));
    try {
      await api.register(userId, event.id);
      const fresh = await api.registrations(userId);
      setRegistrations(Array.isArray(fresh) ? fresh : [...registrations, { event_id: event.id, events: event }]);
      setEvents(rows => rows.map(item => String(item.id) === String(event.id)
        ? { ...item, registered_count: (Number(item.registered_count) || 0) + 1 }
        : item));
      setToast('You’re on the list. See you there!');
    } catch (error) {
      setToast(error.message);
    } finally {
      setRegisteringId('');
    }
  }

  async function publish(formEvent) {
    formEvent.preventDefault();
    if (!userId) { setToast('Choose an organizer ID from the top right first.'); return; }
    const data = new FormData(formEvent.currentTarget);
    setPublishing(true);
    try {
      const created = await api.createEvent({
        title: String(data.get('title') || '').trim(),
        capacity: Number(data.get('capacity')),
        organizer_id: userId,
      });
      setEvents(rows => [created, ...rows]);
      setToast('Your event is live on campus.');
      navigate('feed');
    } catch (error) {
      setToast(error.message);
    } finally {
      setPublishing(false);
    }
  }

  const normalizedQuery = normalize(query);
  const filteredEvents = events.filter(event => {
    const categoryMatch = category === 'All events' || normalize(eventCategory(event)).includes(normalize(category)) || normalize(category).includes(normalize(eventCategory(event)));
    const queryMatch = !normalizedQuery || normalize(`${eventTitle(event)} ${eventCategory(event)} ${eventLocation(event)} ${event.description || ''}`).includes(normalizedQuery);
    return categoryMatch && queryMatch;
  });
  const myEvents = registrations.map(row => row.events).filter(Boolean);

  function renderEvents(list) {
    if (loading) return <div className="empty loading-state"><span className="loader" /><h3>Finding your next thing…</h3><p>Connecting to the campus feed.</p></div>;
    if (!list.length) return <div className="empty"><span className="material-symbols-outlined">event_busy</span><h3>{eventsError ? 'The feed could not load' : 'Nothing on the calendar yet'}</h3><p>{eventsError || 'Check back soon, or be the first to bring something to campus.'}</p>{eventsError && <button className="primary-btn" onClick={() => setRefreshToken(value => value + 1)}>Try again</button>}</div>;
    return <div className="event-grid">{list.map((event, index) => <EventCard
      key={event.id} event={event} index={index} canRegister={canRegister} userChosen={Boolean(userId)}
      isRegistered={registeredIds.has(String(event.id))} onRegister={register} registering={registeringId === String(event.id)}
    />)}</div>;
  }

  const navItems = [
    { id: 'feed', title: 'Explore', symbol: 'explore', visible: true },
    { id: 'registered', title: 'My events', symbol: 'confirmation_number', visible: role !== 'admin' },
    { id: 'create', title: 'Create', symbol: 'add_circle', visible: role === 'organizer' },
    { id: 'reports', title: 'Reports', symbol: 'query_stats', visible: role === 'admin' },
  ];
  const activeView = role === 'admin' && view === 'registered' ? 'reports' : role !== 'organizer' && view === 'create' ? 'feed' : role !== 'admin' && view === 'reports' ? 'feed' : view;

  return <>
    <header className="topbar">
      <a className="brand" href="#feed" aria-label="Pulse home" onClick={event => { event.preventDefault(); navigate('feed'); }}>
        <span className="brand-mark">{icon('bolt')}</span><span><b>Pulse</b><small>CAMPUS LIVE</small></span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.filter(item => item.visible).map(item => <button key={item.id} className={`nav-link ${activeView === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)}>{icon(item.symbol)}{item.title}</button>)}
      </nav>
      <div className="profile-tools">
        <label className="role-select"><span className="material-symbols-outlined" aria-hidden="true">shield_person</span><select aria-label="Switch role" value={role} onChange={event => changeRole(event.target.value)}><option value="student">Student</option><option value="organizer">Organizer</option><option value="admin">Admin</option></select></label>
        <label className="user-select"><span className="material-symbols-outlined" aria-hidden="true">fingerprint</span><select aria-label="Choose database ID" value={userId} onChange={event => setUserId(event.target.value)}><option value="">{usersError ? 'IDs unavailable' : loading ? 'Loading IDs…' : 'Choose an ID'}</option>{users.map(user => <option key={user.id} value={user.id}>{user.id}{user.role ? ` · ${user.role}` : ''}</option>)}</select></label>
        <div className="avatar" aria-hidden="true">{selectedUser?.role?.slice(0, 1)?.toUpperCase() || 'P'}</div>
      </div>
    </header>

    <main className="page-shell" aria-live="polite">
      {(eventsError || usersError) && <div className="connection-banner" role="status"><span>{icon('wifi_off')}</span><div><strong>Backend connection needs attention</strong><p>{[eventsError, usersError].filter(Boolean).join(' ')}</p><small>API: {api.baseUrl}</small></div><button onClick={() => setRefreshToken(value => value + 1)}>Retry</button></div>}

      {activeView === 'feed' && <>
        <section className="hero"><div className="hero-copy"><div className="eyebrow">Your campus, in motion</div><h1>Find your <span className="gradient-text">next thing.</span></h1><p>Good people, big ideas, and nights you’ll talk about later. It’s all happening right here.</p><label className="search-wrap">{icon('search')}<input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder="Search events, people, places…" /><button type="button" onClick={() => document.querySelector('.event-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Explore</button></label></div><div className="hero-art"><div className="art-content"><span className="live-pill"><i className="live-dot" /> Campus is calling</span><strong>Make room for something new.</strong><p>Your people are already here.</p></div></div></section>
        <div className="filters" aria-label="Filter events by category">{categories.map(item => <button key={item} className={`filter ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="section-heading"><div><h2>Coming up around campus</h2><p>{loading ? 'Finding events…' : `${filteredEvents.length} events to put on your radar`}</p></div><button className="text-link" onClick={() => navigate(role === 'admin' ? 'reports' : 'registered')}>{role === 'admin' ? 'Campus reports →' : 'Your event passes →'}</button></div>
        {eventsError ? renderEvents([]) : renderEvents(filteredEvents)}
      </>}

      {activeView === 'registered' && <>
        <div className="eyebrow">Your campus calendar</div><h1 className="page-title">My event passes</h1><p className="subtext">All the good stuff you’ve signed up for, in one place.</p>
        {!userId ? <div className="empty"><span className="material-symbols-outlined">fingerprint</span><h3>Choose your campus ID</h3><p>Select an ID in the top right to see your registrations.</p></div> : eventsError ? renderEvents([]) : myEvents.length ? renderEvents(myEvents) : <div className="empty"><span className="material-symbols-outlined">confirmation_number</span><h3>No passes yet</h3><p>Find something you’re excited about and save your spot.</p><button className="primary-btn" onClick={() => navigate('feed')}>Explore events</button></div>}
      </>}

      {activeView === 'create' && <>
        <div className="eyebrow">Organizer studio</div><h1 className="page-title">Bring your event to life.</h1><p className="subtext">Share the details and get your campus talking.</p>
        <div className="two-col"><form className="panel" onSubmit={publish}><h2>Event details</h2><div className="field-grid"><div className="field full"><label htmlFor="title">Event title *</label><input id="title" name="title" maxLength="80" required placeholder="e.g. Neon Quad Fest" /></div><div className="field full"><label htmlFor="capacity">Capacity</label><input id="capacity" name="capacity" type="number" min="1" step="1" required defaultValue="100" /></div></div><div className="form-bottom"><span className="checkbox">{userId ? `Publishing as ${userId}` : 'Choose an organizer ID above first.'}</span><button className="primary-btn" type="submit" disabled={publishing || !userId}>{publishing ? 'Publishing…' : <>Publish event {icon('arrow_forward')}</>}</button></div></form><aside className="panel"><h2>Make it easy to say yes</h2><p className="muted">A clear title and a realistic capacity help students decide quickly and keep your event welcoming.</p><div className="report-list"><div className="report-row"><div>{icon('campaign')}<strong>Reach your campus</strong><small>Events appear in Explore</small></div><b>01</b></div><div className="report-row"><div>{icon('groups')}<strong>Build your crowd</strong><small>Watch registrations grow</small></div><b>02</b></div></div><p className="form-hint">Your current events table stores the title, capacity, organizer ID, and registration status.</p></aside></div>
      </>}

      {activeView === 'reports' && <>
        <div className="eyebrow">Campus pulse</div><h1 className="page-title">The campus at a glance.</h1><p className="subtext">A live snapshot of the events bringing people together.</p>
        {eventsError ? renderEvents([]) : <>
          <div className="stats-grid"><div className="stat-card"><span>Events listed</span><strong>{events.length}</strong><small>Across campus</small></div><div className="stat-card"><span>People registered</span><strong>{events.reduce((sum, event) => sum + (Number(event.registered_count) || 0), 0).toLocaleString()}</strong><small>And counting</small></div><div className="stat-card"><span>Available spots</span><strong>{events.reduce((sum, event) => sum + Math.max(0, (Number(event.capacity) || 0) - (Number(event.registered_count) || 0)), 0).toLocaleString()}</strong><small>Across all events</small></div><div className="stat-card"><span>Categories</span><strong>{new Set(events.map(eventCategory)).size}</strong><small>Something for everyone</small></div></div>
          <div className="two-col"><section className="panel"><h2>Events by category</h2><div className="report-list">{Object.entries(events.reduce((result, event) => { const label = eventCategory(event); result[label] = (result[label] || 0) + 1; return result; }, {})).map(([label, count]) => <div className="report-row" key={label}><div><strong>{label}</strong><small>{count} {count === 1 ? 'event' : 'events'}</small></div><b>{events.length ? Math.round(count / events.length * 100) : 0}%</b></div>)}</div></section><section className="panel"><h2>Most popular</h2><div className="report-list">{[...events].sort((a, b) => (Number(b.registered_count) || 0) - (Number(a.registered_count) || 0)).slice(0, 5).map(event => <div className="report-row" key={event.id}><div><strong>{eventTitle(event)}</strong><small>{eventLocation(event)}</small></div><b>{Number(event.registered_count) || 0} going</b></div>)}</div></section></div>
        </>}
      </>}
    </main>

    <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.filter(item => item.visible).map(item => <button key={item.id} className={activeView === item.id ? 'active' : ''} onClick={() => navigate(item.id)}>{icon(item.symbol)}<small>{item.title}</small></button>)}</nav>
    <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
  </>;
}

export default App;
