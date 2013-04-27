function onRigListShow() {
	App.setRig(undefined);
	App.setCategory(undefined);
	var url = getRequestURL('riglist');
	showLoader("Fetching rig list", $.get(url, onGetRigListSuccess).fail(onRequestFail));
}

function onGetRigListSuccess(data, status) {
	if (App.isLoaderCanceled()) {
		return;
	}
    hideLoader();
	var rigList = getRequestData(data, status);
	if (rigList) {
		$("#rig-list-view").data("kendoMobileListView").setDataSource(new kendo.data.DataSource({data:rigList}));
	}
}

function onRigListClick(e) {
	App.setRig(e.dataItem);
	App.getApp().navigate('views/categorieslist.html');
}