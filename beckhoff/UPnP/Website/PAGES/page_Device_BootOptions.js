(function (window) {

    // namespace
    var Page_Device_BootOptions = new (function () {

        this.BootOptions = function () {

            this.category = "Device";
            this.name = "Boot";
            this.subnavigationicon = "sec-nav-equipment.png";

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
                base.addParameter("Misc_Properties_StartupNumlockState", true);                                    // Idx: 0
                base.addParameter("Misc_Properties_CERemoteDisplayEnabled", true);                                 // Idx: 1

                // init events
                base.setOnInitStaticPage(OnInitStaticPage);
                base.setOnDisplayValues(OnDisplayValues);
                base.setOnWriteFailed(OnWriteFailed);
                base.setOnWriteResult(OnWriteResult);
                base.setOnServiceTransferFailed(OnServiceTransferFailed);
                base.setOnServiceTransferResult(OnServiceTransferResult);

                return true;
            }

            var OnInitStaticPage = function (RequestParamIDs) {

                var html = "";

                if (wince) {

                    // Startup Numlock State
                    if (RequestParamIDs[0].getHasValues()) {

                        html += '<table style="margin-bottom: 5px"><tr>';
                        html += '<td class="td_trans"><h3>Startup Numlock State</h3></td>';
                        html += '<td class="td_Action_trans">' +
                            new ControlLib.SmallButton().Create("btnWriteStartupNumlockStateSettings", "save", "Save Startup Numlock State") +
                            new ControlLib.SmallButton().Create("btnWriteStartupNumlockStateSettings_Cancel", "delete") +
                            '</td>';
                        html += '</tr></table>';
                        var StartupNumlockStates = ["Off", "On"];
                        html += '<table><tr><td class="td_FirstColumn">Startup Numlock State</td><td>' + new ControlLib.Combobox().Create(RequestParamIDs[0].parameterName, StartupNumlockStates) + '</td></tr></table>';
                        html += '<br>';
                        html += '<br>';
                    }
                
                    // Remote Display Enabled
                    if (RequestParamIDs[1].getHasValues()) {

                        html += '<table style="margin-bottom: 5px"><tr>';
                        html += '<td class="td_trans"><h3>Remote Display</h3></td>';
                        html += '<td class="td_Action_trans">' +
                            new ControlLib.SmallButton().Create("btnWriteRemoteDisplayEnabledSettings", "save", "Save Remote Display Setting") +
                            new ControlLib.SmallButton().Create("btnWriteRemoteDisplayEnabledSettings_Cancel", "delete") +
                            '</td>';
                        html += '</tr></table>';
                        var RemoteDisplayStates = ["Off", "On"];
                        html += '<table><tr><td class="td_FirstColumn">Remote Display</td><td>' + new ControlLib.Combobox().Create(RequestParamIDs[1].parameterName, RemoteDisplayStates) + '</td></tr></table>';
                        html += '<br>';
                        html += '<br>';
                    }
                

                    // Restore Factory Settings
                    html += '<table><tr><td class="td_trans"><h3>Restore Factory Settings</h3></td></tr></table>';
                    
                    html += '<table>';
                    html += '<tr><td class="td_FirstColumn_Important">Warning</td><td>You may have to clear your browsers cache before you are able to reconnect.</td></tr>';
                    html += '<tr><td class="td_trans">' + new ControlLib.Button().Create("btnRestoreFactorySettings", "Restore Settings...") + '</td></tr>';
                    html += '</table>';
                    html += '<br>';
                    html += '<br>';
                }

                html += '<table>';
                html += '<tr><td class="td_trans"><h3>Reboot Machine</h3></td></tr>';
                html += '<tr><td class="td_trans">' + new ControlLib.Button().Create("btnRebootMachine", "Reboot...") + '</td></tr>';
                html += '</table>';
                html += '<br>';
                html += '<br>';

                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);

                // Events (CE)
                if (wince) {

                    // Startup Numlock State
                    base.setElementOnClick("btnWriteStartupNumlockStateSettings", function (_id) { return function () { WriteStartupNumlockStateSettings(_id); }; }(0));
                    base.setElementOnClick("btnWriteStartupNumlockStateSettings_Cancel", function (_id) { return function () { WriteStartupNumlockStateSettings_Cancel(_id); }; }(0));
                    base.addLockListener(RequestParamIDs[0].parameterName);

                    // Remote Display Enabled
                    base.setElementOnClick("btnWriteRemoteDisplayEnabledSettings", function (_id) { return function () { WriteRemoteDisplayEnabledSettings(_id); }; }(0));
                    base.setElementOnClick("btnWriteRemoteDisplayEnabledSettings_Cancel", function (_id) { return function () { WriteRemoteDisplayEnabledSettings_Cancel(_id); }; }(0));
                    base.addLockListener(RequestParamIDs[1].parameterName);
                
                    // Restore Factory Settings
                    base.setElementOnClick("btnRestoreFactorySettings", function (_id) { return function () { RestoreFactorySettings(_id); }; }(0));
                }

                // Events (Win32/CE)
                // Reboot Machine
                base.setElementOnClick("btnRebootMachine", function (_id, _prompt) { return function () { RebootMachine(_id, _prompt); }; }(0, true));

                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                if (RequestParamIDs[0].getHasValues()) {
                    base.setElementValue(RequestParamIDs[0].parameterName, RequestParamIDs[0].values[0].data);
                }

                if (RequestParamIDs[1].getHasValues()) {
                    base.setElementValue(RequestParamIDs[1].parameterName, RequestParamIDs[1].values[0].data);
                }

            }



            ////////////////////////////////////////////////////////////////////////////////////////////
            // Write-Requests
            /////////////////////////////////////////////////////////////////////////////////////////
            var OnWriteFailed = function (error) {

                Helper.HideLoading();
                window.DevMan.getErrorQueue().AddError(error.requestStatus, error.requestStatusText);

                base.clearLocks();
            }

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

                        if (ModuleItemsWritten[i].name == "Misc_Properties_StartupNumlockState" ||
                            ModuleItemsWritten[i].name == "Misc_Properties_CERemoteDisplayEnabled") {

                            RebootMachineApplyChanges(true);
                            break;
                        }

                    }
                }

            }

            var WriteStartupNumlockStateSettings = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                var RequestParamIDs = base.getRequestParamIDs();
                
                if (base.isLocked(RequestParamIDs[0].parameterName)) {

                    var bStartupNumlockState = base.getElementValue(RequestParamIDs[0].parameterName);

                    writeParams.push(RequestParamIDs[0].parameterName);
                    idxs.push(0);
                    writeValues.push(bStartupNumlockState);
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var WriteStartupNumlockStateSettings_Cancel = function (idx) {

                var RequestParamIDs = base.getRequestParamIDs();

                base.removeLock(RequestParamIDs[0].parameterName);
            }

            var WriteRemoteDisplayEnabledSettings = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                var RequestParamIDs = base.getRequestParamIDs();

                if (base.isLocked(RequestParamIDs[1].parameterName)) {

                    var bRemoteDisplayEnabled = base.getElementValue(RequestParamIDs[1].parameterName);

                    writeParams.push(RequestParamIDs[1].parameterName);
                    idxs.push(0);
                    writeValues.push(bRemoteDisplayEnabled);
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var WriteRemoteDisplayEnabledSettings_Cancel = function (idx) {

                var RequestParamIDs = base.getRequestParamIDs();

                base.removeLock(RequestParamIDs[1].parameterName);
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

                    if (serviceTransferResponse.moduleItem.name == "MISC_Function_RestoreFactorySettings") {

                        // Do a reboot to apply changes
                        RebootMachine(0, false);
                    }
                }

            }

            var RestoreFactorySettings = function (idx) {

                if (confirm("Do you really want to restore factory settings and reboot the computer?")) {

                    var CommandParamID = "MISC_Function_RestoreFactorySettings";

                    // calc length of data
                    var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID);

                    var paramValues = [];
                    paramValues.push(cbInputData);
                    paramValues.push(0);    // Dummy

                    base.executeCommand(CommandParamID, 0, paramValues);
                    Helper.ShowLoading();
                }
            }

            var RebootMachineApplyChanges = function (prompt) {

                if (prompt) {
                    if (!confirm("You must restart your computer to apply these changes.\nDo you really want to reboot the computer?")) {
                        return;
                    }
                }

                Reboot();
            }

            var RebootMachine = function (idx, prompt) {

                if (prompt) {
                    if (!confirm("Do you really want to reboot the computer?")) {
                        return;
                    }
                }

                Reboot();
            }

            var Reboot = function () {

                var CommandParamID = "MISC_Function_Reboot";

                // calc length of data
                var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID);

                var paramValues = [];
                paramValues.push(cbInputData);
                paramValues.push(0);    // Dummy

                Helper.RebootActive();
                base.executeCommand(CommandParamID, 0, paramValues);
            }


        }

        this.BootOptions.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Device_BootOptions.BootOptions(), window.DevMan.ModuleType.Website);

})(window);
