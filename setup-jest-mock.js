const StorageArea = require('mem-storage-area/StorageArea')

var localStorage = new StorageArea();

global.chrome = { 
	storage: {
		local: {
			set: jest.fn((a, b) => localStorage.set(a, b)),
			get: jest.fn((a, b) => localStorage.get(a, b)),
			clear: jest.fn((a) => localStorage.clear(a))
		}
	}
}
