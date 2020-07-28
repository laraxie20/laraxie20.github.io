let dbPromised = idb.open('db_soccerinfo', 1, upgradeDb => {
    let objectStore = upgradeDb.createObjectStore('myfavorite', {
        keyPath: 'id'
    });
    objectStore.createIndex('team', 'team', { unique: false });
});

const addFavorite = data => {
    dbPromised.then(db => {
        let tx = db.transaction('myfavorite', 'readwrite');
        let store = tx.objectStore('myfavorite');
        let dataSave = {
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
        const message = `${data.name} berhasil ditambahkan ke daftar team favoritmu`;

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

const deleteFavorite = data => {
    dbPromised.then(db => {
        let tx = db.transaction('myfavorite', 'readwrite');
        let store = tx.objectStore('myfavorite');

        store.delete(data.id);
        return tx.complete;
    }).then(() => {
        const message = `${data.name} berhasil dihapus dari daftar team favoritmu`;
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

const getFavData = () => {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(db => {
                let tx = db.transaction('myfavorite', "readonly");
                let store = tx.objectStore('myfavorite');
                return store.getAll();
            })
            .then(data => {
                resolve(data);
            });
    });
}

const checkData = id => {
    return new Promise(function (resolve, reject) {
        dbPromised.then(db => {
            let tx = db.transaction('myfavorite', "readonly");
            let store = tx.objectStore('myfavorite');
            return store.get(id);
        })
            .then(data => {
                if (data != undefined) resolve(true)
                else reject(false);
            });
    });
}

const showNotification = body => {
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