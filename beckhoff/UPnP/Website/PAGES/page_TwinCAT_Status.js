(function (window) {

    // namespace
    var Page_TwinCAT_Status = new (function () {

        this.Status = function () {

            this.category = "TwinCAT";
            this.name = "Status";
            this.subnavigationicon = "sec-nav-status.png";

            var CycleTime = 2000;
            var base = undefined;

            var IDX_TC_Status = 0;
            var IDX_TC_RunAsDevice = 0;
            var IDX_TC_LatencyTimeWatch = 0;
            var IDX_TC_RegLevel = 0;
            var IDX_TC_ShowTargetVisu = 0;
            var IDX_TC_MajorVersion = 0;
            var IDX_TC_Minorversion = 0;
            var IDX_TC_Build = 0;
            var IDX_TC_Revision = 0;
            var IDX_TC_RouterMemMax = 0;
            var IDX_TC_RouterMemAvail = 0;

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
                IDX_TC_Status = base.addParameter("TwinCAT_TcMisc_Property_TwinCATStatus", true);
                IDX_TC_RunAsDevice = base.addParameter("TwinCAT_TcMisc_Property_RunAsDevice", true);                // CE
                IDX_TC_LatencyTimeWatch = base.addParameter("LatencyTimeWatch", true);                              // not in mdp
                IDX_TC_RegLevel = base.addParameter("TwinCAT_TcMisc_Property_RegLevel", true);
                IDX_TC_ShowTargetVisu = base.addParameter("TwinCAT_TcMisc_Property_ShowTargetVisu", true);          // CE
                IDX_TC_MajorVersion = base.addParameter("TwinCAT_TcMisc_Property_MajorVersion", false);       
                IDX_TC_Minorversion =  base.addParameter("TwinCAT_TcMisc_Property_MinorVersion", false);
                IDX_TC_Build = base.addParameter("TwinCAT_TcMisc_Property_Build", false);
                IDX_TC_Revision = base.addParameter("TwinCAT_TcMisc_Property_Revision", false);
                IDX_TC_RouterMemMax =  base.addParameter("TwinCAT_TcRouterStatusInfo_Property_MemoryMax", true);
                IDX_TC_RouterMemAvail = base.addParameter("TwinCAT_TcRouterStatusInfo_Property_MemoryAvailable", true);

                // init events
                base.setOnInitStaticPage(OnInitStaticPage);
                base.setOnDisplayValues(OnDisplayValues);
                base.setOnWriteFailed(OnWriteFailed);
                base.setOnWriteResult(OnWriteResult);
                //base.setOnServiceTransferFailed(OnServiceTransferFailed); not used in this page
                //base.setOnServiceTransferResult(OnServiceTransferResult); not used in this page

                return true;
            };

            var OnInitStaticPage = function (RequestParamIDs) {

                var html = "";

                if (RequestParamIDs[IDX_TC_Status].getHasValues() ||
                    RequestParamIDs[IDX_TC_RunAsDevice].getHasValues() ||
                    RequestParamIDs[IDX_TC_LatencyTimeWatch].getHasValues() ||
                    RequestParamIDs[IDX_TC_RegLevel].getHasValues() ||
                    RequestParamIDs[IDX_TC_ShowTargetVisu].getHasValues()) {

                    if (!winxp) {
                        html += '<table style="margin-bottom: 5px"><tr>';
                        html += '<td class="td_trans"><h3>Status</h3></td>';
                        html += '<td class="td_Action_trans">' +
                            new ControlLib.SmallButton().Create("btnWriteTcSettings", "save") +
                            new ControlLib.SmallButton().Create("btnWriteTcSettings_Cancel", "delete") + '</td>';
                        html += '</tr></table>';
                    }
                    else {
                        html += "<h3>Status</h3>";
                    }

                    html += "<table>";
                    if (RequestParamIDs[IDX_TC_Status].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">TwinCAT Status</td><td><div id="' + RequestParamIDs[IDX_TC_Status].parameterName + '"></div></td></tr>';
                    }
                    if (RequestParamIDs[IDX_TC_RunAsDevice].getHasValues()) {
                        // RunAsDevice
                        var ComboItems = ["No", "Yes"];
                        html += '<tr><td class="td_FirstColumn">Run As Device</td><td>' + new ControlLib.Combobox().Create(RequestParamIDs[IDX_TC_RunAsDevice].parameterName, ComboItems) + '</td></tr>';
                    }
                    if (RequestParamIDs[IDX_TC_LatencyTimeWatch].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Latency timewatch</td><td><div id="temp1">no mdp property</div></td></tr>';
                    }
                    if (RequestParamIDs[IDX_TC_RegLevel].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Reg Level</td><td><div id="' + RequestParamIDs[IDX_TC_RegLevel].parameterName + '"></div></td></tr>';
                    }
                    if (RequestParamIDs[IDX_TC_ShowTargetVisu].getHasValues()) {
                        // ShowTargetVisu
                        var ComboItems = ["No", "Yes"];
                        html += '<tr><td class="td_FirstColumn">Show Target-Visu</td><td>' + new ControlLib.Combobox().Create(RequestParamIDs[IDX_TC_ShowTargetVisu].parameterName, ComboItems) + '</td></tr>';
                    }
                    html += "</table>";
                    html += "<br>";
                }

                if (RequestParamIDs[IDX_TC_MajorVersion].getHasValues() ||
                    RequestParamIDs[IDX_TC_Minorversion].getHasValues() ||
                    RequestParamIDs[IDX_TC_Build].getHasValues()) {

                    html += '<h3>Version</h3>';
                    html += "<table>";

                    if (RequestParamIDs[IDX_TC_MajorVersion].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Major</td><td><div id="' + RequestParamIDs[IDX_TC_MajorVersion].parameterName + '"></div></td></tr>';
                    }
                    if (RequestParamIDs[IDX_TC_Minorversion].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Minor</td><td><div id="' + RequestParamIDs[IDX_TC_Minorversion].parameterName + '"></div></td></tr>';
                    }
                    if (RequestParamIDs[IDX_TC_Build].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Build</td><td><div id="' + RequestParamIDs[IDX_TC_Build].parameterName + '"></div></td></tr>';
                    }
                    if (RequestParamIDs[IDX_TC_Revision].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Revision</td><td><div id="' + RequestParamIDs[IDX_TC_Revision].parameterName + '"></div></td></tr>';
                    }
                    
                    html += "</table>";
                    html += "<br>";
                }

                if (RequestParamIDs[IDX_TC_RouterMemMax].getHasValues() &&
                    RequestParamIDs[IDX_TC_RouterMemAvail].getHasValues()) {

                    html += '<h3>Router</h3>';
                    html += "<table>";
                    html += '<tr><div id="' + RequestParamIDs[IDX_TC_RouterMemMax].parameterName + '"></div></tr>';
                    html += "</table>";
                    html += "<br>";
                }

                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);

                if (!winxp) {
                    // locks
                    base.addLockListener(RequestParamIDs[IDX_TC_RunAsDevice].parameterName);
                    base.addLockListener(RequestParamIDs[IDX_TC_ShowTargetVisu].parameterName);

                    // events
                    base.setElementOnClick("btnWriteTcSettings", function (_id) { return function () { WriteTcSettings(_id); }; }(0));
                    base.setElementOnClick("btnWriteTcSettings_Cancel", function (_id) { return function () { WriteTcSettings_Cancel(_id); }; }(0));
                }

                return true;
            };

            var OnDisplayValues = function (RequestParamIDs) {

                if (RequestParamIDs[IDX_TC_Status].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_TC_Status].parameterName, Helper.getTwinCATState(RequestParamIDs[IDX_TC_Status].values[0].data));
                }
                if (RequestParamIDs[IDX_TC_RunAsDevice].getHasValues()) {
                    base.setElementValue(RequestParamIDs[IDX_TC_RunAsDevice].parameterName, RequestParamIDs[IDX_TC_RunAsDevice].values[0].data);
                }
                if (RequestParamIDs[IDX_TC_LatencyTimeWatch].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_TC_LatencyTimeWatch].parameterName, RequestParamIDs[IDX_TC_LatencyTimeWatch].values[0].data);
                }
                if (RequestParamIDs[IDX_TC_RegLevel].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_TC_RegLevel].parameterName, Helper.getTwinCATRegLevel(RequestParamIDs[IDX_TC_RegLevel].values[0].data));
                }
                if (RequestParamIDs[IDX_TC_ShowTargetVisu].getHasValues()) {
                    base.setElementValue(RequestParamIDs[IDX_TC_ShowTargetVisu].parameterName, RequestParamIDs[IDX_TC_ShowTargetVisu].values[0].data);
                }

                if (RequestParamIDs[IDX_TC_MajorVersion].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_TC_MajorVersion].parameterName, RequestParamIDs[IDX_TC_MajorVersion].values[0].data);
                }
                if (RequestParamIDs[IDX_TC_Minorversion].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_TC_Minorversion].parameterName, RequestParamIDs[IDX_TC_Minorversion].values[0].data);
                }
                if (RequestParamIDs[IDX_TC_Build].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_TC_Build].parameterName, RequestParamIDs[IDX_TC_Build].values[0].data);
                }
                if (RequestParamIDs[IDX_TC_Revision].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_TC_Revision].parameterName, RequestParamIDs[IDX_TC_Revision].values[0].data);
                }

                if (RequestParamIDs[IDX_TC_RouterMemMax].getHasValues() &&
                    RequestParamIDs[IDX_TC_RouterMemAvail].getHasValues()) {

                    var RouterMemMax = RequestParamIDs[IDX_TC_RouterMemMax].values[0].data;
                    var RouterMemAvail = RequestParamIDs[IDX_TC_RouterMemAvail].values[0].data;
                    base.writeElement(RequestParamIDs[IDX_TC_RouterMemMax].parameterName, new ControlLib.Bargraph().CreateMemoryBar(
                        "res/modules/ram/kachelicons-sw-groesse-1-ram_32.png", "Memory", RouterMemMax, RouterMemMax - RouterMemAvail));
                }

            };


            ////////////////////////////////////////////////////////////////////////////////////////////
            // Write-Requests
            /////////////////////////////////////////////////////////////////////////////////////////
            var OnWriteFailed = function (error) {

                Helper.HideLoading();
                window.DevMan.getErrorQueue().AddError(error.requestStatus, error.requestStatusText);

                base.clearLocks();
            };

            var OnWriteResult = function (ModuleItemsWritten, ErrorCodes) {

                Helper.HideLoading();

                // check for errors
                for (var i = 0; i < ModuleItemsWritten.length; i++) {
                    if (ErrorCodes[i] > 0) {
                        window.DevMan.getErrorQueue().AddError(ErrorCodes[i]);
                    }
                }

                // remove Locks
                for (var i = 0; i < ModuleItemsWritten.length; i++) {
                    base.removeLock(ModuleItemsWritten[i].name);
                }

                // other functions
                for (var i = 0; i < ModuleItemsWritten.length; i++) {

                    if (ErrorCodes[i] == 0) {

                        if (ModuleItemsWritten[i].name == "TwinCAT_TcMisc_Property_RunAsDevice" ||
                            ModuleItemsWritten[i].name == "TwinCAT_TcMisc_Property_ShowTargetVisu") {

                            RebootMachine(true);
                            break;
                        }
                    }
                }
            };

            var WriteTcSettings = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                var RequestParamIDs = base.getRequestParamIDs();

                if (base.isLocked(RequestParamIDs[IDX_TC_RunAsDevice].parameterName)) {

                    var bRunAsDevice = base.getElementValue(RequestParamIDs[IDX_TC_RunAsDevice].parameterName);

                    writeParams.push(RequestParamIDs[IDX_TC_RunAsDevice].parameterName);
                    idxs.push(0);
                    writeValues.push(bRunAsDevice);
                }

                if (base.isLocked(RequestParamIDs[IDX_TC_ShowTargetVisu].parameterName)) {

                    var bShowTargetVisu = base.getElementValue(RequestParamIDs[IDX_TC_ShowTargetVisu].parameterName);

                    writeParams.push(RequestParamIDs[IDX_TC_ShowTargetVisu].parameterName);
                    idxs.push(0);
                    writeValues.push(bShowTargetVisu);
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            };

            var WriteTcSettings_Cancel = function (idx) {
                var RequestParamIDs = base.getRequestParamIDs();

                base.removeLock(RequestParamIDs[IDX_TC_RunAsDevice].parameterName);
                base.removeLock(RequestParamIDs[IDX_TC_ShowTargetVisu].parameterName);
            };

            var RebootMachine = function (prompt) {

                if (prompt) {
                    if (!confirm("You must restart your computer to apply these changes.\nDo you really want to reboot the computer?")) {
                        return;
                    }
                }

                var CommandParamID = "MISC_Function_Reboot";

                // calc length of data
                var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID);

                var paramValues = [];
                paramValues.push(cbInputData);
                paramValues.push(0);    // Dummy

                Helper.RebootActive();
                base.executeCommand(CommandParamID, 0, paramValues);
            };

        };

        this.Status.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_TwinCAT_Status.Status(), window.DevMan.ModuleType.Website);

})(window);
