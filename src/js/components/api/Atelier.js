/*jslint eqeq: true, plusplus: true*/
/*globals app, jQuery, require*/
(function ($) {
	"use strict";

	var DROPBAG_CLASSNAME = "dropbag",
		ATELIER_PAGE_CLASSNAME = "atelier-page",
		PAGE_LINE_CLASSNAME = "page-line",
		file_uiElements = './js/data/UiElements.json',
		file_optionsUiElements = "./js/data/optionsByUiElements.json",
		optionsByUiElements = {};

	/**
	 * Récupère les options par défaut d'un type de uiElement.
	 * @author JJACQUES
	 * @param   {string} typeElement le type d'uiElement
	 * @returns {object} les options par défaut du type d'uiElement
	 */
	function getOptionsParType(typeElement) {
		var mapTypeOption = {
				"form": ["required", "disabled", "hasInfobulle", "codeChamp", "format", "attributJava"],
				"text": ["codeChamp", "attributJavaText"]
			},
			options = {},
			i = 0;
		if (mapTypeOption.hasOwnProperty(typeElement)) {
			for (i; i < mapTypeOption[typeElement].length; i++) {
				options[mapTypeOption[typeElement][i]] = optionsByUiElements[mapTypeOption[typeElement][i]];
			}
		}
		return options;
	}

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
		require("fs").readFile(file_uiElements, "utf8", function (err, listeData) {
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

	/**
	 * Initialise les options UiElements en récupérant les données depuis le JSON
	 * @author JJACQUES
	 * @callback callback
	 */
	function initialiserOptionsUiElements(callback) {
		require("fs").readFile(file_optionsUiElements, "utf8", function (err, listeOptions) {
			if (err) {
				throw err;
			}
			var optionsString = JSON.parse(listeOptions);
			if (optionsString != null) {
				optionsByUiElements = optionsString.map;
			}
			callback();
		});
	}

	/**
	 * Créé un élément Pageline
	 * @author JJACQUES
	 * @param {object} $tag l'objet déposé à convertir en pageline
	 */
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

	/**
	 * Supprime toutes les pageslines vides
	 * @author JJACQUES
	 */
	function supprimerPageLineVides() {
		$("." + PAGE_LINE_CLASSNAME + " .uiElement-content:empty").parents("." + PAGE_LINE_CLASSNAME + ":first").remove();
	}

	/**
	 * Effectue un appel de création de modale pour une création / modification d'uiElement
	 * @author JJACQUES
	 * @param   {object} uiElement        l'uiElement à modifier / créer
	 * @param   {object} initialUiElement l'uiElement initial (lors de la création)
	 * @callback callback
	 */
	function createModaleForUiElement(uiElement, initialUiElement, callback) {
		var option = null,
			uiData = (initialUiElement != null) ? initialUiElement.data("uielement") : uiElement.data("uielement"),
			options = (initialUiElement != null && initialUiElement.data("uielement") != null) ? initialUiElement.data("uielement").options : uiElement.data("datagen"),
			optionsDefault = jQuery.extend(true, {}, getOptionsParType(uiData.type)),
			optionsFinal = optionsDefault,
			content = null,
			titreModal = (initialUiElement != null) ? "Ajouter un élément" : "Modifier un élément";
		if (options != null) {
			// on créé la liste finale des options à partir de la liste des options de type et la liste des options spécifiques
			for (option in options) {
				if (options.hasOwnProperty(option)) {
					optionsFinal[option] = options[option];
				}
			}
			// on génère chaque élément de formulaire sur la base de la liste finale des options
			content = {
				className: "",
				listFormGroups: []
			};

			option = null;
			for (option in optionsFinal) {
				if (optionsFinal.hasOwnProperty(option)) {
					content.listFormGroups.push({
						key: option,
						option: optionsFinal[option],
						valeurDefault: optionsFinal[option].val
					});
				}
			}
			app.core.modal.drawModal("addUiElement", titreModal, content, true, function () {
				var validationModal = app.core.validation.valideForm($("#addUiElement"));
				if (validationModal) {
					if (initialUiElement != null) {
						uiElement.find(".uiElement-content").text(initialUiElement[0].innerText.trim() + "#" + $("#modal_codeChamp").val());
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

	/**
	 * Evènement joué lors du dépot d'un uiElement sur la page
	 * @author JJACQUES
	 * @param {object} uiElement        l'uiElement créé
	 * @param {object} initialUiElement l'uiElement source
	 * @callback callback
	 */
	function dropUiElement(uiElement, initialUiElement, callback) {
		// affichage des options relatives à l'élément
		createModaleForUiElement($(uiElement), $(initialUiElement), callback);
	}

	app.api.atelier = {
		// indique si la page Atelier a déjà été initialisée
		isInitialisated: false,

		// contient l'UIElement dragNdroppé
		draggedUIElement: null,

		/**
		 * Méthode d'initialisation de la page Atelier
		 */
		init: function () {
			if (!app.api.atelier.isInitialisated) {
				initialiserListeUIElements(function () {
					initialiserOptionsUiElements(function () {
						$("body").on("dragstart", "[draggable=true]", function (event) {
							app.api.atelier.draggedUIElement = event.target;
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
							dropUiElement($(this), app.api.atelier.draggedUIElement, null);
						}).on("dragleave", "." + ATELIER_PAGE_CLASSNAME, function (event) {
							event.preventDefault();
						}).on("dragend", "[draggable=true]", function (event) {
							$("." + ATELIER_PAGE_CLASSNAME + " ." + DROPBAG_CLASSNAME).remove();
						});
						app.api.atelier.init = true;
					});
				});

				$("body").on("click", ".btn-delete", function () {
					$(this).parents("." + PAGE_LINE_CLASSNAME).remove();
				}).on("click", ".btn-edit", function () {
					createModaleForUiElement($(this).parents("." + PAGE_LINE_CLASSNAME + ":first"), null, null);
				});
			}
		},

		/**
		 * Retourne le contenu de l'atelier.
		 * @author JJACQUES
		 * @returns {object} le contenu de l'atelier sous forme d'objet jQuery
		 */
		getContenuAtelier: function () {
			return $("." + ATELIER_PAGE_CLASSNAME).find("." + PAGE_LINE_CLASSNAME);
		}
	};
}(jQuery));