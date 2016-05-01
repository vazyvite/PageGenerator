/*jslint eqeq: true, plusplus: true*/
/*globals $, app*/
function Page() {
	"use strict";
	var that = this;

	that.idPage = "";
	that.model = "";
	that.prefixDemarche = "";
	that.prefixPage = "";
	that.user = "";

	/**
	 * Set la valeur dans l'attribut identifié par key.
	 * Pousse la valeur en même temps dans le localstorage.
	 * @param {string} key   l'attribut
	 * @param {string} value la valeur à setter
	 */
	that.setValue = function (key, value) {
		if (that.hasOwnProperty(key)) {
			that[key] = value;
			localStorage.setItem(key, value);
		}
	};

	/**
	 * Dessine un modale de connexion
	 */
	that.drawModal = function () {
		// création du contenu de la modale
		var formModal = {
			className: "col-md-10 col-md-offset-1",
			listFormGroups: [{
				label: "Trigramme",
				id: "msp_user",
				requis: true,
				infobulle: "Les 3 lettres permettant d'identifier le développeur.",
				valeurDefault: localStorage.getItem("user")
			}, {
				label: "Code démarche (préfix messages properties de la démarche)",
				id: "msp_prefixDemarche",
				requis: true,
				infobulle: "Le préfix de la demarche permettant de construire les messages properties de la démarche.",
				valeurDefault: localStorage.getItem("prefixDemarche")
			}, {
				label: "Nom du Model",
				id: "msp_model",
				requis: true,
				infobulle: "Nom du model auquel est rattaché la page tel qu'il apparait dans le demarche-flow.xml.",
				valeurDefault: localStorage.getItem("model")
			}, {
				label: "Préfix de properties page",
				id: "msp_prefixPage",
				requis: true,
				infobulle: "Le préfix de la page permettant de construire les messages properties de la page.",
				valeurDefault: localStorage.getItem("prefixPage")
			}, {
				label: "Identifiant JS de Page",
				id: "msp_idPage",
				requis: true,
				infobulle: "Identifiant permettant d'identifier la page dans le code Javascript.",
				valeurDefault: localStorage.getItem("idPage")
			}]
		};

		// création de la modale
		app.core.modal.drawModal("modalSettingsPage", "Informations sur la Page", formModal, false, function (event, $modal) {
			var validationModal = app.core.validation.valideForm($modal);
			if (validationModal) {
				// initialisation de la page Atelier
				app.api.atelier.init();
				// initialisation de la page HTML
				app.api.html.init();
				// initialisation de la page Properties
				app.api.properties.init();

				// sauvegarde des informations de la page dans le localStorage et dans le model Page
				that.setValue("idPage", $modal.find("#msp_idPage").val());
				that.setValue("model", $modal.find("#msp_model").val());
				that.setValue("prefixDemarche", $modal.find("#msp_prefixDemarche").val());
				that.setValue("prefixPage", $modal.find("#msp_prefixPage").val());
				that.setValue("user", $modal.find("#msp_user").val());
				app.page = that;
				return true;
			} else {
				return false;
			}
		}, function () {
			return true;
		});
	};
}
