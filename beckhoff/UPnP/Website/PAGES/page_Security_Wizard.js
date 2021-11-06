/// <reference path="_template_page.js" />
(function (window) {

    // namespace
    var Page_Security_Wizard = new (function () {

        this.Wizard = function () {

            this.category = "Security";
            this.name = "Wizard";
            this.subnavigationicon = "sec-nav-sys-settings.png";

            var CycleTime = 2000;
            var base = undefined;

            // Wizard Vars
            var sDefaultUsers = [];
            var iDefaultUserCurrent = 0;
            var bCheckDefaultPassword = false;
            var bHasDefaultPasswords = false;

            var iCurPos = 0;
            var iMaxPos = 2;
            var btnWizardBack_Name = "btnWizardBack";
            var btnWizardNext_Name = "btnWizardNext";
            var sBtnBackTitle = "<< Back";
            var sBtnNextTitle = "Next >>";
            var sBtnNextTitle_Finish = "Finish";

            this.Init = function () {

                // store context to base page
                base = this;

                if (base == undefined || base == null) {
                    return false;
                }

                if (tcbsd)
                    return false;

                // init Cycle Time for cyclic refreshing values
                base.setCycleTime(CycleTime);

                // init communication
                base.setCommunicationObj(window.DevMan.getCommunicationModule(window.DevMan.CommunicationType.mdp));

                //// init parameter
                base.addParameter("Misc_Properties_AutoLogonUsername", false);
                //base.addParameter("Management_Username_Property_Len", false);
                //base.addParameter("Management_User_Flags_Property_Len", false);

                // init events
                base.setOnInitStaticPage(OnInitStaticPage);
                base.setOnDisplayValues(OnDisplayValues);
                base.setOnWriteFailed(OnWriteFailed);
                base.setOnWriteResult(OnWriteResult);
                base.setOnServiceTransferFailed(OnServiceTransferFailed);
                base.setOnServiceTransferResult(OnServiceTransferResult);

                return true;
            }

            var CheckNextPassword = function () {
                iDefaultUserCurrent--;
                if (iDefaultUserCurrent < 0) {
                    if (sDefaultUsers.length == 0) {
                        bHasDefaultPasswords = false;
                    }
                    else {
                        bHasDefaultPasswords = true;
                    }
                    bCheckDefaultPassword = false;
                    InitSecurityWizard();
                }
                else {
                    CheckDefaultPassword();
                }
            }

            var OnInitStaticPage = function (RequestParamIDs) {

                // Start always @ first page of wizard
                iCurPos = 0;

                var html = "";
                html += "<div id='oWizzard' class='wizzard_body'>";
                html += " <div id='oWizzard'>";
                html += "  <div id='oWizzard_Bottom' class='wizzard_bottom'>";
                html += "   <button id='" + btnWizardBack_Name + "'>" + sBtnBackTitle + "</button>";
                html += "   <button id='" + btnWizardNext_Name + "'>" + sBtnNextTitle + "</button>";
                html += "  </div>";
                html += " </div>";
                html += "</div>";
                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);


                // check default passwords
                sDefaultUsers = [];
                sDefaultUsers.push("Administrator");
                
                bCheckDefaultPassword = true;
                iDefaultUserCurrent = sDefaultUsers.length;

                CheckNextPassword();

                return true;
            }

            var InitSecurityWizard = function () {

                document.getElementById("oWizzard").innerHTML += createWizardPage0();
                document.getElementById("oWizzard").innerHTML += createWizardPage1(true);
                document.getElementById("oWizzard").innerHTML += createWizardPage2();

                // Add Events
                base.setElementOnClick("btnChangePassword", function (_id) { return function () { ChangePassword(_id); }; }(0));
                base.setElementOnClick("btnChangePassword_cancel", function (_id) { return function () { Changepassword_Cancel(_id); }; }(0));

                base.setElementOnClick("btnWizardBack", function (_id) { return function () { WizardBack(_id); }; }(0));
                base.setElementOnClick("btnWizardNext", function (_id) { return function () { WizardNext(_id); }; }(0));

                base.setElementOnKeyUp("txtPassword", function (_event) { return function () { OnTxtKeyUp(_event); }; }(null));
                base.setElementOnKeyUp("txtPasswordNew", function (_event) { return function () { OnTxtKeyUp(_event); }; }(null));
                base.setElementOnKeyUp("txtPasswordNew2", function (_event) { return function () { OnTxtKeyUp(_event); }; }(null));

                // Add Locks
                base.addLockListener("chkAutoLogon");

                PageChange_After();
            }

            var OnDisplayValues = function (RequestParamIDs) {
            }

            var OnTxtKeyUp = function (e) {
                SetNextButtonState();
            }

            var SetNextButtonState = function () {

                var sPassword = base.getElementValue("txtPassword");
                var sPasswordNew = base.getElementValue("txtPasswordNew");
                var sPasswordNew2 = base.getElementValue("txtPasswordNew2");
                var bHasInput = !(sPassword == "" && sPasswordNew == "" && sPasswordNew2 == "");

                base.setElementDisabled("btnWizardBack", bHasInput);
                base.setElementDisabled("btnWizardNext", bHasInput);
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

                for (var i = 0; i < ModuleItemsWritten.length; i++) {

                    if (ModuleItemsWritten[i].name == "Misc_Properties_SecurityWizardEnabled") {

                        if (ErrorCodes[i] == 0) {
                            // Navigate to main page
                            base.ChangePage("Device", "System");
                        }
                        else {
                            window.DevMan.getErrorQueue().AddError(ErrorCodes[i]);
                        }
                    }
                }
            }

            var WrSecurityWizardState = function (idx) {

                var writeParams = [];
                var idxs = [];
                var writeValues = [];

                writeParams.push("Misc_Properties_SecurityWizardEnabled");
                idxs.push(0);
                writeValues.push(base.getElementChecked("chkEnableSecWiz"));

                base.Write(writeParams, idxs, writeValues);
                Helper.ShowLoading();
            }


            ////////////////////////////////////////////////////////////////////////////////////////////
            // Service-Transfers
            /////////////////////////////////////////////////////////////////////////////////////////
            var OnServiceTransferFailed = function (error) {

                Helper.HideLoading();

                if (bCheckDefaultPassword) {
                    CheckNextPassword();
                }
                else {
                    window.DevMan.getErrorQueue().AddError(error.requestStatus, error.requestStatusText);
                }
            }

            var OnServiceTransferResult = function (serviceTransferResponse) {

                if (serviceTransferResponse.isBusy) {
                    return; // just wait
                }

                Helper.HideLoading();

                if (serviceTransferResponse.hasError) {

                    if (serviceTransferResponse.moduleItem.name == "Management_Function_Change_Password_Secure") {
                        if (bCheckDefaultPassword) {
                            sDefaultUsers.splice(iDefaultUserCurrent, 1);
                            CheckNextPassword();
                        }
                        else {
                            window.DevMan.getErrorQueue().AddError(serviceTransferResponse.errCode);
                        }
                    }
                    else {
                        window.DevMan.getErrorQueue().AddError(serviceTransferResponse.errCode);
                    }
                }
                else {

                    if (serviceTransferResponse.moduleItem.name == "Management_Function_Change_Password_Secure") {
                        if (bCheckDefaultPassword) {
                            CheckNextPassword();
                        }
                        else {
                            if (winxp) {
                                SetAutoLogon(0);
                            }
                            else {
                                Changepassword_Cancel(0);
                            }
                        }
                    }
                    else if (serviceTransferResponse.moduleItem.name == "MISC_Function_AutoLogon") {
                        Changepassword_Cancel(0);
                    }
                }
            }

            // User Functions
            var ChangePassword = function (idx) {

                var szUsername = base.getElementValue("cmbUserNames");
                var szDomain = "";
                var szPassword = base.getElementText("txtPassword");
                var szPasswordNew = base.getElementText("txtPasswordNew");
                var szPasswordNew2 = base.getElementText("txtPasswordNew2");

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
            var CheckDefaultPassword = function () {

                var szUsername = sDefaultUsers[iDefaultUserCurrent];
                var szDomain = ""; // local
                var szPassword = "1";
                var szPasswordNew = "1";
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

            var Changepassword_Cancel = function (idx) {

                base.setElementUnchecked("chkAutoLogon");
                base.removeLock("chkAutoLogon");

                base.setElementValue("txtPassword", "");
                base.setElementValue("txtPasswordNew", "");
                base.setElementValue("txtPasswordNew2", "");

                SetNextButtonState();
            }

            var SetAutoLogon = function (idx) {

                var bAutoLogonEnabled = base.getElementChecked("chkAutoLogon");

                var szUsername = base.getElementValue("cmbUserNames");
                var szDomain = "";
                var szPassword = base.getElementText("txtPasswordNew");

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


            ////////////////////////////////////////////////////////////////////////////////////////////////
            // Wizard Functions
            //////////////////////////////////////////////////////////////////////////////////////////////

            // PAGE0 - Welcome page
            var createWizardPage0 = function () {

                var html = "";
                html += "<div id='wizzardPage_0'>";

                html += '<h1>Security Wizard</h1>';

                if (bHasDefaultPasswords) {
                    html += '<h3>You are using default credentials!</h3>';
                }
                else {
                    Helper.setDeactivateSecurityWizard();
                }

                html += '<h4>This wizard will support you to configure the security settings of your Beckhoff IPC.</h4>';
                html += '<h4>For more information, see <a href="https://www.beckhoff.com/secguide" target="_blank">IPC security guideline</a>.<br>Please note also the advisories on <a href="https://www.beckhoff.com/secinfo" target="_blank">computer security</a>.</h4>';
                html += '<br>';
                html += '<br>';
                html += '<br>';

                html += '</div>';

                return html;
            }

            // PAGE1 - Change passwords
            var createWizardPage1 = function (bAutoLogonEnabled) {

                var html = "";
                html += "<div id='wizzardPage_1'>";

                html += '<h3>Change Passwords</h3>';
                html += '<h4>Your Beckhoff IPC is delivered with default user accounts and related default passwords! It is strongly recommended to change the default passwords to prohibit unauthorized access to your Beckhoff IPC. Please note that these passwords are valid for the access to the Beckhoff Device Manager, too.</h4>';
                html += '<br>';

                if (bHasDefaultPasswords) {
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += ' <td class="td_trans"><h4>Change the default password of the user account(s) to prohibit unauthorized access to your Beckhoff IPC.</h4></td>';
                    html += ' <td class="td_Action_trans">' +
                        new ControlLib.SmallButton().Create("btnChangePassword", "save", "Change Password") +
                        new ControlLib.SmallButton().Create("btnChangePassword_cancel", "delete");
                    html += '</table>';

                    // ChangePasswords
                    html += '<table>';
                    html += '<tr><td class="td_FirstColumn">Local Users</td><td>' + new ControlLib.Combobox().CreateMap("cmbUserNames", sDefaultUsers, sDefaultUsers) + '</td></tr>';
                    html += '<tr><td class="td_FirstColumn">Password</td><td>' + new ControlLib.Textbox().CreatePassword("txtPassword", "150px", "password") + '</td></tr>';
                    html += '<tr><td class="td_FirstColumn">New Password</td><td>' + new ControlLib.Textbox().CreatePassword("txtPasswordNew", "150px", "password") + '</td></tr>';
                    html += '<tr><td class="td_FirstColumn">New Password (confirm)</td><td>' + new ControlLib.Textbox().CreatePassword("txtPasswordNew2", "150px", "password") + '</td></tr>';

                    // AutoLogon
                    if (winxp) {
                        html += '<tr><td class="td_FirstColumn">Auto Logon Enabled</td><td>' + new ControlLib.Checkbox().Create("chkAutoLogon", 1, "", bAutoLogonEnabled) + '</td></tr>';
                    }
                }
                else {
                    html += ' <td class="td_trans"><h4>You have already changed the default passwords.</h4></td>';
                }

                html += '<tr><td class="td_trans"></td></tr>';
                html += '</table>';
                html += '<br>';

                html += '</div>';

                return html;
            }

            // PAGE2 - Turn off SecurityWizard
            var createWizardPage2 = function () {

                var html = "";
                html += "<div id='wizzardPage_2'>";

                // Title
                html += '<h3>Turn Security Wizard ON or OFF</h1>';
                html += '<h4>If you turn off the Security Wizard you agree that you will not be advised to the security settings anymore.</h4>';
                html += '<br>';
                html += '<h4>The security wizard only contains basic security settings. More advanced security settings can be made within the settings of the operating system which is in the sole responsibility of the user.</h4>';
                html += '<br>';

                // Turn off SecWiz
                html += '<table>';
                html += '<tr><td class="td_trans">' + new ControlLib.Checkbox().Create("chkEnableSecWiz", 1, "Run Beckhoff Security Wizard on next startup.", true) + '</td></tr>';
                html += '</table>';

                html += '<br>';
                html += "</div>"

                return html;
            }

            var WizardBack = function () {

                if (iCurPos > 0) {
                    if (PageChange_Before()) {
                        iCurPos--;
                        PageChange_After();
                    }
                }
            }

            var WizardNext = function () {

                if (iCurPos < iMaxPos) {
                    if (PageChange_Before()) {
                        iCurPos++;
                        PageChange_After();
                    }
                }
                else if (iCurPos == iMaxPos) {

                    FinishWizzard();
                }
            }

            var PageChange_Before = function () {

                // Check input

                switch (iCurPos) {
                    case 0:
                        return true;
                    case 1:
                        {
                            var sInput = base.getElementValue("txtPassword") + base.getElementValue("txtPasswordNew") + base.getElementValue("txtPasswordNew2");

                            if (sInput.length > 0) {
                                if (confirm("If you continue your current changes will not be saved!")) {
                                    Changepassword_Cancel(0); return true;
                                }
                                else {
                                    return false;
                                }
                            }
                            else {
                                return true;
                            }
                        }
                    case 2:
                        return true;
                    default:
                        return false;
                }
            }

            var PageChange_After = function () {

                // show the current div, hide the other divs
                for (var i = 0; i <= iMaxPos; i++) {

                    var sNewStyle = "";
                    if (i == iCurPos) { sNewStyle = "block"; }  // show
                    else { sNewStyle = "none"; }                // hide

                    var divCurrentPage = document.getElementById("wizzardPage_" + i);
                    if (divCurrentPage) {
                        divCurrentPage.style.display = sNewStyle;
                    }
                }

                // Change "Next >>" to "Finish" if the last page was opened
                var btnNext = document.getElementById(btnWizardNext_Name);
                if (btnNext) {
                    if (iCurPos == iMaxPos) {
                        btnNext.firstChild.data = sBtnNextTitle_Finish;
                    }
                    else {
                        btnNext.firstChild.data = sBtnNextTitle;
                    }
                }

                // Set "<< Back" Button disabled if on first page
                base.setElementDisabled(btnWizardBack_Name, (iCurPos == 0));
            }

            var FinishWizzard = function () {

                var sText = "Do you really want to leave the security wizard?";

                var bSecurityWizardEnabled = base.getElementChecked("chkEnableSecWiz");
                if (!bSecurityWizardEnabled) {
                    sText = "Do you really want to turn off the security wizard?";
                }

                if (confirm(sText)) {
                    // internal website state
                    Helper.setDeactivateSecurityWizard();

                    // machine state
                    WrSecurityWizardState(bSecurityWizardEnabled);
                }
            }

        }

        this.Wizard.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Security_Wizard.Wizard(), window.DevMan.ModuleType.Website);

})(window);
