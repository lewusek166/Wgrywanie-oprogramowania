(function (window) {

    // namespace
    var Page_Security_AccessRights = new (function () {

        this.AccessRights = function () {

            this.category = "Security";
            this.name = "Access";
            this.subnavigationicon = "sec-nav-access.png";

            var CycleTime = 2000;
            var base = undefined;

            // private members of AccessRights page
            var RootDir = "";


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
                if (!tcbsd) {
                    base.addParameter("Management_Username_Property_Len", true);            // 0
                    base.addParameter("Management_Domain_Property_Len", true);
                    base.addParameter("Management_Group_Membership_Property_Len", true);
                    base.addParameter("Management_Local_Groups_Property_Len", true);
                    base.addParameter("Management_User_Flags_Property_Len", true);
                    base.addParameter("GENERAL_Device_Name", false);                        // 5
                    base.addParameter("Misc_Properties_AutoLogonUsername", true);
                }

                // init events
                base.setOnInitStaticPage(OnInitStaticPage);
                base.setOnDisplayValues(OnDisplayValues);
                // base.setOnWriteFailed(OnWriteFailed); 
                // base.setOnWriteResult(OnWriteResult); 
                base.setOnServiceTransferFailed(OnServiceTransferFailed); 
                base.setOnServiceTransferResult(OnServiceTransferResult); 

                return true;
            }

            var OnInitStaticPage = function (RequestParamIDs) {

                var html = "";
                html += '<h3>Login</h3>';

                // Change User passwords (BigWindows-only!)
                html += '<table style="margin-bottom: 5px"><tr>';
                html += ' <td class="td_trans"><h4>Change User Passwords</h4></td>';
                html += ' <td class="td_Action_trans">' +
                    new ControlLib.SmallButton().Create("btnChangePassword", "save", "Change Password") +
                    new ControlLib.SmallButton().Create("btnChangePassword_cancel", "delete");
                html += '</table>';
                html += '<table>';
                html += '<tr><td class="td_FirstColumn">Username</td><td>' + new ControlLib.Textbox().Create("txtChangePasswordUsername") + '</td></tr>';
                html += '<tr><td class="td_FirstColumn">Domain (optional)</td><td>' + new ControlLib.Textbox().Create("txtChangePasswordDomain") + '</td></tr>'; // BigWinOnly
                html += '<tr><td class="td_FirstColumn">Password</td><td>' + new ControlLib.Textbox().CreatePassword("txtChangePassword", "150px", "password") + '</td></tr>';
                html += '<tr><td class="td_FirstColumn">New Password</td><td>' + new ControlLib.Textbox().CreatePassword("txtChangePasswordNew", "150px", "password") + '</td></tr>';
                html += '<tr><td class="td_FirstColumn">New Password (confirm)</td><td>' + new ControlLib.Textbox().CreatePassword("txtChangePasswordNew2", "150px", "password") + '</td></tr>';
                html += '</table>';
                html += '<br>';

                if (winxp) {
                    // Configure Auto Logon User (BigWindows-only!)
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += ' <td class="td_trans"><h4>Configure Auto Logon</h4></td>';
                    html += ' <td class="td_Action_trans">' +
                        new ControlLib.SmallButton().Create("btnSetAutoLogon", "save", "Set Auto Logon") +
                        new ControlLib.SmallButton().Create("btnSetAutoLogon_cancel", "delete");
                    html += '</table>';
                    html += '<table>';
                    html += '<tr><td class="td_FirstColumn">Enable</td><td>' + new ControlLib.Checkbox().Create("chkAutoLogon", 1, "", false) + '</td></tr>';
                    html += '<tr><td class="td_FirstColumn">Username</td><td>' + new ControlLib.Textbox().Create("txtAutoLogonUsername") + '</td></tr>';
                    html += '<tr><td class="td_FirstColumn">Domain (optional)</td><td>' + new ControlLib.Textbox().Create("txtAutoLogonDomain") + '</td></tr>';
                    html += '<tr><td class="td_FirstColumn">Password</td><td>' + new ControlLib.Textbox().CreatePassword("txtAutoLogonPassword", "150px", "password") + '</td></tr>';
                    html += '<tr><td class="td_FirstColumn">Password (confirm)</td><td>' + new ControlLib.Textbox().CreatePassword("txtAutoLogonPassword2", "150px", "password") + '</td></tr>';
                    html += '</table>';
                    html += '<br>';
                }


                html += '<h3>NTLM Configuration</h3>';

                // Add User
                html += '<table style="margin-bottom: 5px">';
                html += '<tr><td class="td_trans"><h4>Add User</h4></td><td class="td_Action_trans">'
                    + new ControlLib.SmallButton().Create("btnAddUser", "save", "Add User")
                    + new ControlLib.SmallButton().Create("btnAddUser_Cancel", "delete", "Discard Changes")
                    + '</td></tr>';
                html += '</table>';
                html += '<table>';
                html += '<tr><td class="td_FirstColumn">Username</td><td>' + new ControlLib.Textbox().Create("txtAddUser_Username") + '</td></tr>';
                if (winxp) {
                    html += '<tr><td class="td_FirstColumn">Domain (optional)</td><td>' + new ControlLib.Textbox().Create("txtAddUser_Domain") + '</td></tr>';
                }
                html += '<tr><td class="td_FirstColumn">Password</td><td>' + new ControlLib.Textbox().CreatePassword("txtAddUser_Password", "150px", "password") + '</td></tr>';
                html += '<tr><td class="td_FirstColumn">Password (confirm)</td><td>' + new ControlLib.Textbox().CreatePassword("txtAddUser_Password2", "150px", "password") + '</td></tr>';
                html += '</table>';
                html += '<br>';

                // Add local Group
                html += '<table style="margin-bottom: 5px">';
                html += '<tr><td class="td_trans"><h4>Add Local Group</h4></td><td class="td_Action_trans">'
                    + new ControlLib.SmallButton().Create("btnAddLocalGroup", "save", "Add Local Group")
                    + new ControlLib.SmallButton().Create("btnAddLocalGroup_Cancel", "delete", "Discard Changes")
                    + '</td></tr>';
                html += '</table>';
                html += '<table>';
                html += '<tr><td class="td_FirstColumn">Groupname</td><td>' + new ControlLib.Textbox().Create("txtAddGroup_Groupname") + '</td></tr>';
                html += '</table>';
                html += '<br>';

                // Set (local) Group Membership
                html += '<table style="margin-bottom: 5px">';
                html += '<tr><td class="td_trans"><h4>Set Local Group Membership</h4></td><td class="td_Action_trans">'
                    + new ControlLib.SmallButton().Create("btnSetGroupMembership", "save", "Set Local Group Membership")
                    + new ControlLib.SmallButton().Create("btnSetGroupMembership_Cancel", "delete", "Discard Changes")
                    + '</td></tr>';
                html += '</table>';
                html += '<table>';
                html += '<tr><td class="td_FirstColumn">Membership</td><td>'
                            + new ControlLib.Radiobutton().Create("chkSetGroupMembership_Membership", 1, "Add", true)
                            + new ControlLib.Radiobutton().Create("chkSetGroupMembership_Membership", 0, "Delete", false)
                            + '</td></tr>';
                html += '<tr><td class="td_FirstColumn">Username</td><td>' + new ControlLib.Textbox().Create("txtSetGroupMembership_Username") + '</td></tr>';
                html += '<tr><td class="td_FirstColumn">Groupname</td><td>' + new ControlLib.Textbox().Create("txtSetGroupMembership_Groupname") + '</td></tr>';
                html += '</table>';
                html += '<br>';

                // Display and delete Users (display even if there are no items available)
                html += '<h3>Configured Users</h3>';
                html += '<div id="users">No Items available</div>';
                html += "<br>";
                
                // Display and delete Groups (display even if there are no items available)
                html += '<h3>Configured Local Groups</h3>';
                html += '<div id="local_groups">No Items available</div>';
                html += "<br>";
                
                //html += '<h3>FTP</h3>';
                //html += '<br>';

                //html += '<h3>RAS</h3>';
                //html += '<br>';


                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);

                // Add Events
                base.setElementOnClick("btnAddUser", function (_id) { return function () { AddUser(_id); }; }(0));
                base.setElementOnClick("btnAddUser_Cancel", function (_id) { return function () { AddUser_Cancel(_id); }; }(0));
                
                base.setElementOnClick("btnAddLocalGroup", function (_id) { return function () { AddLocalGroup(_id); }; }(0));
                base.setElementOnClick("btnAddLocalGroup_Cancel", function (_id) { return function () { AddLocalGroup_Cancel(_id); }; }(0));
                
                base.setElementOnClick("btnSetGroupMembership", function (_id) { return function () { SetGroupMembership(_id); }; }(0));
                base.setElementOnClick("btnSetGroupMembership_Cancel", function (_id) { return function () { SetGroupMembership_Cancel(_id); }; }(0));

                base.setElementOnClick("btnChangePassword", function (_id) { return function () { ChangePassword(_id); }; }(0));
                base.setElementOnClick("btnChangePassword_cancel", function (_id) { return function () { Changepassword_Cancel(_id); }; }(0));


                if (winxp)
                {
                    // Add Events
                    base.setElementOnClick("btnSetAutoLogon", function (_id) { return function () { SetAutoLogon(_id); }; }(0));
                    base.setElementOnClick("btnSetAutoLogon_cancel", function (_id) { return function () { SetAutoLogon_Cancel(_id); }; }(0));

                    base.addLockListener("chkAutoLogon");
                    base.addLockListener("txtAutoLogonUsername");
                }

                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                if (RequestParamIDs[0].getHasValues() ||
                    RequestParamIDs[1].getHasValues() ||
                    RequestParamIDs[2].getHasValues()) {

                    var html = "";
                    html += '<table>';
                    html += '<tr><th>User Name</th><th>Group Membership</th><th>Account Status</th><th></th></tr>';


                    var RowsUsername = 0;
                    if (RequestParamIDs[0].getHasValues()) { RowsUsername = RequestParamIDs[0].values[0].length; }

                    var RowsGroupMembership = 0;
                    if (RequestParamIDs[2].getHasValues()) { RowsGroupMembership = RequestParamIDs[2].values[0].length; }

                    var Rows = Math.max(RowsUsername, RowsGroupMembership);

                    for (var i = 0; i < Rows; i++) {

                        html += '<tr>';

                        try {
                            html += '<td><div id="' + RequestParamIDs[0].parameterName + i + '">' + RequestParamIDs[0].values[0][i].getOutput() + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        try {
                            html += '<td><div id="' + RequestParamIDs[2].parameterName + i + '">' + RequestParamIDs[2].values[0][i].getOutput() + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        try {
                            var bIsActive = Helper.getNTLMUserAccountIsActive(RequestParamIDs[4].values[0][i].data);
                            var sDisplayValue = bIsActive ? "Enabled" : "Disabled";
                            html += '<td><div id="' + RequestParamIDs[4].parameterName + i + '">' + sDisplayValue + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        try {
                            html += '<td><div align="right" id="">' + new ControlLib.SmallButton().Create("DeleteUser" + i, "delete", "") + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        html += '</tr>';
                    }
                    html += '</table>';

                    base.writeElement("users", html);

                    // Add Events
                    for (var i = 0; i < Rows; i++) {

                        try {
                            base.setElementOnClick("DeleteUser" + i, function (_id) { return function () { DeleteUser(_id); }; }(i));
                        }
                        catch (e) { }
                    }
                }
                else {

                    base.writeElement("users", "No items available");
                }

                if (RequestParamIDs[3].getHasValues()) {

                    var html = "";
                    html += '<table>';
                    html += '<tr><th>Local Group</th><th></th></tr>';

                    var RowsLocalGroups = 0;
                    if (RequestParamIDs[3].getHasValues()) { RowsLocalGroups = RequestParamIDs[3].values[0].length; }

                    var Rows = RowsLocalGroups;
                    for (var i = 0; i < Rows; i++) {

                        html += '<tr>';

                        try {
                            html += '<td><div id="' + RequestParamIDs[3].parameterName + i + '">' + RequestParamIDs[3].values[0][i].getOutput() + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        try {
                            html += '<td><div align="right" id="">' + new ControlLib.SmallButton().Create("DeleteLocalGroup" + i, "delete", "") + '</div></td>';
                        }
                        catch (e) { 
                            html += '<td></td>';
                        }

                        html += '</tr>';
                    }

                    html += '</table>';
                    base.writeElement("local_groups", html);

                    // Add Events
                    for (var i = 0; i < Rows; i++) {

                        try {
                            base.setElementOnClick("DeleteLocalGroup" + i, function (_id) { return function () { DeleteLocalGroup(_id); }; }(i));
                        }
                        catch (e) { }
                    }
                }
                else {

                    base.writeElement("local_groups", "No items available");
                }

                // Auto-Logon (Current Configuration)
                if (RequestParamIDs[6].getHasValues()) {
                    base.setElementChecked("chkAutoLogon");
                    base.setElementValue("txtAutoLogonUsername", RequestParamIDs[6].values[0].getOutput());
                }
                else {
                    base.setElementUnchecked("chkAutoLogon");
                    base.setElementValue("txtAutoLogonUsername", "");
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

                    // MDP Errorcode-fix
                    if (serviceTransferResponse.errCode == 1378) {  // ERROR_MEMBER_IN_ALIAS
                        serviceTransferResponse.errCode = 0xECA70562;
                    }
                    else if (serviceTransferResponse.errCode == 1388) { // ERROR_INVALID_MEMBER
                        serviceTransferResponse.errCode = 0xECA7056C;
                    }
                    else if (serviceTransferResponse.errCode == 1377) { // ERROR_MEMBER_NOT_IN_ALIAS
                        serviceTransferResponse.errCode = 0xECA70561;
                    }

                    window.DevMan.getErrorQueue().AddError(serviceTransferResponse.errCode);
                }
                else {

                    if (serviceTransferResponse.moduleItem.name == "Management_Function_Add_User") {
                        AddUser_Cancel(0);
                    }
                    else if (serviceTransferResponse.moduleItem.name == "Management_Function_Create_Group") {
                        AddLocalGroup_Cancel(0);
                    }
                    else if (serviceTransferResponse.moduleItem.name == "Management_Function_Set_Group_Membership") {
                        SetGroupMembership_Cancel(0);
                    }
                    else if (serviceTransferResponse.moduleItem.name == "Management_Function_Change_Password_Secure") {
                        Changepassword_Cancel(0);
                    }
                    else if (serviceTransferResponse.moduleItem.name == "MISC_Function_AutoLogon") {
                        SetAutoLogon_Cancel(0);
                    }
                }
            }

            // User Functions
            var AddUser = function (idx) {

                var szUsername = base.getElementValue("txtAddUser_Username");
                var szDomain = "";
                if (winxp) { szDomain = base.getElementValue("txtAddUser_Domain"); }
                var szPassword = base.getElementValue("txtAddUser_Password");
                var szPassword2 = base.getElementValue("txtAddUser_Password2");

                if (szPassword == szPassword2) {

                    if (szPassword.length > 0) {

                        var CommandParamID = "Management_Function_Add_User";

                        // calc length of data
                        var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID)
                                          + szUsername.length
                                          + szDomain.length
                                          + szPassword.length;

                        var paramValues = [];
                        paramValues.push(cbInputData);
                        paramValues.push(szUsername.length);
                        paramValues.push(szDomain.length);
                        paramValues.push(szPassword.length);
                        paramValues.push(szUsername);
                        paramValues.push(szDomain);
                        paramValues.push(szPassword);

                        base.executeCommand(CommandParamID, 0, paramValues);
                        Helper.ShowLoading();
                    }
                    else {
                        window.DevMan.getErrorQueue().AddError(0x80050041); // Invalid password
                    }
                }
                else {
                    window.DevMan.getErrorQueue().AddError(0x80050040); // Passwords do not match
                }
            }

            var AddUser_Cancel = function (idx) {

                base.setElementValue("txtAddUser_Username", "");
                if (winxp) { base.setElementValue("txtAddUser_Domain", ""); }
                base.setElementValue("txtAddUser_Password", "");
                base.setElementValue("txtAddUser_Password2", "");
            }


            // User Functions
            var ChangePassword = function (idx) {

                var szUsername = base.getElementValue("txtChangePasswordUsername");
                var szDomain = "";
                if (winxp) { szDomain = base.getElementValue("txtChangePasswordDomain"); }
                var szPassword = base.getElementText("txtChangePassword");
                var szPasswordNew = base.getElementText("txtChangePasswordNew");
                var szPasswordNew2 = base.getElementText("txtChangePasswordNew2");

                if (szPasswordNew == szPasswordNew2) {

                    if (szPasswordNew.length > 0) {

                        var CommandParamID = "Management_Function_Change_Password_Secure";

                        // calc length of data
                        var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID)
                                          + szUsername.length
                                          + szDomain.length
                                          + szPassword.length
                                          + szPasswordNew.length;

                        var paramValues = [];
                        paramValues.push(cbInputData);
                        paramValues.push(szUsername.length);
                        paramValues.push(szDomain.length);
                        paramValues.push(szPassword.length);
                        paramValues.push(szPasswordNew.length);

                        paramValues.push(szUsername);
                        paramValues.push(szDomain);
                        paramValues.push(szPassword);
                        paramValues.push(szPasswordNew);

                        base.executeCommand(CommandParamID, 0, paramValues);
                        Helper.ShowLoading();
                    }
                    else {
                        window.DevMan.getErrorQueue().AddError(0x80050041); // Invalid password
                    }
                }
                else {
                    window.DevMan.getErrorQueue().AddError(0x80050040); // Passwords do not match
                }

            }

            var Changepassword_Cancel = function (idx) {

                base.setElementValue("txtChangePasswordUsername", "");

                if (winxp) {
                    base.setElementValue("txtChangePasswordDomain", "");
                }

                base.setElementValue("txtChangePassword", "");
                base.setElementValue("txtChangePasswordNew", "");
                base.setElementValue("txtChangePasswordNew2", "");
            }


            var DeleteUser = function (idx) {

                var RequestParamIDs = base.getRequestParamIDs();
                var szUsername = base.readElement(RequestParamIDs[0].parameterName + idx);
                var szDomain = base.readElement(RequestParamIDs[1].parameterName + idx);

                if (confirm("Do you really want to delete the user " + szUsername + "?")) {

                    var CommandParamID = "Management_Function_Del_User";

                    // calc length of data
                    var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID)
                                      + szUsername.length
                                      + szDomain.length;

                    var paramValues = [];
                    paramValues.push(cbInputData);
                    paramValues.push(szUsername.length);
                    paramValues.push(szDomain.length);
                    paramValues.push(szUsername);
                    paramValues.push(szDomain);

                    base.executeCommand(CommandParamID, 0, paramValues);
                    Helper.ShowLoading();
                }
            }


            // -LOCAL- Group Functions
            var AddLocalGroup = function (idx) {

                var RequestParamIDs = base.getRequestParamIDs();
                var szGroupname = base.getElementValue("txtAddGroup_Groupname");
                var szDomain = RequestParamIDs[5].values[0].data;   // local domain (hostname)

                var CommandParamID = "Management_Function_Create_Group";

                // calc length of data
                var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID)
                                  + szGroupname.length
                                  + szDomain.length;

                var paramValues = [];
                paramValues.push(cbInputData);
                paramValues.push(szGroupname.length);
                paramValues.push(szDomain.length);
                paramValues.push(szGroupname);
                paramValues.push(szDomain);

                base.executeCommand(CommandParamID, 0, paramValues);
                Helper.ShowLoading();
            }

            var AddLocalGroup_Cancel = function (idx) {

                base.setElementValue("txtAddGroup_Groupname", "");
            }
           

            var DeleteLocalGroup = function (idx) {
                
                var RequestParamIDs = base.getRequestParamIDs();
                var szGroupname = base.readElement(RequestParamIDs[3].parameterName + idx);
                var szDomain = RequestParamIDs[5].values[0].data;   // local domain (hostname)

                if (confirm("Do you really want to delete the group " + szGroupname + "?")) {

                    var CommandParamID = "Management_Function_Delete_Group";

                    // calc length of data
                    var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID)
                                      + szGroupname.length
                                      + szDomain.length;

                    var paramValues = [];
                    paramValues.push(cbInputData);
                    paramValues.push(szGroupname.length);
                    paramValues.push(szDomain.length);
                    paramValues.push(szGroupname);
                    paramValues.push(szDomain);

                    base.executeCommand(CommandParamID, 0, paramValues);
                    Helper.ShowLoading();
                }
            }

            var SetGroupMembership = function (idx) {

                var RequestParamIDs = base.getRequestParamIDs();

                var bIsMemberOfGroup = base.getCheckedRadioButtonValue("chkSetGroupMembership_Membership");    // true = Add Member, false = Remove Member
                var szUsername = base.getElementValue("txtSetGroupMembership_Username");
                var szGroupname = base.getElementValue("txtSetGroupMembership_Groupname");
                var szDomain = RequestParamIDs[5].values[0].data;   // local domain (hostname)
                

                var CommandParamID = "Management_Function_Set_Group_Membership";

                // calc length of data
                var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID)
                                  + szUsername.length
                                  + szGroupname.length
                                  + szDomain.length;

                var paramValues = [];
                paramValues.push(cbInputData);
                paramValues.push(szUsername.length);
                paramValues.push(szGroupname.length);
                paramValues.push(szDomain.length);
                paramValues.push(bIsMemberOfGroup);
                paramValues.push(szUsername);
                paramValues.push(szGroupname);
                paramValues.push(szDomain);
                
                base.executeCommand(CommandParamID, 0, paramValues);
                Helper.ShowLoading();
            }

            var SetGroupMembership_Cancel = function (idx) {

                base.setElementChecked("chkSetGroupMembership_Membership_Add");
                base.setElementValue("txtSetGroupMembership_Username", "");
                base.setElementValue("txtSetGroupMembership_Groupname", "");
            }

            var SetAutoLogon = function (idx) {

                var bAutoLogonEnabled = base.getElementChecked("chkAutoLogon");
                var szUsername = "";
                var szDomain = "";
                var szPassword = "";
                
                if (bAutoLogonEnabled) {
                    szUsername = base.getElementValue("txtAutoLogonUsername");
                    szDomain = base.getElementValue("txtAutoLogonDomain");
                    szPassword = base.getElementText("txtAutoLogonPassword");
                    var szPassword2 = base.getElementText("txtAutoLogonPassword2");

                    if (szUsername.length == 0) {
                        window.DevMan.getErrorQueue().AddError(0x80050031); // Check your input
                        return;
                    }
                    else if (szPassword != szPassword2) {
                        window.DevMan.getErrorQueue().AddError(0x80050040); // Passwords do not match
                        return;
                    }
                    else if (szPassword.length == 0) {
                        window.DevMan.getErrorQueue().AddError(0x80050041); // Invalid password
                        return;
                    }
                }

                var CommandParamID = "MISC_Function_AutoLogon";

                // calc length of data
                var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID)
                                    + szUsername.length
                                    + szDomain.length
                                    + szPassword.length

                var paramValues = [];
                paramValues.push(cbInputData);
                paramValues.push(szUsername.length);
                paramValues.push(szDomain.length);
                paramValues.push(szPassword.length);

                paramValues.push(bAutoLogonEnabled);
                paramValues.push(szUsername);
                paramValues.push(szDomain);
                paramValues.push(szPassword);

                base.executeCommand(CommandParamID, 0, paramValues);
                Helper.ShowLoading();
            }

            var SetAutoLogon_Cancel = function (idx) {

                base.setElementUnchecked("chkAutoLogon");
                base.setElementValue("txtAutoLogonUsername", "");
                base.setElementValue("txtAutoLogonDomain", "");
                base.setElementValue("txtAutoLogonPassword", "");
                base.setElementValue("txtAutoLogonPassword2", "");

                base.removeLock("chkAutoLogon");
                base.removeLock("txtAutoLogonUsername");
            }

        }

        this.AccessRights.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Security_AccessRights.AccessRights(), window.DevMan.ModuleType.Website);

})(window);
