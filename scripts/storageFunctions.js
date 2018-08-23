var request, 
    db, 
    transaction, 
    store, 
    index;

// request.onerror = (e) => { console.log(e); }
// request.onsuccess = function (e) {
  
//   db = request.result;
//   transaction = db.transaction('unitsByRecurrence', 'readwrite');
//   store = transaction.objectStore('unitsByRecurrence');
//   index = store.index('char');
//   console.log(store.getAll());
  
// }

function loadFromIndexedDB(){
  return new Promise(
    function(resolve, reject) {
      var dbRequest = indexedDB.open('priorityDb');

      

      dbRequest.onsuccess = function(event) {
        var database      = event.target.result;
        var transaction   = database.transaction(['unitsByRecurrence']);
        var objectStore   = transaction.objectStore('unitsByRecurrence');
        var objectRequest = objectStore.getAll();

        

        objectRequest.onsuccess = function(event) {
          if (objectRequest.result) resolve(objectRequest.result);
          else reject(Error('object not found'));
        };
      };
    }
  );
}

