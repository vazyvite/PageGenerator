/*jslint eqeq: true, plusplus: true*/
/*globals jQuery, app, prompt, Clipboard*/
(function ($) {
	"use strict";

	var listeProperties = [];

	/**
	 * Objet Propertie
	 * @author JJACQUES
	 * @param {string} cle   la clé de propertie
	 * @param {string} value la valeur de propertie
	 */
	function Propertie(cle, value) {
		var that = this;
		that.cle = cle;
		that.value = value;
	}

	/**
	 * Met à jour une propertie.
	 * @author JJACQUES
	 * @param {number} index l'index de la propertie à modifier
	 * @param {string} value la valeur de la propertie
	 */
	function updatePropertie(index, value) {
		var i = 0,
			valProperties = "";
		if (listeProperties[index]) {
			listeProperties[index].value = value;
			for (i; i < listeProperties.length; i++) {
				valProperties += listeProperties[i].cle + ":" + listeProperties[i].value + "\n";
			}
			$("#copyProperties").val(valProperties);
		} else {
			throw "la propertie " + index + " n'existe pas";
		}
	}

	/**
	 * Création des clés de properties de base.
	 * @author JJACQUES
	 */
	function addRootProperties() {
		// création de la clé de propertie du title de la page
		listeProperties.push(new Propertie(app.page.prefixDemarche + ".title.commons." + app.page.prefixPage));
	}

	app.api.properties = {
		/**
		 * Méthode d'initialisation.
		 * @author JJACQUES
		 */
		init: function () {
			$(".messages-page").on("click", ".cleProperties", function () {
				var $this = $(this),
					index = $this.attr("data-index"),
					value = prompt("Quelle est la valeur asociée à la clé " + $this.text()),
					$valeur = $this.siblings(".valueProperties");
				if (value) {
					updatePropertie(index, value);
					$valeur.text(value);
				}
			});

			$("#filterProperties").on("keyup", function () {
				var $this = $(this);
				if ($this.val() != "") {
					$(".cleProperties").parent().addClass("hide");
					$(".cleProperties:contains('" + $this.val() + "')").parent().removeClass("hide");
				} else {
					$(".cleProperties").parent().removeClass("hide");
				}
			});

			addRootProperties();

//			new Clipboard('#selectProperties');
		},

		/**
		 * Ajout une propertie
		 * @author JJACQUES
		 * @param {string} cle   la clé de propertie
		 * @param {string} value la valeur de propertie
		 */
		addProperties: function (cle, value) {
			var i = 0,
				exists = false;
			for (i; i < listeProperties.length; i++) {
				if (cle == listeProperties[i].cle) {
					exists = true;
					break;
				}
			}

			if (!exists) {
				listeProperties.push(new Propertie(cle, value));
			}
		},

		/**
		 * Retourne la liste des properties.
		 * @author JJACQUES
		 * @returns {Array} la liste des properties
		 */
		getListeProperties: function () {
			return listeProperties;
		},

		/**
		 * Réinitialise la liste des properties.
		 * @author JJACQUES
		 */
		reset: function () {
			listeProperties = [];
			addRootProperties();
		}
	};
}(jQuery));