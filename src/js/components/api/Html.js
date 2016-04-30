/*jslint eqeq: true, plusplus: true*/
/*globals jQuery, app*/
(function ($) {
	"use strict";

	/**
	 * Affiche la source HTML
	 * @author JJACQUES
	 * @param {object} that le bouton d'affichage des sources HTML
	 */
	function afficherSourceHTML(that) {
		$(that).removeClass("btn-default").addClass("btn-primary");
		$("#showVisualiser").removeClass("btn-primary").addClass("btn-default");
		$("#sourceHTML").removeClass("hide");
		$("#visualiserHTML").addClass("hide");
	}

	/**
	 * Affiche la visualisation
	 * @author JJACQUES
	 * @param {object} that le bouton d'affichage de la visualisation
	 */
	function afficherVisualisation(that) {
		$(that).removeClass("btn-default").addClass("btn-primary");
		$("#showSource").removeClass("btn-primary").addClass("btn-default");
		$("#sourceHTML").addClass("hide");
		$("#visualiserHTML").removeClass("hide");
	}

	app.api.html = {

		/**
		 * Initialisation de la page HTML
		 * @author JJACQUES
		 */
		init: function () {
			$("#showSource").on("click", function () {
				afficherSourceHTML(this);
			});

			$("#showVisualiser").on("click", function () {
				afficherVisualisation(this);
			});
		}
	};
}(jQuery));