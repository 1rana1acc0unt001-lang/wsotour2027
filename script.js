let map;

function initMap() {
    // 地図の初期化
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: { lat: 48.2082, lng: 16.3738 }, // ウィーン付近
        // 地図をシンプルにするためのスタイル設定（任意）
        styles: [
            { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] },
            { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }
        ]
    });

    // KMLレイヤーの読み込み
    // キャッシュ回避のためタイムスタンプを付与
    const kmlUrl = "https://raw.githubusercontent.com/1rana1acc0unt001-lang/wsotour2027/main/JP.kml?v=" + new Date().getTime();

    const kmlLayer = new google.maps.KmlLayer({
        url: kmlUrl,
        map: map,
        preserveViewport: false // すべてのピンが見えるように自動調整
    });

    // KML読み込みエラーのチェック
    kmlLayer.addListener("status_changed", () => {
        if (kmlLayer.getStatus() !== "OK") {
            console.error("KML読み込みエラー:", kmlLayer.getStatus());
        }
    });
}

// 公演地リストをクリックしたときに地図を動かす関数
function jumpTo(lat, lng) {
    if (map) {
        map.panTo({ lat: lat, lng: lng });
        map.setZoom(14); // 会場周辺までズーム
    }
}