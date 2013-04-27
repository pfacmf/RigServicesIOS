crewId = -1;
editedCrew = undefined;
function onCrewListShow() {
	setRigTabsTitle()
	var url = getRequestURL('crewlist');
	showLoader("Fetching crew list", $.get(url, onGetCrewListSuccess).fail(onRequestFail));
}

function onGetCrewListSuccess(data, status) {
	if (App.isLoaderCanceled()) {
		return;
	}
	hideLoader();
	var list = getRequestData(data, status);
	if (list) {
		$("#crew-list-view").data("kendoMobileListView").setDataSource(new kendo.data.DataSource({data:list}));
	}
}

function onCrewClick(e) {
	$("#crew-menu").data("kendoMobileActionSheet").open(e.item, e.dataItem);
}

function deleteCrew(e) {
	if (confirm("Are you sure you want to delete the crew member?")) {
		var url = getRequestURL('deletecrew');
		url += "&" + $.param({crewId: e.context.id});
		showLoader("Deleting crew member", $.get(url, onDeleteCrewSuccess).fail(onRequestFail));
	}
}

function onDeleteCrewSuccess() {
	if (App.isLoaderCanceled()) {
		return;
	}
	hideLoader();
	onCrewListShow();
	alert("Crew member was deleted");
}

function onEditCrewShow() {
	if (crewId == -1) {
		resetForm();
		$("#edit-crew-navbar").data("kendoMobileNavBar").title("New Crew");
	}
	else {
		$("#edit-crew-navbar").data("kendoMobileNavBar").title("Edit Crew");
		$("#crew-title").val(editedCrew.title);
		$("#crew-first-name").val(editedCrew.firstName);
		$("#crew-middle-name").val(editedCrew.mi);
		$("#crew-last-name").val(editedCrew.lastName);
		$("#crew-company-info").val(editedCrew.companyInfo);
		$("#crew-email").val(editedCrew.email);
		$("#crew-work").val(editedCrew.telephone);
		$("#crew-cell").val(editedCrew.cell);
		$("#crew-fax").val(editedCrew.fax);
		$("#crew-medical-info").val(editedCrew.medical);
		if (editedCrew.enabled) {
			$("#crew-enabled").attr("checked", "checked");
		}
		else {
			$("#crew-enabled").removeAttr("checked");
		}
	}
}

function resetForm() {
	$("#crew-title").val('');
	$("#crew-first-name").val('');
	$("#crew-middle-name").val('');
	$("#crew-last-name").val('');
	$("#crew-company-info").val('');
	$("#crew-email").val('');
	$("#crew-work").val('');
	$("#crew-cell").val('');
	$("#crew-fax").val('');
	$("#crew-medical-info").val('');
	$("#crew-enabled").attr("checked", "checked");
}

function editCrew(e) {
	crewId = e.context.id;
	editedCrew = e.context;
	App.getApp().navigate("views/editcrew.html");
}

function onNewCrew() {
	crewId = -1;
	App.getApp().navigate("views/editcrew.html");
}

function saveCrew() {
	var firstName = $("#crew-first-name").val().trim();
	var lastName = $("#crew-last-name").val().trim();
	if (firstName.length == 0) {
		alertBox("First name is mandatory");
		return;
	}
	if (lastName.length == 0) {
		alertBox("Last name is mandatory");
		return;
	}
    
    var email = $("#crew-email").val().trim();
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (email.length > 0 && !emailReg.test(email)){
        alertBox("Invalid email format");
        return;
    }
	var url = getRequestURL('savecrew');
	url += "&" + $.param({
		crewid: crewId,
		title:$("#crew-title").val().trim(), 
		firstname: firstName,
        lastname: lastName,
		mi:$("#crew-middle-name").val().trim(),
		email:$("#crew-email").val().trim(),
        work:$("#crew-work").val().trim(),
        fax:$("#crew-fax").val().trim(),
        cell:$("#crew-cell").val().trim(),
        medicalinfo:$("#crew-medical-info").val().trim(),
        companyinfo:$("#crew-company-info").val().trim(),
        enabled:$("#crew-enabled").is(':checked')
        
	});
	showLoader("Saving crew", $.get(url, onSaveCrewSuccess).fail(onRequestFail));
}

function onSaveCrewSuccess() {
	if (App.isLoaderCanceled()) {
		return;
	}
	hideLoader();
	App.getApp().navigate("views/crewlist.html");
	alert("Crew was saved");
}