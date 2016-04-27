/*jslint eqeq: true, plusplus: true, indent: 4*/
/*globals app, jQuery, Page*/
(function ($) {
	'use strict';

	window.app = {
		// L'objet Page
		page: null,
		core: {
			/**
			 * Initialisation gobale de l'application
			 */
			appLaunch: function () {
				app.core.validation.init();
				app.page.drawModal();
			}
		},
		api: {}
	};

	$(function () {
		app.page = new Page();
		app.core.appLaunch();
	});
}(jQuery));
