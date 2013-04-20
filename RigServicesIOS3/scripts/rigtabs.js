function onRigTabsShow() {
	var title = '';
	if (App.getRig()) {
		title = App.getRig().name;
	}
	else {
		alert('Rig is unselected. Please select a rig');
		App.getApp().navigate('views/riglist.html');
	}
	if (App.getCategory) {
		title += " / " + App.getCategory();
		$("#rig-tabs-navbar").data("kendoMobileNavBar").title(title);
	}
	else {
		alert('Category was not selected. Please select a category');
		App.getApp().navigate('view/categorieslist.html');
	}
}