let map;
let kmlLayer;

function initMap() {
    // 初期表示：ヨーロッパ全体
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: { lat: 48.0, lng: 13.0 },
        // 地図をスッキリさせるスタイル
        styles: [
            { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
            { "featureType": "transit", "stylers": [{ "visibility": "off" }] }
        ],
        // ズームなどのコントロール配置
        mapTypeControl: false,
        streetViewControl: false
    });

    // KML読み込み（キャッシュ回避用パラメータ付き）
    const kmlUrl = "https://raw.githubusercontent.com/1rana1acc0unt001-lang/wsotour2027/main/JP.kml?v=" + new Date().getTime();
    kmlLayer = new google.maps.KmlLayer({
        url: kmlUrl,
        map: map,
        preserveViewport: true // 自動ズームをオフにしてJS側の制御を優先
    });
}

/**
 * 目的地へ「飛ぶ」アニメーション
 */
function flyTo(lat, lng, elementId) {
    if (!map) return;

    // 1. UIの更新（アクティブ状態の切り替え）
    document.querySelectorAll('.concert-item').forEach(item => item.classList.remove('active'));
    const targetEl = document.getElementById(elementId);
    targetEl.classList.add('active');
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // 2. ズームアニメーション
    const currentZoom = map.getZoom();
    const targetZoom = 14;

    // 一旦ズームアウトして「移動感」を出す（既に引いている場合はそのまま移動）
    if (currentZoom > 7) {
        map.setZoom(7);
        // 少し遅らせて移動を開始
        setTimeout(() => {
            map.panTo({ lat: lat, lng: lng });
            // 移動が落ち着いた頃にズームイン
            google.maps.event.addListenerOnce(map, 'idle', () => {
                map.setZoom(targetZoom);
            });
        }, 300);
    } else {
        map.panTo({ lat: lat, lng: lng });
        google.maps.event.addListenerOnce(map, 'idle', () => {
            map.setZoom(targetZoom);
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