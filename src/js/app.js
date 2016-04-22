/*jslint eqeq: true, plusplus: true, indent: 4*/
/*globals app, require, jQuery, console, alert, Notification*/
(function ($) {
	'use strict';
	var DROPBAG_CLASSNAME = "dropbag",
		ATELIER_PAGE_CLASSNAME = "atelier-page",
		PAGE_LINE_CLASSNAME = "page-line";

	/**
	 * Insère dans le DOM un UIElements.
	 * @param {object} UiElement les données de l'UIElement à insérer
	 */
	function drawItemUiElement(UiElement) {
		var $itemMenu = $("<div>").addClass("item").attr({
			"draggable": "true",
			"title": UiElement.shortDesc
		}).data("uielement", UiElement);
		$("<span>").text(UiElement.name).appendTo($itemMenu);
		$itemMenu.appendTo("#tabAtelier .menu");
	}

	/**
	 * Initialisation des UIElements du menu.
	 * @callback callback
	 */
	function initialiserListeUIElements(callback) {
		require("fs").readFile('./js/data/UiElements.json', "utf8", function (err, listeData) {
			if (err) {
				throw err;
			}
			var i = 0,
				listeUiElements = JSON.parse(listeData).listeUIElements;
			for (i; i < listeUiElements.length; i++) {
				drawItemUiElement(listeUiElements[i]);
			}
			callback();
		});
	}

	function getOptionsParType(typeElement) {
		var mapTypeOption = {
				"form": ["required", "disabled", "hasInfobulle", "codeChamp", "attributJava"]
			},
			type = null,
			options = {},
			mapDetailsOptions = {
				"required": {
					"label": "Champs requis",
					"type": "boolean",
					"default": false,
					"pattern": null,
					"list": [],
					"required": false,
					"help": null
				},
				"disabled": {
					"label": "Champs désactivé",
					"type": "boolean",
					"default": false,
					"pattern": null,
					"list": [],
					"required": false,
					"help": null
				},
				"hasInfobulle": {
					"label": "Champs associé à une infobulle",
					"type": "boolean",
					"default": false,
					"pattern": null,
					"list": [],
					"required": false,
					"help": null
				},
				"codeChamp": {
					"label": "Clé de properties",
					"type": "text",
					"default": "",
					"pattern": null,
					"list": [],
					"required": true,
					"help": "Indique le préfix utilisé pour les messages properties du champ. Ce code doit être unique car il permettra de générer les identifiants."
				},
				"attributJava": {
					"label": "Attribut Java",
					"type": "text",
					"default": "",
					"pattern": null,
					"list": [],
					"required": true,
					"help": "Indique le nom de l'attribut Java lié au champ de saisie."
				}
			},
			i = 0;

		if (mapTypeOption.hasOwnProperty(typeElement)) {
			for (i; i < mapTypeOption[typeElement].length; i++) {
				options[mapTypeOption[typeElement][i]] = mapDetailsOptions[mapTypeOption[typeElement][i]];
			}
		}
		return options;
	}

	function supprimerPageLineVides() {
		$(".page-line .uiElement-content:empty").parents(".page-line:first").remove();
	}

	function createModaleForUiElement(uiElement, initialUiElement, callback) {
		var option = null,
			uiData = (initialUiElement != null) ? initialUiElement.data("uielement") : uiElement.data("uielement"),
			options = (initialUiElement != null && initialUiElement.data("uielement") != null) ? initialUiElement.data("uielement").options : uiElement.data("datagen"),
			optionsDefault = getOptionsParType(uiData.type),
			optionsFinal = optionsDefault,
			$content = $("<div>"),
			$contentLeft = $("<div>").addClass("col-md-5 col-md-offset-1"),
			$contentRight = $("<div>").addClass("col-md-5"),
			generatedFormGroup = null,
			titreModal = (initialUiElement != null) ? "Ajouter un élément" : "Modifier un élément";
		if (options != null) {
			// on créé la liste finale des options à partir de la liste des options de type et la liste des options spécifiques
			for (option in options) {
				if (options.hasOwnProperty(option)) {
					optionsFinal[option] = options[option];
				}
			}
			// on génère chaque élément de formulaire sur la base de la liste finale des options
			option = null;
			for (option in optionsFinal) {
				if (optionsFinal.hasOwnProperty(option)) {
					generatedFormGroup = app.core.modal.generateFormGroup(option, optionsFinal[option], optionsFinal[option].val);
					if (optionsFinal[option].type == "boolean") {
						generatedFormGroup.appendTo($contentRight);
					} else {
						generatedFormGroup.appendTo($contentLeft);
					}
				}
			}
			$contentLeft.appendTo($content);
			$contentRight.appendTo($content);
			app.core.modal.drawModal("addUiElement", titreModal, $content, function () {
				var validationModal = app.core.validation.valideForm($("#addUiElement"));
				if (validationModal) {
					if (initialUiElement != null) {
						uiElement.find(".uiElement-content").text(initialUiElement[0].innerText.trim() + "#" + $("#modal_codeChamp").val())
//						uiElement.prepend($("<span>").text(initialUiElement[0].innerText.trim() + "#" + $("#modal_codeChamp").val()));
					}
					$("#addUiElement .app-modal-content :input").each(function () {
						var $this = $(this),
							keyOption = $this.attr("data-optionName");
						if (optionsFinal.hasOwnProperty(keyOption)) {
							if ($this.is(":checkbox") || $this.is(":radio")) {
								optionsFinal[keyOption].val = $this.is(":checked");
							} else {
								optionsFinal[keyOption].val = $this.val();
							}
						}
					});
					uiElement.data("uielement", uiData);
					uiElement.data("datagen", optionsFinal);
					if ($.isFunction(callback)) {
						callback();
					}
					supprimerPageLineVides();
					return true;
				} else {
					return false;
				}
			}, function () {
				if ($.isFunction(callback)) {
					callback();
				}
				supprimerPageLineVides();
				return true;
			});
		}
	}

	function dropUiElement(uiElement, initialUiElement, callback) {
		// affichage des options relatives à l'élément
		createModaleForUiElement($(uiElement), $(initialUiElement), callback);
		/*var uiElementData = $(initialUiElement).data("uielement"),
			$uiElement = $(uiElement);
		if (uiElement != null) {
			var $content = $("<div>"),
				$contentLeft = $("<div>").addClass("col-md-5 col-md-offset-1"),
				$contentRight = $("<div>").addClass("col-md-5"),
				options = uiElementData.options,
				option = null,
				optionsDefault = getOptionsParType(uiElementData.type),
				optionsFinal = optionsDefault,
				generatedFormGroup = null;

			if (options != null) {

				// on créé la liste finale des options à partir de la liste des options de type et la liste des options spécifiques
				for (option in options) {
					if (options.hasOwnProperty(option)) {
						optionsFinal[option] = options[option];
					}
				}

				// on génère chaque élément de formulaire sur la base de la liste finale des options
				option = null;
				for (option in optionsFinal) {
					if (optionsFinal.hasOwnProperty(option)) {
						generatedFormGroup = app.core.modal.generateFormGroup(option, optionsFinal[option]);
						if (optionsFinal[option].type == "boolean") {
							generatedFormGroup.appendTo($contentRight);
						} else {
							generatedFormGroup.appendTo($contentLeft);
						}
					}
				}
			}

			$contentLeft.appendTo($content);
			$contentRight.appendTo($content);

			app.core.modal.drawModal("addUiElement", "Paramétres de l'élément", $content, function () {
				var validationModal = app.core.validation.valideForm($("#addUiElement"));
				if (validationModal) {
					$uiElement.prepend($("<span>").text(initialUiElement.innerText.trim() + "#" + $("#modal_codeChamp").val()));

					$("#addUiElement .app-modal-content :input").each(function () {
						var $this = $(this),
							keyOption = $this.attr("data-optionName");
						if (optionsFinal.hasOwnProperty(keyOption)) {
							if ($this.is(":checkbox") || $this.is(":radio")) {
								optionsFinal[keyOption].val = $this.is(":checked");
							} else {
								optionsFinal[keyOption].val = $this.val();
							}
						}
					});

					$uiElement.data("uielement", uiElementData);
					$uiElement.data("datagen", optionsFinal);

					if ($.isFunction(callback)) {
						callback();
					}
					$(".page-line:empty").remove();
					return true;
				} else {
					return false;
				}
			}, function () {
				if ($.isFunction(callback)) {
					callback();
				}
				$(".page-line:empty").remove();
				return true;
			});
		}*/
	}

	function convertPageLine($tag) {
		if ($tag != null) {
			$tag.addClass(PAGE_LINE_CLASSNAME).removeClass(DROPBAG_CLASSNAME + " dragover");
			$tag.attr({
				"tabindex": 1
			});
			$("<span>").addClass("uiElement-content").appendTo($tag);
			$("<button>").addClass("btn btn-default glyphicon glyphicon-remove btn-delete pull-right").attr({
				"type": "button",
				"title": "Supprimer"
			}).appendTo($tag);
			$("<button>").addClass("btn btn-default glyphicon glyphicon-edit btn-edit pull-right").attr({
				"type": "button",
				"title": "Modifier"
			}).appendTo($tag);
		}
	}

	// L'objet Page
	window.app.page = new Page();

	// Méthodes relatives à la page Atelier
	window.app.atelier = {
		// indique si la page Atelier a déjà été initialisée
		isInitialisated: false,

		// contient l'UIElement dragNdroppé
		draggedUIElement: null,

		/**
		 * Méthode d'initialisation de la page Atelier
		 */
		init: function () {
			if (!app.atelier.isInitialisated) {

				initialiserListeUIElements(function () {
					$("body").on("dragstart", "[draggable=true]", function (event) {
						app.atelier.draggedUIElement = event.target;
					}).on("dragover", "." + ATELIER_PAGE_CLASSNAME + " ." + DROPBAG_CLASSNAME, function (event) {
						event.preventDefault();
					}).on("dragenter", "." + ATELIER_PAGE_CLASSNAME, function (event) {
						event.preventDefault();
						if (!$("." + ATELIER_PAGE_CLASSNAME + " ." + DROPBAG_CLASSNAME).size()) {
							var ligne = $("<div>").addClass(DROPBAG_CLASSNAME);
							if ($("." + ATELIER_PAGE_CLASSNAME + " ." + PAGE_LINE_CLASSNAME).size()) {
								$("." + ATELIER_PAGE_CLASSNAME + " ." + PAGE_LINE_CLASSNAME).each(function () {
									var ligneCloneBefore = ligne.clone(),
										ligneCloneAfter = null;
									$(this).before(ligneCloneBefore);
									if ($(this).is("." + ATELIER_PAGE_CLASSNAME + " ." + PAGE_LINE_CLASSNAME + ":last-child")) {
										ligneCloneAfter = ligne.clone();
										$(this).after(ligneCloneAfter);
									}
								});
							} else {
								ligne.appendTo("." + ATELIER_PAGE_CLASSNAME);
							}
						}
					}).on("dragenter", "." + ATELIER_PAGE_CLASSNAME, function (event) {
						event.preventDefault();
					}).on("dragenter", "." + DROPBAG_CLASSNAME, function (event) {
						event.preventDefault();
						$(this).addClass("dragover");
					}).on("dragleave", "." + DROPBAG_CLASSNAME, function (event) {
						event.preventDefault();
						$(this).removeClass("dragover");
					}).on("drop", "." + DROPBAG_CLASSNAME, function (event) {
						event.preventDefault();
						var $this = $(this);
						$this.addClass(PAGE_LINE_CLASSNAME).removeClass(DROPBAG_CLASSNAME + " dragover");

						convertPageLine($this);

						$("." + ATELIER_PAGE_CLASSNAME + " ." + DROPBAG_CLASSNAME).remove();
						dropUiElement($(this), app.atelier.draggedUIElement, function () {
//							app.atelier.draggedUIElement = null;
						});
					}).on("dragleave", "." + ATELIER_PAGE_CLASSNAME, function (event) {
						event.preventDefault();
					}).on("dragend", "[draggable=true]", function (event) {
//						app.atelier.draggedUIElement = null;
						$("." + ATELIER_PAGE_CLASSNAME + " ." + DROPBAG_CLASSNAME).remove();
					});
					app.atelier.init = true;
				});

				$("body").on("click", ".btn-delete", function () {
					$(this).parents(".page-line").remove();
				}).on("click", ".btn-edit", function () {
					createModaleForUiElement($(this).parents(".page-line:first"), null, null);
				});
			}
		}
	};

	/**
	 * Initialisation gobale de l'application
	 */
	app.core.appLaunch = function () {
		app.core.validation.init();
		app.page.drawModal();
	};

	app.core.appLaunch();

}(jQuery));
