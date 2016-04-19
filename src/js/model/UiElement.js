function UIElement(name, type, shortDesc, pattern) {
	"use strict";
	var that = this;

	// le nom de l'UIElement
	that.name = name || "";
	// le type d'UIElement
	that.type = type || "";
	// Une description courte affichée dans la barre de menu
	that.shortDesc = shortDesc || "";
	// Le pattern HTML porté par l'élément
	that.pattern = pattern || "";
}
