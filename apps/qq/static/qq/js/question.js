/*global $, ajaxurl */
'use strict';

var question_block,
	slider,
	citation,
	details,
	review;
var storage_manager = new StorageManager();
var minimum_year = 1500;
var maximum_year = 2000;


$(document).ready( function() {
	question_block = $('#questionContainer');
	slider = $('#slider');
	citation = $('#mainCitation');
	details = $('#detailsContainer');
	review = $('#reviewMessage');
	var store = storage_manager.retrieveStore();
	populateState(store);

	var previous_quotations = jsonToQuotations(store.previous);
	quotationsListHtml(previous_quotations, $('#previousContainer'), 'Previous questions');

	$('#questionContainer').animate({ opacity: 1 }, 2000);
	// Set listeners for button clicks
	$('#skipButton').click( function() {
		skipQuestion(store);
	});
	$('#submitButton').click( function() {
		checkAnswer(store);
	});
	$('#nextButton').click( function() {
		location.reload(true);
	});
})


function populateState(store) {
	$('#questionCounter').html('Question ' + (store.questions_done + 1));
	if (store.skips_left) {
		var title = $('#skipButton').attr('title');
		if (store.skips_left === 1) {
			title = title.replace('__SKIPSLEFT__', store.skips_left + ' skip');
		} else {
			title = title.replace('__SKIPSLEFT__', store.skips_left + ' skips');
		}
		$('#skipButton').attr('title', title);
		$('#skipButtonDead').hide();
	} else {
		$('#skipButton').hide();
	}
	populateNavbar(store, true);
	initializeSlider(store.last_guess);

	// Set minimum-height for the question block (so that it doesn't keep
	//  changing size as elements come and go)
	var height = question_block.outerHeight();
	question_block.css('min-height', height + 'px');
}


function initializeSlider(last_guess) {
	// Initialize the date-range slider
	var slider_text = $('#sliderText');
	slider.slider({
		range: false,
		min: minimum_year,
		max: maximum_year ,
		value: last_guess,
		slide: function(event, ui) {
			slider_text.text(ui.value);
		}
	});
	// Initialize the date above the slider
	slider_text.text(slider.slider('value'));

	// Set listeners for buttons
	$('#plusOneYear').click( function() {
		var year = slider_text.text() * 1;
		if (year < maximum_year) {
			year += 1;
			slider_text.text(year);
			slider.slider('option', 'value', year);
		}
	});
	$('#minusOneYear').click( function() {
		var year = slider_text.text() * 1;
		if (year > minimum_year) {
			year -= 1;
			slider_text.text(year);
			slider.slider('option', 'value', year);
		}
	});

}


function skipQuestion(store) {
	store.skips_left -= 1;
	storage_manager.updateStore(store);
	location.reload(true);
}


function checkAnswer(store) {
	// Get the year from the present state of the slider
	var guess = slider.slider('value');
	// Hide the slider
	$('#sliderContainer').hide().html('');
	$('#yearChangeButtons').hide().html('');
	// Fetch the answers
	$.getJSON(
		ajaxurl,
		{},
		function(data) {
			data.guess = guess;
			data.count = store.questions_done + 1;
			var q = new Quotation(data);
			displayAnswers(q, store);
		}
	);
}


function displayAnswers(q, store) {
	var current_score = store.points;

	// Show the citation
	var html = '&mdash; ' + q.citation + citation.html();
	html = html.replace('__LEMMA__', q.lemma);
	html = html.replace('__ENTRYURL__', q.entryUrl());
	citation.html(html);
	citation.animate({ opacity: 1 }, 500);

	// Show details about this quotation
	details.html(q.details());
	details.animate({ opacity: 1 }, 3000);

	review.html(' (' + q.differenceMessage() + ' ' + q.reviewMessage() + ')');

	// Calculate score
	var score = q.score();
	var score_message = q.scoreMessage() + ' You now have <span>' + current_score + '</span> points.';

	// Update the overall score
	var new_score = current_score + score;
	// ...but don't go below zero
	if (new_score < 0) {
		new_score = 0;
	}

	setTimeout( function() {
		review.animate({ opacity: 1 }, 500);
		setTimeout(function () {
			var score_container = $('#scoreContainer');
			score_container.html(score_message);
			animateScoreChange(score_container, current_score, new_score);
		}, 1000);
	}, 1000);

	// Update the store so that this quotation is added
	//  to the list of previous quotations
	store.previous.push(q);
	store.questions_done += 1;
	store.last_guess = q.guess;
	store.points = new_score;
	storage_manager.updateStore(store);
}


function animateScoreChange(parent_node, old_score, new_score) {
	var increment;
	if (old_score < new_score) {
		increment = 1;
	} else {
		increment = -1;
	}

	// Animate the score change
	var child_node = parent_node.find('span');
	child_node.css('color', 'red');
	var i = setInterval(function () {
		if (old_score === new_score) {
			clearInterval(i);
			singularize(new_score, parent_node);
			setTimeout( function() {
				showOnwardButtons(new_score);
			}, 1000);
		} else {
			old_score += increment;
			child_node.text(old_score);
		}
	}, 100);
}


function singularize(score, node) {
	// If down to 1 point, singularize 'points' to 'point'.
	if (score === 1) {
		var html = node.html();
		html = html.replace('</span> points', '</span> point');
		node.html(html);
	}
}


function showOnwardButtons(score) {
	var block;
	if (score > 0) {
		block = $('#aftermathContainer');
	} else {
		block = $('#endgameContainer');
	}
	block.show().animate({ opacity: 1 }, 500);
}
