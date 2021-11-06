(function (window) {

    // namespace
    var Page_Hardware_Nic = new (function () {

        this.Nic = function () {

            this.category = "Hardware";
            this.name = "NIC";
            this.subnavigationicon = "sec-nav-network.png";

            var CycleTime = 2000;
            var base = undefined;

            var bNetworkSettingsFailed = false;
            var iLastNicIdxWritten = null;
            
            var IDX_NIC_NAME = 0;
            var IDX_NIC_MAC = 0;
            var IDX_NIC_IPv4_Address = 0;
            var IDX_NIC_IPv4_Subnet = 0;
            var IDX_NIC_DHCP_Enabled = 0;
            var IDX_NIC_IPv4_DefaultGateway = 0;
            var IDX_NIC_IPv4_DNS = 0;
            
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
                IDX_NIC_NAME = base.addParameter("NIC_Property_Name", false);
                IDX_NIC_MAC = base.addParameter("NIC_Property_MAC_Address", false);
                IDX_NIC_IPv4_Address = base.addParameter("NIC_Property_IPv4_Address", true);
                IDX_NIC_IPv4_Subnet = base.addParameter("NIC_Property_IPv4_Subnet_Mask", true);
                IDX_NIC_DHCP_Enabled = base.addParameter("NIC_Property_DHCP", true);
                IDX_NIC_IPv4_DefaultGateway = base.addParameter("NIC_Property_IPv4_Default_Gateway", true);
                if (tcbsd) {
                    IDX_NIC_IPv4_DNS = base.addParameter("NIC_Property_IPv4_DnsServers", true);
                }

                // init events
                base.setOnInitStaticPage(OnInitStaticPage);
                base.setOnDisplayValues(OnDisplayValues);
                base.setOnWriteFailed(OnWriteFailed);
                base.setOnWriteResult(OnWriteResult);
                base.setOnServiceTransferFailed(OnServiceTransferFailed);
                base.setOnServiceTransferResult(OnServiceTransferResult);

                return true;
            };

            var OnInitStaticPage = function (RequestParamIDs) {

                var html = "";

                if (RequestParamIDs[IDX_NIC_NAME].getHasValues() ||
                    RequestParamIDs[IDX_NIC_MAC].getHasValues() ||
                    RequestParamIDs[IDX_NIC_IPv4_Address].getHasValues() ||
                    RequestParamIDs[IDX_NIC_IPv4_Subnet].getHasValues() ||
                    RequestParamIDs[IDX_NIC_DHCP_Enabled].getHasValues() ||
                    RequestParamIDs[IDX_NIC_IPv4_DefaultGateway].getHasValues()) {

                    html += '<h3>Network Interfaces</h3>';

                    html += '<table>';
                    html += '<tr><td class="td_FirstColumn_Important">Warning</td><td>Incorrect changes may corrupt the connection to a remote computer!</td></tr>';
                    html += '</table>';
                    html += '<table>';
                    html += '<tr><td class="td_FirstColumn_Info">Information</td><td>Changes to inactive network adapters are visible after these are connected to a network.</td></tr>';
                    html += '</table>';
                    html += '<br>';

                    var Rows = Math.max(RequestParamIDs[IDX_NIC_NAME].moduleCount,
                        RequestParamIDs[IDX_NIC_MAC].moduleCount,
                        RequestParamIDs[IDX_NIC_IPv4_Address].moduleCount,
                        RequestParamIDs[IDX_NIC_IPv4_Subnet].moduleCount,
                        RequestParamIDs[IDX_NIC_DHCP_Enabled].moduleCount,
                        RequestParamIDs[IDX_NIC_IPv4_DefaultGateway].moduleCount);

                    for (var i = 0; i < Rows; i++) {

                        // NIC-Title with buttons to accept, cancel changes and renew the ip
                        html += '<table style="margin-bottom: 5px"><tr>';
                        html += '<td class="td_trans"><h4><div id="' + RequestParamIDs[IDX_NIC_NAME].parameterName + i + '"></div></h4></td>';
                        html += '<td class="td_Action_trans">' +
                            new ControlLib.SmallButton().Create("btnRenewIP" + i, "refresh", "Renew IP Address") +
                            new ControlLib.SmallButton().Create("btnWriteNicSettings" + i, "save", "Save Network Settings") +
                            new ControlLib.SmallButton().Create("btnWriteNicSettings_Cancel" + i, "delete") + '</td>';
                        html += '</tr></table>';

                        html += "<table>";
                        html += '<tr><td class="td_FirstColumn">MAC Address</td><td><div id="' + RequestParamIDs[IDX_NIC_MAC].parameterName + i + '"></div></td></tr> ';
                        html += '<tr><td class="td_FirstColumn">IPv4 Address</td><td>' + new ControlLib.Textbox().Create(RequestParamIDs[IDX_NIC_IPv4_Address].parameterName + i) + '</td></tr> ';
                        html += '<tr><td class="td_FirstColumn">IPv4 Subnet Mask</td><td>' + new ControlLib.Textbox().Create(RequestParamIDs[IDX_NIC_IPv4_Subnet].parameterName + i) + '</td></tr> ';
                        html += '<tr><td class="td_FirstColumn">IPv4 Default Gateway</td><td>' + new ControlLib.Textbox().Create(RequestParamIDs[IDX_NIC_IPv4_DefaultGateway].parameterName + i) + '</td></tr> ';

                        var ComboItems = ["Disabled", "Enabled"];
                        html += '<tr>';
                        html += '<td class="td_FirstColumn">DHCP</td>';
                        html += '<td>' + new ControlLib.Combobox().Create(RequestParamIDs[IDX_NIC_DHCP_Enabled].parameterName + i, ComboItems) + '</td>';
                        html += '</tr>';
                        html += "</table>";

                        html += "<br/>";

                        //if (winxp || wince) {
                        //    // DNS-Servers with buttons to accept, cancel changes and renew the ip
                        //    html += '<table style="margin-bottom: 5px"><tr>';
                        //    html += '<td class="td_trans"><h4><div>DNS Servers</div></h4></td>';
                        //    html += '<td class="td_Action_trans">' +
                        //        new ControlLib.SmallButton().Create("btnWriteDnsServers" + i, "save", "Save DNS Servers") +
                        //        new ControlLib.SmallButton().Create("btnWriteDnsServers_Cancel" + i, "delete") + '</td>';
                        //    html += '</tr></table>';

                        //    html += "<table>";
                        //    html += '<tr><td class="td_FirstColumn">IPv4 DNS Servers</td><td>' + new ControlLib.Textbox().Create(RequestParamIDs[IDX_NIC_IPv4_DNS].parameterName + i, "99%") + '</td></tr> ';
                        //    html += "</table>";

                        //    html += "<br/>";
                        //    html += "<br/>";
                        //}
                    }

                    if (tcbsd) {

                        // DNS-Servers with buttons to accept, cancel changes and renew the ip
                        html += '<table style="margin-bottom: 5px"><tr>';
                        html += '<td class="td_trans"><h4><div>DNS Servers</div></h4></td>';
                        html += '<td class="td_Action_trans">' +
                            new ControlLib.SmallButton().Create("btnWriteDnsServers0", "save", "Save DNS Servers") +
                            new ControlLib.SmallButton().Create("btnWriteDnsServers_Cancel0", "delete") + '</td>';
                        html += '</tr></table>';

                        html += "<table>";
                        html += '<tr><td class="td_FirstColumn">IPv4 DNS Servers</td><td>' + new ControlLib.Textbox().Create(RequestParamIDs[IDX_NIC_IPv4_DNS].parameterName + "0", "99%") + '</td></tr> ';
                        html += "</table>";

                        html += "<br/>";
                        html += "<br/>";
                    }

                }

                html += '<div id="status"></div>';  // div for errors, etc.
                base.writeActivePage(html);


                // Add Events 
                if (RequestParamIDs[IDX_NIC_NAME].getHasValues() ||
                    RequestParamIDs[IDX_NIC_MAC].getHasValues() ||
                    RequestParamIDs[IDX_NIC_IPv4_Address].getHasValues() ||
                    RequestParamIDs[IDX_NIC_IPv4_Subnet].getHasValues() ||
                    RequestParamIDs[IDX_NIC_IPv4_DefaultGateway].getHasValues() ||
                    RequestParamIDs[IDX_NIC_DHCP_Enabled].getHasValues()) {

                    var Rows = Math.max(RequestParamIDs[IDX_NIC_NAME].moduleCount,
                        RequestParamIDs[IDX_NIC_MAC].moduleCount,
                        RequestParamIDs[IDX_NIC_IPv4_Address].moduleCount,
                        RequestParamIDs[IDX_NIC_IPv4_Subnet].moduleCount,
                        RequestParamIDs[IDX_NIC_IPv4_DefaultGateway].moduleCount,
                        RequestParamIDs[IDX_NIC_DHCP_Enabled].moduleCount);

                    for (var i = 0; i < Rows; i++) {

                        base.setElementOnClick("btnRenewIP" + i, function (_id) { return function () { RenewIP(_id); }; }(i));
                        base.setElementOnClick("btnWriteNicSettings" + i, function (_id) { return function () { WriteNicSettings(_id); }; }(i));
                        base.setElementOnClick("btnWriteNicSettings_Cancel" + i, function (_id) { return function () { WriteNicSettings_Cancel(_id); }; }(i));
                        base.setElementOnClick(RequestParamIDs[IDX_NIC_DHCP_Enabled].parameterName + i, function (_id) { return function () { DhcpStatus_Changed(_id); }; }(i));

                        base.addLockListener(RequestParamIDs[IDX_NIC_IPv4_Address].parameterName + i);
                        base.addLockListener(RequestParamIDs[IDX_NIC_IPv4_Subnet].parameterName + i);
                        base.addLockListener(RequestParamIDs[IDX_NIC_IPv4_DefaultGateway].parameterName + i);
                        base.addLockListener(RequestParamIDs[IDX_NIC_DHCP_Enabled].parameterName + i);

                        //if (winxp || wince) {
                        //    base.setElementOnClick("btnWriteDnsServers" + i, function (_id) { return function () { WriteDnsServers(_id); }; }(i));
                        //    base.setElementOnClick("btnWriteDnsServers_Cancel" + i, function (_id) { return function () { WriteDnsServers_Cancel(_id); }; }(i));
                        //    base.addLockListener(RequestParamIDs[IDX_NIC_IPv4_DNS].parameterName + i);
                        //}
                    }
                    
                    if (tcbsd) {
                        base.setElementOnClick("btnWriteDnsServers" + "0", function (_id) { return function () { WriteDnsServers(_id); }; }(0));
                        base.setElementOnClick("btnWriteDnsServers_Cancel" + "0", function (_id) { return function () { WriteDnsServers_Cancel(_id); }; }(0));
                        base.addLockListener(RequestParamIDs[IDX_NIC_IPv4_DNS].parameterName + "0");
                    }
                }

                return true;
            };

            var OnDisplayValues = function (RequestParamIDs) {

                if (bNetworkSettingsFailed) {

                    bNetworkSettingsFailed = false;
                    base.writeStatus("Connection has been restored!");
                    base.scrollToElement("status");

                    if (iLastNicIdxWritten >= 0) {
                        // Maybe the user focused some textboxes. 
                        // Unlock all textfields so the new adresses can be displayed!
                        WriteNicSettings_Cancel(iLastNicIdxWritten);
                        iLastNicIdxWritten = -1;
                    }
                }

                // NIC
                var RowsNicName = 0;
                if (RequestParamIDs[IDX_NIC_NAME].getHasValues()) { RowsNicName = RequestParamIDs[IDX_NIC_NAME].moduleCount; }
                for (var i = 0; i < RowsNicName; i++) {

                    var NicName = RequestParamIDs[IDX_NIC_NAME].values[i].getOutput();

                    // Remove Mac-Address
                    var iMacPos = NicName.lastIndexOf("[");
                    if (iMacPos > -1) {
                        NicName = NicName.substring(0, iMacPos);
                    }

                    base.writeElement(RequestParamIDs[IDX_NIC_NAME].parameterName + i, NicName);
                }

                var RowsNicMACs = 0;
                if (RequestParamIDs[IDX_NIC_MAC].getHasValues()) { RowsNicMACs = RequestParamIDs[IDX_NIC_MAC].moduleCount; }
                for (var i = 0; i < RowsNicMACs; i++) {
                    base.writeElement(RequestParamIDs[IDX_NIC_MAC].parameterName + i, RequestParamIDs[IDX_NIC_MAC].values[i].getOutput());
                }

                // IP
                var RowsNicIPs = 0;
                if (RequestParamIDs[IDX_NIC_IPv4_Address].getHasValues()) { RowsNicIPs = RequestParamIDs[IDX_NIC_IPv4_Address].moduleCount; }
                for (var i = 0; i < RowsNicIPs; i++) {
                    base.setElementValue(RequestParamIDs[IDX_NIC_IPv4_Address].parameterName + i, RequestParamIDs[IDX_NIC_IPv4_Address].values[i].getOutput());
                }

                // SubNet
                var RowsNicSubnets = 0;
                if (RequestParamIDs[IDX_NIC_IPv4_Subnet].getHasValues()) { RowsNicSubnets = RequestParamIDs[IDX_NIC_IPv4_Subnet].moduleCount; }
                for (var i = 0; i < RowsNicSubnets; i++) {
                    base.setElementValue(RequestParamIDs[IDX_NIC_IPv4_Subnet].parameterName + i, RequestParamIDs[IDX_NIC_IPv4_Subnet].values[i].getOutput());
                }

                // Gateway
                var RowsNicGateways = 0;
                if (RequestParamIDs[IDX_NIC_IPv4_DefaultGateway].getHasValues()) { RowsNicGateways = RequestParamIDs[IDX_NIC_IPv4_DefaultGateway].moduleCount; }
                for (var i = 0; i < RowsNicGateways; i++) {
                    base.setElementValue(RequestParamIDs[IDX_NIC_IPv4_DefaultGateway].parameterName + i, RequestParamIDs[IDX_NIC_IPv4_DefaultGateway].values[i].getOutput());
                }

                var RowsNicDHCPs = 0;
                if (RequestParamIDs[IDX_NIC_DHCP_Enabled].getHasValues()) { RowsNicDHCPs = RequestParamIDs[IDX_NIC_DHCP_Enabled].moduleCount; }
                for (var i = 0; i < RowsNicDHCPs; i++) {

                    var DHCP_Enabled = RequestParamIDs[IDX_NIC_DHCP_Enabled].values[i].getOutput();
                    base.setElementValue(RequestParamIDs[IDX_NIC_DHCP_Enabled].parameterName + i, DHCP_Enabled);

                    if (base.isLocked(RequestParamIDs[IDX_NIC_DHCP_Enabled].parameterName + i)) {
                        DHCP_Enabled = base.getElementValue(RequestParamIDs[IDX_NIC_DHCP_Enabled].parameterName + i);
                    }

                    base.setElementDisabled(RequestParamIDs[IDX_NIC_IPv4_Address].parameterName + i, (DHCP_Enabled == 1)); // IP
                    base.setElementDisabled(RequestParamIDs[IDX_NIC_IPv4_Subnet].parameterName + i, (DHCP_Enabled == 1)); // SubNet
                    base.setElementDisabled(RequestParamIDs[IDX_NIC_IPv4_DefaultGateway].parameterName + i, (DHCP_Enabled == 1)); // Gateway
                }

                if (winxp || wince) {
                    //// DNS Servers
                    //var RowsNicDnsServers = 0;
                    //if (RequestParamIDs[IDX_NIC_IPv4_DNS].getHasValues()) { RowsNicDnsServers = RequestParamIDs[IDX_NIC_IPv4_DNS].moduleCount; }
                    //for (var i = 0; i < RowsNicDnsServers; i++) {
                    //    base.setElementValue(RequestParamIDs[IDX_NIC_IPv4_DNS].parameterName + i, RequestParamIDs[IDX_NIC_IPv4_DNS].values[i].getOutput());
                    //}
                }
                else {
                    // DNS Servers for all adapters
                    if (RequestParamIDs[IDX_NIC_IPv4_DNS].getHasValues()) { 
                        base.setElementValue(RequestParamIDs[IDX_NIC_IPv4_DNS].parameterName + "0", RequestParamIDs[IDX_NIC_IPv4_DNS].values[0].getOutput());
                    }
                }
            };


            ////////////////////////////////////////////////////////////////////////////////////////////
            // Write-Requests
            /////////////////////////////////////////////////////////////////////////////////////////
            var OnWriteFailed = function (error) {

                Helper.HideLoading();
                base.clearLocks();

                window.DevMan.getErrorQueue().AddError(error.requestStatus, error.requestStatusText);
            };

            var OnWriteResult = function (ModuleItemsWritten, ErrorCodes) {

                Helper.HideLoading();

                // check for errors
                for (var i = 0; i < ModuleItemsWritten.length; i++) {
                    if (ErrorCodes[i] != 0) {
                        window.DevMan.getErrorQueue().AddError(ErrorCodes[i]);
                    }

                    // If WinCE or TC/BSD and writing successfull => renew IP
                    if (wince || tcbsd) {
                        if (ModuleItemsWritten[i].name == "NIC_Property_DHCP") {
                            if (ErrorCodes[i] == 0) {
                                RenewIP(ModuleItemsWritten[i].id);
                            }
                        }
                    }
                }

                // remove all locks with the same ID
                for (var i = 0; i < ModuleItemsWritten.length; i++) {
                    if (ModuleItemsWritten[i].name == "NIC_Property_DHCP") {
                        WriteNicSettings_Cancel(ModuleItemsWritten[i].id);
                    }
                    else if (ModuleItemsWritten[i].name == "NIC_Property_IPv4_DnsServers") {
                        WriteDnsServers_Cancel(ModuleItemsWritten[i].id);
                    }
                }
            };

            var WriteNicSettings_Cancel = function (idx) {

                base.removeLock("NIC_Property_IPv4_Address" + idx);
                base.removeLock("NIC_Property_IPv4_Subnet_Mask" + idx);
                base.removeLock("NIC_Property_IPv4_Default_Gateway" + idx);

                base.removeLock("NIC_Property_DHCP" + idx);
            };

            var WriteNicSettings_Undefined = function (idx) {

                base.setElementValue("NIC_Property_IPv4_Address" + idx, "0.0.0.0");
                base.setElementValue("NIC_Property_IPv4_Subnet_Mask" + idx, "0.0.0.0");
                base.setElementValue("NIC_Property_IPv4_Default_Gateway" + idx, "0.0.0.0");
            };


            var WriteDnsServers = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                var RequestParamIDs = base.getRequestParamIDs();

                if (base.isLocked(RequestParamIDs[IDX_NIC_IPv4_DNS].parameterName + idx)) {

                    var szDnsServers = base.getElementValue(RequestParamIDs[IDX_NIC_IPv4_DNS].parameterName + idx);

                    writeParams.push(RequestParamIDs[IDX_NIC_IPv4_DNS].parameterName);
                    idxs.push(idx);
                    writeValues.push(szDnsServers);
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            };

            var WriteDnsServers_Cancel = function (idx) {

                var RequestParamIDs = base.getRequestParamIDs();
                base.removeLock(RequestParamIDs[IDX_NIC_IPv4_DNS].parameterName + idx);
            };



            ////////////////////////////////////////////////////////////////////////////////////////////
            // Service-Transfers
            /////////////////////////////////////////////////////////////////////////////////////////
            var OnServiceTransferFailed = function (error) {

                Helper.HideLoading();
                base.clearLocks();

                // hide "Request timed out" ...it takes some time
                if (error.requestStatus === 0x80050011) {
                    bNetworkSettingsFailed = true;
                    base.writeStatus("Attempting to reconnect. This process may take up to one minute...");
                    base.scrollToElement("status");

                    if (iLastNicIdxWritten >= 0) {
                        WriteNicSettings_Undefined(iLastNicIdxWritten);
                    }
                }
                else {
                    window.DevMan.getErrorQueue().AddError(error.requestStatus, error.requestStatusText);
                }
            };

            var OnServiceTransferResult = function (serviceTransferResponse) {

                // Check the specific result
                switch (serviceTransferResponse.moduleItem.name) {

                    case "NIC_Function_IP_Release_Renew":

                        if (!serviceTransferResponse.isBusy) {

                            Helper.HideLoading();
                            WriteNicSettings_Cancel(serviceTransferResponse.moduleItem.id);

                            if (serviceTransferResponse.hasError) {
                                window.DevMan.getErrorQueue().AddError(serviceTransferResponse.errCode);
                            }
                        }
                        else {
                            // keep showing the loading div
                        }
                        break;

                    case "NIC_Function_Set_IpAndSubnet":

                        if (!serviceTransferResponse.isBusy) {

                            if (serviceTransferResponse.hasError) {

                                Helper.HideLoading();
                                window.DevMan.getErrorQueue().AddError(serviceTransferResponse.errCode);
                            }

                            if (winxp) {
                                // remove all locks with the same ID, if winxp
                                Helper.HideLoading();
                                WriteNicSettings_Cancel(serviceTransferResponse.moduleItem.id);
                            }
                            else {
                                // If WinCE or TC/BSD and writing successfull => renew IP
                                if (!serviceTransferResponse.hasError) {
                                    RenewIP(serviceTransferResponse.moduleItem.id);
                                }
                            }
                        }
                        else {
                            // keep showing the loading div
                        }
                        break;

                    default:
                        Helper.HideLoading();
                        break;
                }
            };


            var RenewIP = function (idx) {

                var CommandParamID = "NIC_Function_IP_Release_Renew";

                var paramValues = [];
                paramValues.push(base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID));

                if (!winxp) { iLastNicIdxWritten = idx; }
                base.executeCommand(CommandParamID, idx, paramValues);
                Helper.ShowLoading();
            };

            var WriteNicSettings = function (idx) {

                iLastNicIdxWritten = -1;
                base.writeStatus("");

                var DHCP_CurrentState = 0;

                if (base.isLocked("NIC_Property_IPv4_Address" + idx) ||
                    base.isLocked("NIC_Property_IPv4_Subnet_Mask" + idx) ||
                    base.isLocked("NIC_Property_IPv4_Default_Gateway" + idx) ||
                    base.isLocked("NIC_Property_DHCP" + idx)) {

                    var DHCP_UserState = parseInt(base.getElementValue("NIC_Property_DHCP" + idx));

                    // if the user wants to disable dhcp, he is able to configure the IP, Subnetmask and Gateway at once
                    if (DHCP_UserState === 0) {

                        // Get user input
                        var IPAddressNew = base.getElementValue("NIC_Property_IPv4_Address" + idx);
                        if (IPAddressNew === "") { IPAddressNew = "0.0.0.0"; }

                        var SubnetMaskNew = base.getElementValue("NIC_Property_IPv4_Subnet_Mask" + idx);
                        if (SubnetMaskNew === "") { SubnetMaskNew = "0.0.0.0"; }

                        var DefaultGatewayNew = base.getElementValue("NIC_Property_IPv4_Default_Gateway" + idx);
                        if (DefaultGatewayNew === "") { DefaultGatewayNew = "0.0.0.0"; }
                        
                        var CommandParamID = "NIC_Function_Set_IpAndSubnet";
                        var cb = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID) +
                            IPAddressNew.length +
                            SubnetMaskNew.length +
                            DefaultGatewayNew.length;

                        var paramValues = [];
                        paramValues.push(cb);
                        paramValues.push(IPAddressNew.length);
                        paramValues.push(SubnetMaskNew.length);
                        paramValues.push(DefaultGatewayNew.length);
                        paramValues.push(IPAddressNew);
                        paramValues.push(SubnetMaskNew);
                        paramValues.push(DefaultGatewayNew);

                        iLastNicIdxWritten = idx;
                        base.executeCommand(CommandParamID, idx, paramValues);
                        Helper.ShowLoading();
                    }
                    else if (DHCP_UserState === 1) {

                        var writeParams = [];
                        var idxs = [];
                        var writeValues = [];

                        // turn on DHCP
                        writeParams.push("NIC_Property_DHCP");
                        idxs.push(idx);
                        writeValues.push(DHCP_UserState);

                        iLastNicIdxWritten = idx;
                        base.Write(writeParams, idxs, writeValues);
                        Helper.ShowLoading();
                    }
                }
            };


            ////////////////////////////////////////////////////////////////////////////////////////////
            // Other
            /////////////////////////////////////////////////////////////////////////////////////////

            var DhcpStatus_Changed = function (idx) {

                if (base.isLocked("NIC_Property_DHCP" + idx)) {

                    // current user state
                    var DHCP_Enabled = base.getElementValue("NIC_Property_DHCP" + idx);

                    base.setElementDisabled("NIC_Property_IPv4_Address" + idx, (DHCP_Enabled == 1));
                    base.setElementDisabled("NIC_Property_IPv4_Subnet_Mask" + idx, (DHCP_Enabled == 1));
                    base.setElementDisabled("NIC_Property_IPv4_Default_Gateway" + idx, (DHCP_Enabled == 1));
                }
            };

        };

        this.Nic.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Hardware_Nic.Nic(), window.DevMan.ModuleType.Website);

})(window);
