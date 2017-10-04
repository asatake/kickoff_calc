function calc(){
    var points = [];
    var request = indexedDB.open("teams", 3);

    request.onerror = function(event) {
        console.log('request failure');
    };

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore("points", { keyPath: "id" });
        for (var i = 0; i < 10; i++) {
            objectStore.add({id: i, points: i * 10});
        }
    };
    var db;
    request.onsuccess = function (event) {
        db = request.result;

        //"twitter", "pocket"2つのオブジェクトストアを読み書き権限付きで使用することを宣言
        var transaction = db.transaction(["points"], "readwrite");

        //各オブジェクトストアの取り出し
        var pointsStore = transaction.objectStore("points");

        //pocketオブジェクトストアからの全データの取り出し
        pointsStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                console.log("id:" + cursor.id + " points: " + cursor.value.points);
                cursor.continue();
            }
        };
    };
}
