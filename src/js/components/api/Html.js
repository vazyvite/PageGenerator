/*jslint eqeq: true, plusplus: true*/
/*globals jQuery, app, Clipboard*/
(function ($) {
	"use strict";

	/**
	 * Affiche la source HTML
	 * @author JJACQUES
	 * @param {object} that le bouton d'affichage des sources HTML
	 */
	function afficherSourceHTML(that) {
		$(that).removeClass("btn-default");
		$("#showVisualiser").addClass("btn-default");
		$("#sourceHTML").removeClass("hide");
		$("#visualiserHTML").addClass("hide");
	}

	/**
	 * Affiche la visualisation
	 * @author JJACQUES
	 * @param {object} that le bouton d'affichage de la visualisation
	 */
	function afficherVisualisation(that) {
		$(that).removeClass("btn-default");
		$("#showSource").addClass("btn-default");
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

			new Clipboard('#selectHTML');
		}
	};
}(jQuery));