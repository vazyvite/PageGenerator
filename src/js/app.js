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
				app.api.generate.init();
				app.page.drawModal();

				$("#btnReset").on("click", function () {
					app.api.atelier.reset();
				});

				$("#btnOptions").on("click", function () {
					app.page.drawModal();
				});

				$(".selectClipboard").on("click", function () {
					app.core.alert.create("success", "Code copié dans le presse papier.");
				});
			}
		},
		api: {}
	};

	$(function () {
		app.page = new Page();
		app.core.appLaunch();
	});
}(jQuery));
