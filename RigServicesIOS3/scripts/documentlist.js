var documentListSelector;
var documentType;

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

function onDrawingsClick(e) {
	documentListSelector = '#drawings-list-view';
    documentType = 'Drawings';
	onDocumentClick(e);
}
function onWorkOrderClick(e) {
	documentListSelector = '#work-order-list-view';
    documentType = 'Work Order';
	onDocumentClick(e);
}
function onDocumentClick(e) {
	$("#document-menu").data("kendoMobileActionSheet").open(e.item, e.dataItem.id);
}

function deleteDocument(e) {
	if (confirm("Are you sure you want to delete the document?")) {
		var url = getRequestURL('deletedocument');
		url += "&" + $.param({documentId: e.context});
		$.get(url, onDeleteDocumentSuccess).fail(onRequestFail);
	}
}

function onDeleteDocumentSuccess() {
    onDocumentListShow(documentType, documentListSelector);
    alert("Document was deleted");
}