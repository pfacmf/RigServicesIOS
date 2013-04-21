// JavaScript Document

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};

// PhoneGap is ready
function onDeviceReady() {
	//getLocation();
	//navigator.splashscreen.hide();
}

function onLoginShow() {
	App.setInitialData(undefined);
	App.setRig(undefined);
	App.setCategory(undefined);
    
	var username = getPersistent('rememberMeUsername');
	var password = getPersistent('rememberMePassword');
	if (username && password) {
		$("#username").val(username);
		$("#password").val(password);
	}
}

var App = (function () { 
	var _app = undefined; 
	var _initialData = undefined;
	var _rig = undefined;
	var _category = undefined;
    
	return { 
		getApp: function () { 
			return _app; 
		}, 
		setApp: function (app) { 
			_app = app; 
			return this; 
		},
		getInitialData: function() {
			return _initialData;
		},
		setInitialData: function(initialData) {
			_initialData = initialData;
		},
		setRig: function(rig) {
			_rig = rig;
		},
		getRig: function() {
			return _rig;
		},
		setCategory:function(category) {
			_category = category;
		},
		getCategory:function() {
			return _category;
		}
	}; 
}());

function login() {
	var username = $("#username").val().trim();
	var password = $("#password").val().trim();
	if (! $("#remember-me").is(':checked')) {
		deletePersistent('rememberMeUsername');
		deletePersistent('rememberMePassword');
	}
	if (username.length == 0) {
		alert("Please provide an username");
		$("#username").focus();
		return;
	}
	if (password.length == 0) {
		alert("Please provide a password");
		$("#password").focus();
		return;
	}
    
	var url = getURL();
	url += 'mainServiceProxy?';
	url += $.param({action: 'login', username: username, password: password});
	$.get(url, onLoginDone).fail(onRequestFail);
}

function getRequestData(data, status) {
	if (status == 'success') {
		if (data.indexOf('Error:') == 0) {
			alert(data);
		}
		else {
			try {
				return $.parseJSON(data);
			}
			catch (err) {
				alert(err);
			}
		}   
	}
	else {
		alert('Error during request');
	}
	return null;
}

function onLoginDone(data, status) {
	var initialData = getRequestData(data, status);
	if (initialData) {
		App.setInitialData(initialData);
		var username = $("#username").val().trim();
		var password = $("#password").val().trim()
		if ($("#remember-me").is(':checked')) {
			savePersistent('rememberMeUsername', username);
			savePersistent('rememberMePassword', password);
		}
		saveSession('username', username);
		saveSession('password', password);
		App.getApp().navigate('views/riglist.html');
	}
}

function onRequestFail(jqxhr, textStatus, error) {
	alert('Error making the request:\n' + error);
}

function saveSettings() {
	var url = $("#url").val().trim();
	if (url.length == 0) {
		alert('url is mandatory');
		return;
	}
	savePersistent('url', url);
	App.getApp().navigate("#login");
}

function onSettingsInit() {
	$("#url").val(getURL());
}

function getURL() {
	var url = getPersistent('url');
	if (url) {
		if (!url.lastIndexOf('/') == url.length - 1) {
			return url + '/';
		}
		return url;
	}
	else {
		return "http://192.168.0.90:8888/";
	}
}

function getRequestURL(action) {
	var url = getURL();
	var params = {
		username: getSession('username'),
		password: getSession('password')
	}

	if (action) {
		params.action = action;
	}
	if (App.getRig()) {
		params.id = App.getRig().id;
	}
	if (App.getCategory()) {
		params.itemmodel = App.getCategory();
	}
	return url + "mainServiceProxy?" + $.param(params);
}

function setRigTabsTitle() {
	var title = '';
	if (App.getRig()) {
		title = App.getRig().name;
	}
	else {
		alert('Rig is unselected. Please select a rig');
		App.getApp().navigate('views/riglist.html');
		return;
	}
	if (App.getCategory) {
		title += " / " + App.getCategory();
		$("#rig-tabs-navbar").data("kendoMobileNavBar").title(title);
	}
	else {
		alert('Category was not selected. Please select a category');
		App.getApp().navigate('view/categorieslist.html');
		return;
	}
}