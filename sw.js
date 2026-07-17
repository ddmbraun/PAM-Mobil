// Service Worker - PAM Mobil
// Google-APIs werden NIEMALS gecacht.

const CACHE_NAME = 'pam-mobil-v106'; // v106: 🌙 DUNKELMODUS NEUTRAL-GRAU (Wunsch Frank, „zu unübersichtlich"): Blau-Schwarz-Töne raus, One-UI-Stil wie die Samsung-Apps auf dem Tab S10 FE – Hintergrund reines Schwarz (#000), Karten/Chips neutral-grau (#232326/#313138), Schrift reines Weiß + hellere Zweitschrift (#b5b5bd) für Sonnenlicht draußen, Ränder dezentes Grau (#3d3d44), Akzentblau heller (#8aa4ff), Kartenabstand 10→14 px; theme-color/manifest auf #000, Skizzen-Leiste + Text-Overlay auf #232326. Hell-Modus unverändert. · v105: 🏠 Dachplan LIVE-STANDORT wie Desktop b481: neuer Knopf „📡 Live" – Punkt wandert live mit (watchPosition), Genauigkeitskreis, ±m-Anzeige im Knopf, Blickrichtungs-Kegel (Kompass; iOS mit Erlaubnis-Abfrage); stoppt bei Bild-Modus/Schließen/GPS-Fehler. „📍➕" mittelt Messungen gewichtet (1/acc², bis 12 s, früher fertig bei ±≤5 m und ≥5 Messungen) → beim Stillstehen typisch ±2–3 m. · v104:🏠 Dachplan-Feinschliff wie Desktop b480: (1) „Karte"-Auswahl war ausgegraut sobald tiefer als Zoom 19 gezoomt (Leaflet deaktiviert Ebenen außerhalb ihrer maxZoom) → OSM-Layer maxZoom:21 + maxNativeZoom:19, Auswahl bleibt immer aktiv. (2) Bild-Modus zoomt feiner: zoomSnap 0.1, zoomDelta 0.25, wheelPxPerZoomLevel 180. · v103:🏠 Dachplan – AMTLICHE LUFTBILDER: Thüringer Orthophotos (20 cm, TLBG/GDI-Th Open Data dl-de/by-2-0) als Standard-Luftbild via WMS (geoproxy.geoportal-th.de, Layer th_dop) statt Esri – schärfer + lagerichtig, Pins exakt aufs Dach ziehbar. Außerhalb Thüringens (t.lat/lon-Check) automatisch Esri; Umschalter „amtlich (TH) / Welt (Esri) / Karte". CSP img-src um www.geoproxy.geoportal-th.de erweitert. Gleiche Änderung in PAM Desktop b479. · v102:🖥 TABLET-PAKET (Wunsch Frank, Tab S10 FE): (1) GLOBALER APP-ZOOM 80–150 % – neuer „Aa"-Knopf in der Listen-Kopfzeile blendet eine Reglerleiste ein (A−/Slider/A+), CSS-zoom auf listScreen+settingsScreen+Task-Kopfbereich (hdr/mSizeBar/detailTabBar), Wert pro Gerät in localStorage (ptpm_app_zoom); Task-Inhalte skalieren weiter über --m-scale (keine Doppel-Skalierung), Lightbox/Dachplan/Skizze bewusst unskaliert (Gesten-Koordinaten). (2) TABLET-LAYOUT ab 900px Breite: Taskliste zweispaltig (Grid), Task-Sektionen (#detailBody .sect) zweispaltig, Suche + Liste/Heute in einer Zeile (.search-toggle-row/.view-toggle, bricht auf Handy um), Board-Chips größer. (3) REGLER HINTER „Aa": die zwei Reglerzeilen im Task (Schrift+Helligkeit) sind standardmäßig ausgeblendet – „Aa" im Task-Kopf blendet EINE kompakte Zeile ein (toggleMSizeBar war vorhanden, hatte aber nie einen Knopf); Zustand gemerkt (ptpm_sizebar_open). (4) OPTIK Variante B: Taskkarten mit farbigem Seitenstreifen (blau, orange bei überfälligem Termin/Fälligkeit, .card-warn). · v101:📲 ECHTE APP-INSTALLATION auf Android (Befund Frank, Tablet): „Zum Startbildschirm" erzeugte nur eine Browser-Verknüpfung, weil ein Web-App-Manifest fehlte (nur die iOS-Meta-Tags waren da). Neu: manifest.json (display:standalone, start_url/scope ./, Farben #1a1a2e) + App-Icons icon-192.png/icon-512.png (PAM-Schriftzug, auch als maskable) + <link rel=manifest> und apple-touch-icon in index.html; Manifest+Icons im PRECACHE; deploy_git.bat lädt die neuen Dateien mit hoch. Chrome bietet damit „App installieren" an → eigenes Fenster ohne Browserleiste, Icon in der App-Übersicht. · v100:📷 Foto-Großansicht Teil 2 (Rückmeldung Frank): (1) ZOOMEN – Pinch-Zoom mit 2 Fingern (bis 6×, Bildpunkt unterm Finger-Mittelpunkt bleibt stehen), gezoomt zieht 1 Finger das Bild, DOPPELTIPP zoomt auf 2.5× an die getippte Stelle / zurück (die App hat user-scalable=no, darum ging natives Zoomen nie; eigener Gesten-Block auf #lightbox, Zustand _lz, _lzApply auf #lbImg-transform). Einzeltipp schließt weiter – minimal verzögert (340 ms), damit der Doppeltipp gewinnt; Geister-Klick-Schutz für iOS (_lbLastTouchEnd). Wischen/Blättern nur ungezoomt; beim Malen springt der Zoom zurück (sonst würden Striche versetzt gespeichert). (2) BLÄTTERPFEILE deutlich größer (62×116 px, Schrift 54 px, heller Rand) für Tablet/Handschuh. · v99:📷 Foto-Großansicht (Tablet-Paket): (1) BLÄTTERN – ‹ ›-Pfeile (nur bei >1 Foto), Wischgeste links/rechts und Pfeiltasten gehen durch alle Task-Fotos (mit Umlauf, wie Desktop #312); beim Malen und in der 360°-Ansicht ist Blättern aus. (2) S-PEN MALT SOFORT – berührt ein Stift (pointerType 'pen') das Foto, startet der Malen-Modus automatisch mit dem zuletzt gewählten Werkzeug/Farbe und der erste Strich zählt direkt (_onDrawDown-Weiterleitung mit Pointer-Capture); Finger bedient weiter normal (tippen/wischen/blättern), Knöpfe (Text/Malen/Schließen/Pfeile) bleiben vom Stift bedienbar. (3) 360°-ERKENNUNG entschärft wie Desktop b478 – nur noch .insp / „pano(rama)" als eigenes Wort / Ratio exakt ≈ 2:1 (1.95–2.05) statt ≥ 1.8; normale breite Fotos öffnen wieder flach (_lbIs360Name/_lbIs360Ratio in openLightbox). · v98:📷 Foto-Kompression behält GPS + Aufnahmedatum: seit v78 warf die Canvas-Verkleinerung ALLE EXIF-Daten weg → Fotos auf Drive ohne GPS, Desktop-ℹ fand keinen Aufnahmeort mehr. _compressFoto liest jetzt GPS-IFD, DateTimeOriginal/Digitized, DateTime, Make/Model aus dem Original und schreibt sie per piexif in die verkleinerte JPEG zurück (Orientation bewusst NICHT – Canvas-Bild ist schon aufrecht gedreht). Bei Fehlern weiter das komprimierte Foto ohne EXIF (kein Upload-Abbruch). · v97:🏠 Dachplan-Bedienung: (1) Pin-Liste war inset:0 (Vollbild) und verdeckte die Kopfleiste inkl. „← Zurück" → man musste erst schließen. Liste beginnt jetzt unter der Leiste (top:58px), Leiste position:relative;z-index:1400 (statt z-index:2) → immer oben/klickbar. (2) Feinere Zoomstufen in Karte + Bild (zoomSnap:0.25, zoomDelta:0.5, wheelPxPerZoomLevel:120). · v96: 🏠 Dachplan-Fix: „🏠 Dach"/Auto-Sprung fand Adressen mit MEHREREN Hausnummern (z. B. „…-Straße 2,4,6, 99947 Bad Langensalza") nicht. Neuer Helfer _geoQuery trennt PLZ/Ort ab und reduziert Hausnummer-Listen (2,4,6 / 2-6 / 10/12) auf die erste. · v95: 🏠 Dachplan – zwei neue Knöpfe: „🏠 Dach" zentriert die Luftbildkarte auf die Auftragsadresse (t.adresse, Photon) + Auto-Sprung beim Öffnen (wenn keine Pins & kein gespeicherter Ausschnitt & keine Task-Koordinaten); „📍➕ Pin an meinem Standort" setzt per GPS (bester Fix ≤8 m, ±-Anzeige) einen Pin an die aktuelle Position, danach auf dem Luftbild an die genaue Stelle ziehen (Pins draggable). Nur Karten-Modus. · v94: 📴 Offline-Dokumente gerätespezifisch öffnen – Android/Desktop direkt im PDF-Betrachter (window.open Blob), iPhone weiter per Download-/Vorschau-Link (window.open bleibt dort weiß) · v93: 📴 Offline-FIX Dokumente – offline öffneten Dokumente den Google-Login (weiße Seite); jetzt lokale Kopie (Offline-Blob/Base64) zuerst + Öffnen per Download-Link (iOS zeigt PDF-Vorschau), offline NIE Drive-Login; Bild-Anhänge auch aus Base64 offline; „Offline mitnehmen" lädt auch Drive-Anhänge mit Base64 · v92: 📴 Offline mitnehmen (Stufe 1: Ansehen) – Task per Knopf für unterwegs sichern: Fotos+Dokumente in lokale Ablage (IndexedDB mob-offline-v1), offline OHNE Netz/Token ansehbar; Karten-Badge „📴 Offline"; Offline-Start lädt Boards aus lokalem Backup; read-only gegenüber Drive (kein Schreiben bis frisch geladen) · v91: 🏠 Dachplan – Standort genauer: statt erstem (oft groben) Fix wird per watchPosition einige Sekunden der BESTE GPS-Wert genommen (rastet bei ≤8 m ein, max 20 s), Live-Anzeige „±X m" + Genauigkeits-Kreis in Karte UND Bild-Modus · v90: 🏠 Dachplan – 🗑 Zurücksetzen-Knopf (kompletter Reset: Pins + Basisbild + Kalibrierung, mit Sicherheitsabfrage) · v89: 🏠 Dachplan – Kartenausschnitt wird beim Verschieben/Zoomen laufend gemerkt und beim erneuten Öffnen wiederhergestellt (Karte + Bild getrennt) · v88: 🏠 Dachplan – Bild-Modus: Umschalter Karte↔eigenes Bild (🗺️/🖼️), eigenes Orthofoto laden (📷 Bild, Drive+lokal), Pins/Fotos aufs Bild, 2-Punkt-Kalibrierung (🎯 Kal.: zwei Ecken antippen + Koordinaten aus Google Maps oder GPS) → Live-Standort + Navigation auch im Bild · v87: 🏠 Dachplan – sichtbare Meldungen im Vollbild (Toasts lagen hinter dem Overlay → Standort/Fehler wirkten „tot"), Hinweis beim Tippen ohne aktiven Pin-Modus · v86: 🏠 Dachplan-Karte Feinschliff – Adresssuche (Photon), Standort-Button robuster (getCurrentPosition + Rückmeldung), Pin-Setzen standardmäßig AUS (kein versehentliches Anlegen; „➕ Pin" aktiviert), Pin-Liste „☰" (Antippen springt zum Pin), Foto-Buttons Kamera + Galerie · v85: 🏠 DACHPLAN – neue isolierte Vollbild-Seite pro Auftrag (Button „🏠 Dachplan" im Task): Basisbild/Orthofoto laden, Zoom/Pan, nummerierte Pins setzen/verschieben, Status (Schaden/Prüfen/OK) + Filter „Nur Schaden", Notiz, Fotos (Kamera) mit Vollbild-Ansicht, Geo automatisch aus Foto-EXIF oder per Standort + Navigation. Speicherung in task.dachplan (workboard.json); Bilder lokal in vorhandener Foto-IndexedDB · v84: 🔐 FIX „ständige Neuanmeldung" auf iOS – nach kurzem Hintergrund/Bildschirm-aus wird der Token jetzt STILL erneuert: neuer Mutex-geschützter Reconnect (_ensureTokenSilent) restauriert Token aus localStorage → Cloud-Refresh (mit 1 Retry) → GSI-Silent; Visibility-Handler nutzt Cloud-Refresh statt des auf iOS scheiternden GSI-Silent und greift auch bei fehlendem Token; Login-Screen erst nach voll ausgeschöpftem stillen Pfad · v83: 🔗 Link-Button jetzt zusätzlich ganz oben im Task (immer sichtbar, außerhalb der zuklappbaren Sektionen) · v82: 🔗 Link-Öffnen-Buttons in der Objektadresse-Sektion (öffnet hinterlegte Task-Links, z.B. Übersichtskarte) · v81: Deep-Link aus Outlook übersteht jetzt den Google-Login-Redirect (accounts.google.com) – Task-ID wird in localStorage gesichert (10-min-Fenster) und nach dem Daten-Load geöffnet; vorher ging die ID beim Redirect verloren → Mobil öffnete ohne Task. Rücksprung zusätzlich direkt nach Daten-Load, Poll-Fenster ~5 min, kein Doppel-Poll, klarere Timeout-Meldung · v80: Deep-Link aus Outlook – ?task=<ID> öffnet nach dem Laden direkt den Task (openDetail); Hinweis, falls das Board mobil nicht freigegeben ist · v79: Vergessene-Stoppuhr-Paket – globale Timer-Leiste unten (jede Ansicht, Antippen öffnet Task, ⏹ stoppt) · Erinnerungs-Overlay alle 30 Min bei laufendem Timer (Weiter/Stoppen) · Nachfrage beim App-Start bei Timer >2 Std. (Weiter/Stoppen/Endzeit korrigieren) · FIX blinkende Karten-Vorschauen (Tick-Loop rief renderList jede Sekunde, wenn Timer-Task nicht in aktueller Ansicht) · Adress-Popup: ✏️ an allen Adressfeldern öffnet großes mehrzeiliges Bearbeitungsfeld · v78: Schnellnotiz-Paket – Galerie-Mehrfachauswahl im Schnell-Tab (multiple fehlte) · Titel auf Mobil umbenennbar (✏️ im Detail-Header) · GPS: auf genauen Fix warten (≤30 m, max. 12 s, watchPosition) statt erstem groben WLAN/Funkzellen-Fix · Geocoder: Nominatim-Fallback auch bei Teilergebnis (nur Ort), Teilergebnisse nicht mehr gecacht, ±Genauigkeit in Anzeige · Schnell-Tab: 📍-Button + anpassbares Adressfeld ergänzt · Fotos: clientseitige Kompression (max. 2560 px, JPEG 85 %, erst nach EXIF/GPS-Auswertung), sofortige Vorschau per ObjectURL, sequenzieller Upload mit Fortschritt „Foto x/y" · v77: startDiktatNotiz definiert (Diktat-Button im Notizprotokoll war funktionslos) · doppelte _fileToDataUrl-Definition entfernt · v76: QUICK_PARENT_KEY bei Logout löschen · Checkliste-Merge ohne done-Status (kein Duplikat) · doppelte Ordner-ID-Validierung vermieden · v75: Schnellnotiz-Ordner robust auflösen (feste ID validieren → per Name suchen → anlegen; überlebt Konto-/Ordnerwechsel) + klarere Fehlermeldung (offline vs. Zugriff) · Foto-Merge: kein reines name-Matching mehr (name nur mit size) → verhindert stilles Verschmelzen verschiedener Fotos · v74: Sync-Race behoben – gerade angelegte Foto-Schnellnotiz wird im Konflikt-Merge geschützt (Fotos gingen verloren, wenn der Desktop während des Uploads auf Drive schrieb) · v73: Nachträglicher Foto-Upload erkennt das konfigurierte Schnell-Board auch ohne Board-Typ 'notiz' → landet jetzt zuverlässig in „Schnellnotizen" statt im Standard-Fotoordner · v72: Foto-Schnellnotizen-Unterordner immer im Projektordner „Schnellnotizen" · v71: Erfassungszeitpunkt (standortErfasst) wird beim 📍-Standort/Foto-GPS gespeichert → auf Desktop in der Objekt-Sektion sichtbar · v70: FIX Adresse wurde nie gefunden (CSP connect-src erlaubte photon/nominatim nicht) + FIX Karten-Thumbnails blinkten (Timer-Badge ohne Klasse → renderList jede Sekunde) · v69: Adresse aus EINER Quelle, 📍 nur nach Rückfrage, maximumAge 0, Geocoder 8s-Timeout · v68: Foto-„springt zurück/blinkt" behoben

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
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
