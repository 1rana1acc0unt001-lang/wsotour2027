let map;
let kmlLayer;

function initMap() {
    // 初期表示：ヨーロッパを広域で表示
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: { lat: 49.0, lng: 12.0 },
        styles: [
            { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
            { "featureType": "transit", "stylers": [{ "visibility": "off" }] }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false
    });

    const kmlUrl = "https://raw.githubusercontent.com/1rana1acc0unt001-lang/wsotour2027/main/JP.kml?v=" + new Date().getTime();
    kmlLayer = new google.maps.KmlLayer({
        url: kmlUrl,
        map: map,
        preserveViewport: true
    });
}

/**
 * 動きを強調したズーム移動関数
 */
function flyTo(lat, lng, elementId) {
    if (!map) return;

    // UI更新
    document.querySelectorAll('.concert-item').forEach(item => item.classList.remove('active'));
    const targetEl = document.getElementById(elementId);
    targetEl.classList.add('active');
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const currentZoom = map.getZoom();
    const midZoom = 6;  // 移動中（引いた状態）のズーム
    const endZoom = 11; // 目的地（寄った状態）のズーム：街全体が見える程度

    // 1. まず少し引いて（ズームアウト）、移動の「助走」をつける
    if (currentZoom > midZoom) {
        map.setZoom(midZoom);
        
        // ズームアウトが少し進んでから移動を開始
        setTimeout(() => {
            map.panTo({ lat: lat, lng: lng });
            
            // 移動が終わるタイミングを見計らってズームイン
            google.maps.event.addListenerOnce(map, 'idle', () => {
                map.setZoom(endZoom);
            });
        }, 250);
    } else {
        // すでに引いている場合は直接移動してズーム
        map.panTo({ lat: lat, lng: lng });
        google.maps.event.addListenerOnce(map, 'idle', () => {
            map.setZoom(endZoom);
        });
    }
}

/**
 * 言語切り替え
 */
function setLanguage(lang) {
    document.body.className = 'lang-' + lang;
    document.querySelectorAll('.lang-switcher button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + lang).classList.add('active');
}