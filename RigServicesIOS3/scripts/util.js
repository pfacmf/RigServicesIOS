function savePersistent(key, value) {
	if (typeof(Storage) !== undefined) {
		localStorage[key] = value;
	}
	else {
		$.cookie(key, value, {expires: 3650});
	}
}

function getPersistent(key) {
	if (typeof(Storage) !== undefined) {
		return localStorage[key];
	}
	else {
		return $.cookie(key);
	}
	return null;
}

function deletePersistent(key) {
	if (typeof(Storage) !== undefined) {
		localStorage.removeItem(key);
	}
	else {
		$.cookie(key) = null;
	}
}
function saveSession(key, value) {
	if (typeof(Storage) !== undefined) {
		sessionStorage [key] = value;
	}
	else {
		$.cookie(key, value);
	}
}

function getSession(key) {
	if (typeof(Storage) !== undefined) {
		return sessionStorage[key];
	}
	else {
		return $.cookie(key);
	}
	return null;
}

function getFormattedDateTime(d) {
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	curr_month++;
	var curr_year = d.getFullYear();
    
	var hour = d.getHours() /*% 12*/;
	var min = d.getMinutes();
	var sec = d.getSeconds();
    /*
	var meridian = 'AM';
	if (d.getHours() >= 12)
		meridian = 'PM';
    */
	return curr_month + "/" + curr_date + "/" + curr_year + " " + hour + ":" + min + ":" + sec/* + " " + meridian*/;
}

function getFormattedDate(dateParam) {
    var d;
    if (typeof dateParam === "Date"){
        d = dateParam;
    } else {
        d = new Date(dateParam);
    }
    
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	curr_month++;
	var curr_year = d.getFullYear();
    
	return curr_month + "/" + curr_date + "/" + curr_year;
}

function onEditSettingsBack(){
    App.getApp().navigate('#login');
}

function onTabsBack(){
    App.getApp().navigate('views/categorieslist.html');
}