/*global $ */
'use strict';


function populateNavbar(store, include_quit) {
	var blocks = $('.navbar-nav > li > a');
	blocks.each( function(i) {
		if (i === 0) {
			$(this).text($(this).text() + store.questions_done);
		} else if (i === 1) {
			$(this).text($(this).text() + store.points);
		} else if (i === 2) {
			$(this).text($(this).text() + store.skips_left);
		}
	});
	if (! include_quit) {
		$('.navbar').find('form').hide();
	}
}
