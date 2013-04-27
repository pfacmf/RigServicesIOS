function onCategoriesListInit() {
	$("#categories-list-view").data("kendoMobileListView").setDataSource(new kendo.data.DataSource({data: categories}));
}

function onCategoriesListShow(){
    App.setCategory(undefined);
    if (App.getRig()){
        $("#categories-navbar").data("kendoMobileNavBar").title(App.getRig().name);
    } else {
        alertBox('Rig was not selected. Please select a rig');
        App.getApp().navigate('views/riglist.html');
    }
}

function onCategoriesListClick(e){
    App.setCategory(e.item.text());
    App.getApp().navigate('views/riginfo.html');
}