/*jslint eqeq: true, plusplus: true*/
/*globals app, jQuery, require, console*/
(function ($) {
	"use strict";

	/**
	 * Génère un UID
	 * @author JJACQUES
	 * @returns {string} l'UID
	 */
	function generateUID() {
		return (Math.random() < 0.5 ? '-' : '') + Math.round(Math.pow(10, 17) * Math.random()) + 'L';
	}

	function generateAttribut(option) {
		var attribut = "";
		if (option.attributJava != null && option.attributJava.val != "") {
			attribut += "\t/**\n";
			attribut += "\t * champ " + option.attributJava.val + ".\n";
			attribut += "\t */\n";
			attribut += '\t@ProprieteTeledossier(name = "info-' + option.attributJava.val + ')\n';
			if (option.required != null && option.required.val) {
				attribut += '\t@NotBlank(message = "' + app.page.prefixDemarche + '.' + app.page.prefixPage + '.' + option.attributJava.val + '.empty")\n';
			}
			attribut += "\tprivate String " + option.attributJava.val + ";\n\n";
		}
		return attribut;
	}

	function generateJavaCode() {
		var code = "",
			$atelier = app.api.atelier.getContenuAtelier();
		$atelier.each(function () {
			var $uiElement = $(this),
				typeElement = $uiElement.data("uielement"),
				options = $uiElement.data("datagen"),
				$element = null;

			if ($uiElement != null && options != null && typeElement != null) {
				code += generateAttribut(options);
			}
		});
		return code;
	}

	function generateJava(callback) {
		require("fs").readFile("./js/data/template-java.txt", "utf8", function (err, dataJava) {
			if (err) {
				throw err;
			}
			if (dataJava != null) {
				try {
					var template = dataJava,
						regExp = null,
						regExpCapitalize = null,
						attribut = null;
					if (app.page != null) {
						for (attribut in app.page) {
							if (app.page.hasOwnProperty(attribut)) {
								regExp = new RegExp("{{" + attribut + "}}", "gi");
								template = template.replace(regExp, app.page[attribut]);
								if (app.page[attribut] != null && !$.isFunction(app.page[attribut])) {
									regExpCapitalize = new RegExp("{\\[" + attribut + "\\]}", "gi");
									template = template.replace(regExpCapitalize, app.page[attribut].substr(0, 1).toUpperCase() + app.page[attribut].substr(1));
								}
							}
						}
						template = template.replace("{{UID}}", generateUID());
						template = template.replace("{{attributs}}", generateJavaCode());
					}

					if ($.isFunction(callback)) {
						callback(template);
					}
				} catch (e) {
					console.error(e);
				}
			}
		});
	}

	app.api.java = {
		init: function () {

		},

		generateJava: generateJava
	};
}(jQuery));