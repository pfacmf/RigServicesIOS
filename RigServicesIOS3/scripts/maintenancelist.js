maintenanceId = -1;
editedMaintenance = undefined;
function onMaintenanceListShow() {
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

function onNewMaintenance() {
	maintenanteId = -1;
	App.getApp().navigate("views/editmaintenance.html");
}

function saveMaintenance() {
	var activityAt = $("#activity-at").val().trim();
	var performedBy = $("#activity-performed-by").val().trim();
	if (activityAt.length == 0) {
		alertBox("Activity at is mandatory");
		return;
	}
	if (performedBy.length == 0) {
		alertBox("Performed by mandatory");
		return;
	}
    
	var url = getRequestURL('saveactivity');
	url += "&" + $.param({
		maintenanceid: maintenanceId,
		activityat:activityAt, 
		performedby: performedBy,
		performingcompany: $("#activity-performing-company").val(),
		details: $("#activity-details").val()
	});
	showLoader("Saving maintenance", $.get(url, onSaveMaintenanceSuccess).fail(onRequestFail));
}

function onSaveMaintenanceSuccess() {
	if (App.isLoaderCanceled()) {
		return;
	}
	hideLoader();
	App.getApp().navigate("views/maintenancelist.html");
	alert("Maintenance was saved");
}

function onEditMaintenanceShow() {
	if (maintenanceId == -1) {
		resetForm();
        $("#edit-maintenance-navbar").data("kendoMobileNavBar").title("New Maintenance");
        $("#activity-at").val(getFormattedDateTime(new Date()));
	} else {
        $("#edit-maintenance-navbar").data("kendoMobileNavBar").title("Edit Maintenance");
        $("#activity-at").val(getFormattedDateTime(new Date(editedMaintenance.activityAt)));
        $("#activity-performing-company").val(editedMaintenance.performingCompanyName);
        $("#activity-performed-by").val(editedMaintenance.performedBy);
        $("#activity-details").val(editedMaintenance.details);
    }
}

function resetForm() {
	$("#activity-at").val('');
	$("#activity-performed-by").val(App.getInitialData().currentUser.lightUser.firstName + " " + App.getInitialData().currentUser.lightUser.lastName);
	$("#activity-performing-company").val(App.getInitialData().currentUser.lightUser.company);
	$("#activity-details").val('');
}

function onMaintenanceClick(e) {
	$("#maintenance-menu").data("kendoMobileActionSheet").open(e.item, e.dataItem);
}

function editMaintenance(e){
    maintenanceId = e.context.id;
    editedMaintenance = e.context;
    App.getApp().navigate("views/editmaintenance.html");
}

function deleteMaintenance(e) {
	if (confirm("Are you sure you want to delete the maintenance?")) {
		var url = getRequestURL('deleteactivity');
		url += "&" + $.param({maintenanceId: e.context.id});
		showLoader("Deleting maintenance", $.get(url, onDeleteMaintenanceSuccess).fail(onRequestFail));
	}
}

function onDeleteMaintenanceSuccess() {
	if (App.isLoaderCanceled()) {
		return;
	}
    hideLoader();
	onMaintenanceListShow();
	alert("Maintenance was deleted");
}

function onEditMaintananceBack(){
    App.getApp().navigate('views/maintenancelist.html');
}