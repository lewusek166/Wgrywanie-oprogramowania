(function (window) {

    // namespace
    var Page_Hardware_Equipment = new (function () {

        this.Equipment = function () {

            this.category = "Hardware";
            this.name = "Equipment";
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
                base.addParameter("CPU_Property_CPU_Frequency", false);                             // 0
                base.addParameter("CPU_Property_Current_CPU_Usage", true);
                base.addParameter("CPU_Property_Current_CPU_Temperature", true);
                if (wince) {
                    base.addParameter("Memory_Property_Program_Memory_Allocated", true);
                    base.addParameter("Memory_Property_Program_Memory_Available", true);
                }
                else {
                    base.addParameter("Memory_Property_Program_Memory_Allocated_64", true);
                    base.addParameter("Memory_Property_Program_Memory_Available_64", true);
                }
                base.addParameter("Memory_Property_Storage_Memory_Allocated_CE", true);             // 5
                base.addParameter("Memory_Property_Storage_Memory_Available_CE", true);
                base.addParameter("Memory_Property_Memory_Division", true);
                base.addParameter("DisplayDevice_Property_DeviceName", false);
                base.addParameter("DisplayDevice_Settings_Property_IDxActiveDisplayMode", true);
                base.addParameter("DisplayDevice_Modes_Property_Len", false);                       // 10
                base.addParameter("Fan_Property_AdapterName", false);
                base.addParameter("Fan_Properties_Property_Speed", true);
                base.addParameter("UPS_Information_Property_UPSModel", false);
                base.addParameter("UPS_Information_Property_VendorName", false);
                base.addParameter("UPS_Information_Property_Version", false);                       // 15
                base.addParameter("UPS_Information_Property_Revision", false);
                base.addParameter("UPS_Information_Property_Build", false);
                base.addParameter("UPS_Information_Property_SerialNumber", false);
                base.addParameter("UPS_Information_Property_PowerStatus", true);
                base.addParameter("UPS_Information_Property_CommunicationStatus", true);            // 20
                base.addParameter("UPS_Information_Property_BatteryStatus", true);
                base.addParameter("UPS_Information_Property_BatteryCapacity", true);
                base.addParameter("UPS_Information_Property_BatteryRuntime", false);
                base.addParameter("UPS_Information_Property_PersistentPowerFailCount", true);
                base.addParameter("UPS_Information_Property_PowerFailCounter", true);               // 25
                base.addParameter("UPS_Information_Property_FanError", true);
                base.addParameter("UPS_Information_Property_NoBattery", true);
                base.addParameter("UPS_Information_Property_BatteryReplaceDate", false);
                base.addParameter("UPS_Information_Property_IntervalServiceStatus", true);          
                base.addParameter("UPS_GPIOPinInformation_Property_Address", false);                // 30
                base.addParameter("UPS_GPIOPinInformation_Property_Offset", false);                 
                base.addParameter("UPS_GPIOPinInformation_Property_Params", false);             

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
                
                if (RequestParamIDs[0].getHasValues()) {

                    html += '<h3>CPU</h3>';
                    html += '<table>';

                    if (RequestParamIDs[0].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Frequency (MHz)</td><td><div id="' + RequestParamIDs[0].parameterName + '"></div></td></tr> ';
                    }
                    
                    html += '</table>';
                    html += '<br>';
                }

                if (RequestParamIDs[1].getHasValues() ||
                    RequestParamIDs[2].getHasValues()) {

                    html += '<div id="graphs_cpu_container" style="overflow:auto;min-width:250px;">';
                    
                    if (RequestParamIDs[1].getHasValues()) {

                        html += '<div id="' + RequestParamIDs[1].parameterName + '" style="float:left"></div>';
                    }
                    if (RequestParamIDs[2].getHasValues()) {

                        html += '<div id="' + RequestParamIDs[2].parameterName + '" style="float:left"></div>';
                    }
                    
                    html += '</div>';

                }

                if (wince) {

                    // Memory CE
                    if (RequestParamIDs[3].getHasValues() && RequestParamIDs[4].getHasValues() ||
                        RequestParamIDs[5].getHasValues() && RequestParamIDs[6].getHasValues()) {

                        html += '<h3>Memory</h3>';
                        html += '<div id="graphs_cpu_container" style="overflow:auto;min-width:250px;">';

                        // Memory CE
                        if (RequestParamIDs[3].getHasValues() && RequestParamIDs[4].getHasValues()) {  // Memory x86

                            html += '<div id="' + RequestParamIDs[3].parameterName + '" style="float:left"></div>';
                        }

                        // Storage Memory CE
                        if (RequestParamIDs[5].getHasValues() && RequestParamIDs[6].getHasValues()) {

                            html += '<div id="' + RequestParamIDs[5].parameterName + '" style="float:left"></div>';
                        }

                        html += '</div>';
                    }
                }
                else {

                    // Memory Win32/Win64
                    if (RequestParamIDs[3].getHasValues() && RequestParamIDs[4].getHasValues()) {

                        html += '<h3>Memory</h3>';
                        html += '<div id="' + RequestParamIDs[3].parameterName + '"></div>';
                    }
                }

                if (RequestParamIDs[7].getHasValues()) {

                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += '<td class="td_trans"><h3>Memory Division</h3></td>';
                    html += '<td class="td_Action_trans">' +
                        new ControlLib.SmallButton().Create("btnWriteMemoryDivisionSettings", "save", "Save Memory division") +
                        new ControlLib.SmallButton().Create("btnWriteMemoryDivisionSettings_Cancel", "delete") + '</td>';
                    html += '</tr></table>';

                    html += '<table>';
                    html += '<tr><td class="td_FirstColumn">Memory Division (%)</td><td>' + new ControlLib.Textbox().Create(RequestParamIDs[7].parameterName) + '</td></tr> ';
                    html += '</table>';
                    html += '<br>';
                }

                if (RequestParamIDs[8].getHasValues() &&
                    RequestParamIDs[9].getHasValues() && RequestParamIDs[10].getHasValues()) {

                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += '<td class="td_trans"><h3>Display Device</h3></td>';
                    html += '<td class="td_Action_trans">' + new ControlLib.SmallButton().Create("btnEditDispalyResolution", "configure", "Configure Display Resolutions") + '</td>';
                    html += '</tr></table>';

                    html += "<table>"
                    html += '<tr><th>Name</th><th>Resolution</th></tr>';

                    for (var i = 0; i < RequestParamIDs[8].moduleCount; i++) {
                        
                        html += '<tr>';

                        html += '<td class="td_FirstColumn"><div id="' + RequestParamIDs[8].parameterName + i + '"></div></td>';    // Name
                        html += '<td><div id="' + RequestParamIDs[9].parameterName + i + '"></div></td>';                           // Display Resolution

                        html += '</tr>';
                    }

                    html += '</table>';
                    html += '<br>';
                }

                // FAN                
                if (RequestParamIDs[11].getHasValues() ||
                    RequestParamIDs[12].getHasValues()) {

                    html += '<h3>FAN</h3>';
                    html += '<table>';

                    var Rows = Math.max(RequestParamIDs[11].moduleCount,
                                        RequestParamIDs[12].moduleCount);

                    for (var i = 0; i < Rows; i++) {

                        html += '<tr>';
                        html += '<td class="td_FirstColumn"><div id="' + RequestParamIDs[11].parameterName + i + '"></div></td>';
                        html += '<td><div id="' + RequestParamIDs[12].parameterName + i + '"></div></td>';
                        html += '</tr>';
                    }

                    html += '</table><br>';
                }



                if (RequestParamIDs[13].getHasValues() ||
                    RequestParamIDs[14].getHasValues() ||
                    RequestParamIDs[15].getHasValues() ||
                    RequestParamIDs[16].getHasValues() ||
                    RequestParamIDs[17].getHasValues() ||
                    RequestParamIDs[18].getHasValues() ||
                    RequestParamIDs[19].getHasValues() ||
                    RequestParamIDs[20].getHasValues() ||
                    RequestParamIDs[21].getHasValues() ||
                    RequestParamIDs[22].getHasValues() ||
                    RequestParamIDs[23].getHasValues() ||
                    RequestParamIDs[24].getHasValues() ||
                    RequestParamIDs[25].getHasValues() ||
                    RequestParamIDs[26].getHasValues() ||
                    RequestParamIDs[27].getHasValues() ||
                    RequestParamIDs[28].getHasValues() ||
                    RequestParamIDs[29].getHasValues() ||
                    RequestParamIDs[30].getHasValues() ||
                    RequestParamIDs[31].getHasValues()) {

                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += '<td class="td_trans"><h3>UPS</h3></td>';
                    html += '<td class="td_Action_trans">' + new ControlLib.SmallButton().Create("btnTestCapacity", "power", "Test Capacity") + '</td>';
                    html += '</tr></table>';

                    html += '<table>';

                    if (RequestParamIDs[13].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Model</td><td><div id="' + RequestParamIDs[13].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[14].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Vendor name</td><td><div id="' + RequestParamIDs[14].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[15].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Version</td><td><div id="' + RequestParamIDs[15].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[16].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Revision</td><td><div id="' + RequestParamIDs[16].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[17].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Build</td><td><div id="' + RequestParamIDs[17].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[18].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Serialnumber</td><td><div id="' + RequestParamIDs[18].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[19].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Power status</td><td><div id="' + RequestParamIDs[19].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[20].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Communication status</td><td><div id="' + RequestParamIDs[20].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[21].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Battery status</td><td><div id="' + RequestParamIDs[21].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[22].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Battery capacity (%)</td><td><div id="' + RequestParamIDs[22].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[23].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Battery runtime (s)</td><td><div id="' + RequestParamIDs[23].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[24].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Persistant power fail count</td><td><div id="' + RequestParamIDs[24].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[25].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Power fail counter</td><td><div id="' + RequestParamIDs[25].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[26].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Fan Error</td><td><div id="' + RequestParamIDs[26].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[27].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">No battery</td><td><div id="' + RequestParamIDs[27].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[28].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Battery Replace Date</td><td><div id="' + RequestParamIDs[28].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[29].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Interval Service Status</td><td><div id="' + RequestParamIDs[29].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[30].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">GPIO Pin address</td><td><div id="' + RequestParamIDs[30].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[31].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">GPIO Pin offset</td><td><div id="' + RequestParamIDs[31].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[32].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">GPIO Pin parameters</td><td><div id="' + RequestParamIDs[32].parameterName + '"></div></td></tr> ';
                    }

                    html += '</table>';
                    html += '<br>';
                }


                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);

                // Add Events
                if (RequestParamIDs[7].getHasValues()) {

                    base.addLockListener(RequestParamIDs[7].parameterName);
                    base.setElementOnClick("btnWriteMemoryDivisionSettings", function (_id) { return function () { WriteMemoryDivisionSettings(_id); }; }(0));
                    base.setElementOnClick("btnWriteMemoryDivisionSettings_Cancel", function (_id) { return function () { WriteMemoryDivisionSettings_Cancel(_id); }; }(0));

                }

                if (RequestParamIDs[8].getHasValues() &&
                    RequestParamIDs[9].getHasValues() && RequestParamIDs[10].getHasValues()) {

                    base.setElementOnClick("btnEditDispalyResolution", function (_id) { return function () { ChangePage(_id); }; }(0));
                }

                if (RequestParamIDs[13].getHasValues() ||
                    RequestParamIDs[14].getHasValues() ||
                    RequestParamIDs[15].getHasValues() ||
                    RequestParamIDs[16].getHasValues() ||
                    RequestParamIDs[17].getHasValues() ||
                    RequestParamIDs[18].getHasValues() ||
                    RequestParamIDs[19].getHasValues() ||
                    RequestParamIDs[20].getHasValues() ||
                    RequestParamIDs[21].getHasValues() ||
                    RequestParamIDs[22].getHasValues() ||
                    RequestParamIDs[23].getHasValues() ||
                    RequestParamIDs[24].getHasValues() ||
                    RequestParamIDs[25].getHasValues() ||
                    RequestParamIDs[26].getHasValues() ||
                    RequestParamIDs[27].getHasValues() ||
                    RequestParamIDs[28].getHasValues() ||
                    RequestParamIDs[29].getHasValues() ||
                    RequestParamIDs[30].getHasValues() ||
                    RequestParamIDs[31].getHasValues()) {

                    base.setElementOnClick("btnTestCapacity", function (_id) { return function () { WriteTestCapacity(_id); }; }(0));
                }

                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                // Frequency
                if (RequestParamIDs[0].getHasValues()) {
                    base.writeElement(RequestParamIDs[0].parameterName, RequestParamIDs[0].values[0].data);
                }

                // CPU-Load
                if (RequestParamIDs[1].getHasValues()) {

                    base.writeElement(RequestParamIDs[1].parameterName, new ControlLib.Bargraph().CreateDefaultBar(
                        "res/modules/cpu/kachelicons-sw-groesse-1-cpu_32.png", "Load", "%", 100, RequestParamIDs[1].values[0].data));
                }

                // CPU-Temperature
                if (RequestParamIDs[2].getHasValues()) {
                    
                    base.writeElement(RequestParamIDs[2].parameterName, new ControlLib.Bargraph().CreateDefaultBar_NoMaxDisplay(
                        "res/modules/cpu/kachelicons-sw-groesse-1-cpu_32.png", "Temperature", "°C", 100, RequestParamIDs[2].values[0].data));
                }

                // Memory-Load x86 ([3] = Total memory; [4] = Available memory)
                if (RequestParamIDs[3].getHasValues() &&
                    RequestParamIDs[4].getHasValues()) {

                    var totalMemory = RequestParamIDs[3].values[0].data;
                    var availableMemory = RequestParamIDs[4].values[0].data;
                    var usedMemory = totalMemory - availableMemory;
                    base.writeElement(RequestParamIDs[3].parameterName, new ControlLib.Bargraph().CreateMemoryBar("res/modules/ram/kachelicons-sw-groesse-1-ram_32.png", "RAM", totalMemory, usedMemory));                    
                }

                // Storage Memory - CE
                if (RequestParamIDs[5].getHasValues() &&
                    RequestParamIDs[6].getHasValues()) {

                    var totalMemory = RequestParamIDs[5].values[0].data;
                    var availableMemory = RequestParamIDs[6].values[0].data;
                    var usedMemory = totalMemory - availableMemory;

                    base.writeElement(RequestParamIDs[5].parameterName, new ControlLib.Bargraph().CreateMemoryBar("res/modules/ram/kachelicons-sw-groesse-1-ram_32.png", "Storage", totalMemory, usedMemory));
                }
                
                // Memory Division
                if (RequestParamIDs[7].getHasValues()) {
                    base.setElementValue(RequestParamIDs[7].parameterName, RequestParamIDs[7].values[0].data);
                }

                // Display resolution
                if (RequestParamIDs[8].getHasValues() &&
                    RequestParamIDs[9].getHasValues() && RequestParamIDs[10].getHasValues()) {

                    for (var i = 0; i < RequestParamIDs[9].moduleCount; i++) {

                        base.writeElement(RequestParamIDs[8].parameterName + i, RequestParamIDs[8].values[i].data);

                        var ResolutionIndex = RequestParamIDs[9].values[i].data;
                        ResolutionIndex--;  // zero based ResolutionIndex

                        if (ResolutionIndex >= 0 &&
                            RequestParamIDs[10].values[i].length > 0 &&
                            RequestParamIDs[10].values[i].length > ResolutionIndex) {

                            var Resolution = RequestParamIDs[10].values[i][ResolutionIndex].data;
                            base.writeElement(RequestParamIDs[9].parameterName + i, Resolution);
                        }
                        else {
                            // No resolution selected
                            base.writeElement(RequestParamIDs[9].parameterName + i, "None");
                        }

                    }

                }

                // FAN
                if (RequestParamIDs[11].getHasValues() ||
                    RequestParamIDs[12].getHasValues()) {

                    var Rows = Math.max(RequestParamIDs[11].moduleCount,
                                        RequestParamIDs[12].moduleCount);

                    for (var i = 0; i < Rows; i++) {

                        if (RequestParamIDs[11].values.length > i) {
                            base.writeElement(RequestParamIDs[11].parameterName + i, RequestParamIDs[11].values[i].getOutput() + " (rpm)");
                        }

                        if (RequestParamIDs[12].values.length > i) {
                            base.writeElement(RequestParamIDs[12].parameterName + i, RequestParamIDs[12].values[i].getOutput());
                        }
                    }
                }

                // UPS
                if (RequestParamIDs[13].getHasValues()) {
                    base.writeElement(RequestParamIDs[13].parameterName, RequestParamIDs[13].values[0].getOutput());
                }
                if (RequestParamIDs[14].getHasValues()) {
                    base.writeElement(RequestParamIDs[14].parameterName, RequestParamIDs[14].values[0].getOutput());
                }
                if (RequestParamIDs[15].getHasValues()) {
                    base.writeElement(RequestParamIDs[15].parameterName, RequestParamIDs[15].values[0].getOutput());
                }
                if (RequestParamIDs[16].getHasValues()) {
                    base.writeElement(RequestParamIDs[16].parameterName, RequestParamIDs[16].values[0].getOutput());
                }
                if (RequestParamIDs[17].getHasValues()) {
                    base.writeElement(RequestParamIDs[17].parameterName, RequestParamIDs[17].values[0].getOutput());
                }
                if (RequestParamIDs[18].getHasValues()) {
                    base.writeElement(RequestParamIDs[18].parameterName, RequestParamIDs[18].values[0].getOutput());
                }
                if (RequestParamIDs[19].getHasValues()) {
                    base.writeElement(RequestParamIDs[19].parameterName, Helper.getUPSPowerStatusInfo(RequestParamIDs[19].values[0].data));
                }
                if (RequestParamIDs[20].getHasValues()) {
                    base.writeElement(RequestParamIDs[20].parameterName, Helper.getUPSCommunicationStatusInfo(RequestParamIDs[20].values[0].data));
                }
                if (RequestParamIDs[21].getHasValues()) {
                    base.writeElement(RequestParamIDs[21].parameterName, Helper.getUPSBatteryStatusInfo(RequestParamIDs[21].values[0].data));
                }
                if (RequestParamIDs[22].getHasValues()) {
                    base.writeElement(RequestParamIDs[22].parameterName, RequestParamIDs[22].values[0].getOutput());
                }
                if (RequestParamIDs[23].getHasValues()) {
                    base.writeElement(RequestParamIDs[23].parameterName, RequestParamIDs[23].values[0].getOutput());
                }
                if (RequestParamIDs[24].getHasValues()) {
                    base.writeElement(RequestParamIDs[24].parameterName, Helper.getBooleanToString(RequestParamIDs[24].values[0].data));
                }
                if (RequestParamIDs[25].getHasValues()) {
                    base.writeElement(RequestParamIDs[25].parameterName, RequestParamIDs[25].values[0].getOutput());
                }
                if (RequestParamIDs[26].getHasValues()) {
                    base.writeElement(RequestParamIDs[26].parameterName, Helper.getBooleanToString(RequestParamIDs[26].values[0].data));
                }
                if (RequestParamIDs[27].getHasValues()) {
                    base.writeElement(RequestParamIDs[27].parameterName, Helper.getBooleanToString(RequestParamIDs[27].values[0].data));
                }
                if (RequestParamIDs[28].getHasValues()) {
                    base.writeElement(RequestParamIDs[28].parameterName, RequestParamIDs[28].values[0].getOutput());
                }
                if (RequestParamIDs[29].getHasValues()) {
                    base.writeElement(RequestParamIDs[29].parameterName, Helper.getBooleanToString(RequestParamIDs[29].values[0].data));
                }
                if (RequestParamIDs[30].getHasValues()) {
                    base.writeElement(RequestParamIDs[30].parameterName, RequestParamIDs[30].values[0].getOutput());
                }
                if (RequestParamIDs[31].getHasValues()) {
                    base.writeElement(RequestParamIDs[31].parameterName, RequestParamIDs[31].values[0].getOutput());
                }
                if (RequestParamIDs[32].getHasValues()) {
                    base.writeElement(RequestParamIDs[32].parameterName, RequestParamIDs[32].values[0].getOutput());
                }
            }

            var ChangePage = function (idx) {
                base.ChangePage("Software", "System");
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
                    else {

                        switch (ModuleItemsWritten[i].name) {

                            case "UPS_Information_Property_TestCapacity":
                                alert("Capacity-test successfully initialized.\n" +
                                      "The test will begin when you remove the power supply of the device!\n" +
                                      "\n" +
                                      "The runtime of the Battery will be stored in the property \"Battery runtime (s)\"");
                                break;
                        }
                    }
                }

                // remove Locks
                for (var i = 0; i < ModuleItemsWritten.length; i++) {
                    base.removeLock(ModuleItemsWritten[i].name);
                }
            }

            var WriteMemoryDivisionSettings = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                var RequestParamIDs = base.getRequestParamIDs();

                if (base.isLocked(RequestParamIDs[7].parameterName)) {
                    writeParams.push("Memory_Property_Memory_Division");
                    idxs.push(idx);
                    writeValues.push(base.getElementValue("Memory_Property_Memory_Division"));
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var WriteMemoryDivisionSettings_Cancel = function (idx) {

                base.removeLock("Memory_Property_Memory_Division");
            }

            var WriteTestCapacity = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                writeParams.push("UPS_Information_Property_TestCapacity");
                idxs.push(0);
                writeValues.push(1);
                
                base.Write(writeParams, idxs, writeValues);
                Helper.ShowLoading();
            }
        }

        this.Equipment.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Hardware_Equipment.Equipment(), window.DevMan.ModuleType.Website);

})(window);
