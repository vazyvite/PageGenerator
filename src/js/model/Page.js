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
	that.codeXitiDemarche = "";
	that.codeXitiPage = "";

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
			}, {
				label: "Identifiant XITI de la démarche",
				id: "msp_xitiDemarche",
				requis: false,
				infobulle: "Identifiant XITI permettant d'identifier la démarche.",
				valeurDefault: localStorage.getItem("codeXitiDemarche")
			}, {
				label: "Identifiant XITI de la page",
				id: "msp_xitiPage",
				requis: false,
				infobulle: "Identifiant XITI permettant d'identifier la page.",
				valeurDefault: localStorage.getItem("codeXitiPage")
			}]
		};

		// création de la modale
		app.core.modal.drawModal("modalSettingsPage", "Informations sur la Page", formModal, false, function (event, $modal) {
			var validationModal = app.core.validation.valideForm($modal);
			if (validationModal) {
				// sauvegarde des informations de la page dans le localStorage et dans le model Page
				that.setValue("idPage", $modal.find("#msp_idPage").val());
				that.setValue("model", $modal.find("#msp_model").val());
				that.setValue("prefixDemarche", $modal.find("#msp_prefixDemarche").val());
				that.setValue("prefixPage", $modal.find("#msp_prefixPage").val());
				that.setValue("user", $modal.find("#msp_user").val());
				that.setValue("codeXitiDemarche", $modal.find("#msp_xitiDemarche").val());
				that.setValue("codeXitiPage", $modal.find("#msp_xitiPage").val());
				app.page = that;

				// initialisation de la page Atelier
				app.api.atelier.init();
				// initialisation de la page HTML
				app.api.html.init();
				// initialisation de la page Properties
				app.api.properties.init();
				// initialisation de la page ViewXML
				app.api.viewxml.init();

				new Clipboard('.selectClipboard');

				return true;
			} else {
				return false;
			}
		}, function () {
			return true;
		});
	};
}
