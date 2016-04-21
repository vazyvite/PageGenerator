(function () {
	"use strict";

	/**
	 * Mise du focus sur le premier élément de la modale
	 * @param {object} $modal la modale
	 */
	function focusOnFirstField($modal) {
		if ($modal != null) {
			$modal.find(":input:visible:first").focus();
		}
	}

	/**
	 * Dessine une modale
	 * @param {string}   id             l'id de la modale
	 * @param {string}   title          le titre de la modale
	 * @param {object}   $content       le contenu de la modale
	 * @param {function} callbackDone   la callback de la modale en cas de clic sur le bouton OK
	 * @param {function} callbackCancel la callback de la modale en cas de clic sur le bouton Annuler
	 *
	 */
	function drawModal(id, title, $content, callbackDone, callbackCancel) {
		var $cache = $("<div>").addClass("app-modal").attr("id", id),
			$modal = $("<div>").addClass("app-modal-window"),
			$modalTitle = $("<div>").addClass("app-modal-title"),
			$modalFooter = $("<div>").addClass("app-modal-footer");
		$("<h2>").text(title).appendTo($modalTitle);
		$("<button>").text("Valider").addClass("btn btn-primary").attr("type", "button").appendTo($modalFooter);
		$("<button>").text("Annuler").addClass("btn btn-default").attr("type", "button").appendTo($modalFooter);

		$modalTitle.appendTo($modal);
		$("<div>").addClass("app-modal-content").append($content).appendTo($modal);
		$modalFooter.appendTo($modal);
		$modal.appendTo($cache);
		$cache.appendTo("body");

		focusOnFirstField($modal);

		// Mise en place des évènements sur les boutons Ok et Annuler
		$("#" + id + " .app-modal-footer .btn-primary").on("click", function (event) {
			if (callbackDone(event, $modal)) {
				$cache.remove();
			}
		});
		$("#" + id + " .app-modal-footer .btn-default").on("click", function (event) {
			if (callbackCancel(event, $modal)) {
				$cache.remove();
			}
		});
	}

	/**
	 * @deprecated
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
			"id": id,
			"type": "text",
			"required": requis
		}).val(valeurDefault || "").addClass("form-control").appendTo($divControl);
		$formGroup.appendTo($row);
		return $row;
	}

	/**
	 * Génère un form group.
	 * @param   {string} key    le nom de la clé de l'option
	 * @param   {object} option l'option à générer sous forme de formulaire
	 * @returns {object} le form group
	 */
	function generateFormGroup(key, option, valeurDefault) {
		var $row = $("<div>").addClass("row"),
			$formGroup = $("<div>").addClass("form-group"),
			$divControl = $("<div>").addClass("col-md-7"),
			$label = $("<label>").attr({
				"for": "modal_" + key
			}).addClass("control-label col-md-12 " + ((option.required) ? "required" : "")).text(option.label);
		$label.appendTo($formGroup);

		if (option.help != null) {
			$("<span>").addClass("infos").html(option.help).appendTo($label);
		}

		if (option.type != "boolean") {
			$divControl.appendTo($formGroup);
		}
		if (option.list != null && option.list.length) {
			var $select = $("<select>").attr({
				"id": "modal_" + key,
				"required": option.required,
				"data-optionName": key
			}).addClass("form-control").appendTo($divControl),
				i = 0;
			for (i; i < option.list.length; i++) {
				$("<option>").attr({
					"value": option.list[i],
					"selected": (option.list[i] == option.default || option.list[i] == valeurDefault)
				}).text(option.list[i]).appendTo($select);
			}
		} else if (option.type == "boolean") {
			$("<input>").attr({
				"id": "modal_" + key,
				"name": "modal_" + key,
				"type": "checkbox",
				"required": option.required,
				"data-optionName": key,
				"checked": valeurDefault
			}).prependTo($label);
			$formGroup.addClass("checkbox");
			$row.removeClass("row");
		} else {
			$("<input>").attr({
				"id": "modal_" + key,
				"type": option.type,
				"required": option.required,
				"pattern": option.pattern,
				"value": option.default,
				"data-optionName": key
			}).val(valeurDefault).addClass("form-control").appendTo($divControl);
		}
		$formGroup.appendTo($row);
		return $row;
	}

	app.core.modal = {

		/**
		 * Dessine une modale.
		 */
		drawModal: drawModal,

		/**
		 * Génère un form-group pour une modale (Page).
		 */
		generateModalFormGroup: generateModalFormGroup,

		/**
		 * Génère un form-group pour une modale (uiElement).
		 */
		generateFormGroup: generateFormGroup
	}
}());
