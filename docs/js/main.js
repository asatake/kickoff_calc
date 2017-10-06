// DBの初期化
(function () {
    const DB_NAME = "teams";
    const STORE_NAME = "points";
    const team = 10;
    const first_point = 10;

    // ページロード時に残ってしまっているデータベースを削除
    var req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = function(evt) {
        // console.log(req.result);
        console.log('init success.');
    };
    req.onerror = function(evt) {
        console.log('init failure');
    };

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
        // 初期値入力
        var first = [];
        for (var i = 0; i < team; i++) {
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
const first_point = 10;
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

// DBがopen済みでないならopen
if(typeof indexedDB.instance !== 'undefined') {
    openDb();
}

// 確認ダイアログ
function calcConfirm() {
    if (window.confirm('OK?')) {
        main();
    }
    else {
        console.log('calc canceled.');
    }
}

function main() {
    var pointArray;
    var table = getObjectStore(STORE_NAME, "readwrite");
    var req = table.getAll();
    req.onerror = function(evt) {
        console.log('get failed');
    };
    req.onsuccess = function(evt) {
        var result = calc(evt.target.result);
        for (var x in result) {
            var r = table.put(result[x]);
            r.onsuccess = function() {
                console.log('put success');
            };
            r.onerror = function() {
                console.log('put failed');
            };
        }
    };
    return pointArray;
}

// 計算の主処理
function calc(pointArray){
    var ods = [
        {one: 2, two: 4, three: 6, four: 8},
        {one: 2, two: 4, three: 6, four: 8},
        {one: 2, two: 4, three: 6, four: 8},
        {one: 2, two: 4, three: 6, four: 8},
    ];
    var result = [];
    var battle = document.getElementById('battle'); // n回戦
    var f = document.getElementById('first'); // n番が1位だった
    for(var i in pointArray) {
        var point = pointArray[i].point;
        var sel = document.getElementById('sel' + i); // n番目を選んでいる
        var latch = document.getElementById('latch' + i); // 掛け金
        point -= latch.value;
        if (sel.selectedIndex === f.selectedIndex) {
            switch (Number(sel.selectedIndex)) {
            case 0:
                point += latch.value * ods[battle.selectedIndex].one;
                break;
            case 1:
                point += latch.value * ods[battle.selectedIndex].two;
                break;
            case 2:
                point += latch.value * ods[battle.selectedIndex].three;
                break;
            case 3:
                point += latch.value * ods[battle.selectedIndex].four;
                break;
            default:
                point += 0;
            }
        }
        var tpoint = document.getElementById('tpoint' + i);
        tpoint.innerHTML = point;
        result.push({'id': Number(i), point: Number(point)});
    }
    return result;
}
