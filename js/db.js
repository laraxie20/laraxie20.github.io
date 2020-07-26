var dbPromised = idb.open('db_soccerinfo', 1, upgradeDb => {
    var objectStore = upgradeDb.createObjectStore('myfavorite', {
        keyPath: 'id'
    });
    objectStore.createIndex('team', 'team', { unique: false });
});

function addFavorite(data) {
    dbPromised.then(db => {
        var tx = db.transaction('myfavorite', 'readwrite');
        var store = tx.objectStore('myfavorite');
        var dataSave = {
            id: data.id,
            name: data.name,
            founded: data.founded,
            venue: data.venue,
            crestUrl: data.crestUrl,
        };
        store.put(dataSave);
        return tx.complete;
    }).then(() => {
        console.log('Team favorit berhasil disimpan.');
        var message = `${data.name} berhasil ditambahkan ke daftar team favoritmu`;

        if (Notification.permission === 'granted') {
            M.toast({ html: message, classes: 'rounded' });
            showNotification(message);
        } else {
            console.error('Fitur notifikasi tidak diizinkan.');
        }

    }).catch(err => {
        console.log(err);
    });
}

function deleteFavorite(data) {
    dbPromised.then(db => {
        var tx = db.transaction('myfavorite', 'readwrite');
        var store = tx.objectStore('myfavorite');

        store.delete(data.id);
        return tx.complete;
    }).then(() => {
        var message = `${data.name} berhasil dihapus dari daftar team favoritmu`;
        if (Notification.permission === 'granted') {
            M.toast({ html: message, classes: 'rounded' });
            showNotification(message);
        } else {
            console.error('Fitur notifikasi tidak diizinkan.');
        }
    }).catch(err => {
        console.log(err);
    });
}

function getFavData() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(db => {
                var tx = db.transaction('myfavorite', "readonly");
                var store = tx.objectStore('myfavorite');
                return store.getAll();
            })
            .then(data => {
                resolve(data);
            });
    });
}

function checkData(id) {
    return new Promise(function (resolve, reject) {
        dbPromised.then(db => {
            var tx = db.transaction('myfavorite', "readonly");
            var store = tx.objectStore('myfavorite');
            return store.get(id);
        })
            .then(data => {
                if (data != undefined) resolve(true)
                else reject(false);
            });
    });
}

function showNotification(body) {
    const title = 'Favorite Team';
    const options = {
        'body': `${body}`,
        'icon': '../img/logo.png',
        'badge': '../img/logo.png'
    }
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, options);
        });
    } else {
        console.error('Fitur notifikasi tidak diizinkan.');
    }
}