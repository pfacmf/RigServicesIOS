function onCrewListShow() {
	setRigTabsTitle()
	var url = getRequestURL('crewlist');
	showLoader("Fetching crew list", $.get(url, onGetCrewListSuccess).fail(onRequestFail));
}

function onGetCrewListSuccess(data, status) {
	if (App.isLoaderCanceled()) {
		return;
	}
    hideLoader();
	var list = getRequestData(data, status);
	if (list) {
		$("#crew-list-view").data("kendoMobileListView").setDataSource(new kendo.data.DataSource({data:list}));
	}
}

function onCrewClick(e) {
	$("#crew-menu").data("kendoMobileActionSheet").open(e.item, e.dataItem);
}

function deleteCrew(e) {
	if (confirm("Are you sure you want to delete the crew member?")) {
		var url = getRequestURL('deletecrew');
		url += "&" + $.param({crewId: e.context.id});
		showLoader("Deleting crew member", $.get(url, onDeleteCrewSuccess).fail(onRequestFail));
	}
}

function onDeleteCrewSuccess() {
	if (App.isLoaderCanceled()) {
		return;
	}
    hideLoader();
	onCrewListShow();
	alert("Crew member was deleted");
}