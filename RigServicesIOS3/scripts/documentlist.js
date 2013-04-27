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
	showLoader("Fetching documents list", $.get(url, onGetDocumentListSuccess).fail(onRequestFail));
}

function onGetDocumentListSuccess(data, status) {
	if (App.isLoaderCanceled()) {
		return;
	}
    hideLoader();
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
		showLoader("Deleting document", $.get(url, onDeleteDocumentSuccess).fail(onRequestFail));
	}
}

function onDeleteDocumentSuccess() {
	if (App.isLoaderCanceled()) {
		return;
	}
    hideLoader();
	onDocumentListShow(documentType, documentListSelector);
	alert("Document was deleted");
}

function onDocumentTypeChange() {
	alertBox($("#document-type").val());
}

function onEditDocumentShow(e) {
	if (! e.view.params.documentId) {
		//new document
		$("#document-type").val("Link");
	}
}