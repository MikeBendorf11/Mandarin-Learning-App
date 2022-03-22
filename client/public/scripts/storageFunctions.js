var request, 
    db, 
    transaction, 
    store, 
    index;

function loadFromIndexedDB(dbName){
  return new Promise(
    function(resolve, reject) {
      var dbRequest = indexedDB.open(dbName);

      dbRequest.onsuccess = function(event) {
        var database      = event.target.result;
        var transaction   = database.transaction([dbName]);
        var objectStore   = transaction.objectStore(dbName);
        var objectRequest = objectStore.getAll();

        dbRequest.onerror = function(event) {
          reject(Error("Problem while loading from exitent db", event));
        }

        objectRequest.onsuccess = function(event) {
          if (objectRequest.result){
            database.close();
            resolve(objectRequest.result);
          } 
          else reject(Error('object not found', event));
        };
      };
    }
  );
}
function checkDbExists(storeName){
  return new Promise(
    function(resolve, reject) {
      var dbRequest = indexedDB.open(storeName);
      dbRequest.onupgradeneeded = function(event) {
        // Objectstore does not exist. Nothing to load
        event.target.transaction.abort();
        resolve(false);
      }
      dbRequest.onerror = function(event) {
        reject(Error("Problem while checking if db exists"));
      }
      dbRequest.onsuccess = function(event) {
        resolve(true)
      }
    });
}

function saveToIndexedDB(storeName, object){
  return new Promise(
    function(resolve, reject) {
      if (object.id === undefined) reject(Error('object has no id.'));
      var dbRequest = indexedDB.open(storeName);

      dbRequest.onerror = function(event) {
        reject(Error("IndexedDB database error"));
      };

      dbRequest.onupgradeneeded = function(event) {
        var database    = event.target.result;
        var objectStore = database.createObjectStore(storeName, {keyPath: "id"});
      };

      dbRequest.onsuccess = function(event) {
        var database      = event.target.result;
        var transaction   = database.transaction([storeName], 'readwrite');
        var objectStore   = transaction.objectStore(storeName);
        var objectRequest = objectStore.put(object); // Overwrite if exists

        objectRequest.onerror = function(event) {
          reject(Error('Error text'));
        };

        objectRequest.onsuccess = function(event) {
          resolve('Data saved OK');
        };
      };
    }
  );
}

function findChar(storeName, searchStr){
  return new Promise((resolve, reject)=>{
    var dbRequest = indexedDB.open(storeName);
    dbRequest.onupgradeneeded = function(event) {
      // Objectstore does not exist. Nothing to load
      event.target.transaction.abort();
      resolve(false);
    }
    dbRequest.onerror = function(event) {
      reject(Error("Problem while accessing DB"));
    }
    dbRequest.onsuccess = function(event) {
      var database      = event.target.result;
      var transaction   = database.transaction([storeName], 'readwrite');
      var objectStore   = transaction.objectStore(storeName);
      var index = objectStore.index('char').getAll(searchStr.trim());
      
      index.onsuccess = (event) => {
        //console.log(event.target.result);
        resolve(event.target.result);
      }
      index.onerror =  () => reject(Error(
        'Problem while getting index of chars'
      ));
    }
  })
}

//着