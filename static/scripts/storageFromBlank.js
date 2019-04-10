
function storageFromBlank(dbName) {
  return new Promise((res, rej) => {
    //There is no dbStorage for this browser, create a new priority db from 
    var request = window.indexedDB.open(dbName, 1),
      db,
      transaction,
      store,
      index;

    request.onload = () => console.log('loaded');
    request.onupgradeneeded = function () {
      let db = request.result;
      store = db.createObjectStore(dbName, { keyPath: 'id' });
      //index characters for later search
      index = store.createIndex('char', 'char', { unique: false });
    }
    request.onerror = (e) => {
      console.log(e);
      setCookie('dbRecurrenceCreated', false);
      rej()
    }
    request.onsuccess = function (e) {
      db = request.result;
      transaction = db.transaction(dbName, 'readwrite');
      store = transaction.objectStore(dbName);
      index = store.index('char')
      units.forEach(unit => {
        console.log('adding DB from scratch ...');
        store.put({
          id: unit.id,
          learnedId: unit.learnedId,
          level: unit.level,
          consult: unit.consult,
          char: unit.char,
          pronunciation: unit.pronunciation,
          combinations: {
            short: unit.combinations.short,
            long: unit.combinations.long
          },
          definitions: {
            short: unit.definitions.short,
            long: unit.definitions.long,
            single: unit.definitions.single
          }
        });
      });
      setCookie('dbRecurrenceCreated', true);
      res();
    }



  })




}
