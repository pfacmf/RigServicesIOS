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


var App = (function () { 
	var _app = undefined; 
    var _initialData = undefined;
    
    return { 
		getApp: function () { 
			return _app; 
		}, 
		setApp: function (app) { 
			_app = app; 
			return this; 
		},
        getInitialData: function(){
            return _initialData;
        },
        setInitialData: function(initialData){
            _initialData = initialData;
        }
	}; 
}());

function login() {
	var username = $("#username").val().trim();
	var password = $("#password").val().trim();
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
    
    var url = getNormalizedURL(getURL());
    url += 'mainServiceProxy?';
    url += $.param({action: 'login', username: username, password: password});
    $.get(url, onLoginDone).fail(onLoginFail);
}

function onLoginDone(data, status){
    if (status == 'success'){
        if (data.indexOf('Error:') == 0){
            alert(data);
        } else {
            App.setInitialData($.parseJSON(data));
            alert(App.getInitialData().currentUser.lightUser.firstName);
        }
    } else {
        alert('Error logging in');
    }
}

function onLoginFail(jqxhr, textStatus, error){
    alert('Error loging in:\n' + error);
}

function saveSettings(){
    var url = $("#url").val().trim();
    if (url.length == 0){
        alert('url is mandatory');
        return;
    }
    if (typeof(Storage) !== undefined){
        localStorage.url = url;
    } else {
        $.cookie("url", rul, {expires: 3650});
    }
    App.getApp().navigate("#login");
}

function onSettingsInit(){
    $("#url").val(getURL());
}

function getURL(){
    if (localStorage && localStorage.url){
        return localStorage.url;
    }
    if ($.cookie("url")){
        return $.cookie("url");
    }
    return "http://192.168.0.90/";
}

function getNormalizedURL(url){
    if (!url.lastIndexOf('/') == url.length-1){
        return url + '/';
    } else {
        return url;
    }
}