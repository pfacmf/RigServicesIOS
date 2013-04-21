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

function saveRig(){
    var rigName = $("#rig-name").val().trim();
    if (rigName.length == 0){
        alert("Rig name is mandatory");
        return;
    }
    var rigInfo = $("#rig-info").val().trim();
    var url = getRequestURL('saverig');
    url += "&" + $.param({rigname:rigName, riginfo: rigInfo});
    $.get(url, onSaveRigSuccess).fail(onRequestFail);
}

function onSaveRigSuccess(){
    App.getApp().navigate("views/riglist.html");
    alert("Rig was saved");
}

function onEditRigShow(){
    $("#rig-name").val('');
    $("#rig-info").val('');
}