(function (window) {

    // namespace
    var Page_Software_SystemSettings = new (function () {

        this.SystemSettings = function () {

            this.category = "Software";
            this.name = "System";
            this.subnavigationicon = "sec-nav-sys-settings.png";

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
                base.addParameter("TIME_Property_SNTP_Server", true);
                base.addParameter("TIME_Property_SNTP_Refresh", true);
                base.addParameter("TIME_Property_Seconds", false);
                base.addParameter("TIME_Property_Textual_DateTime_presentation", true);
                base.addParameter("TIME_Property_Timezone", true);
                base.addParameter("TIME_Property_Timezones_Len", false);
                base.addParameter("DisplayDevice_Property_DeviceName", false);
                base.addParameter("DisplayDevice_Settings_Property_IDxActiveDisplayMode", true);
                base.addParameter("DisplayDevice_Modes_Property_Len", false);

                // init events
                base.setOnInitStaticPage(OnInitStaticPage);
                base.setOnDisplayValues(OnDisplayValues);
                base.setOnWriteFailed(OnWriteFailed); 
                base.setOnWriteResult(OnWriteResult); 
                //base.setOnServiceTransferFailed(OnServiceTransferFailed); not used in this page
                //base.setOnServiceTransferResult(OnServiceTransferResult); not used in this page

                return true;
            }

            var OnInitStaticPage = function (RequestParamIDs) {

                var html = "";
                
                if (RequestParamIDs[0].values.length > 0 && // SNTP Server (can have errCode: 0xECA60105 if SNTP turned off)
                    RequestParamIDs[1].getHasValues())    // SNTP Refresh
                {
                    // Time-Title with buttons to accept or cancel changes
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += '<td class="td_trans"><h3>SNTP Server</h3></td>';
                    html += '<td class="td_Action_trans">' +
                        new ControlLib.SmallButton().Create("btnTurnOffSNTP", "power", "Turn Off SNTP Server") +
                        new ControlLib.SmallButton().Create("btnWriteSNTPSettings", "save", "Activate SNTP Settings") +
                        new ControlLib.SmallButton().Create("btnWriteSNTPSettings_Cancel", "delete") + '</td>';
                    html += '</tr></table>';

                    // Time-Table
                    html += "<table>";
                    if (RequestParamIDs[0].values.length > 0 &&
                        RequestParamIDs[1].getHasValues()) {

                        html += '<tr><td class="td_FirstColumn">Servername</td><td>' + new ControlLib.Textbox().Create(RequestParamIDs[0].parameterName) + '</td></tr> ';

                        var SNTPRefreshDurations = Helper.getSNTPRefreshDurationsArr();
                        html += '<tr><td class="td_FirstColumn">Refresh Rate</td><td>' + new ControlLib.Combobox().Create(RequestParamIDs[1].parameterName, SNTPRefreshDurations) + '</td></tr> ';
                    }
                    html += "</table>";
                    html += '<br>';
                }

                if (RequestParamIDs[3].getHasValues())      // DateTime Textual presentation
                {
                    // Time-Title with buttons to accept or cancel changes
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += '<td class="td_trans"><h3>Local Date/Time</h3></td>';
                    html += '<td class="td_Action_trans">' +
                        new ControlLib.SmallButton().Create("btnWriteTimeSettings", "save", "Save Local Date/Time") +
                        new ControlLib.SmallButton().Create("btnWriteTimeSettings_Cancel", "delete") + '</td>';
                    html += '</tr></table>';

                    // Time-Table
                    html += "<table>";
                    if (RequestParamIDs[3].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Date (dd.MM.yyyy)</td><td>' + new ControlLib.Textbox().Create(RequestParamIDs[3].parameterName + "_date") + '</td></tr>';
                        html += '<tr><td class="td_FirstColumn">Time (HH:mm:ss)</td><td>' + new ControlLib.Textbox().Create(RequestParamIDs[3].parameterName + "_time") + '</td></tr>';
                    }
                    html += "</table>";
                    html += '<br>';
                }


                if (RequestParamIDs[4].getHasValues() &&    // Timezone Idx
                    RequestParamIDs[5].getHasValues())      // Timezone-strings
                {

                    // Time-Title with buttons to accept or cancel changes
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += '<td class="td_trans"><h3>Timezone</h3></td>';
                    html += '<td class="td_Action_trans">' +
                        new ControlLib.SmallButton().Create("btnWriteTimezoneSettings", "save", "Save Timezone") +
                        new ControlLib.SmallButton().Create("btnWriteTimezoneSettings_Cancel", "delete") + '</td>';
                    html += '</tr></table>';

                    html += "<table>";

                    var TimeZones = [];
                    try {
                        for (var i = 0; i < RequestParamIDs[5].values[0].length; i++) {
                            TimeZones.push(RequestParamIDs[5].values[0][i].data);
                        }

                        html += '<tr><td class="td_FirstColumn">Timezone</td><td>' + new ControlLib.Combobox().Create(RequestParamIDs[4].parameterName, TimeZones, "100%") + '</td></tr>';
                    }
                    catch (e) {
                        TimeZones = [];
                    }

                    html += "</table>";
                    html += '<br>';
                }


                if (RequestParamIDs[6].getHasValues() &&    // Display names
                    RequestParamIDs[7].getHasValues() && RequestParamIDs[8].getHasValues()) { // Current DisplayMode and available Modes

                    // Display Device-Title with buttons to accept or cancel changes
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += '<td class="td_trans"><h3>Display Device</h3></td>';
                    html += '<td class="td_Action_trans">' +
                        new ControlLib.SmallButton().Create("btnWriteDisplayDeviceSettings", "save", "Save Display Resolution") +
                        new ControlLib.SmallButton().Create("btnWriteDisplayDeviceSettings_Cancel", "delete") + '</td>';
                    html += '</tr></table>';


                    html += "<table>"
                    html += '<tr><th>Name</th><th>Display Resolution</th></tr>';

                    for (var i = 0; i < RequestParamIDs[6].moduleCount; i++) {

                        html += '<tr>';
                        html += '<td class="td_FirstColumn"><div id="' + RequestParamIDs[6].parameterName + i + '"></div></td>';   // Name

                        var DisplayResolutions = [];
                        var DisplayResolutionValues = [];

                        DisplayResolutions.push("");
                        DisplayResolutionValues.push(-1);
                        try {
                            for (var j = 0; j < RequestParamIDs[8].values[i].length; j++) {
                                DisplayResolutions.push(RequestParamIDs[8].values[i][j].data);
                                DisplayResolutionValues.push(j);
                            }
                        }
                        catch (e) {
                            DisplayResolutions = [];
                            DisplayResolutionValues = [];
                        }

                        html += '<td>';
                        if (DisplayResolutions.length > 0) {
                            // Combobox to choose Display Resolution 
                            html += new ControlLib.Combobox().CreateMap(RequestParamIDs[8].parameterName + i, DisplayResolutions, DisplayResolutionValues, "100%");
                        }
                        html += '</td>';

                        html += '</tr>';
                    }

                    html += '</table>';
                    html += '<br>';
                }

                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);

                // Add Events
                if (RequestParamIDs[0].values.length > 0 &&
                    RequestParamIDs[1].getHasValues()) {

                    base.addLockListener(RequestParamIDs[0].parameterName);
                    base.addLockListener(RequestParamIDs[1].parameterName);
                    
                    base.setElementOnClick("btnTurnOffSNTP", function (_id) { return function () { TurnOffSNTP(_id); }; }(0));
                    base.setElementOnClick("btnWriteSNTPSettings", function (_id) { return function () { WriteSNTPSettings(_id); }; }(0));
                    base.setElementOnClick("btnWriteSNTPSettings_Cancel", function (_id) { return function () { WriteSNTPSettings_Cancel(_id); }; }(0));
                }

                if (RequestParamIDs[3].getHasValues()) {

                    base.addLockListener(RequestParamIDs[3].parameterName + "_date");
                    base.addLockListener(RequestParamIDs[3].parameterName + "_time");

                    base.setElementOnClick("btnWriteTimeSettings", function (_id) { return function () { WriteTimeSettings(_id); }; }(0));
                    base.setElementOnClick("btnWriteTimeSettings_Cancel", function (_id) { return function () { WriteTimeSettings_Cancel(_id); }; }(0));
                }

                if (RequestParamIDs[4].getHasValues() &&
                    RequestParamIDs[5].getHasValues()) {

                    base.addLockListener(RequestParamIDs[4].parameterName);

                    base.setElementOnClick("btnWriteTimezoneSettings", function (_id) { return function () { WriteTimezoneSettings(_id); }; }(0));
                    base.setElementOnClick("btnWriteTimezoneSettings_Cancel", function (_id) { return function () { WriteTimezoneSettings_Cancel(_id); }; }(0));
                }

                if (RequestParamIDs[6].getHasValues() &&
                    RequestParamIDs[7].getHasValues() && RequestParamIDs[8].getHasValues()) {

                    for (var i = 0; i < RequestParamIDs[7].moduleCount; i++) {
                        base.addLockListener(RequestParamIDs[8].parameterName + i);
                    }

                    base.setElementOnClick("btnWriteDisplayDeviceSettings", function (_id) { return function () { WriteDisplayDeviceSettings(_id); }; }(0));
                    base.setElementOnClick("btnWriteDisplayDeviceSettings_Cancel", function (_id) { return function () { WriteDisplayDeviceSettings_Cancel(_id); }; }(0));
                }

                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                if (RequestParamIDs[0].values.length > 0 &&
                    RequestParamIDs[1].getHasValues()) {

                    base.setElementValue(RequestParamIDs[0].parameterName, RequestParamIDs[0].values[0].data);
                    base.setElementValue(RequestParamIDs[1].parameterName, Helper.getSNTPRefreshDurationIndex(RequestParamIDs[1].values[0].data));

                    var bSNTPEnabled = true;
                    if (RequestParamIDs[0].values[0].error == 0xECA60105) { bSNTPEnabled = false; }         // No data available
                    else if (RequestParamIDs[0].values[0].error == 0xECA61000) { bSNTPEnabled = false; }    // Not supported

                    base.setElementDisabled(RequestParamIDs[1].parameterName, !bSNTPEnabled);
                }

                if (RequestParamIDs[2].getHasValues()) {
                    
                    //base.setElementValue(RequestParamIDs[2].parameterName + "_date", Helper.parseDateFromTimestamp(RequestParamIDs[2].values[0].data));
                    //base.setElementValue(RequestParamIDs[2].parameterName + "_time", Helper.parseTimeFromTimestamp(RequestParamIDs[2].values[0].data));
                }

                if (RequestParamIDs[3].getHasValues()) {

                    var isoDt = new Helper.TextualDateTime_ISO8601(RequestParamIDs[3].values[0].data);
                    if (isoDt.isValidDate()) {

                        base.setElementValue(RequestParamIDs[3].parameterName + "_date", isoDt.getDateString());
                        base.setElementValue(RequestParamIDs[3].parameterName + "_time", isoDt.getTimeString());
                    }
                }

                if (RequestParamIDs[4].getHasValues() && RequestParamIDs[5].getHasValues()) {
                    // Write TimezoneIdx in Timezone Combobox
                    base.setElementValue(RequestParamIDs[4].parameterName, RequestParamIDs[4].values[0].data);
                }

                if (RequestParamIDs[6].getHasValues() &&
                    RequestParamIDs[7].getHasValues() && RequestParamIDs[8].getHasValues()) {

                    for (var i = 0; i < RequestParamIDs[7].moduleCount; i++) {

                        base.writeElement(RequestParamIDs[6].parameterName + i, RequestParamIDs[6].values[i].data);

                        var ResolutionIndex = RequestParamIDs[7].values[i].data;
                        ResolutionIndex--;  // zero based ResolutionIndex

                        if (ResolutionIndex >= 0) {
                            base.setElementValue(RequestParamIDs[8].parameterName + i, ResolutionIndex);
                        }
                        else {
                            base.setElementValue(RequestParamIDs[8].parameterName + i, -1); // Empty combobox item
                        }
                    }
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

                    // check which group was written
                    if (Helper.StringStartsWith(ModuleItemsWritten[i].name, "TIME_Property_SNTP"))
                    {
                        WriteSNTPSettings_Cancel();
                    }
                    else if (Helper.StringStartsWith(ModuleItemsWritten[i].name, "TIME_Property_Textual_DateTime_presentation"))
                    {
                        WriteTimeSettings_Cancel();
                    }
                    else if (Helper.StringStartsWith(ModuleItemsWritten[i].name, "TIME_Property_Timezone"))
                    {
                        WriteTimezoneSettings_Cancel();
                    }
                    else if(Helper.StringStartsWith(ModuleItemsWritten[i].name, "DisplayDevice_"))
                    {
                        WriteDisplayDeviceSettings_Cancel();
                    }
                }

                // other functions
                for (var i = 0; i < ModuleItemsWritten.length; i++) {

                    if (ErrorCodes[i] == 0 ) {

                        if (Helper.StringStartsWith(ModuleItemsWritten[i].name, "DisplayDevice_") ||
                            ModuleItemsWritten[i].name == "TIME_Property_Timezone") {

                            // Reboot if CE
                            if (wince) {
                                RebootMachine(true);
                                break;
                            }
                        }
                    }
                }

            }

            
            var TurnOffSNTP = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                writeParams.push("TIME_Property_SNTP_Server");
                idxs.push(0);
                writeValues.push("NoSync");
                
                base.Write(writeParams, idxs, writeValues);
                Helper.ShowLoading();
            }

            var WriteSNTPSettings = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                if (base.isLocked("TIME_Property_SNTP_Server")) {

                    writeParams.push("TIME_Property_SNTP_Server");
                    idxs.push(0);
                    writeValues.push(base.getElementValue("TIME_Property_SNTP_Server"));
                }

                var bSNTPEnabled = true;
                if (base.getRequestParamIDs()[0].values[0].error == 0xECA60105) { bSNTPEnabled = false; }
                // If SNTP was disabled and gets activated with this write-action, update the refresh rate too!

                if (base.isLocked("TIME_Property_SNTP_Refresh") ||
                    base.isLocked("TIME_Property_SNTP_Server") && !bSNTPEnabled) {

                    writeParams.push("TIME_Property_SNTP_Refresh");
                    idxs.push(0);
                    writeValues.push(Helper.getSNTPRefreshDurationInSec(base.getElementValue("TIME_Property_SNTP_Refresh")));
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }

            }

            var WriteSNTPSettings_Cancel = function (idx) {

                base.removeLock("TIME_Property_SNTP_Server");
                base.removeLock("TIME_Property_SNTP_Refresh");
            }


            var WriteTimeSettings = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                if (base.isLocked("TIME_Property_Textual_DateTime_presentation_date") ||
                    base.isLocked("TIME_Property_Textual_DateTime_presentation_time")) {

                    // prepare new date
                    var isoDt = new Helper.TextualDateTime_ISO8601(base.getRequestParamIDs()[3].values[0].data);
                    if (isoDt.isValidDate()) {

                        var NewDate = base.getElementValue("TIME_Property_Textual_DateTime_presentation_date");
                        var NewTime = base.getElementValue("TIME_Property_Textual_DateTime_presentation_time");

                        if (isoDt.setDateTime(NewDate, NewTime)) {

                            var isoDtStr = isoDt.getISO8601String();

                            // ISO8601 fixed in MDP
                            //if (winxp) { isoDtStr = isoDt.getISO8601NotString(); }
                            //else { isoDtStr = isoDt.getISO8601String(); }

                            if (isoDtStr.length != "") {
                                writeParams.push("TIME_Property_Textual_DateTime_presentation");
                                idxs.push(idx);
                                writeValues.push(isoDtStr);
                            }
                        }
                        else {

                            window.DevMan.getErrorQueue().AddError(0x80050030);
                        }
                    }
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var WriteTimeSettings_Cancel = function (idx) {
                
                base.removeLock("TIME_Property_Textual_DateTime_presentation_date");
                base.removeLock("TIME_Property_Textual_DateTime_presentation_time");
            }


            var WriteTimezoneSettings = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                if (base.isLocked("TIME_Property_Timezone")) {

                    writeParams.push("TIME_Property_Timezone");
                    idxs.push(idx);
                    writeValues.push(base.getElementValue("TIME_Property_Timezone"));
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var WriteTimezoneSettings_Cancel = function (idx) {

                base.removeLock("TIME_Property_Timezone");
            }

            var WriteDisplayDeviceSettings = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                var iDisplayDeviceModules = base.getRequestParamIDs()[7].moduleCount;

                for (var i = 0; i < iDisplayDeviceModules; i++) {

                    if (base.isLocked("DisplayDevice_Modes_Property_Len" + i)) {

                        var DisplayModeIdx = base.getElementValue("DisplayDevice_Modes_Property_Len" + i);
                        DisplayModeIdx++;   // DisplayModes start @ idx 1 (mdp)

                        if (DisplayModeIdx > 0) {
                            writeParams.push("DisplayDevice_Settings_Property_IDxActiveDisplayMode");
                            idxs.push(i);

                            writeValues.push(DisplayModeIdx);
                        }
                    }
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var WriteDisplayDeviceSettings_Cancel = function (idx) {

                var iDisplayDeviceModules = base.getRequestParamIDs()[7].moduleCount;

                for (var i = 0; i < iDisplayDeviceModules; i++) {
                    base.removeLock("DisplayDevice_Modes_Property_Len" + i);
                }
            }

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
            }

        }

        this.SystemSettings.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Software_SystemSettings.SystemSettings(), window.DevMan.ModuleType.Website);

})(window);
