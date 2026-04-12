let map;
let kmlLayer;

function initMap() {
    // 初期の中心（ヨーロッパ全体）
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: { lat: 48.0, lng: 14.0 },
        styles: [
            { "featureType": "poi.business", "stylers": [{ "visibility": "off" }] }
        ]
    });

    // KMLレイヤーの追加
    const kmlUrl = "https://raw.githubusercontent.com/1rana1acc0unt001-lang/wsotour2027/main/JP.kml?v=" + new Date().getTime();
    kmlLayer = new google.maps.KmlLayer({
        url: kmlUrl,
        map: map,
        preserveViewport: true // 手動のzoom制御を優先するためtrueに
    });
}

// 都市にズームインする関数
function jumpTo(lat, lng, elementId) {
    if (!map) return;

    // 地図を移動
    map.panTo({ lat: lat, lng: lng });
    map.setZoom(13);

    // リストのアクティブ状態を更新
    document.querySelectorAll('.concert-item').forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(elementId).classList.add('active');

    // スマホの場合、リストを少しスクロールさせて視認性を上げる
    document.getElementById(elementId).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 言語切り替え関数
function setLanguage(lang) {
    // bodyのクラスを書き換え
    document.body.className = 'lang-' + lang;

    // ボタンのactive状態を更新
    document.querySelectorAll('.lang-switcher button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('btn-' + lang).classList.add('active');
}