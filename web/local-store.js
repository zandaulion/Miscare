// One versioned document keeps profile, journal and progression atomic, including
// process death between writes. Read/modify/write runs inside one IDB transaction;
// concurrent tabs cannot overwrite each other's completed workouts.
export function createLocalStore({ indexedDB = globalThis.indexedDB, name = 'miscare-local' } = {}) {
  let connection;
  function open() {
    if (!connection) connection = new Promise((resolve, reject) => {
      const request = indexedDB.open(name, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('documents');
      request.onerror = () => { connection = null; reject(request.error); };
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); connection = null; };
        resolve(db);
      };
    });
    return connection;
  }
  return {
    async transaction(change) {
      const db = await open();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('documents', change ? 'readwrite' : 'readonly');
        const documents = tx.objectStore('documents');
        let result, failure;
        tx.oncomplete = () => resolve(result);
        tx.onabort = () => reject(failure || tx.error || new Error('Local storage transaction aborted'));
        const request = documents.get('app');
        request.onsuccess = () => {
          try {
            const data = request.result || { version: 1, profile: null, logs: [], routine: null };
            if (data.version !== 1) throw new Error('Unsupported local data version');
            result = change ? change(data) : data;
            if (change) documents.put(data, 'app');
          } catch (err) { failure = err; tx.abort(); }
        };
      });
    },
    async close() { if (connection) (await connection).close(); connection = null; }
  };
}
