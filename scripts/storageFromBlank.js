

//There is no dbStorage for this browser, create a new priority db from 
parseCSVfile();
var request = window.indexedDB.open('priorityDb', 1), 
    db, 
    transaction, 
    store, 
    index;

request.onload = () => console.log('loaded');
request.onupgradeneeded = function () {
  let db = request.result;
  store = db.createObjectStore('unitsByRecurrence', { keyPath: 'id' });
  //index characters for later search
  index = store.createIndex('char', 'char', { unique: false });
}
request.onerror = (e) => { console.log(e); }
request.onsuccess = function (e) {
  db = request.result;
  transaction = db.transaction('unitsByRecurrence', 'readwrite');
  store = transaction.objectStore('unitsByRecurrence');
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
}

request.oncomplete = function(){
  db.close;
}




