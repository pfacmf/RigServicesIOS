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