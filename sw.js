// Service Worker - PAM Mobil
// Google-APIs werden NIEMALS gecacht.

const CACHE_NAME = 'pam-mobil-v260';
// Aenderungsnotizen stehen bewusst NICHT hier, sondern lokal in CHANGES.md -
// diese Datei wird oeffentlich ausgeliefert (v183, Datenschutz; wie b646 am Desktop).

// ── v167: Vorschaubild-Speicher ──────────────────────────────────────────────
// Der Kern: Wir dürfen den INHALT eines fremden Bildes nicht lesen – aber wir dürfen
// die Antwort unveraendert AUFHEBEN und spaeter wieder anzeigen. Zwei verschiedene
// Erlaubnisse. Genau das macht diese Datei seit v137 schon mit den CDN-Bibliotheken
// (siehe unten "opaque"): sie werden gespeichert, ohne je gelesen zu werden.
// Fuer die Google-Vorschaubilder war das bisher ausdruecklich ABGESCHALTET –
// lh3.googleusercontent.com steht in der Ausnahmeliste weiter unten.
//
// Warum ein eigener Cache und eine eigene Adresse:
// Die Vorschau-Adresse von Google traegt ein Ticket und laeuft nach Stunden ab. Wuerde
// man die Antwort unter DIESER Adresse ablegen, sucht die App beim naechsten Start unter
// einer neuen Adresse und findet nichts. Deshalb fragt die App unter einer eigenen,
// gleichbleibenden Adresse an:   ./pam-thumb/<driveId>?u=<aktuelle Google-Adresse>
// Gespeichert wird OHNE die Abfrage, der Schluessel ist also nur ./pam-thumb/<driveId>
// und ueberlebt jeden Adresswechsel. Das `u=` wird nur gebraucht, wenn noch nichts da ist.
const THUMB_CACHE = 'pam-vorschau-v1';
const THUMB_MAX = 300;   // bewusst vorsichtig: "verschlossene" Antworten werden beim
                         // Speicherplatz mit einem Aufschlag angerechnet (s. CHANGES v167)

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './artikel.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(
        PRECACHE.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Precache fehlgeschlagen:', url, err))
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      // v167: der Vorschau-Speicher MUSS hier ausgenommen werden. Sonst wirft jede neue
      // Version saemtliche gesammelten Vorschaubilder weg und alles laedt wieder neu –
      // also genau der Zustand, den v155 bis v162 beseitigt haben.
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== THUMB_CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// v167: Vorschaubild aus dem eigenen Speicher bedienen, sonst EINMAL von Google holen
// und aufheben. Es wird nie gelesen, nur weitergereicht – deshalb reicht "no-cors".
async function _pamThumbAntwort(request) {
  try {
    const u = new URL(request.url);
    const schluessel = new Request(u.origin + u.pathname);   // ohne Abfrage = stabil
    const cache = await caches.open(THUMB_CACHE);
    const treffer = await cache.match(schluessel);
    if (treffer) return treffer;                              // auch ohne Netz
    const ziel = u.searchParams.get('u');
    // Nichts gespeichert und keine Adresse mitgegeben: klar absagen, damit die App zur
    // naechsten Quelle weitergeht (das <img> loest onerror aus).
    if (!ziel) return new Response('', { status: 504, statusText: 'Kein Vorschaubild gespeichert' });
    const resp = await fetch(ziel, { mode: 'no-cors' });
    if (resp && (resp.status === 200 || resp.type === 'opaque')) {
      try {
        await _pamThumbAufraeumen(cache);
        await cache.put(schluessel, resp.clone());
      } catch (err) { console.warn('[SW] Vorschau ablegen:', err); }
    }
    return resp;
  } catch (e) {
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}
// Aeltestes zuerst wegwerfen. Der Cache liefert die Schluessel in der Reihenfolge, in
// der sie abgelegt wurden – das reicht hier voellig aus.
async function _pamThumbAufraeumen(cache) {
  const keys = await cache.keys();
  if (keys.length < THUMB_MAX) return 0;
  const weg = keys.length - Math.floor(THUMB_MAX * 0.8);
  for (let i = 0; i < weg; i++) await cache.delete(keys[i]);
  console.info('[SW] Vorschau-Speicher: ' + weg + ' alte Bilder verworfen (' + keys.length + ' → ' + (keys.length - weg) + ').');
  return weg;
}

self.addEventListener('fetch', e => {
  const url = e.request.url;

  if (url.startsWith('blob:') || url.startsWith('data:')) return;

  // v167: eigene Vorschau-Adresse – MUSS vor der Ausnahmeliste stehen
  if (url.indexOf('/pam-thumb/') >= 0) { e.respondWith(_pamThumbAntwort(e.request)); return; }

  if (
    url.includes('googleapis.com') ||
    url.includes('accounts.google.com') ||
    url.includes('drive.google.com') ||
    url.includes('oauth2.google') ||
    url.includes('lh3.googleusercontent.com') ||
    url.includes('api.open-meteo.com') ||
    url.includes('nominatim.openstreetmap.org') ||
    url.includes('photon.komoot.io')
  ) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        // v137: Bibliotheken vom CDN (Leaflet, jsPDF, …) laden als <script>/<link> ohne
        // CORS → resp.status ist 0 ("opaque"), nie 200 → sie wurden im laufenden Betrieb
        // NIE nachgespeichert. Scheiterte ihr Vorladen bei der SW-Installation einmal
        // (Netz-Wackler), blieb die Lücke für immer und z.B. der Dachplan fiel bei jedem
        // Start-Schluckauf aus ("Karte braucht einmal Internet"). Jetzt: opaque-Antworten
        // der bekannten CDN-Hosts werden mitgespeichert – die Lücke heilt sich beim
        // nächsten erfolgreichen Laden von selbst.
        // v184: die Bibliotheken stehen jetzt IN der index.html - es gibt keine
        // fremden Adressen mehr, fuer die hier eine Ausnahme noetig waere.
        const istCdn = false;
        if (e.request.method === 'GET' && (resp.status === 200 || (resp.type === 'opaque' && istCdn))) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => new Response('', {status: 503, statusText: 'Offline'}));
    })
  );
});
