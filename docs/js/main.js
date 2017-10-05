// DBの初期化
(function () {
    const DB_NAME = "teams";
    const STORE_NAME = "points";
    const team = 10;
    const first_point = 10;
    var db;

    var request = indexedDB.open(DB_NAME, 1);
    request.onerror = function(evt) {
        console.log('request failure');
    };

    request.onsuccess = function(evt) {
        db = this.result;
        console.log("openDb DONE");
    };

    request.onupgradeneeded = function(evt) {
        console.log("openDb.onupgradeneeded");
        var store = evt.currentTarget.result.createObjectStore(
            STORE_NAME, { keyPath: "id" });
        store.createIndex('id', 'id', { unique: true });
        var first = [];
        for (var i = 1; i < team; i++) {
            first.push({id: i, point: first_point});
        }
        for (var x in first) {
            var req = store.add(first[x]);
            req.onsuccess = function(evt) {
                console.log();
            };
        }
    };

}());

const DB_NAME = "teams";
const STORE_NAME = "points";
const team = 10;
var db;

function openDb(){
    var request = indexedDB.open(DB_NAME, 1);
    request.onerror = function(evt) {
        console.log('request failure');
    };

    request.onsuccess = function(evt) {
        db = this.result;
        console.log("openDb DONE");
    };

    request.onupgradeneeded = function(evt) {
        console.log("openDb.onupgradeneeded");
        var store = evt.currentTarget.result.createObjectStore(
            STORE_NAME, { keyPath: "id" });
        store.createIndex('id', 'id', { unique: true });
    };
}

function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

function getBlob(key, store, success_callback) {
    var req = store.get(key);
    req.onsuccess = function(evt) {
        var value = evt.target.result;
        if (value)
            success_callback(value.blob);
    };
}

openDb();

// 計算の主処理
function calc(){
    var points = [];
    var table = getObjectStore(STORE_NAME, "readwrite");
    table.openCursor().onsuccess = function(evt) {
        var cursor = evt.target.result;
        if (cursor) {
            console.log("id: " + cursor.key + ", point: " + cursor.value.point);
            cursor.continue();
        }
        else {
            console.log('no more entries');
        }
    };
}
