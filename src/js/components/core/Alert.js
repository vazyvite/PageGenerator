/*jslint eqeq: true, plusplus: true*/
/*globals app, jQuery*/
(function ($) {
	"use strict";

	var _timer = null,
		$_alert = null;

	function createAlert(type, message) {
		$_alert = $("<div>").addClass("alert alert-" + type).text(message);
		$_alert.appendTo($("body"));
		setTimer();
	}

	function setTimer() {
		_timer = setTimeout(removeAlert, 2000);
	}

	function removeAlert() {
		$_alert.remove();
	}

	app.core.alert = {
		create: createAlert
	};
}(jQuery));