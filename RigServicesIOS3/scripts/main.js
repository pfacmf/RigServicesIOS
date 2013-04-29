// JavaScript Document

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};

// PhoneGap is ready
function onDeviceReady() {
	//getLocation();
	navigator.splashscreen.hide();
    
	//add cancel button to kendo loader
	var loaderElement = $('[data-role="loader"]');
	var cancelButtonIOS = $("#loading-cancel");
	loaderElement.append(cancelButtonIOS);
	loaderElement.css("text-align", "center");
}

function showLoader(text, request, callback) {
	$("#glass").show();
	loaderElement = App.getApp().pane.loader.element.find("h1");
	if (text) {
		loaderElement.text(text);
	}
	else {
		loaderElement.text('');
	}
	App.setLoaderCanceled(false);
	App.setLoaderCancelCallback(callback);
	App.setRequest(request);
	App.getApp().showLoading();
}

function cancelLoader() {
	App.setLoaderCanceled(true);
	if (App.getLoaderCancelCallback()) {
		App.loaderCancelCallback();
	}
	if (App.getRequest()) {
		App.getRequest().abort();
	}
	hideLoader();
}
function hideLoader() {
	$("#glass").hide();
	App.getApp().hideLoading();    
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
	var _loaderCancelCallback = undefined;
	var _loaderCanceled = false;
	var _request = undefined;
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
		}, setLoaderCancelCallback: function(callback) {
			_loaderCancelCallback = callback;
		}, getLoaderCancelCallback: function() {
			return _loaderCancelCallback;
		}, setLoaderCanceled: function(canceled) {
			_loaderCanceled = canceled;
		}, isLoaderCanceled:function() {
			return _loaderCanceled;
		}, setRequest: function(request) {
			_request = request;
		}, getRequest: function() {
			return _request;
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
		alertBox("Please provide an username");
		$("#username").focus();
		return;
	}
	if (password.length == 0) {
		alertBox("Please provide a password");
		$("#password").focus();
		return;
	}
    
	var url = getURL();
	url += 'mainServiceProxy?';
	url += $.param({action: 'login', username: username, password: password});
	showLoader("Logging in...", $.get(url, onLoginDone).fail(onRequestFail));
}

function getRequestData(data, status) {
	if (status == 'success') {
		if (data.indexOf('Error:') == 0) {
			alertBox(data);
		}
		else {
			try {
				return $.parseJSON(data);
			}
			catch (err) {
				alertBox(err);
			}
		}   
	}
	else {
		alertBox('Error during request');
	}
	return null;
}

function onLoginDone(data, status) {
	if (App.isLoaderCanceled()) {
		return;
	}
	hideLoader();
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
	if (!App.isLoaderCanceled()) {
		alertBox('Error making the request: ' + error);
	}
    hideLoader();
}

function saveSettings() {
	var url = $("#url").val().trim();
	if (url.length == 0) {
		alertBox('url is mandatory');
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
		return "http://rigservices.com:8080/";
        
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
		alertBox('Rig is unselected. Please select a rig');
		App.getApp().navigate('views/riglist.html');
		return;
	}
	if (App.getCategory) {
		title += " / " + App.getCategory();
		$("#rig-tabs-navbar").data("kendoMobileNavBar").title(title);
	}
	else {
		alertBox('Category was not selected. Please select a category');
		App.getApp().navigate('view/categorieslist.html');
		return;
	}
}

function onLogoutClick() {
	if (confirm("Are you sure you want to logout?")) {
		App.getApp().navigate("#login");
	}
}

function onBackClick(navigateTo) {
	App.getApp().navigate(navigateTo);
}

function alertBox(message, title, buttonText) {
	if (title !== undefined) {
		$("#alert-navbar").data("kendoMobileNavBar").title(title);
	}
	if (buttonText !== undefined) {
		$("#alert-ok").text(buttonText);
	}
	$("#alert-message").text(message);
	$("#alert-box").data("kendoMobileModalView").open();

    //navigator.notification.alert(message, clickAlertButton, title, buttonText);
}

function clickAlertButton(e) {
	$("#alert-box").data("kendoMobileModalView").close();
}