/*jslint eqeq: true, plusplus: true*/
/*globals jQuery, app, require, console*/
(function ($) {
	"use strict";

	var file_template = "./js/data/template.html",
		ID_CONTENT_PAGE = "content-page",
		listeID = [];
//		listeProperties = [];

	/**
	 * Génère un saut de ligne.
	 * @author JJACQUES
	 * @param   {object} $container le container dans lequel sera inséré le saut de ligne
	 * @returns {object} le saut de ligne
	 */
	function breakLine($container) {
		return $("<!--{{n}}-->").appendTo($container);
	}

	/**
	 * Retourne un commentaire précédé d'un saut de ligne.
	 * @author JJACQUES
	 * @param   {string} texte le texte du commentaire
	 * @param   {object} $container le container dans lequel sera inséré le commentaire
	 * @returns {object} le commentaire
	 */
	function commentaire(texte, $container) {
		breakLine($container);
		$("<!-- " + texte + " --><!--{{n}}-->").appendTo($container);
	}

	/**
	 * Retourne un commentaire HTML.
	 * @author JJACQUES
	 * @param   {string} texte le texte du TODO
	 * @returns {string} le commentaire TODO
	 */
	function todo(texte) {
		return $("<!-- TODO " + app.page.user + " : " + texte + " --><!--{{n}}-->");
	}

	/**
	 * Détermine l'identifiant d'un élément et le stock dans listeID.
	 * @author JJACQUES
	 * @param   {string} prefix  le préfix de l'identifiant
	 * @param   {object}   options les options de l'élément
	 * @returns {string} l'identifiant généré
	 */
	function determinerIdElement(prefix, options) {
		var idBase = (options != null && options.attributJava != null) ? options.attributJava.val : new Date().getTime(),
			id = prefix + "_" + idBase;
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
				"help-content": "info",
				"text": "text"
			},
			suffix = null,
			cle = null,
			value = "";
		suffix = (types.hasOwnProperty(type)) ? types[type] : type;
		cle = prefixDemarche + "." + prefixPage + "." + prefixChamp + "." + suffix;
//		listeProperties.push({key: cle, value: ""});
		app.api.properties.addProperties(cle, value);
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
			"th:text": "#{" + generateCleProperties(options, "help-content") + "}"
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
	function genererLabel(idInput, idLabel, element, options) {
		var $label = null,
			idBtnInfobulle = null,
			idContentInfobulle = null;

		if (element.name == "CHECK" || element.name == "RADIO") {
			$label = $("<div>").addClass("control-label col-md-12").attr({
				"id": idLabel
			});
		} else {
			$label = $("<label>").addClass("control-label").attr({
				"for": idInput,
				"id": idLabel
			});
		}

		breakLine($label);
		// on vérifie si le champ est obligatoire
		if (options.required && options.required.val) {
			commentaire("L'indicateur de champ obligatoire.", $label);
			generateRequiredTag().appendTo($label);
			breakLine($label);
		}

		// on positionne le libellé
		commentaire("Le texte du label.", $label);
		generateTexteLabel(options).appendTo($label);
		breakLine($label);

		// on vérifie si le champ a une infobulle
		if (options.hasInfobulle && options.hasInfobulle.val) {
			idBtnInfobulle = determinerIdElement("btnHelp", options);
			idContentInfobulle = determinerIdElement("help", options);
			commentaire("Le bouton de l'infobulle", $label);
			generateBtnInfobulle(options, idBtnInfobulle, idContentInfobulle).appendTo($label);
			breakLine($label);
			commentaire("Le contenu de l'infobulle", $label);
			generateContentInfobulle(options, idBtnInfobulle, idContentInfobulle).appendTo($label);
			breakLine($label);
		}

		// on génère la balise des messages d'erreur
		commentaire("La balise des messages d'erreurs", $label);
		genererErrorTag(options).appendTo($label);
		breakLine($label);

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
	 * Génère un radio container permettant d'y insérer des radios boutons ou des checkbox
	 * @author JJACQUES
	 * @param   {string} type indique le type de container à créer (RADIO | CHECK)
	 * @returns {object} le container
	 */
	function genererRadioContainer(type) {
		var stringType = "";
		if (type == "RADIO") {
			stringType = "radio";
		} else if (type == "CHECK") {
			stringType = "checkbox";
		}
		return $("<div>").addClass(stringType).attr({
			"role": "presentation"
		});
	}

	/**
	 * Rend un champ requis.
	 * @author JJACQUES
	 * @param {object} $field le champ de saisie
	 */
	function makeFieldRequired($field) {
		$field.attr("required", "required");
	}

	/**
	 * Rend un champ désactivé.
	 * @author JJACQUES
	 * @param {object} $field le champ de saisie
	 */
	function makeFieldDisabled($field) {
		$field.attr("disabled", "disabled");
	}

	/**
	 * Rend un champ avec une limite de saisie
	 * @author JJACQUES
	 * @param {object} $field le champ de saisie
	 * @param {number} max    la limite de caractères autorisée
	 */
	function makeFieldMaxLength($field, max) {
		$field.attr("maxlength", max);
	}

	/**
	 * Rend un champ avec un format de saisie.
	 * @author JJACQUES
	 * @param {object} $field le champ de saisie
	 * @param {string} format le format de saisie
	 */
	function makeFieldFormated($field, format) {
		$field.attr("data-format", format);
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
			makeFieldMaxLength($input, options.maxlength.val);
		}

		// on détermine si le champ est requis
		if (options.required && options.required.val) {
			makeFieldRequired($input);
		}

		// on détermine si le champ est désactivé
		if (options.disabled && options.disabled.val) {
			makeFieldDisabled($input);
		}

		// on détermine le format du champ
		if (options.format && options.format.val != "") {
			makeFieldFormated($input, options.format.val);
		}

		return $input;
	}

	/**
	 * Génère un select.
	 * @author JJACQUES
	 * @param   {string} idInput l'id du champ de saisie
	 * @param   {object}   options les options de l'élément
	 * @returns {object} le select
	 */
	function genererSelect(idInput, options) {
		var $select = $("<select>").addClass("form-control").attr({
			"aria-invalid": "false",
			"id": idInput,
			"th:field": "${" + options.attributJava.val + "}"
		});

		if (options.listeOptions && options.listeOptions.val) {
			$("<option>").attr({
				"th:each": "val : ${" + options.listeOptions.val + "}",
				"th:value": "${val.key}",
				"th:text": "${val.value}"
			}).appendTo($select);
		}

		// on détermine si le champ est requis
		if (options.required && options.required.val) {
			makeFieldRequired($select);
		}

		// on détermine si le champ est désactivé
		if (options.disabled && options.disabled.val) {
			makeFieldDisabled($select);
		}

		return $select;
	}

	/**
	 * Génère un champ texte static mappé sur un attribut Java.
	 * @author JJACQUES
	 * @param   {string} idInput l'id de l'input
	 * @param   {object}   options les options de l'élément
	 * @returns {object} le champ static
	 */
	function genererChampTexte(idInput, options) {
		var $staticField = $("<p>").addClass("form-control-static").attr({
			"id": idInput
		});

		if (options != null && options.attributJavaText != null && options.attributJavaText.val != "") {
			$staticField.attr("th:text", "${" + options.attributJavaText.val + "}");
		}
		return $staticField;
	}

	/**
	 * Génère une checkbox
	 * @author JJACQUES
	 * @param   {string} idValue l'id de la checkbox
	 * @param   {string} idLabel l'id du label
	 * @param   {object}   options les options de l'élément
	 * @param   {number} index   l'index du champ dans la liste des checkbox
	 * @returns {object} la checkbox
	 */
	function genererCheckbox(idValue, idLabel, options, index) {
		var $label = $("<label>").attr({
			"for": idValue
		}),
			$input = null;
		breakLine($label);
		$input = $("<input>").addClass("").attr({
			"type": "checkbox",
			"th:field": "${" + options.attributJava.val + "}",
			"th:value": "#{" + generateCleProperties(options, "valeur" + index + ".val") + "}",
			"aria-describedby": idLabel,
			"aria-invalid": "false",
			"id": idValue
		}).appendTo($label);
		breakLine($label);

		$("<span>").attr({
			"th:text": "#{" + generateCleProperties(options, "valeur" + index + ".text") + "}"
		}).appendTo($label);
		breakLine($label);

		// On vérifie si le champ est obligatoire
		if (options.required != null && options.required.val) {
			makeFieldRequired($input);
		}

		// On vérifie si le champ est désactivé
		if (options.disabled != null && options.disabled.val) {
			makeFieldDisabled($input);
		}

		return $label;
	}

	/**
	 * Génère un champ radio bouton
	 * @author JJACQUES
	 * @param   {string} idValue l'id du champ de saisie
	 * @param   {string} idLabel l'id du label
	 * @param   {object}   options les options de l'élément
	 * @param   {number} index   l'index du radio bouton dans la liste des radios boutons
	 * @returns {object} le radio bouton
	 */
	function genererRadio(idValue, idLabel, options, index) {
		var $label = $("<label>").attr({
			"for": idValue
		}),
			$input = null;
		breakLine($label);
		$input = $("<input>").addClass("").attr({
			"type": "radio",
			"th:field": "${" + options.attributJava.val + "}",
			"value": "valeur" + index,
			"aria-describedby": idLabel,
			"aria-invalid": "false",
			"id": idValue
		}).appendTo($label);
		breakLine($label);
		$("<span>").attr({
			"th:text": "#{" + generateCleProperties(options, "valeur" + index) + "}"
		}).appendTo($label);
		breakLine($label);

		// On vérifie si le champ est obligatoire
		if (options.required != null && options.required.val) {
			makeFieldRequired($input);
		}

		// On vérifie si le champ est désactivé
		if (options.disabled != null && options.disabled.val) {
			makeFieldDisabled($input);
		}

		return $label;
	}

	/**
	 * Génére un textarea.
	 * @author JJACQUES
	 * @param {string} idInput l'id du champ de saisie
	 * @param {object}   options les options de l'élément
	 * @return {object} le textarea
	 */
	function generateTextarea(idInput, options) {
		var $textarea = $("<textarea>").addClass("form-control").attr({
			"aria-invalid": "false",
			"id": idInput,
			"th:field": "${" + options.attributJava.val + "}"
		});

		// Déterminer si le champ de saisie à une limite de caractères
		if (options.maxLength != null && options.maxLength.val != "") {
			makeFieldMaxLength(options.maxLength.val);
		}

		// Déterminer si le champ de saisie est obligatoire
		if (options.required != null && options.required.val != "") {
			makeFieldRequired(options.required.val);
		}

		// Déterminer si le champ de saisie est désactivé
		if (options.disabled != null && options.disabled.val != "") {
			makeFieldDisabled(options.disabled.val);
		}

		return $textarea;
	}

	/**
	 * Génère un champ de saisie.
	 * @author JJACQUES
	 * @param   {string} idInput l'id de l'input
	 * @param   {object}   element l'élément
	 * @param   {object} options les options de l'élément
	 * @returns {object} l'élément
	 */
	function genererInput(idInput, idLabel, element, options) {
		var $inputContainer = null,
			$inputPres = null,
			i = 0;

		if (element.name == "INPUT" || element.name == "SELECT" || element.name == "TEXTE-STATIC") {
			$inputContainer = genererInputContainer();
			breakLine($inputContainer);
			if (element.name == "INPUT") {
				genererChampInput(idInput, options).appendTo($inputContainer);
				breakLine($inputContainer);
			} else if (element.name == "SELECT") {
				todo("vérifier le mapping sur la liste des éléments de la liste.").appendTo($inputContainer);
				genererSelect(idInput, options).appendTo($inputContainer);
				breakLine($inputContainer);
			} else if (element.name == "TEXTE-STATIC") {
				genererChampTexte(idInput, options).appendTo($inputContainer);
				breakLine($inputContainer);
			}
			return $inputContainer;
		} else if (element.name == "RADIO" || element.name == "CHECK") {
			$inputContainer = $("<div>");
			breakLine($inputContainer);
			if (options.number != null && options.number.val > 0) {
				for (i; i < options.number.val; i++) {
					breakLine($inputContainer);
					$inputPres = genererRadioContainer();
					$inputPres.appendTo($inputContainer);
					breakLine($inputPres);
					if (element.name == "RADIO") {
						commentaire("Réponse " + i, $inputPres);
						genererRadio(determinerIdElement("val" + i, options), idLabel, options, i).appendTo($inputPres);
						breakLine($inputPres);
					} else if (element.name == "CHECK") {
						commentaire("Réponse " + i, $inputPres);
						genererCheckbox(determinerIdElement("val" + i, options), idLabel, options, i).appendTo($inputPres);
						breakLine($inputPres);
					}
				}
			}
			breakLine($inputContainer);
			return $inputContainer;
		} else if (element.name == "TEXTAREA") {
			$inputContainer = $("<div>");
			breakLine($inputContainer);
			generateTextarea(idInput, options).appendTo($inputContainer);
			breakLine($inputContainer);
			return $inputContainer;
		}
	}

	/**
	 * Initialise et génère un form-group.
	 * @author JJACQUES
	 * @param   {object} element les informations sur l'élément à générer
	 * @param   {object} options les options de l'élément
	 * @returns {object} le form-group
	 */
	function initialiserFormElement(element, options) {
		var $element = $("<div>").addClass("form-group row"),
			idInput = determinerIdElement("input", options),
			idLabel = determinerIdElement("lbl", options),
			$label = genererLabel(idInput, idLabel, element, options),
			$input = genererInput(idInput, idLabel, element, options);

		breakLine($element);
		commentaire("le Label", $element);
		$label.appendTo($element);
		breakLine($element);
		commentaire("le champ de saisie", $element);
		$input.appendTo($element);
		breakLine($element);

		return $element;
	}

	/**
	 * Initialise la génération.
	 * @author JJACQUES
	 */
	function initialiserGeneration() {
		listeID = [];
//		listeProperties = [];
	}

	/**
	 * Détermine si une ligne contient une balise ouvrante
	 * @author JJACQUES
	 * @param   {string}   ligne la ligne
	 * @returns {boolean}
	 */
	function hasBaliseOuvrante(ligne) {
		return (ligne.match(/^<[a-z!]/gi)) ? true : false;
	}

	/**
	 * Détermine si une ligne contient une balise fermante
	 * @author JJACQUES
	 * @param   {string}   ligne la ligne
	 * @returns {boolean}
	 */
	function hasBaliseFermante(ligne) {
		return (ligne.match(/(<\/|(\-\->|\/>))/gi)) ? true : false;
	}

	function formatTemplateFromAtelier(template, nbTab) {
		var regExp = new RegExp(/(^.*$)/gim),
			lignes = [],
			i = 0,
			t = 0,
			etatTab = 0,
			subEtatTab = 0;
		lignes = template.match(regExp);
		if (lignes != null) {
			for (i; i < lignes.length; i++) {
				subEtatTab = 0;

				if (lignes[i].indexOf("<input") != -1) {
					lignes[i] = lignes[i].replace(">", "/>");
				}

				if (hasBaliseOuvrante(lignes[i]) && !hasBaliseFermante(lignes[i])) {
					subEtatTab++;
				} else if (hasBaliseFermante(lignes[i]) && !hasBaliseOuvrante(lignes[i])) {
					etatTab--;
				}

				t = 0;
				if (i != 0) {
					while (t < nbTab + etatTab) {
						lignes[i] = "\t" + lignes[i];
						t++;
					}
				}
				etatTab += subEtatTab;
			}
			template = lignes.join("\n");
		}
		return template;
	}

	/**
	 * Génère le contenu à partir des données de l'atelier.
	 * @author JJACQUES
	 * @param {object} $atelier les objets issus de l'atelier
	 */
	function generateFromAtelier($atelier, nbTab) {
		var $htmlGenere = $("<div>"),
			htmlString = "",
			regExp = new RegExp(/<!\-\-\{\{n\}\}\-\->/gi);
		breakLine($htmlGenere);
		if ($atelier != null) {
			initialiserGeneration();
			$atelier.each(function () {
				var option = null,
					$uiElement = $(this),
					typeElement = $uiElement.data("uielement"),
					options = $uiElement.data("datagen"),
					$element = null;

				if ($uiElement != null && options != null && typeElement != null) {
					if (typeElement.type == "form" || typeElement.type == "textform") {
						// si l'élément est de type form ou textform
//						for (option in options) {
//							if (options.hasOwnProperty(option)) {
						$element = initialiserFormElement(typeElement, options);
//							}
//						}
					} else if (typeElement.type == "text") {
						if (typeElement.name == "PARA-GRAPH") {
							$element = $("<p>").attr({
								"th:utext": generateCleProperties(options, "text")
							});
						} else if (typeElement.name == "TITRE") {
							if (options.niveau != null && options.niveau.val != "") {
								$element = $("<h" + options.niveau.val + ">").attr({
									"th:utext": generateCleProperties(options, "text")
								});
							}
						}
					}
					commentaire("Element " + options.codeChamp.val, $htmlGenere);
					$htmlGenere.append($element);
					breakLine($htmlGenere);
				}
			});
		}

		htmlString = $htmlGenere[0].outerHTML.replace(regExp, "\n");
		htmlString = formatTemplateFromAtelier(htmlString, nbTab);
		return htmlString;
	}

	/**
	 * Replace le contenu du template par le contenu de la page.
	 * @author JJACQUES
	 * @param   {string} template le template initiale
	 * @returns {string} le template initialisé
	 */
	function replaceContent(template) {
		var regExp = new RegExp("{{content}}", "gi"),
			$atelier = app.api.atelier.getContenuAtelier(),
			// on recherche le nombre de tabulation il y a devant {{content}}
			lineContent = template.match(/^\t*\{\{content\}\}/gim),
			nbTab = 0;

		if (lineContent != null && lineContent.length) {
			nbTab = lineContent[0].indexOf("{{content}}");
		}

		if ($atelier != null) {
			$atelier = generateFromAtelier($atelier, nbTab);
		}

		return template.replace(regExp, $atelier);
	}

	/**
	 * Initialise le template HTML.
	 * @author JJACQUES
	 * @param   {string} templateData le template brute
	 * @returns {string} le template initialisé
	 */
	function initialiserTemplate(templateData) {
		try {
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
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Initialise le template du view.xml
	 * @author JJACQUES
	 * @param   {string} templateXml le template brute
	 * @returns {string} le template initialisé
	 */
	function initialiserTemplateViewXML(templateXml) {
		try {
			var template = templateXml,
				regExp = null,
				attribut = null;
			if (app.page != null) {
				for (attribut in app.page) {
					if (app.page.hasOwnProperty(attribut)) {
						regExp = new RegExp("{{" + attribut + "}}", "gi");
						template = template.replace(regExp, app.page[attribut]);
					}
				}
			}
			return template;
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Créé une cle de propertie.
	 * @author JJACQUES
	 * @param   {number} index     l'index de la clé
	 * @param   {object}   propertie la clé de propertie
	 * @returns {object} la clé de propertie
	 */
	function creerClePropertie(index, propertie) {
		var $container = $("<div>");
		$("<a>").addClass("cleProperties").attr({
			"title": "Cliquer pour définir le libellé",
			"data-index": index
		}).text(propertie.cle).appendTo($container);
		$("<span>").text(":").appendTo($container);
		$("<span>").addClass("valueProperties").text(propertie.value).appendTo($container);
		return $container;
	}

	/**
	 * Génère les properties.
	 * @author JJACQUES
	 */
	function generateProperties() {
		var i = 0,
			$container = null,
			listeProperties = app.api.properties.getListeProperties(),
			valProperties = null;
		$(".messages-page").children().remove();
		if (listeProperties != null && listeProperties.length) {
			for (i; i < listeProperties.length; i++) {
				creerClePropertie(i, listeProperties[i]).appendTo($(".messages-page"));
				valProperties += listeProperties[i].cle + ":" + listeProperties[i].value + "\n";
			}
			i++;
			$("#copyProperties").val(valProperties);
		}
	}

	/**
	 * Génère le view.xml.
	 * @author JJACQUES
	 */
	function generateViewXml() {
		require("fs").readFile("./js/data/template-viewxml.xml", "utf8", function (err, dataXml) {
			var template = null;
			if (err) {
				throw err;
			}
			if (dataXml != null) {
				template = initialiserTemplateViewXML(dataXml);
				$("#sourceViewXml").text(template);
				$("#copyViewXml").val(template);
			}
		});
	}

	/**
	 * Initialiser la page du demarche-flow.
	 * @author JJACQUES
	 * @param   {string} dataFlow les données du template du flow
	 * @returns {string} le template du flow initialisé
	 */
	function initialiserTemplateFlow(dataFlow) {
		try {
			var template = dataFlow,
				regExp = null,
				regExpCapitalize = null,
				attribut = null;
			if (app.page != null) {
				for (attribut in app.page) {
					if (app.page.hasOwnProperty(attribut)) {
						regExp = new RegExp("{{" + attribut + "}}", "gi");
						template = template.replace(regExp, app.page[attribut]);
						if (app.page[attribut] != null && !$.isFunction(app.page[attribut])) {
							regExpCapitalize = new RegExp("{[" + attribut + "]}", "gi");
							template = template.replace(regExp, app.page[attribut].substr(0, 1).toUpperCase() + app.page[attribut].substr(1));
						}
					}
				}
			}
			return template;
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Génère la page flow.
	 * @author JJACQUES
	 */
	function generateFlow() {
		require("fs").readFile("./js/data/template-flow.xml", "utf8", function (err, dataFlow) {
			var template = null;
			if (err) {
				throw err;
			}
			if (dataFlow != null) {
				template = initialiserTemplateFlow(dataFlow);
				$("#sourceFlow").text(template);
				$("#copyFlow").val(template);
			}
		});
	}

	app.api.generate = {
		/**
		 * Méthode d'initialisation.
		 * @author JJACQUES
		 */
		init: function () {
			$("#btnGenerate").on("click", function () {
				var templatePage = require("fs").readFile(file_template, "utf8", function (err, dataHtml) {
					var template = null;
					if (err) {
						throw err;
					}
					if (dataHtml != null) {
						template = initialiserTemplate(dataHtml);
						$("#sourceHTML").text(template);
						$("#copyHTML").val(template);
						$("#visualiserHTML").html(template);
						$("#htmlFileName").text(app.page.prefixPage + ".html");

						generateViewXml();

						generateProperties();

						generateFlow();
					}
				});
			});
		}
	};
}(jQuery));