(function (window) {

    // namespace
    var Page_Device_System = new (function () {

        this.System = function () {

            this.category = "Device";
            this.name = "System";
            this.subnavigationicon = "sec-nav-verlauf.png";

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
                base.addParameter("GENERAL_Device_Name", true);                                    // Idx: 0
                base.addParameter("TIME_Property_Textual_DateTime_presentation", true);
                base.addParameter("OS_Header_Property_OSName", false);
                base.addParameter("EWF_VolumeName_Property_Len", false);
                base.addParameter("EWF_State_Property_Len", true);
                base.addParameter("FBWF_CurrentState_Property_State", true);                        // Idx: 5
                base.addParameter("RAID_Property_ControllerInfo_State", true);
                base.addParameter("UPS_Information_Property_PowerStatus", true);
                base.addParameter("UPS_Information_Property_CommunicationStatus", true);
                base.addParameter("UPS_Information_Property_BatteryStatus", true);
                base.addParameter("CPU_Property_Current_CPU_Usage", true);                          // Idx: 10
                if (wince)
                {
                    base.addParameter("Memory_Property_Program_Memory_Allocated", true);
                    base.addParameter("Memory_Property_Program_Memory_Available", true);
                }
                else {
                    base.addParameter("Memory_Property_Program_Memory_Allocated_64", true);
                    base.addParameter("Memory_Property_Program_Memory_Available_64", true);
                }
                base.addParameter("CPU_Property_Current_CPU_Temperature", true);
                base.addParameter("Mainboard_Information_Property_MinBoardTemperature", true);
                base.addParameter("Mainboard_Information_Property_MaxBoardTemperature", true);     // Idx: 15
                base.addParameter("Mainboard_Information_Property_MainboardTemperature", true);
                base.addParameter("Fan_Property_AdapterName", false);
                base.addParameter("Fan_Properties_Property_Speed", true);
                base.addParameter("DEVICE_IPC_Serial_Number", true);
                base.addParameter("Mainboard_VoltageInformationLocation_Property_Len", false);      // Idx: 20
                base.addParameter("Mainboard_VoltageInformationVoltage_Property_Len", true);
                base.addParameter("GENERAL_OS_and_Image_Version", false);
                base.addParameter("GENERAL_Hardware_Version", false);

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
                
                if (window.ProductName != undefined ||
                    RequestParamIDs[0].getHasValues() ||    // Computername
                    RequestParamIDs[1].getHasValues() ||    // Date & Time Textual Presentation
                    RequestParamIDs[2].getHasValues() ||    // OS
                    RequestParamIDs[19].getHasValues() ||   // Serial number of IPC
                    RequestParamIDs[21].getHasValues() ||   // Battery Voltage
                    RequestParamIDs[22].getHasValues() ||   // OS and Image Version
                    RequestParamIDs[23].getHasValues()) {   // Hardware Version

                    // Computername
                    if (RequestParamIDs[0].getHasValues()) {    

                        html += '<table style="margin-bottom: 5px"><tr>';
                        html += '<td class="td_trans"><h3>Device</h3></td>';
                        html += '<td class="td_Action_trans">' +
                            new ControlLib.SmallButton().Create("btnWriteComputername", "save", "Save Computername") +
                            new ControlLib.SmallButton().Create("btnWriteComputername_Cancel", "delete") + '</td>';
                        html += '</tr></table>';

                        html += '<table>';
                        html += '<tr><td class="td_FirstColumn">Name</td><td>' + new ControlLib.Textbox().Create(RequestParamIDs[0].parameterName) + '</td></tr> ';

                        // Set title of Website "%ComputerName% - Device Manager"
                        var sTitle = RequestParamIDs[0].values[0].data + " - Device Manager";
                        try { if (document.title != sTitle) { document.title = sTitle; } } catch (e) { }
                    }
                    else {
                        html += '<h3>Device</h3>';
                        html += '<table>';
                    }

                    // Date & Time Textual Presentation
                    if (RequestParamIDs[1].getHasValues()) {    
                        html += '<tr><td class="td_FirstColumn">Date Time</td><td><div id="' + RequestParamIDs[1].parameterName + '"></div></td></tr> ';
                    }

                    // OS
                    if (RequestParamIDs[2].getHasValues()) {    
                        html += '<tr><td class="td_FirstColumn">Operating System</td><td><div id="' + RequestParamIDs[2].parameterName + '"></div></td></tr> ';
                    }

                    // Image Version
                    if (RequestParamIDs[22].getHasValues()) {
                        // valid data available?
                        if (window.Helper.getOsAndImageVersion(RequestParamIDs[22].values[0].data).length > 0) {
                            html += '<tr><td class="td_FirstColumn">Image Version</td><td><div id="' + RequestParamIDs[22].parameterName + '"></div></td></tr> ';
                        }
                    }

                    // Hardware Version
                    if (RequestParamIDs[23].getHasValues()) {
                        // valid data available?
                        if (window.Helper.getHardwareVersion(RequestParamIDs[23].values[0].data).length > 0) {
                            html += '<tr><td class="td_FirstColumn">Hardware Version</td><td><div id="' + RequestParamIDs[23].parameterName + '"></div></td></tr> ';
                        }
                    }

                    // IPC Serial number
                    if (RequestParamIDs[19].getHasValues()) {    
                        html += '<tr><td class="td_FirstColumn">Serial number of IPC</td><td><div id="' + RequestParamIDs[19].parameterName + '"></div></td></tr> ';
                    }

                    // Device Manager Version
                    if (window.ProductName != undefined &&
                        window.ProductMajor != undefined && window.ProductMinor != undefined && window.ProductRevision != undefined && window.ProductBuild != undefined) {

                        html += '<tr><td class="td_FirstColumn">Device Manager Version</td><td>' +
                            window.ProductMajor + "." +
                            window.ProductMinor + "." +
                            window.ProductRevision + "." +
                            window.ProductBuild +
                            '</div></td></tr> ';
                    }


                    html += '</table>';
                    html += '<br/>';
                }

               
                if (RequestParamIDs[10].getHasValues() ||   // CPU-Usage
                    RequestParamIDs[11].getHasValues() ||   // Total Memory
                    RequestParamIDs[12].getHasValues() ||   // Available Memory
                    RequestParamIDs[13].getHasValues() ||   // CPU-Temperature
                    RequestParamIDs[14].getHasValues() ||   // Mainboard Temperature Min
                    RequestParamIDs[15].getHasValues() ||   // Mainboard Temperature Max
                    RequestParamIDs[16].getHasValues()) {   // Mainboard Temperature 

                    html += '<div id="graphs" style="overflow:auto;min-width:250px;">';

                    if (RequestParamIDs[10].getHasValues() ||
                        RequestParamIDs[11].getHasValues() && RequestParamIDs[12].getHasValues()) {

                        html += '   <div id="workloads" style="float:left;">';
                        html += '   <h3>Workload</h3>';

                        if (RequestParamIDs[10].getHasValues()) {   // CPU-Usage
                            html += '       <div id="' + RequestParamIDs[10].parameterName + '"></div>';
                        }

                        if (RequestParamIDs[11].getHasValues() &&   // Total Memory
                            RequestParamIDs[12].getHasValues()) {   // Available Memory
                            html += '       <div id="' + RequestParamIDs[11].parameterName + '"></div>';
                        }

                        html += '   </div>';
                    }

                    if (RequestParamIDs[13].getHasValues() ||   // CPU-Temperature
                        RequestParamIDs[16].getHasValues()) {   // Mainboard-Temperature

                        html += '   <div id="temperatures" style="float:left;">';
                        html += '       <h3>Temperature</h3>';


                        if (RequestParamIDs[13].getHasValues()) {   // CPU-Temperature
                            html += '       <div id="' + RequestParamIDs[13].parameterName + '"></div>';
                        }
                        if (RequestParamIDs[16].getHasValues()) {   // Mainboard-Temperature
                            html += '       <div id="' + RequestParamIDs[16].parameterName + '"></div>';
                        }

                        html += '   </div>';
                    }

                    html += '<div style="clear:both"></div>';
                    html += '</div>';   // div graphs
                }
                
                if (RequestParamIDs[17].getHasValues() ||   // FAN name
                    RequestParamIDs[18].getHasValues()) {   // FAN speed

                    html += '<h3>FAN</h3>';
                    html += '<table>';

                    var Rows = Math.max(RequestParamIDs[17].moduleCount,
                                        RequestParamIDs[18].moduleCount);

                    for (var i = 0; i < Rows; i++) {

                        html += '<tr>';
                        html += '<td class="td_FirstColumn"><div id="' + RequestParamIDs[17].parameterName + i + '"></div></td>';  // FAN name
                        html += '<td><div id="' + RequestParamIDs[18].parameterName + i + '"></div></td>';  // FAN speed
                        html += '</tr>';
                    }

                    html += '</table>';
                    html += '<br/>';
                }

                if (RequestParamIDs[7].getHasValues() ||    // UPS Power State
                    RequestParamIDs[8].getHasValues() ||    // UPS Communication State
                    RequestParamIDs[9].getHasValues()) {    // UPS Battery State

                    html += '<h3>UPS</h3>';
                    html += '<table>';

                    if (RequestParamIDs[7].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Power Status</td><td><div id="' + RequestParamIDs[7].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[8].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Communication Status</td><td><div id="' + RequestParamIDs[8].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[9].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Battery Status</td><td><div id="' + RequestParamIDs[9].parameterName + '"></div></td></tr> ';
                    }

                    html += '</table>';
                    html += '<br/>';
                }

                if (RequestParamIDs[6].getHasValues()) {    // RAID State
                    html += '<div>';
                    html += '<h3>RAID</h3>';
                    html += '<table >';
                    html += '<tr><td class="td_FirstColumn">Controller Status</td><td><div id="' + RequestParamIDs[6].parameterName + '"></div></td></tr> ';
                    html += '</table>';
                    html += '</div>';
                    html += '<br/>';
                }

                if (RequestParamIDs[20].getHasValues() &&
                    RequestParamIDs[21].getHasValues()) {

                    var RowsVoltageLocations = RequestParamIDs[20].values[0].length;
                    for (var i = 0; i < RowsVoltageLocations; i++) {

                        // find LOCATION_BATTERY
                        if (RequestParamIDs[20].values[0][i].data == 13) {

                            // Mainboard_VoltageInformationVoltage_Property @ 21!
                            if (RequestParamIDs[21].values[0].length > i) {
                                html += '<h3>Voltage</h3>';
                                html += '<table>';
                                html += '<td class="td_FirstColumn">Battery (mV)</td>';
                                html += '<td><div id="' + RequestParamIDs[21].parameterName + '"></div></td>';
                                html += '</table>';
                                html += '<br/>';
                                break;
                            }
                        }
                    }
                }

                if (RequestParamIDs[3].getHasValues() && RequestParamIDs[4].getHasValues() ||    // EWF Volume & Volume States
                    RequestParamIDs[5].getHasValues()) {    // FBWF State

                    html += '<h3>WriteFilter</h3>';
                    
                    if (RequestParamIDs[3].getHasValues() ||    // EWF Volumes
                        RequestParamIDs[4].getHasValues()) {    // EWF States
                        
                        html += '<div id=WriteFilter_EWF></div>';
                    }

                    if (RequestParamIDs[5].getHasValues()) {    // FBWF State
                        html += '<h4>Filebased Write Filter (FBWF)</h4>';

                        html += '<table>';
                        html += '<tr><td class="td_FirstColumn">FBWF Status</td><td><div id="' + RequestParamIDs[5].parameterName + '"></div></td></tr> ';
                        html += '</table>';
                    }

                    html += "<br/>";
                }
                

                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);

                // Locks & Events
                base.setElementOnClick("btnWriteComputername", function (_id) { return function () { WriteComputername(_id); }; }(0));
                base.setElementOnClick("btnWriteComputername_Cancel", function (_id) { return function () { WriteComputername_Cancel(_id); }; }(0));

                base.addLockListener(RequestParamIDs[0].parameterName);

                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                // Computername
                if (RequestParamIDs[0].getHasValues()) {    
                    base.setElementValue(RequestParamIDs[0].parameterName, RequestParamIDs[0].values[0].data);
                }

                // Date & Time
                if (RequestParamIDs[1].getHasValues()) {    

                    var isoDt = new Helper.TextualDateTime_ISO8601(RequestParamIDs[1].values[0].data);
                    if (isoDt.isValidDate) {

                        var sDateTime = isoDt.getDateString() + " " + isoDt.getTimeString();
                        base.writeElement(RequestParamIDs[1].parameterName, sDateTime);
                    }
                }

                // OS
                if (RequestParamIDs[2].getHasValues()) {    
                    base.writeElement(RequestParamIDs[2].parameterName, RequestParamIDs[2].values[0].data);    
                }

                // OS and Image Version
                if (RequestParamIDs[22].getHasValues()) {
                    var sOsAndImageVersion = window.Helper.getOsAndImageVersion(RequestParamIDs[22].values[0].data);    // valid data available?
                    if (sOsAndImageVersion.length > 0) {
                        base.writeElement(RequestParamIDs[22].parameterName, sOsAndImageVersion);
                    }
                }

                // Hardware Version
                if (RequestParamIDs[23].getHasValues()) {
                    var sHardwareVersion = window.Helper.getHardwareVersion(RequestParamIDs[23].values[0].data);  // valid data available?
                    if (sHardwareVersion.length > 0) {
                        base.writeElement(RequestParamIDs[23].parameterName, sHardwareVersion);
                        //base.writeElement(RequestParamIDs[23].parameterName, "EK9160");
                    }
                }

                // IPC Serial number
                if (RequestParamIDs[19].getHasValues()) {
                    base.writeElement(RequestParamIDs[19].parameterName, RequestParamIDs[19].values[0].data);
                }
                
                // EWF 
                // is array so update table on every event
                if (RequestParamIDs[3].getHasValues() && RequestParamIDs[4].getHasValues()) {

                    var html = "";
                    html += '<h4>Enhanced Write Filter (EWF)</h4>';
                    html += '<table>';
                    html += '<tr><th style="width:150px">Volume name</th><th>State</th></tr>';

                    var RowsNames = 0;
                    if (RequestParamIDs[3].getHasValues()) { RowsNames = RequestParamIDs[3].values[0].length; }

                    var RowsStates = 0;
                    if (RequestParamIDs[4].getHasValues()) { RowsStates = RequestParamIDs[4].values[0].length; }

                    var Rows = Math.max(RowsNames, RowsStates);

                    for (var i = 0; i < Rows; i++) {

                        html += '<tr>';

                        try {
                            // EWF Volumes
                            html += '<td class="td_FirstColumn"><div id="' + RequestParamIDs[3].parameterName + i + '">' + RequestParamIDs[3].values[0][i].getOutput() + '</div></td>';
                        }
                        catch (e) {
                            html += '<td class="td_FirstColumn"></td>';
                        }

                        try {
                            // EWF Volume states
                            html += '<td><div id="' + RequestParamIDs[4].parameterName + i + '">' + window.Helper.getEWFStatusString(RequestParamIDs[4].values[0][i].getOutput()) + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        html += '</tr>';
                    }

                    html += '</table>';
                    html += '<br/>';

                    // update container div
                    base.writeElement("WriteFilter_EWF", html);
                }
                
                if (RequestParamIDs[5].getHasValues()) {    // FBWF status
                    base.writeElement(RequestParamIDs[5].parameterName, window.Helper.getStatusString(RequestParamIDs[5].values[0].data));    
                }

                if (RequestParamIDs[6].getHasValues()) {    // RAID status
                    base.writeElement(RequestParamIDs[6].parameterName, window.Helper.getRaidState(RequestParamIDs[6].values[0].data));    
                }

                if (RequestParamIDs[7].getHasValues()) {    // UPS Power status
                    base.writeElement(RequestParamIDs[7].parameterName, window.Helper.getUPSPowerStatusInfo(RequestParamIDs[7].values[0].data));
                }
                if (RequestParamIDs[8].getHasValues()) {    // UPS communication status
                    base.writeElement(RequestParamIDs[8].parameterName, window.Helper.getUPSCommunicationStatusInfo(RequestParamIDs[8].values[0].data));
                }
                if (RequestParamIDs[9].getHasValues()) {    // UPS battery status
                    base.writeElement(RequestParamIDs[9].parameterName, window.Helper.getUPSBatteryStatusInfo(RequestParamIDs[9].values[0].data));
                }
                

                //  Workloads
                if (RequestParamIDs[10].getHasValues()) {   // CPU-Load

                    base.writeElement(RequestParamIDs[10].parameterName, new ControlLib.Bargraph().CreateDefaultBar(
                        "res/modules/cpu/kachelicons-sw-groesse-1-cpu_32.png", "CPU", "%", 100, RequestParamIDs[10].values[0].data));
                }

                if (RequestParamIDs[11].getHasValues() && RequestParamIDs[12].getHasValues()) { // Memory-Load
                    base.writeElement(RequestParamIDs[11].parameterName, new ControlLib.Bargraph().CreateDefaultBar(
                        "res/modules/ram/kachelicons-sw-groesse-1-ram_32.png", "Memory", "%", 100,
                            window.Helper.getMemoryUsagePercent(RequestParamIDs[11].values[0].data, RequestParamIDs[12].values[0].data)));
                }

                // Temperatures
                if (RequestParamIDs[13].getHasValues()) {   // CPU Temperature
 
                    base.writeElement(RequestParamIDs[13].parameterName, new ControlLib.Bargraph().CreateDefaultBar_NoMaxDisplay(
                        "res/modules/cpu/kachelicons-sw-groesse-1-cpu_32.png", "CPU", "°C", 100,
                        RequestParamIDs[13].values[0].data));
                }

                if (RequestParamIDs[15].getHasValues() && RequestParamIDs[16].getHasValues()) { // Mainboard max- & current Temperature

                    base.writeElement(RequestParamIDs[16].parameterName, new ControlLib.Bargraph().CreateDefaultBar_NoMaxDisplay(
                        "res/modules/mainboard/kachelicons-sw-groesse-1-mainboard32.png", "Mainboard", "°C", 100,     
                        RequestParamIDs[16].values[0].data));   
                }


                // FAN
                if (RequestParamIDs[17].getHasValues() ||   // FAN name
                    RequestParamIDs[18].getHasValues()) {   // FAN speed

                    var Rows = Math.max(RequestParamIDs[17].moduleCount,
                                        RequestParamIDs[18].moduleCount);

                    for (var i = 0; i < Rows; i++) {

                        if (RequestParamIDs[17].values.length > i) {    // FAN name
                            base.writeElement(RequestParamIDs[17].parameterName + i, RequestParamIDs[17].values[i].getOutput() + " (rpm)");
                        }

                        if (RequestParamIDs[18].values.length > i) {    // FAN speed
                            base.writeElement(RequestParamIDs[18].parameterName + i, RequestParamIDs[18].values[i].getOutput());
                        }
                    }
                }

                if (RequestParamIDs[20].getHasValues() &&
                    RequestParamIDs[21].getHasValues()) {

                    var RowsVoltageLocations = RequestParamIDs[20].values[0].length;
                    for (var i = 0; i < RowsVoltageLocations; i++) {

                        // find LOCATION_BATTERY
                        if (RequestParamIDs[20].values[0][i].data == 13) {

                            if (RequestParamIDs[21].values[0].length > i) {
                                base.writeElement(RequestParamIDs[21].parameterName, RequestParamIDs[21].values[0][i].getOutput());
                                break;
                            }
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
                    base.removeLock(ModuleItemsWritten[i].name);
                }

                // other functions
                for (var i = 0; i < ModuleItemsWritten.length; i++) {
                    if (ErrorCodes[i] == 0 &&
                        ModuleItemsWritten[i].name == "GENERAL_Device_Name") {

                        if (winxp || wince) {
                            // Computer name successfully changed 
                            if (RebootMachineNoWait(true)) {

                                // and the user wants to reboot at once 
                                // ...stop the website 
                                base.Stop();

                                // ...and tell the user to login with the new computername after restart
                                var html = "";
                                html += "<h3>Computer name successfully changed...</h3>";
                                html += "<h4>Please log in using the new computer name after the device is restarted.<h4>";
                                base.writeActivePage(html);
                            }
                        }
                    }
                }

            }

            var WriteComputername = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                var RequestParamIDs = base.getRequestParamIDs();

                if (base.isLocked(RequestParamIDs[0].parameterName)) {

                    var szComputername = base.getElementValue(RequestParamIDs[0].parameterName);

                    writeParams.push(RequestParamIDs[0].parameterName);
                    idxs.push(0);
                    writeValues.push(szComputername);
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var WriteComputername_Cancel = function (idx) {

                var RequestParamIDs = base.getRequestParamIDs();

                base.removeLock(RequestParamIDs[0].parameterName);
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
            }

            var RebootMachineNoWait = function (prompt) {

                if (prompt) {
                    if (!confirm("You must restart your computer to apply these changes.\nDo you really want to reboot the computer?")) {
                        return false;
                    }
                }

                var CommandParamID = "MISC_Function_Reboot";

                // calc length of data
                var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID);

                var paramValues = [];
                paramValues.push(cbInputData);
                paramValues.push(0);    // Dummy

                Helper.RebootActiveNoWait(); // NO WAIT: the website will not reload the current page
                base.executeCommand(CommandParamID, 0, paramValues);
                return true;
            }

        }

        this.System.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Device_System.System(), window.DevMan.ModuleType.Website);

})(window);
