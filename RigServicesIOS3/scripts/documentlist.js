var documentListSelector;

function onDrawingsListShow() {
	onDocumentListShow("Drawings", "#drawings-list-view");
}

function onWorkOrderListShow() {
	onDocumentListShow("Work Order", "#work-order-list-view");
}

function onDocumentListShow(type, listSelector) {
	setRigTabsTitle()
	documentListSelector = listSelector; 
	var url = getRequestURL('documentlist');
	url += "&" + $.param({type:type});
	$.get(url, onGetDocumentListSuccess).fail(onRequestFail);
}

function onGetDocumentListSuccess(data, status) {
	var docList = getRequestData(data, status);
	if (docList) {
		$(documentListSelector).data("kendoMobileListView").setDataSource(new kendo.data.DataSource({data:docList}));
	}
}