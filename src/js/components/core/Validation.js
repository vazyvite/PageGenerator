(function () {
	"use strict";

	/**
	 * Supprimer un message d'erreur sur un selecteur.
	 * @param {object} $champ un selecteur vers un champ ou un groupe de champs ou un conteneur de champs
	 */
	function removeError($champ) {
		$champ.parents(".form-group:first").find("label").removeClass("has-error").find(".text-danger").remove();
	}

	/**
	 * Créé une erreur sur un selecteur.
	 * @param {object} $champ un selecteur vers un champ ou un groupe de champs ou un conteneur de champs
	 */
	function createError($champ) {
		$champ.each(function () {
			var champ = this,
				erreur = $("<span>").addClass("text-danger").text(champ.validationMessage);
			removeError($champ);
			$(this).parents(".form-group:first").find("label").addClass("has-error").append(erreur);
		});
	}

	/**
	 * Valide un context (champ, groupe de champs ou conteneur de champs).
	 * @param   {object}  context le champ, groupe de champ ou conteneur de champs
	 * @returns {boolean} indique si les champs testés sont valides ou non
	 */
	function validationContext(context) {
		var isValid = true,
			selector = context;

		if (selector && selector.size()) {
			if (!selector.is(":input")) {
				selector = selector.find(":input");
			}

			selector.each(function () {
				if (this.willValidate && !this.checkValidity()) {
					isValid = false;
					createError($(this));
				}
			});

			if (isValid) {
				removeError(selector);
			}
		}
		return isValid;
	}

	app.core.validation = {
		/**
		 * Initialisation de la validation
		 */
		init: function () {
			$("body").on("change", ":input", function () {
				validationContext($(this));
			});
		},

		/**
		 * Appel à validationContext
		 */
		valideForm: validationContext
	};
}());
