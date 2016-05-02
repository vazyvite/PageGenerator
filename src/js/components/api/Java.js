(function ($) {
	"use strict";

	/**
	 * Génère un UID
	 * @author JJACQUES
	 * @returns {string} l'UID
	 */
	function generateUID() {
		return (Math.random() < 0.5 ? '-' : '') + Math.round(Math.pow(10, 17) * Math.random()) + 'L';
	}

	app.api.java = {
		init: function () {

		}
	};
}(jQuery));