var documentListSelector;
var documentType;
var documentId = -1;

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

function editDocument(e){
    documentId = e.context;
    if ($("#drawings-list").length == 1 && App.getApp().view() == $("#drawings-list").data("kendoMobileView")){
        documentType = 'Drawings';
    } else {
        documentType = 'Work Order';
    }
    App.getApp().navigate("views/editdocument.html");
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
    var t = $("#document-type").val();
    var fileRow = $("#filerow");
    var linkRow = $("#linkrow");
    if (t == 'File'){
        fileRow.show();
        linkRow.hide();
    } else {
        fileRow.hide();
        linkRow.show();
    }
}

function onEditDocumentShow(e) {
    var title = "";
    if (documentId == -1){
        title = "New ";
        $("#edit-document-open").hide();
        onDocumentTypeChange();
    } else {
        title = "Edit ";
        $("#edit-document-open").show();
    }
    
    title += documentType;
    $("#edit-document-navbar").data("kendoMobileNavBar").title(title);
}

function onEditDocumentBackClick(){
    if (documentType == "Drawings"){
        onBackClick("views/drawingslist.html");
    } else {
        onBackClick("views/workorderlist.html");
    }
}

function onNewDrawings(){
    documentId = -1;
    documentType = 'Drawings';
    App.getApp().navigate('views/editdocument.html');
}

function onNewWorkorder(){
    documentId = -1;
    documentType = 'Work Order';
    App.getApp().navigate('views/editdocument.html');
}