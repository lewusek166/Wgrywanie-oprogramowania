(function (window) {

    // namespace
    var Page_TwinCAT_Connectivity = new (function () {

        this.Connectivity = function () {

            this.category = "TwinCAT";
            this.name = "Connectivity";
            this.subnavigationicon = "sec-nav-network.png";

            var CycleTime = 2000;
            var base = undefined;

            this.Init = function () {

                // store context to base page
                base = this;

                if (base == undefined || base == null) {
                    return false;
                }

                // init Cycle Time for cyclic refreshing values
                base.setCycleTime(CycleTime);

                // init communication
                base.setCommunicationObj(window.DevMan.getCommunicationModule(window.DevMan.CommunicationType.mdp));

                // init parameter
                base.addParameter("TwinCAT_TcMisc_Property_TwinCATSystemID", false);    // 0
                base.addParameter("TwinCAT_TcMisc_Property_AmsNetID", true);            // 1

                base.addParameter("TwinCAT_Property_Route_Name_Len", true);             // 2     
                base.addParameter("TwinCAT_Property_Route_AMS_Address_Len", true);
                base.addParameter("TwinCAT_Property_Route_Transport_Len", true);
                base.addParameter("TwinCAT_Property_Route_Address_Len", true);          
                base.addParameter("TwinCAT_Property_Route_Timeout_Len", true);
                base.addParameter("TwinCAT_Property_Route_Flags_Len", true);            // 7
                

                // init events
                base.setOnInitStaticPage(OnInitStaticPage);
                base.setOnDisplayValues(OnDisplayValues);
                //base.setOnWriteFailed(OnWriteFailed); not used in this page
                //base.setOnWriteResult(OnWriteResult); not used in this page
                base.setOnServiceTransferFailed(OnServiceTransferFailed);
                base.setOnServiceTransferResult(OnServiceTransferResult);

                return true;
            }

            var OnInitStaticPage = function (RequestParamIDs) {

                var html = "";

                if (RequestParamIDs[0].getHasValues() ||
                    RequestParamIDs[1].getHasValues()) {

                    html += '<h3>Connectivity</h3>';
                    html += "<table>";

                    if (RequestParamIDs[0].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">System ID</td><td><div id="' + RequestParamIDs[0].parameterName + '"></div></td></tr>';
                    }

                    if (RequestParamIDs[1].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">AMS Net ID</td><td><div id="' + RequestParamIDs[1].parameterName + '"></div></td></tr>';
                    }

                    html += "</table>"
                    html += "<br>";
                }


                // List/Remove TwinCAT Routes
                html += '<h3>TwinCAT Routes</h3>';
                html += '<div id="TwinCAT_Routes">No routes available</div>';
                html += '<br>';


                // Add TwinCAT Route
                html += '<table style="margin-bottom: 5px"><tr>';
                html += '<td class="td_trans"><h4>Add TwinCAT Route</h4></td>';
                html += '<td class="td_Action_trans">' +
                    new ControlLib.SmallButton().Create("btnAddTwinCATRoute", "save", "Add TwinCAT Route") +
                    new ControlLib.SmallButton().Create("btnAddTwinCATRoute_Cancel", "delete") + '</td>';
                html += '</tr></table>';

                html += '<table>';
                html += '<tr><td class="td_FirstColumn">Route Name</td><td>' + new ControlLib.Textbox().Create("txtAddRoute_Name") + '</td></tr>';
                html += '<tr><td class="td_FirstColumn">AMS Net ID</td><td>' + new ControlLib.Textbox().Create("txtAddRoute_AmsNetId") + '</td></tr>';
                var cmbItemsRouteTransportTypes = Helper.getTwinCATRouteTransportTypes();
                html += '<tr><td class="td_FirstColumn">Transport Type</td><td>' + new ControlLib.Combobox().Create("cmbAddRoute_TransportType", cmbItemsRouteTransportTypes) + '</td></tr></td>';
                html += '<tr><td class="td_FirstColumn">Address</td><td>' +
                    new ControlLib.Textbox().Create("txtAddRoute_Address") +
                    new ControlLib.Radiobutton().Create("rdAddRouteFlag_Dynamic", 2, "Host Name", true) +
                    new ControlLib.Radiobutton().Create("rdAddRouteFlag_Dynamic", 0, "IP Address", false) +
                    '</td></tr>';
                html += '<tr><td class="td_FirstColumn">Connection Timeout (ms)</td><td>' + new ControlLib.Textbox().Create("txtAddRoute_Timeout") + '</td></tr>';
                html += '<tr><td class="td_FirstColumn">Temporary</td><td>' + new ControlLib.Checkbox().Create("chkAddRouteFlag_Temporary", 1, "Delete route after next restart") + '</td></tr>';
                // not supported yet:
                // html += '<tr><td class="td_FirstColumn">No Override</td><td>' + new ControlLib.Checkbox().Create("chkAddRouteFlag_NoOverride", 4, "Do not override route") + '</td></tr>';
                html += '</table>';
                html += '<br>';
                
                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);


                // Add Events
                base.setElementOnClick("btnAddTwinCATRoute", function (_id) { return function () { TwinCATRouteAdd(_id); }; }(0));
                base.setElementOnClick("btnAddTwinCATRoute_Cancel", function (_id) { return function () { TwinCATRouteAdd_Cancel(_id); }; }(0));

                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                if (RequestParamIDs[0].getHasValues()) {
                    base.writeElement(RequestParamIDs[0].parameterName, RequestParamIDs[0].values[0].data);
                }

                if (RequestParamIDs[1].getHasValues()) {
                    base.writeElement(RequestParamIDs[1].parameterName, RequestParamIDs[1].values[0].data);
                }

                if (RequestParamIDs[2].getHasValues()) {

                    var html = "";

                    var Rows = RequestParamIDs[2].values[0].length;
                    for (var i = 0; i < Rows; i++) {

                        html += '<table style="margin-bottom: 5px"><tr>';
                        html += '<td class="td_trans"><h4>#' + (i + 1) + " " + RequestParamIDs[2].values[0][i].data + '</h4></td>';
                        html += '<td class="td_Action_trans">' +
                            new ControlLib.SmallButton().Create("btnDelTwinCATRoute" + i, "delete", "") + '</td>';
                        html += '</tr></table>';

                        html += '<table>';
                        if (RequestParamIDs[3].values[0].length > i) { html += '<tr><td class="td_FirstColumn">AMS Net ID</td><td>' + RequestParamIDs[3].values[0][i].data + '</td></tr>'; }
                        if (RequestParamIDs[4].values[0].length > i) { html += '<tr><td class="td_FirstColumn">Transport Type</td><td>' + Helper.getTwinCATRouteTransportTypeById(RequestParamIDs[4].values[0][i].data) + '</tr></td>'; }
                        if (RequestParamIDs[5].values[0].length > i) { html += '<tr><td class="td_FirstColumn">Address</td><td>' + RequestParamIDs[5].values[0][i].data + '</td></tr>'; }
                        if (RequestParamIDs[6].values[0].length > i) { html += '<tr><td class="td_FirstColumn">Connection Timeout (ms)</td><td>' + RequestParamIDs[6].values[0][i].data + '</td></tr>'; }
                        if (RequestParamIDs[7].values[0].length > i) { html += '<tr><td class="td_FirstColumn">Flags</td><td>' + Helper.getTwinCATRouteFlagsStr(RequestParamIDs[7].values[0][i].data) + '</td></tr>'; }
                        html += '</table>';
                        html += '<br>';
                    }

                    if (Rows == 0) { html = "No routes available"; }


                    base.writeElement("TwinCAT_Routes", html);

                    // Add Events
                    for (var i = 0; i < Rows; i++) {

                        var sRouteName = RequestParamIDs[2].values[0][i].data;
                        base.setElementOnClick("btnDelTwinCATRoute" + i, function (_RouteName) { return function () { TwinCATRouteDelete(_RouteName); }; }(sRouteName));
                    }

                }
                else {
                    var html = "No routes available";
                    base.writeElement("TwinCAT_Routes", html);
                }
            }


            ////////////////////////////////////////////////////////////////////////////////////////////
            // Service-Transfers
            /////////////////////////////////////////////////////////////////////////////////////////
            var OnServiceTransferFailed = function (error) {

                Helper.HideLoading();
                window.DevMan.getErrorQueue().AddError(error.requestStatus, error.requestStatusText);
            }

            var OnServiceTransferResult = function (serviceTransferResponse) {

                if (serviceTransferResponse.isBusy) {
                    return; // just wait
                }

                Helper.HideLoading();

                if (serviceTransferResponse.hasError) {
                    window.DevMan.getErrorQueue().AddError(serviceTransferResponse.errCode);
                }
                else {

                    // Check the specific result
                    switch (serviceTransferResponse.moduleItem.name) {

                        case "TwinCAT_Function_AddRoute":
                            TwinCATRouteAdd_Cancel(0);
                            break;

                        default:
                            break;
                    }
                }

            }

            var TwinCATRouteAdd = function (idx) {

                var CommandParamID = "TwinCAT_Function_AddRoute";

                var nFlags = 0;
                nFlags |= base.getCheckedRadioButtonValue("rdAddRouteFlag_Dynamic");
                if (base.getElementChecked("chkAddRouteFlag_Temporary")) { nFlags |= base.getElementValue("chkAddRouteFlag_Temporary"); }
                //not supported yet:
                //if (base.getElementChecked("chkAddRouteFlag_NoOverride")) { nFlags |= base.getElementValue("chkAddRouteFlag_NoOverride"); }

                var nTimeout = base.getElementValue("txtAddRoute_Timeout");
                var nTransportType = base.getElementValue("cmbAddRoute_TransportType");
                var bNetIdArr = base.getElementValue("txtAddRoute_AmsNetId").split(".");
                if (bNetIdArr.length != 6) { bNetIdArr = [0, 0, 0, 0, 0, 0]; }
                var sRouteName = base.getElementValue("txtAddRoute_Name");
                var sAddress = base.getElementValue("txtAddRoute_Address");

                var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID) +
                                    sRouteName.length +
                                    sAddress.length;

                var paramValues = [];
                paramValues.push(cbInputData);
                paramValues.push(nFlags);
                paramValues.push(nTimeout);
                paramValues.push(nTransportType);
                paramValues.push(bNetIdArr[0]);
                paramValues.push(bNetIdArr[1]);
                paramValues.push(bNetIdArr[2]);
                paramValues.push(bNetIdArr[3]);
                paramValues.push(bNetIdArr[4]);
                paramValues.push(bNetIdArr[5]);
                paramValues.push(sRouteName.length);
                paramValues.push(sAddress.length);
                paramValues.push(sRouteName);
                paramValues.push(sAddress);

                base.executeCommand(CommandParamID, 0, paramValues);
                Helper.ShowLoading();
            }

            var TwinCATRouteAdd_Cancel = function (idx) {

                base.setElementValue("txtAddRoute_Name", "");
                base.setElementValue("txtAddRoute_AmsNetId", "");
                base.setElementValue("cmbAddRoute_TransportType", 0);
                base.setElementValue("txtAddRoute_Address", "");
                base.setElementChecked("rdAddRouteFlag_Dynamic_Host Name");
                base.setElementValue("txtAddRoute_Timeout", "");
                base.setElementUnchecked("chkAddRouteFlag_Temporary");
            }

            var TwinCATRouteDelete = function (RouteName) {

                if (confirm("Do you really want to delete the route " + RouteName + "?")) {

                    var CommandParamID = "TwinCAT_Function_DelRoute";

                    var paramValues = [];
                    paramValues.push(RouteName.length);
                    paramValues.push(RouteName);

                    base.executeCommand(CommandParamID, 0, paramValues);
                    Helper.ShowLoading();
                }
            }

        }

        this.Connectivity.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_TwinCAT_Connectivity.Connectivity(), window.DevMan.ModuleType.Website);

})(window);
