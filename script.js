let map;
let currentAnimation = null;
const HOME_CENTER = { lat: 49.0, lng: 12.0 };
const HOME_ZOOM = 5;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: HOME_ZOOM,
        center: HOME_CENTER,
        styles: [{ "featureType": "poi", "stylers": [{ "visibility": "off" }] }],
        gestureHandling: "greedy",
        disableDefaultUI: false
    });

    const kmlUrl = "https://raw.githubusercontent.com/1rana1acc0unt001-lang/wsotour2027/main/JP.kml?v=" + new Date().getTime();
    new google.maps.KmlLayer({
        url: kmlUrl,
        map: map,
        preserveViewport: true
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.section-tabs button').forEach(el => el.classList.remove('active'));
    document.getElementById('sec-' + sectionId).classList.add('active');
    document.getElementById('tab-' + sectionId).classList.add('active');
    if (sectionId !== 'schedule') resetView();
}

function animateFlight(targetLat, targetLng, targetZoom, duration = 3000) {
    if (currentAnimation) cancelAnimationFrame(currentAnimation);
    const startPos = map.getCenter();
    const startZoom = map.getZoom();
    const startTime = performance.now();

    function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        map.setCenter({
            lat: startPos.lat() + (targetLat - startPos.lat()) * ease,
            lng: startPos.lng() + (targetLng - startPos.lng()) * ease
        });
        
        let curZoom;
        if (progress < 0.5) {
            curZoom = startZoom + (Math.min(startZoom, targetZoom) - 0.5 - startZoom) * easeInOutCubic(progress * 2);
        } else {
            const mid = Math.min(startZoom, targetZoom) - 0.5;
            curZoom = mid + (targetZoom - mid) * easeInOutCubic((progress - 0.5) * 2);
        }
        map.setZoom(curZoom);
        if (progress < 1) currentAnimation = requestAnimationFrame(step);
    }
    currentAnimation = requestAnimationFrame(step);
}

function flyTo(lat, lng, elementId) {
    const targetEl = document.getElementById(elementId);
    if (targetEl.classList.contains('active')) {
        resetView();
        return;
    }
    document.querySelectorAll('.concert-item').forEach(item => item.classList.remove('active'));
    targetEl.classList.add('active');
    animateFlight(lat, lng, 11, 3000);
}

function resetView() {
    document.querySelectorAll('.concert-item').forEach(item => item.classList.remove('active'));
    animateFlight(HOME_CENTER.lat, HOME_CENTER.lng, HOME_ZOOM, 2500);
}

function setLanguage(lang) {
    document.body.className = 'lang-' + lang;
    document.querySelectorAll('.lang-switcher button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + lang).classList.add('active');
}