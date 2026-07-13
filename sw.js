// Service Worker - PAM Mobil
// Google-APIs werden NIEMALS gecacht.

const CACHE_NAME = 'pam-mobil-v91'; // v91: 🏠 Dachplan – Standort genauer: statt erstem (oft groben) Fix wird per watchPosition einige Sekunden der BESTE GPS-Wert genommen (rastet bei ≤8 m ein, max 20 s), Live-Anzeige „±X m" + Genauigkeits-Kreis in Karte UND Bild-Modus · v90: 🏠 Dachplan – 🗑 Zurücksetzen-Knopf (kompletter Reset: Pins + Basisbild + Kalibrierung, mit Sicherheitsabfrage) · v89: 🏠 Dachplan – Kartenausschnitt wird beim Verschieben/Zoomen laufend gemerkt und beim erneuten Öffnen wiederhergestellt (Karte + Bild getrennt) · v88: 🏠 Dachplan – Bild-Modus: Umschalter Karte↔eigenes Bild (🗺️/🖼️), eigenes Orthofoto laden (📷 Bild, Drive+lokal), Pins/Fotos aufs Bild, 2-Punkt-Kalibrierung (🎯 Kal.: zwei Ecken antippen + Koordinaten aus Google Maps oder GPS) → Live-Standort + Navigation auch im Bild · v87: 🏠 Dachplan – sichtbare Meldungen im Vollbild (Toasts lagen hinter dem Overlay → Standort/Fehler wirkten „tot"), Hinweis beim Tippen ohne aktiven Pin-Modus · v86: 🏠 Dachplan-Karte Feinschliff – Adresssuche (Photon), Standort-Button robuster (getCurrentPosition + Rückmeldung), Pin-Setzen standardmäßig AUS (kein versehentliches Anlegen; „➕ Pin" aktiviert), Pin-Liste „☰" (Antippen springt zum Pin), Foto-Buttons Kamera + Galerie · v85: 🏠 DACHPLAN – neue isolierte Vollbild-Seite pro Auftrag (Button „🏠 Dachplan" im Task): Basisbild/Orthofoto laden, Zoom/Pan, nummerierte Pins setzen/verschieben, Status (Schaden/Prüfen/OK) + Filter „Nur Schaden", Notiz, Fotos (Kamera) mit Vollbild-Ansicht, Geo automatisch aus Foto-EXIF oder per Standort + Navigation. Speicherung in task.dachplan (workboard.json); Bilder lokal in vorhandener Foto-IndexedDB · v84: 🔐 FIX „ständige Neuanmeldung" auf iOS – nach kurzem Hintergrund/Bildschirm-aus wird der Token jetzt STILL erneuert: neuer Mutex-geschützter Reconnect (_ensureTokenSilent) restauriert Token aus localStorage → Cloud-Refresh (mit 1 Retry) → GSI-Silent; Visibility-Handler nutzt Cloud-Refresh statt des auf iOS scheiternden GSI-Silent und greift auch bei fehlendem Token; Login-Screen erst nach voll ausgeschöpftem stillen Pfad · v83: 🔗 Link-Button jetzt zusätzlich ganz oben im Task (immer sichtbar, außerhalb der zuklappbaren Sektionen) · v82: 🔗 Link-Öffnen-Buttons in der Objektadresse-Sektion (öffnet hinterlegte Task-Links, z.B. Übersichtskarte) · v81: Deep-Link aus Outlook übersteht jetzt den Google-Login-Redirect (accounts.google.com) – Task-ID wird in localStorage gesichert (10-min-Fenster) und nach dem Daten-Load geöffnet; vorher ging die ID beim Redirect verloren → Mobil öffnete ohne Task. Rücksprung zusätzlich direkt nach Daten-Load, Poll-Fenster ~5 min, kein Doppel-Poll, klarere Timeout-Meldung · v80: Deep-Link aus Outlook – ?task=<ID> öffnet nach dem Laden direkt den Task (openDetail); Hinweis, falls das Board mobil nicht freigegeben ist · v79: Vergessene-Stoppuhr-Paket – globale Timer-Leiste unten (jede Ansicht, Antippen öffnet Task, ⏹ stoppt) · Erinnerungs-Overlay alle 30 Min bei laufendem Timer (Weiter/Stoppen) · Nachfrage beim App-Start bei Timer >2 Std. (Weiter/Stoppen/Endzeit korrigieren) · FIX blinkende Karten-Vorschauen (Tick-Loop rief renderList jede Sekunde, wenn Timer-Task nicht in aktueller Ansicht) · Adress-Popup: ✏️ an allen Adressfeldern öffnet großes mehrzeiliges Bearbeitungsfeld · v78: Schnellnotiz-Paket – Galerie-Mehrfachauswahl im Schnell-Tab (multiple fehlte) · Titel auf Mobil umbenennbar (✏️ im Detail-Header) · GPS: auf genauen Fix warten (≤30 m, max. 12 s, watchPosition) statt erstem groben WLAN/Funkzellen-Fix · Geocoder: Nominatim-Fallback auch bei Teilergebnis (nur Ort), Teilergebnisse nicht mehr gecacht, ±Genauigkeit in Anzeige · Schnell-Tab: 📍-Button + anpassbares Adressfeld ergänzt · Fotos: clientseitige Kompression (max. 2560 px, JPEG 85 %, erst nach EXIF/GPS-Auswertung), sofortige Vorschau per ObjectURL, sequenzieller Upload mit Fortschritt „Foto x/y" · v77: startDiktatNotiz definiert (Diktat-Button im Notizprotokoll war funktionslos) · doppelte _fileToDataUrl-Definition entfernt · v76: QUICK_PARENT_KEY bei Logout löschen · Checkliste-Merge ohne done-Status (kein Duplikat) · doppelte Ordner-ID-Validierung vermieden · v75: Schnellnotiz-Ordner robust auflösen (feste ID validieren → per Name suchen → anlegen; überlebt Konto-/Ordnerwechsel) + klarere Fehlermeldung (offline vs. Zugriff) · Foto-Merge: kein reines name-Matching mehr (name nur mit size) → verhindert stilles Verschmelzen verschiedener Fotos · v74: Sync-Race behoben – gerade angelegte Foto-Schnellnotiz wird im Konflikt-Merge geschützt (Fotos gingen verloren, wenn der Desktop während des Uploads auf Drive schrieb) · v73: Nachträglicher Foto-Upload erkennt das konfigurierte Schnell-Board auch ohne Board-Typ 'notiz' → landet jetzt zuverlässig in „Schnellnotizen" statt im Standard-Fotoordner · v72: Foto-Schnellnotizen-Unterordner immer im Projektordner „Schnellnotizen" · v71: Erfassungszeitpunkt (standortErfasst) wird beim 📍-Standort/Foto-GPS gespeichert → auf Desktop in der Objekt-Sektion sichtbar · v70: FIX Adresse wurde nie gefunden (CSP connect-src erlaubte photon/nominatim nicht) + FIX Karten-Thumbnails blinkten (Timer-Badge ohne Klasse → renderList jede Sekunde) · v69: Adresse aus EINER Quelle, 📍 nur nach Rückfrage, maximumAge 0, Geocoder 8s-Timeout · v68: Foto-„springt zurück/blinkt" behoben

const PRECACHE = [
  './',
  './index.html',
  './artikel.json',
  'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css',
  'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js',
  'https://cdn.jsdelivr.net/npm/piexifjs@1.0.6/piexif.js',
  'https://cdn.jsdelivr.net/npm/jspdf-autotable@5.0.7/dist/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css',
  'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js',
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
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  if (url.startsWith('blob:') || url.startsWith('data:')) return;

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
        if (e.request.method === 'GET' && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => new Response('', {status: 503, statusText: 'Offline'}));
    })
  );
});
