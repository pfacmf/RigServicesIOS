function onMaintenanceListShow(type, listSelector) {
	setRigTabsTitle()
	var url = getRequestURL('activitylist');
	showLoader("Fetching maintenance list", $.get(url, onGetMaintenanceListSuccess).fail(onRequestFail));
}

function onGetMaintenanceListSuccess(data, status) {
	if (App.isLoaderCanceled()) {
		return;
	}
    hideLoader();
	var list = getRequestData(data, status);
	if (list) {
		$("#maintenance-list-view").data("kendoMobileListView").setDataSource(new kendo.data.DataSource({data:list}));
	}
}