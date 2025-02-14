sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("wb.project1.controller.MainView", {
        onInit() {


        },

       /*/ onTilePress: function () {
                console.log("Entrado al metodo ")
          //  sap.m.URLHelper.redirect("sap-gui://transaction=ZTNM_STOCK_PLAN_ENTREGAS_SRV/");



        }*/



          onTilePress: function (oEvent) {
            var sUrl = "https://telefonica-global-technology--s-a--ia-test-l358blr2-spa25955da0.cfapps.eu10-004.hana.ondemand.com";
            window.open(sUrl, "_blank"); // Abre la URL en una nueva pestaña
        },

        onTilePress1: function (oEvent) {
            var sUrl = "https://telefonica-global-technology--s-a--ia-test-l358blr2-spa3dd14c01.cfapps.eu10-004.hana.ondemand.com";
            window.open(sUrl, "_blank"); // Abre la URL en una nueva pestaña
        },
        

        onTilePress2: function () {
            // Navegar a otra vista
            this.getOwnerComponent().getRouter().navTo("Tile");
        }
        
        
    });
});