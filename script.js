let map;
let kmlLayer;
// 初期の表示位置（ヨーロッパ全体）を定義
const HOME_CENTER = { lat: 49.0, lng: 12.0 };
const HOME_ZOOM = 5;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: HOME_ZOOM,
        center: HOME_CENTER,
        styles: [
            { "featureType": "poi", "stylers": [{ "visibility": "off" }] }
        ],
        // 滑らかなアニメーションのためにジェスチャー制御などを最適化
        gestureHandling: "greedy"
    });

    const kmlUrl = "https://raw.githubusercontent.com/1rana1acc0unt001-lang/wsotour2027/main/JP.kml?v=" + new Date().getTime();
    kmlLayer = new google.maps.KmlLayer({
        url: kmlUrl,
        map: map,
        preserveViewport: true
    });
}

/**
 * トグル機能付き・スローアニメーション移動
 */
function flyTo(lat, lng, elementId) {
    if (!map) return;

    const targetEl = document.getElementById(elementId);
    
    // --- トグル判定 ---
    // すでにアクティブな項目をもう一度押した場合
    if (targetEl.classList.contains('active')) {
        resetView();
        return;
    }

    // --- 通常の移動（アクティブ化） ---
    // 他の項目のアクティブを解除
    document.querySelectorAll('.concert-item').forEach(item => item.classList.remove('active'));
    targetEl.classList.add('active');
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // スロー演出の設定
    const midZoom = 9;  // 一旦引く時の高さ
    const endZoom = 11; // 最終的な高さ

    // 手順1: ゆっくりズームアウト
    map.setZoom(midZoom);

    // 手順2: ズームアウトが落ち着くのを待ってから「ゆっくり」パン
    // setTimeoutの時間を長めに設定して余韻を作る
    setTimeout(() => {
        // panToは標準で滑らかだが、あえて少し時間差を置いて目的地へ
        map.panTo({ lat: lat, lng: lng });

        // 手順3: 移動が完全に終わってからズームイン
        google.maps.event.addListenerOnce(map, 'idle', () => {
            // idleイベント（地図の動きが止まった時）からさらに少し待ってズーム
            setTimeout(() => {
                map.setZoom(endZoom);
            }, 400); 
        });
    }, 600); // ズームアウト後の待ち時間を増加
}

/**
 * 地図をヨーロッパ全体に戻すリセット関数
 */
function resetView() {
    // 全てのアクティブを解除
    document.querySelectorAll('.concert-item').forEach(item => item.classList.remove('active'));

    // ゆっくりズームアウトして戻る
    map.setZoom(HOME_ZOOM);
    setTimeout(() => {
        map.panTo(HOME_CENTER);
    }, 500);
}

/**
 * 言語切り替え
 */
function setLanguage(lang) {
    document.body.className = 'lang-' + lang;
    document.querySelectorAll('.lang-switcher button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + lang).classList.add('active');
}