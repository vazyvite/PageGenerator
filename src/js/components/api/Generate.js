/*jslint eqeq: true, plusplus: true*/
/*globals jQuery, app, require*/
(function ($) {
	"use strict";

	var file_template = "./js/data/template.html",
		ID_CONTENT_PAGE = "content-page",
		listeID = [],
		listeProperties = [];

	/**
	 * Détermine l'identifiant d'un élément et le stock dans listeID.
	 * @author JJACQUES
	 * @param   {string} prefix  le préfix de l'identifiant
	 * @param   {object}   options les options de l'élément
	 * @returns {string} l'identifiant généré
	 */
	function determinerIdElement(prefix, options) {
		var id = prefix + "_" + options.attributJava.val;
		listeID.push(id);
		return id;
	}

	/**
	 * Génère une clé de properties et la stocke dans listeProperties.
	 * @author JJACQUES
	 * @param   {object}   options les options de l'élément
	 * @param   {string} type    le type de clé à générer
	 * @returns {string} la clé de properties
	 */
	function generateCleProperties(options, type) {
		var prefixDemarche = app.page.prefixDemarche,
			prefixPage = app.page.prefixPage,
			prefixChamp = options.codeChamp.val,
			types = {
				"error-empty": "empty",
				"error-format": "format",
				"label": "text",
				"help-btn": "title",
				"help-content": "info"
			},
			suffix = null,
			cle = null;
		suffix = (types.hasOwnProperty(type)) ? types[type] : type;
		cle = prefixDemarche + "." + prefixPage + "." + prefixChamp + "." + suffix;
		listeProperties.push(cle);
		return cle;
	}

	/**
	 * Génère le tag visuel de champ requis.
	 * @author JJACQUES
	 * @returns {object} le tag visuel requis
	 */
	function generateRequiredTag() {
		return $("<span>").addClass("symbol-required").text("*");
	}

	/**
	 * Génère le tag du texte du label.
	 * @author JJACQUES
	 * @param   {object} options les options de l'élément
	 * @returns {object} le tag du texte du label
	 */
	function generateTexteLabel(options) {
		return $("<span>").attr({
			"th:utext": "#{" + generateCleProperties(options, "label") + "}"
		});
	}

	/**
	 * Génère le bouton de l'infobulle
	 * @author JJACQUES
	 * @param   {object} options     les options de l'élément
	 * @param   {string} idBtn       l'id du bouton de l'infobulle
	 * @param   {string} idInfobulle l'id du contenu de l'infobulle
	 * @returns {object} le bouton de l'infobulle
	 */
	function generateBtnInfobulle(options, idBtn, idInfobulle) {
		var cleProperties = generateCleProperties(options, "help-btn"),
			$btnInfobulle = $("<button>").addClass("btn btn-help collapsed").attr({
				"type": "button",
				"data-toggle": "collapse",
				"id": idBtn,
				"data-target": "#" + idInfobulle,
				"th:title": "#{" + cleProperties + "}"
			});

		// génération de l'icone du bouton d'aide
		$("<span>").addClass("icon icon-help").attr({
			"aria-hidden": "true"
		}).appendTo($btnInfobulle);

		// génération du texte sr-only
		$("<span>").addClass("sr-only").attr({
			"th:utext": "#{" + cleProperties + "}"
		}).appendTo($btnInfobulle);

		return $btnInfobulle;
	}

	/**
	 * Génère le contenu de l'infobulle.
	 * @author JJACQUES
	 * @param   {object} options     les options de l'élément
	 * @param   {string} idBtn       l'id du bouton de l'infobulle
	 * @param   {string} idInfobulle l'id du texte de l'infobulle
	 * @returns {object} le contenu de l'infobulle
	 */
	function generateContentInfobulle(options, idBtn, idInfobulle) {
		var $infobulle = $("<span>").addClass("help-panel collapse").attr({
			"id": idInfobulle
//			"aria-describedby": idBtn
		});

		// génération du texte
		$("<span>").attr({
			"th:text": generateCleProperties(options, "help-content")
		}).appendTo($infobulle);

		return $infobulle;
	}

	/**
	 * Génère un tag d'erreur associé à un libellé.
	 * @author JJACQUES
	 * @param {object} options les options de l'élément
	 * @return {object} le tag d'erreur
	 */
	function genererErrorTag(options) {
		return $("<span>").addClass("text-danger").attr({
			"th:attr": "'data-error-required': #{" + generateCleProperties(options, "error-empty") + "}, 'data-error-format': #{" + generateCleProperties(options, "error-format") + "}",
			"role": "alert"
		});
	}

	/**
	 * Génère un label.
	 * @author JJACQUES
	 * @param   {string} idInput l'id de l'input
	 * @param   {object}   options les options de l'élément
	 * @returns {object} le label
	 */
	function genererLabel(idInput, options) {
		var $label = $("<label>").addClass("control-label").attr({
			"for": idInput,
			"id": determinerIdElement("lbl", options)
		});

		// on vérifie si le champ est obligatoire
		if (options.required && options.required.val) {
			generateRequiredTag().appendTo($label);
		}

		// on positionne le libellé
		generateTexteLabel(options).appendTo($label);

		// on vérifie si le champ a une infobulle
		if (options.hasInfobulle && options.hasInfobulle.val) {
			var idBtnInfobulle = determinerIdElement("btnHelp", options),
				idContentInfobulle = determinerIdElement("help", options);
			generateBtnInfobulle(options, idBtnInfobulle, idContentInfobulle).appendTo($label);
			generateContentInfobulle(options, idBtnInfobulle, idContentInfobulle).appendTo($label);
		}

		// on génère la balise des messages d'erreur
		genererErrorTag(options).appendTo($label);

		return $label;
	}

	/**
	 * Génère l'input container
	 * @author JJACQUES
	 * @returns {object} l'input container
	 */
	function genererInputContainer() {
		return $("<div>").addClass("col-md-6");
	}

	/**
	 * Génère un champ de saisie simple.
	 * @author JJACQUES
	 * @param   {string} idInput l'id du champ de saisie
	 * @param   {object}   options les options de saisie
	 * @returns {object} le champ de saisie
	 */
	function genererChampInput(idInput, options) {
		var $input = $("<input>").addClass("form-control").attr({
			"type": "text",
			"aria-invalid": "false",
			"id": idInput,
			"th:field": "${" + options.attributJava.val + "}"
		});

		// on détermine la longueur maximale du champ de saisie
		if (options.maxlength && options.maxlength.val) {
			$input.attr("maxlength", options.maxlength.val);
		}

		// on détermine si le champ est requis
		if (options.required && options.required.val) {
			$input.attr("required", "required");
		}

		return $input;
	}

	function genererSelect(options) {

	}

	function genererChampTexte(options) {

	}

	function genererInput(idInput, element, options) {
		var $inputContainer = null;

		if (element.name == "INPUT" || element.name == "SELECT" || element.name == "TEXTE") {
			$inputContainer = genererInputContainer();
			if (element.name == "INPUT") {
				genererChampInput(idInput, options);
			} else if (element.name == "SELECT") {
				genererSelect(idInput, options);
			} else if (element.name == "TEXTE") {
				genererChampTexte(idInput, options);
			}
			return $inputContainer;
		} else if (element.name == "CHECK") {

		} else if (element.name == "RADIO") {

		} else if (element.name == "TEXTAREA") {

		}
	}

	function initialiserFormElement(element, options) {
		var $element = $("<div>").addClass("form-group"),
			idInput = determinerIdElement("input", options),
			$label = genererLabel(idInput, options),
			$input = genererInput(idInput, element, options);

		$label.appendTo($element);
		$input.appendTo($element);


		return $element;
	}

	/**
	 * Initialise la génération.
	 * @author JJACQUES
	 */
	function initialiserGeneration() {
		listeID = [];
		listeProperties = [];
	}

	/**
	 * Génère le contenu à partir des données de l'atelier.
	 * @author JJACQUES
	 * @param {object} $atelier les objets issus de l'atelier
	 */
	function generateFromAtelier($atelier) {
		var $htmlGenere = $("<div>");
		if ($atelier != null) {
			initialiserGeneration();
			$atelier.each(function () {
				var option = null,
					$uiElement = $(this),
					typeElement = $uiElement.data("uielement"),
					options = $uiElement.data("datagen"),
					$element = null;

				if ($uiElement != null && options != null && typeElement != null) {
					if (typeElement.type == "form") {
						// si l'élément est de type form
						for (option in options) {
							if (options.hasOwnProperty(option)) {
								$element = initialiserFormElement(typeElement, options);
							}
						}
					} else if (typeElement.type == "text") {
						// si l'élément est de type texte
						alert("TODO");
					}
					$htmlGenere.append($element);
				}
			});
		}

		$(".html-page").text($htmlGenere[0].outerHTML);
	}

	/**
	 * Replace le contenu du template par le contenu de la page.
	 * @author JJACQUES
	 * @param   {string} template le template initiale
	 * @returns {string} le template initialisé
	 */
	function replaceContent(template) {
		var regExp = new RegExp("{{content}}", "gi"),
			$atelier = app.api.atelier.getContenuAtelier();

		if ($atelier != null) {
			generateFromAtelier($atelier);
		}

		return template.replace(regExp, $atelier);
	}

	/**
	 * Initialise le template.
	 * @author JJACQUES
	 * @param   {string} templateData le template brute
	 * @returns {string} le template initialisé
	 */
	function initialiserTemplate(templateData) {
		var pageModel = app.page,
			attribut = null,
			regExp = null,
			template = templateData,
			$template = null;
		if (pageModel != null) {
			for (attribut in pageModel) {
				if (pageModel.hasOwnProperty(attribut)) {
					regExp = new RegExp("{{" + attribut + "}}", "gi");
					template = template.replace(regExp, pageModel[attribut]);
				}
			}
		}
		template = replaceContent(template);
		return template;
	}

	app.api.generate = {
		init: function () {
			$("#btnGenerate").on("click", function () {
				var templatePage = require("fs").readFile(file_template, "utf8", function (err, dataHtml) {
					var template = null;
					if (err) {
						throw err;
					}
					if (dataHtml != null) {
						template = initialiserTemplate(dataHtml);
					}
				});
			});
		}
	};
}(jQuery));