function onRigInfoShow() {
	setRigTabsTitle();
    
	//hide crew if we are not in rig
	if (App.getCategory() == 'Rig') {
		$("#crew-tab-strip").show();
	}
	else {
		$("#crew-tab-strip").hide();
	}
    
	//fetch rig info

	var url;
	if (App.getCategory() == 'Rig') {
		url = getRequestURL('riginfo');
	}
	else {
		url = getRequestURL('modelinfo');
	}
	$.get(url, onGetRigInfoSuccess).fail(onRequestFail);
}

function onGetRigInfoSuccess(data, status) {
	var info = getRequestData(data, status);
	if (info) {
		$("#riginfo-html").html(info.description);
	}
}