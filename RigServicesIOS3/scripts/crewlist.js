function onCrewListShow(type, listSelector) {
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