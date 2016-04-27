/*jslint eqeq: true, plusplus: true*/
/*globals $, app*/
function Page() {
	"use strict";
	var that = this;

	that.idPage = "";
	that.model = "";
	that.prefixDemarche = "";
	that.prefixPage = "";

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
				label: "IdPage",
				id: "msp_idPage",
				requis: true,
				infobulle: "Identifiant permettant d'identifier la page dans le code Javascript.",
				valeurDefault: localStorage.getItem("idPage")
			}, {
				label: "Model",
				id: "msp_model",
				requis: true,
				infobulle: "Nom du model auquel est rattaché la page tel qu'il apparait dans le demarche-flow.xml.",
				valeurDefault: localStorage.getItem("model")
			}, {
				label: "Code démarche (préfix messages properties de la démarche)",
				id: "msp_prefixDemarche",
				requis: true,
				infobulle: "Le préfix de la demarche permettant de construire les messages properties de la démarche.",
				valeurDefault: localStorage.getItem("prefixDemarche")
			}, {
				label: "Préfix page (préfix messages properties de la page)",
				id: "msp_prefixPage",
				requis: true,
				infobulle: "Le préfix de la page permettant de construire les messages properties de la page.",
				valeurDefault: localStorage.getItem("prefixPage")
			}]
		};

		// création de la modale
		app.core.modal.drawModal("modalSettingsPage", "Informations sur la Page", formModal, false, function (event, $modal) {
			var validationModal = app.core.validation.valideForm($modal);
			if (validationModal) {
				// initialisation de la page Atelier
				app.api.atelier.init();
				// sauvegarde des informations de la page dans le localStorage et dans le model Page
				that.setValue("idPage", $modal.find("#msp_idPage").val());
				that.setValue("model", $modal.find("#msp_model").val());
				that.setValue("prefixDemarche", $modal.find("#msp_prefixDemarche").val());
				that.setValue("prefixPage", $modal.find("#msp_prefixPage").val());
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
