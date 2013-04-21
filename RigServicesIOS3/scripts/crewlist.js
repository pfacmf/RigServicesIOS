function onCrewListShow(type, listSelector) {
	setRigTabsTitle()
	var url = getRequestURL('crewlist');
	$.get(url, onGetCrewListSuccess).fail(onRequestFail);
}

function onGetCrewListSuccess(data, status) {
	var list = getRequestData(data, status);
	if (list) {
		$("#crew-list-view").data("kendoMobileListView").setDataSource(new kendo.data.DataSource({data:list}));
	}
}