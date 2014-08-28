/*global $ */
'use strict';


$(document).ready( function() {
	var storage_manager = new StorageManager();
	var store = storage_manager.retrieveStore();
	populateNavbar(store, false);

	var previous_quotations = jsonToQuotations(store.previous);
	quotationsListHtml(previous_quotations, $('#questionsAnswered'), 'Questions answered');

	var results_container = $('#resultsContainer');
	results_container.html(doReplacements(results_container.html(), store, previous_quotations));

	// Null the store (so that if the user back-pages, they start a new quiz
	// rather than find themselves in the middle of the old one).
	storage_manager.initializeStore()
});


function doReplacements(html, store, quotations) {
	var z;
	if (store.questions_done === 1) {
		z = '1 question';
	} else {
		z = store.questions_done + ' questions';
	}
	html = html.replace('__NUMQUESTIONS__', z);

	var message;
	if (store.points > 0) {
		message = ', with ' + store.points + ' points remaining';
	} else {
		message = ' before running out of points';
	}
	html = html.replace('__MESSAGE__', message);

	var b_message, w_message;
	if (quotations.length > 0) {
		var q1 = findBestGuess(quotations);
		var q2 = findWorstGuess(quotations);
		b_message = evaluation(q1);
		w_message = evaluation(q2);
	} else {
		b_message = '[n/a].';
		w_message = '[n/a].';
	}
	html = html.replace('__BESTGUESS__', b_message);
	html = html.replace('__WORSTGUESS__', w_message);
	return html;
}


function findBestGuess(quotations) {
	var best = quotations[0];
	for (var i = 0; i < quotations.length; i += 1) {
		var q = quotations[i];
		if (q.difference() < best.difference()) {
			best = q;
		}
	}
	return best;
}


function findWorstGuess(quotations) {
	var worst = quotations[0];
	for (var i = 0; i < quotations.length; i += 1) {
		var q = quotations[i];
		if (q.difference() > worst.difference()) {
			worst = q;
		}
	}
	return worst;
}


function evaluation(q) {
	return q.differenceString() + '. (<a href="#' + q.anchor() + '">Question #' + q.count + '</a>; you guessed ' + q.guess + '; actual date was ' + q.year + '.)';
}
