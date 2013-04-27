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
	showLoader("Fetching rig info", $.get(url, onGetRigInfoSuccess).fail(onRequestFail));
}

function onGetRigInfoSuccess(data, status) {
	if (App.isLoaderCanceled()) {
		return;
	}
    hideLoader();
	var info = getRequestData(data, status);
	if (info) {
		$("#riginfo-html").html(info.description);
	}
}

function saveRig() {
	var rigName = $("#rig-name").val().trim();
	if (rigName.length == 0) {
		alertBox("Rig name is mandatory");
		return;
	}
	var rigInfo = $("#rig-info").val().trim();
	var url = getRequestURL('saverig');
	url += "&" + $.param({rigname:rigName, riginfo: rigInfo});
	showLoader("Saving rig", $.get(url, onSaveRigSuccess).fail(onRequestFail));
}

function onSaveRigSuccess() {
	if (App.isLoaderCanceled()) {
		return;
	}
    hideLoader();
	App.getApp().navigate("views/riglist.html");
	alert("Rig was saved");
}

function onEditRigShow() {
	$("#rig-name").val('');
	$("#rig-info").val('');
}