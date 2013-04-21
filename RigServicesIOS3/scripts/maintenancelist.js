function onMaintenanceListShow(type, listSelector) {
	setRigTabsTitle()
	var url = getRequestURL('activitylist');
	$.get(url, onGetMaintenanceListSuccess).fail(onRequestFail);
}

function onGetMaintenanceListSuccess(data, status) {
	var list = getRequestData(data, status);
	if (list) {
		$("#maintenance-list-view").data("kendoMobileListView").setDataSource(new kendo.data.DataSource({data:list}));
	}
}