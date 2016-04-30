/*jslint eqeq: true, plusplus: true*/
/*globals jQuery, app*/
(function ($) {
	"use strict";

	/**
	 * Mise du focus sur le premier élément de la modale
	 * @param {object} $modal la modale
	 */
	function setFocusOnFirstField($modal) {
		if ($modal != null) {
			$modal.find(":input:visible:first").focus();
		}
	}

	/**
	 * Génère un form group pour un uiElement.
	 * @param   {string} key    le nom de la clé de l'option
	 * @param   {object} option l'option à générer sous forme de formulaire
	 * @param   {string} valeurDefault la valeur par défaut
	 * @returns {object} le form group
	 */
	function generateUiFormGroup(key, option, valeurDefault) {
		var $row = $("<div>").addClass("row"),
			$formGroup = $("<div>").addClass("form-group"),
			$divControl = $("<div>").addClass("col-md-7"),
			$select = null,
			i = 0,
			$label = null;

		// création du label
		$label = $("<label>").attr({
			"for": "modal_" + key
		}).addClass("control-label col-md-12 " + ((option.required) ? "required" : "")).text(option.label);
		$label.appendTo($formGroup);

		// création de l'aide à la saisie si elle existe
		if (option.help != null) {
			$("<span>").addClass("infos").html(option.help).appendTo($label);
		}

		// mise en place de la structure du champ de saisie si le type de champ n'est pas un boolean
		if (option.type != "boolean") {
			$divControl.appendTo($formGroup);
		}

		// cas des listes déroulantes
		if (option.list != null && option.list.length) {
			$select = $("<select>").attr({
				id: "modal_" + key,
				required: option.required,
				"data-optionName": key
			}).addClass("form-control").appendTo($divControl);
			for (i = 0; i < option.list.length; i++) {
				$("<option>").attr({
					value: option.list[i],
					selected: (option.list[i] == option["default"] || option.list[i] == valeurDefault)
				}).text(option.list[i]).appendTo($select);
			}
		} else if (option.type == "boolean") {
			// cas des checkbox
			$("<input>").attr({
				id: "modal_" + key,
				name: "modal_" + key,
				type: "checkbox",
				required: option.required,
				"data-optionName": key,
				checked: valeurDefault
			}).prependTo($label);
			$formGroup.addClass("checkbox");
			$row.removeClass("row");
		} else {
			// cas des champs de saisie classiques (défaut)
			$("<input>").attr({
				id: "modal_" + key,
				type: option.type,
				required: option.required,
				pattern: option.pattern,
				value: option["default"],
				"data-optionName": key
			}).val(valeurDefault).addClass("form-control").appendTo($divControl);
		}
		$formGroup.appendTo($row);
		return $row;
	}

	/**
	 * Génération d'un form group.
	 * @param   {string}  label         le libellé du form group
	 * @param   {string}  id            l'id du form group
	 * @param   {boolean} requis        indique si le champ est requis
	 * @param   {boolean} infobulle     indique si le champ a une info associée
	 * @param   {string}  valeurDefault la valeur par défaut
	 * @returns {object}  le form group
	 */
	function generateModalFormGroup(label, id, requis, infobulle, valeurDefault) {
		var $row = $("<div>").addClass("row"),
			$formGroup = $("<div class='form-group'>"),
			$divControl = $("<div>").addClass("col-md-5"),
			$label = $("<label>").attr({
				"for": id
			}).addClass("control-label col-md-12 " + ((requis) ? 'required' : '')).text(label);
		$label.appendTo($formGroup);
		if (infobulle != null) {
			$("<span>").addClass("infos").html(infobulle).appendTo($label);
		}
		$divControl.appendTo($formGroup);
		$("<input>").attr({
			id: id,
			type: "text",
			required: requis
		}).val(valeurDefault || "").addClass("form-control").appendTo($divControl);
		$formGroup.appendTo($row);
		return $row;
	}

	/**
	 * Dessine une modale
	 * @param {string}   id             l'id de la modale
	 * @param {string}   title          le titre de la modale
	 * @param {object}   $content       le contenu de la modale
	 * @param {boolean}   isUiElementModal       Indique si la modale concerne un uiElement
	 * @param {function} callbackDone   la callback de la modale en cas de clic sur le bouton OK
	 * @param {function} callbackCancel la callback de la modale en cas de clic sur le bouton Annuler
	 *
	 */
	function drawModal(id, title, content, isUiElementModal, callbackDone, callbackCancel) {
		var $cache = $("<div>").addClass("app-modal").attr("id", id),
			$modal = $("<div>").addClass("app-modal-window"),
			$modalTitle = $("<div>").addClass("app-modal-title"),
			$modalFooter = $("<div>").addClass("app-modal-footer"),
			$content =  $("<div>"),
			formGroup = null,
			$contentLeft = $("<div>").addClass("col-md-5 col-md-offset-1"),
			$contentRight = $("<div>").addClass("col-md-5"),
			i = 0;

		// création du titre de la modale
		$("<h2>").text(title).appendTo($modalTitle);
		$modalTitle.appendTo($modal);

		// création du contenu de la modale
		$content.addClass(content.className);
		if (content.listFormGroups != null) {
			for (i; i < content.listFormGroups.length; i++) {
				formGroup = content.listFormGroups[i];
				if (isUiElementModal) {
					if (formGroup.option != null && formGroup.option.type == "boolean") {
						generateUiFormGroup(formGroup.key, formGroup.option, formGroup.valeurDefault).appendTo($contentRight);
					} else {
						generateUiFormGroup(formGroup.key, formGroup.option, formGroup.valeurDefault).appendTo($contentLeft);
					}
				} else {
					generateModalFormGroup(formGroup.label, formGroup.id, formGroup.requis, formGroup.infobulle, formGroup.valeurDefault).appendTo($content);
				}
			}
		}
		if (isUiElementModal) {
			$content.append($contentLeft).append($contentRight);
		}
		$("<div>").addClass("app-modal-content").append($content).appendTo($modal);

		// création du footer de la modale
		$("<button>").text("Valider").addClass("btn btn-primary").attr("type", "button").appendTo($modalFooter);
		$("<button>").text("Annuler").addClass("btn btn-default").attr("type", "button").appendTo($modalFooter);
		$modalFooter.appendTo($modal);
		$modal.appendTo($cache);
		$cache.appendTo("body");

		// on pose le focus sur le premier élément de la modale
		setFocusOnFirstField($modal);

		// Mise en place des évènements sur le bouton Ok
		$("#" + id + " .app-modal-footer .btn-primary").on("click", function (event) {
			if (callbackDone(event, $modal)) {
				$cache.remove();
			}
		});
		// Mise en place des évènements sur le bouton Annuler
		$("#" + id + " .app-modal-footer .btn-default").on("click", function (event) {
			if (callbackCancel(event, $modal)) {
				$cache.remove();
			}
		});
		$("#" + id).on("keypress", function (event) {
			if (event.keyCode == 13) {
				$("#" + id + " .app-modal-footer .btn-primary").trigger("click");
			}
		});
	}

	app.core.modal = {

		/**
		 * Dessine une modale.
		 */
		drawModal: drawModal
	};
}(jQuery));
