sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/GenericTile",
    "sap/m/TileContent",
    "sap/m/ImageContent",

], (Controller, GenericTile, TileContent,FilterOperator ,ImageContent, ObjectPageSection, ObjectPageSubSection, HorizontalLayout) => {
    "use strict";

    return Controller.extend("wb.project1.controller.MainView", {
        onInit() {
     // Inicialización del modelo de secciones
     var oSectionModel = new sap.ui.model.json.JSONModel({ Sections: [] });
     this.getView().setModel(oSectionModel, "sectionModel");
 
     this.loadSections(); // Llamar al método para cargar las secciones
        },

      
       
        loadSections: function () {
            var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIORI_SECC_SRV", {
                "odataVersion": "2.0"
            });
            this.getView().setModel(oModel, "mainService");
        
            oModel.read("/SD_HEADERSet", {
                success: function (oData) {
                    if (oData && oData.results) {
                        var aSections = [];
        
                        // Para cada sección obtenida, cargar los tiles relacionados
                        var oTilePromises = oData.results.map((section) => {
                            return new Promise((resolve, reject) => {
                                this.loadTiles(section.Id).then((tiles) => {
                                    aSections.push({
                                        SectionId: section.Id, // ID para vincular la sección
                                        SectionName: section.SectionName,
                                        Tiles: tiles
                                    });
                                    resolve();
                                }).catch(reject);
                            });
                        });
        
                        // Esperamos a que todas las promesas de tiles terminen antes de actualizar el modelo
                        Promise.all(oTilePromises).then(() => {
                            var oSectionModel = new sap.ui.model.json.JSONModel({ Sections: aSections });
                            this.getView().setModel(oSectionModel, "sectionModel");
                        }).catch((err) => {
                            console.error("Error al cargar las secciones y tiles:", err);
                        });
                    }
                }.bind(this),
                error: function (oError) {
                    console.error("Error al obtener los datos de las secciones:", oError);
                }
            });
        },
        
        loadTiles: function (sectionId) {
            return new Promise((resolve, reject) => {
                var oModel = this.getView().getModel("mainService");
        
                if (!sectionId) {
                    console.error("El Id de la sección no es válido");
                    reject("ID de sección inválido");
                    return;
                }
        
                oModel.read("/SD_TILESSet", {
                    filters: [
                        new sap.ui.model.Filter("IdSection", sap.ui.model.FilterOperator.EQ, sectionId)
                    ],
                    success: function (oData) {
                        resolve(oData.results || []);
                    },
                    error: function (oError) {
                        console.error("Error al obtener los tiles:", oError);
                        reject(oError);
                    }
                });
            });
        },
        
        
        
        
        /*  _loadTiles: function () {

            var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIORI_SECC_SRV", {
                "odataVersion": "2.0"
            });
            this.getView().setModel(oModel, "mainService");
            console.log("Modelo OData cargado explícitamente");
        
            // Obtener el modelo OData
  

            // Filtro para obtener los tiles
            var oFilter = new sap.ui.model.Filter({
                path: "IdSection",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: "1" // IdSection específico
            });

            // Llamada al OData service para obtener los tiles con el filtro
            oModel.read("/SD_TILESSet", {
                filters: [oFilter],
                success: function(oData) {
                    var aTiles = oData.results.map(function(tile) {
                        // Construir el enlace para cada tile
                        var sUrl = "flp?sap-client=500#AnalyticQuery-preview?query=" + tile.QueryString;

                        return {
                            TileName: tile.TileName,
                            QueryString: tile.QueryString,
                            TileUrl: sUrl
                        };

                    
                    });

                    aTiles.forEach(function(tile) {
                        console.log("Tile: ", tile);
                    });
                    // Crear un modelo JSON con los tiles
                    var oTileModel = new sap.ui.model.json.JSONModel(aTiles);
                    this.getView().setModel(oTileModel, "tileModel"); // Asignar el modelo a la vista
               
                    console.log("Modelo de tiles cargado en la vista"  + oTileModel);
               
                }.bind(this),
                error: function(oError) {
                    console.error("Error al obtener los tiles: ", oError);
                }
            });
        },
*/







          onTilePress: function (oEvent) {
            var sUrl = "https://telefonica-global-technology--s-a--ia-test-l358blr2-spa25955da0.cfapps.eu10-004.hana.ondemand.com";
            window.open(sUrl, "_blank"); // Abre la URL en una nueva pestaña
        },

        onTilePress1: function (oEvent) {
            var sUrl = "https://telefonica-global-technology--s-a--ia-test-l358blr2-spa3dd14c01.cfapps.eu10-004.hana.ondemand.com";
            window.open(sUrl, "_blank"); // Abre la URL en una nueva pestaña
        },
        

        onTilePress2: function () {
           
            this.getOwnerComponent().getRouter().navTo("Tile");
        },
        
        prueba: function() {
            var sTransactionCode = "ZTU_TRANSACCION"; // Reemplaza con tu código de transacción
            var sUrl = "/sap/bc/gui/sap/its/webgui?~transaction=" + sTransactionCode;
            sap.m.URLHelper.redirect(sUrl, true);
          }
          


    });
});