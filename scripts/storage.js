
//There is no dbStorage for this browser
//Create a new priority db from 
if (!getCookie('dbRecurrenceCreated')) {
  parseCSVfile();
  var request = window.indexedDB.open('priorityDb', 1), db, transaction, store, index;
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
      console.log('adding...');
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
          long: unit.definitions.long
        }
      });
    });
    setCookie('dbRecurrenceCreated', true);
  }
}

function getCookie(name, defaultValue) {
  defaultValue = (typeof defaultValue === 'undefined') ? null : defaultValue;
  var re = new RegExp(name + "=([^;]+)"); // the () is capture group
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : defaultValue;
}

function setCookie(name, value) {
  var date = new Date();
  date.setTime((new Date()).getTime() + 1000 * 60 * 60 * 24 * 365);
  document.cookie = escape(name) + '=' + escape(value) + ';expires=' + date.toGMTString();
}

