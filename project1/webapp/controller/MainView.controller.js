sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/GenericTile",
    "sap/m/TileContent",
    "sap/m/ImageContent",

], (Controller, GenericTile, TileContent, FilterOperator, ImageContent, ObjectPageSection, ObjectPageSubSection, HorizontalLayout) => {
    "use strict";

    return Controller.extend("wb.project1.controller.MainView", {
        onInit() {


            // Inicialización del modelo de secciones
            var oSectionModel = new sap.ui.model.json.JSONModel({ Sections: [] });
            this.getView().setModel(oSectionModel, "sectionModel");

            var oModel = new sap.ui.model.json.JSONModel();
            var that = this;
            var oDataModel = this.getOwnerComponent().getModel();
            var aSections = [];
            var oSectionsMap = {};

            // Obtener las SECCIONES con sus nombres
            oDataModel.read("/SD_HEADERSet", {
                success: function (oData) {
                    oData.results.forEach(function (oSection) {
                        var sIdSection = oSection.Id;
                        oSectionsMap[sIdSection] = {
                            IdSection: sIdSection,
                            SectionName: oSection.SectionName, // Aquí guardamos el nombre correcto
                            Tiles: []
                        };
                        aSections.push(oSectionsMap[sIdSection]);
                    });

                    // Obtener los TILES y asignarlos a la sección correcta
                    oDataModel.read("/SD_TILESSet", {
                        success: function (oTileData) {
                            oTileData.results.forEach(function (oTile) {
                                var sIdSection = oTile.IdSection;
                                if (oSectionsMap[sIdSection]) {
                                    oSectionsMap[sIdSection].Tiles.push({
                                        TileName: oTile.TileName,
                                        QueryString: oTile.QueryString
                                    });
                                }
                            });

                            // Asignar datos al modelo y vincular a la vista
                            oModel.setData({ Sections: aSections });
                            that.getView().setModel(oModel, "sectionModel");
                        },
                        error: function (oError) {
                            console.error("Error al cargar los tiles", oError);
                        }
                    });
                },
                error: function (oError) {
                    console.error("Error al cargar las secciones", oError);
                }

            });



            //  this.loadSections(); // Llamar al método para cargar las secciones
        },

        onTilePress: function (oEvent) {
            var sQueryString = oEvent.getSource().getCustomData()[0].getValue(); // Obtener QueryString

            console.log("QueryString obtenido:", sQueryString); // Debug en consola

            if (sQueryString && sQueryString !== "null") {
                var sUrl = "/sap/ui2/flp?sap-client=500#AnalyticQuery-preview?query=" + encodeURIComponent(sQueryString);
                sap.m.URLHelper.redirect(sUrl, true);
            } else {
                sap.m.MessageToast.show("No hay Query disponible.");
            }
        },







        loadTiles: function (sectionId) {
            var oModel = this.getView().getModel("mainService");

            if (!sectionId) {
                console.error("El Id de la sección no es válido");
                return;
            }

            oModel.read("/SD_TILESSet", {
                filters: [
                    new sap.ui.model.Filter("IdSection", sap.ui.model.FilterOperator.EQ, sectionId)
                ],
                success: function (oData) {
                    if (oData.results && oData.results.length > 0) {
                        var oSectionModel = this.getView().getModel("sectionModel");
                        var aSections = oSectionModel.getProperty("/Sections");

                        // Buscar la sección correspondiente
                        var oSection = aSections.find(section => section.Id === sectionId);
                        if (oSection) {
                            // Asignar los tiles a la sección correcta
                            oSection.Tiles = oData.results.map((tile, index) => ({
                                ...tile,
                                uniqueId: "tile" + sectionId + "_" + index
                            }));

                            // Actualizar el modelo correctamente
                            oSectionModel.setProperty("/Sections", aSections);
                        }
                    }
                }.bind(this),
                error: function (oError) {
                    console.error("Error al obtener los tiles:", oError);
                }
            });
        },









        prueba: function () {
            var sTransactionCode = "ZTU_TRANSACCION"; // Reemplaza con tu código de transacción
            var sUrl = "/sap/bc/gui/sap/its/webgui?~transaction=" + sTransactionCode;
            sap.m.URLHelper.redirect(sUrl, true);
        }



    });
});