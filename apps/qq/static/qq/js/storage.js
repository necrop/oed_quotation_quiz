'use strict';

function StorageManager() {
	this.store_name = 'oedquotequiz';
}

StorageManager.prototype.initializeStore = function() {
	var data = {
		'points': 100,
		'skips_left': 3,
		'previous': [],
		'questions_done': 0,
		'last_guess': 1750
	};
	localStorage.setItem(this.store_name, JSON.stringify(data));
}

StorageManager.prototype.retrieveStore = function() {
	var data = localStorage.getItem(this.store_name);
	if (data === null) {
		this.initializeStore();
		data = localStorage.getItem(this.store_name);
	}
	return JSON.parse(data);
}

StorageManager.prototype.updateStore = function(data) {
	localStorage.setItem(this.store_name, JSON.stringify(data));
}
