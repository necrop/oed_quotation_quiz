/*global $ */
'use strict';

var baseurl = 'http://www.oed.com/';


/*-----------------------------------
Constructor
------------------------------------- */

function Quotation(qdata) {
	// Copy qdata attributes to this
	for (var property in qdata) {
		this[property] = qdata[property];
	}
}



/*-----------------------------------
Class properties
------------------------------------- */

Quotation.penalties = [
	[200, 50],
	[175, 45],
	[150, 40],
	[125, 35],
	[100, 30],
	[90, 25],
	[80, 20],
	[70, 18],
	[60, 16],
	[50, 14],
	[40, 12],
	[30, 10],
	[25, 9],
	[20, 8],
	[17, 7],
	[13, 6],
	[0, 5]
];
Quotation.reviews = {
	'perfect': ['You nailed it', 'Pinpoint accuracy', 'Dating perfection', 'A staggering achievement'],
	'oneout': ['Amazing', 'Stunning', 'The crowd gasps'],
	'close': ['So close', 'Nearly', 'Just missed', 'Oooh', 'Not bad'],
	'unremarkable': ['', ''],
	'mediocre': ['Room for improvement', 'Could be worse'],
	'terrible': ['Oh dear', 'Disappointing', 'What a shame', 'Good grief', 'Never mind', 'Embarrassing']
};
Quotation.url_templates = {
	'entry': baseurl + 'view/Entry/',
	'quotation_search': baseurl + 'search?scope=QUOTATION&dateFilter=',
	'entry_search': baseurl + 'search?scope=ENTRY&dateFilter='
};
Quotation.html_template = '\
	<div class="previousQuotationContainer" id="__ANCHOR__">\
		<p>\
			<span class="previousQuotationCounter">__COUNTER__</span>\
			<span class="citation">__CITATION__</span>\
			<span class="qtext">&ldquo;__QUOTATION__&rdquo;</span>\
		</p>\
		<div>\
			[<a href="__ENTRYURL__" target="oed" title="Go to entry in OED Online."><strong>__LEMMA__</strong></a>]\
		</div>\
		<div>\
			You guessed <strong>__GUESS__</strong> (__DIFFERENCEMESSAGE__).\
		</div>\
		<div>\
			__FINDMORE__\
		</div>\
	</div>';
Quotation.details_template = '\
	<p>\
		This quotation appears in the OED entry for &ldquo;<a href="__ENTRYURL__" target="oed" title="View entry in OED Online"><strong>__LEMMA__</strong></a>&rdquo;.\
	</p>\
	<p>\
		__FINDMORE__\
	</p>';
Quotation.findmore_template = '\
	Find <a href="__QUOTATIONSURL__" target="oed" title="Search for quotations in OED Online.">more quotations from __YEAR__</a> |\
	<a href="__ENTRIESURL__" target="oed" title="Search for entries in OED Online.">words first recorded in __YEAR__</a>';



/*-----------------------------------
Methods
------------------------------------- */

Quotation.prototype.difference = function() {
	return Math.abs(this.year - this.guess);
}


Quotation.prototype.differenceString = function() {
	if (this.difference() === 1) {
		return '1 year out';
	} else {
		return this.difference() + ' years out';
	}
}


Quotation.prototype.differenceMessage = function() {
	if (this.difference() === 0) {
		return 'Bullseye!';
	} else if (this.difference() === 1) {
		return 'Just one year out!';
	} else {
		return this.difference() + ' years out.';
	}
}


Quotation.prototype.reviewMessage = function() {
	var list, punc;
	if (this.difference() === 0) {
		list = Quotation.reviews.perfect;
		punc = '!';
	} else if (this.difference() === 1) {
		list = Quotation.reviews.oneout;
		punc = '!';
	} else if (this.difference() <= 10) {
		list = Quotation.reviews.close;
		punc = '!';
	} else if (this.difference() < 70) {
		list = Quotation.reviews.unremarkable;
		punc = '';
	} else if (this.difference() < 100) {
		list = Quotation.reviews.mediocre;
		punc = '.';
	} else {
		list = Quotation.reviews.terrible;
		punc = '.';
	}
	var message = list[Math.floor(Math.random() * list.length)];
	return message + punc;
}


Quotation.prototype.score = function() {
	var score;
	var difference = this.difference();
	if (difference === 0) {
		score = 50
	} else if (difference === 1) {
		score = 20;
	} else if (difference <= 10) {
		score = 15 - difference;
	} else {
		for (var i = 0; i < Quotation.penalties.length; i +=1) {
			var d = Quotation.penalties[i][0];
			var p = Quotation.penalties[i][1];
			if (difference > d) {
				score = -p;
				break;
			}
		}
	}
	return score;
}


Quotation.prototype.scoreMessage = function() {
	var message;
	var score = this.score();
	if (score > 0) {
		message = 'You score ' + score + ' points.';
	} else if (score === -1) {
		message = 'You lose 1 point.';
	} else {
		message = 'You lose ' + Math.abs(score) + ' points.';
	}
	return message;
}


Quotation.prototype.anchor = function() {
	return 'pq' + this.id;
}



/*-----------------------------------
HTML slugs
------------------------------------- */

Quotation.prototype.html = function() {
	return this.htmlReplacements(Quotation.html_template);
}


Quotation.prototype.details = function() {
	return this.htmlReplacements(Quotation.details_template);
}


Quotation.prototype.htmlReplacements = function(template) {
	var html = template;
	html = html.replace(/__COUNTER__/g, '' + this.count);
	html = html.replace(/__CITATION__/g, this.citation);
	html = html.replace(/__QUOTATION__/g, this.text);
	html = html.replace(/__LEMMA__/g, this.lemma);
	html = html.replace(/__YEAR__/g, '' + this.year);
	html = html.replace(/__GUESS__/g, '' + this.guess);
	html = html.replace(/__DIFFERENCEMESSAGE__/g, this.differenceMessage());
	html = html.replace(/__ENTRYURL__/g, this.entryUrl());
	html = html.replace(/__ANCHOR__/g, this.anchor());
	html = html.replace(/__FINDMORE__/g, this.findmore());
	return html;
}


Quotation.prototype.findmore = function() {
	var html = Quotation.findmore_template;
	html = html.replace(/__YEAR__/g, '' + this.year);
	html = html.replace(/__QUOTATIONSURL__/g, this.quotationSearchUrl());
	html = html.replace(/__ENTRIESURL__/g, this.entrySearchUrl());
	return html;
}



/*-----------------------------------
URLs to OED Online
------------------------------------- */

Quotation.prototype.entryUrl = function() {
	return Quotation.url_templates.entry + this.target;
}


Quotation.prototype.quotationSearchUrl = function() {
	return Quotation.url_templates.quotation_search + this.year;
}


Quotation.prototype.entrySearchUrl = function() {
	return Quotation.url_templates.entry_search + this.year;
}



/*-----------------------------------
Helper functions associated with Quotation
------------------------------------- */

function jsonToQuotations(json) {
	// Turn a list of json data into a list of Quotation objects
	var quotations = [];
	for (var i = 0; i < json.length; i += 1) {
		var q = new Quotation(json[i]);
		quotations.push(q);
	}
	return quotations;
}


function quotationsListHtml(quotations, node, header) {
	if (quotations.length) {
		var html = '<h2>' + header + '</h2>';
		for (var i = 0; i < quotations.length; i += 1) {
			html += quotations[i].html();
		}
		node.html(html);
	}
}
