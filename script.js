function initMap() {
  // 地図の基本設定（ヨーロッパ全体が見えるように調整）
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: { lat: 48.2082, lng: 16.3738 }, // ウィーン付近
    styles: [ /* ここに楽団のイメージに合わせた地図デザインを挿入可能 */ ]
  });

  // あなたのKMLファイルが参照しているURLを直接指定
  const kmlUrl = "http://www.google.com/maps/d/kml?forcekml=1&mid=19iVREu6_ZInWc_nU9fQ80G_vH7uJ20A";

  const kmlLayer = new google.maps.KmlLayer({
    url: kmlUrl,
    suppressInfoWindows: false, // trueにすると、独自のポップアップを自作できます
    map: map,
  });
}