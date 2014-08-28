/*global $ */
'use strict';

var storage_manager = new StorageManager();


$(document).ready( function() {
	prepareLocalStorage();
})


function prepareLocalStorage() {
	storage_manager.initializeStore();
}
