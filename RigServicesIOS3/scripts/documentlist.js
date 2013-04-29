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

function editDocument(e) {
	documentId = e.context;
	if ($("#drawings-list").length == 1 && App.getApp().view() == $("#drawings-list").data("kendoMobileView")) {
		documentType = 'Drawings';
	}
	else {
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
	if (t == 'File') {
		fileRow.show();
		linkRow.hide();
	}
	else {
		fileRow.hide();
		linkRow.show();
	}
}

function onEditDocumentShow(e) {
	var title = "";
	if (documentId == -1) {
		title = "New ";
		$("#edit-document-open").hide();
		onDocumentTypeChange();
	}
	else {
		title = "Edit ";
		$("#edit-document-open").show();
	}
    
	title += documentType;
	$("#edit-document-navbar").data("kendoMobileNavBar").title(title);
}

function onEditDocumentBackClick() {
	if (documentType == "Drawings") {
		onBackClick("views/drawingslist.html");
	}
	else {
		onBackClick("views/workorderlist.html");
	}
}

function onNewDrawings() {
	documentId = -1;
	documentType = 'Drawings';
	App.getApp().navigate('views/editdocument.html');
}

function onNewWorkorder() {
	documentId = -1;
	documentType = 'Work Order';
	App.getApp().navigate('views/editdocument.html');
}

function selectFile() {
	$("#file").click();
}

function fileSelected() {
	$("#file-name").val($("#file").val());
}

function saveDocument() {
	var name = $("#document-name").val().trim();
	if (name.length == 0) {
		alertBox("Name is mandatory");
		return;
	}
	var type = $("#document-type").val().trim();
    
	params = {};
	params.name = name;
	params.type = type;
	params.projectId = App.getRig().id;
	params.accountId = App.getInitialData().currentUser.accountId;
	var documentCategories = App.getInitialData().documentCategories;
	for (var i = 0; i < documentCategories.length; i++) {
		if (documentCategories[i].text == documentType) {
			params.categoryId = documentCategories[i].value;
			break;
		}      
	}
	if (App.getCategory() == 'Rig') {
		params.linkableId = App.getRig().id;
		params.modelNumber = "";
		params.linkableType = "Project";
	}
	else {
		params.linkableId = "";
		params.modelNumber = App.getCategory();
		params.linkableType = "ItemModel";
	}
	if (type == 'File') {
		//upload file    
		var filePath = $("#file-name").val().trim();
		if (filePath.length == 0) {
			alertBox("File is mandatory");
			return;
		}
		var ft = new FileTransfer();
        var options = new FileUploadOptions();
        options.params = params;
		var url = getURL() + "UploadDocumentServlet";
        ft.upload(filePath, encodeURI(url), onDocumentUploadSuccess, onDocumentUploadSuccessError, options);
	}
	else {
		//post link
		var info = $("#document-info").val.trim();
		if (info.length == 0) {
			alertBox("Info is mandatory");
			return;
		}
		params.info = info;
	}
}

function onDocumentUploadSuccess() {
	alert("done");
}

function onDocumentUploadError() {
	alert("error");
}