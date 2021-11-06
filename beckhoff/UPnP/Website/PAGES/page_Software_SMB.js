(function (window) {

    // namespace
    var Page_Software_SMB = new (function () {

        this.SMB = function () {

            this.category = "Software";                     // Device, Hardware, Software, Security or TwinCAT
            this.name = "Shares";                           // This name will be displayed in the SubNavigation-menue
            this.subnavigationicon = "sec-nav-smb.png";     // Icon of SubNavigation-menue

            var CycleTime = 2000;
            var base = undefined;
            var bScrollToBottom = false;

            this.Init = function () {

                // store context to base page (_template_page.js)
                base = this;

                if (base == undefined || base == null) {
                    return false;
                }

                // init cycletime for cyclic refreshing values (default: 1000ms)
                base.setCycleTime(CycleTime);

                // select the communication type (here: mdp)
                base.setCommunicationObj(window.DevMan.getCommunicationModule(window.DevMan.CommunicationType.mdp));

                // init parameterlist
                // select the paramaters which will be read (all parameternames in ...\DeviceManager\communication\moduleList.js  ...scroooolll ;-])
                base.addParameter("SMB_Property_Share_Names_Len", true);
                base.addParameter("SMB_Property_Path_Names_Len", true);
                base.addParameter("SMB_Property_Userlist_Len", true);
                base.addParameter("SMB_Property_Access_Rights_Len", true);
                base.addParameter("Management_Username_Property_Len", false);
                
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

                html += '<h3>Shared Folders SMB</h3>';

                html += '<h4>Shares</h4>';
                html += '<div id="smb_shares"></div>';
                html += '<br>';
                html += '<h4>Access Rights</h4>';
                html += '<div id="smb_accessrights"></div>';
                html += '<br>';

                if (RequestParamIDs[0].getHasValues() &&
                    RequestParamIDs[4].getHasValues()) {

                    // "Set User Access Rights"-Title with buttons to save and discard changes
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += ' <td class="td_trans"><h4>Set User Access Rights</h4></td>';
                    html += ' <td class="td_Action_trans">' +
                        new ControlLib.SmallButton().Create("btnSetUserAccessRights", "save", "Set Access Rights") +
                        new ControlLib.SmallButton().Create("btnSetUserAccessRights_cancel", "delete");
                    html += '</tr></table>';

                    html += '<table>';
                    html += '<tr><td class="td_FirstColumn">Share Name</td><td><div id="cmbShareNameDiv"</div></td></tr>';

                    var sUserNames = [];
                    sUserNames.push("");
                    for (var i = 0; i < RequestParamIDs[4].values[0].length; i++) {
                        if (RequestParamIDs[4].values[0][i].error == 0) {
                            sUserNames.push(RequestParamIDs[4].values[0][i].data);
                        }
                    }
                    sUserNames.push("Other");
                    html += '<tr><td class="td_FirstColumn">User Name</td><td>' + new ControlLib.Combobox().CreateMap("cmbUserName", sUserNames, sUserNames) + '</td></tr>';
                    html += '<tr><td class="td_FirstColumn">User Name (other)</td><td>' + new ControlLib.Textbox().Create("txtUserNameEx") + '</td></tr>';

                    var sAccessRightsNames = []; sAccessRightsNames.push("");
                    var sAccessRightsValues = []; sAccessRightsValues.push("");

                    if (winxp) {
                        sAccessRightsNames.push("Read"); sAccessRightsValues.push(10);
                        sAccessRightsNames.push("Change"); sAccessRightsValues.push(20);
                        sAccessRightsNames.push("Full Access"); sAccessRightsValues.push(-1);
                        sAccessRightsNames.push("Delete User"); sAccessRightsValues.push(0);
                    }
                    else if (wince) {
                        // win CE only "Full Access" & "Delete User"
                        sAccessRightsNames.push("Full Access"); sAccessRightsValues.push(-1);
                        sAccessRightsNames.push("Delete User"); sAccessRightsValues.push(0);
                    }
                    else {
                        // TODO
                    }

                    html += '<tr><td class="td_FirstColumn">Access Rights</td><td>' + new ControlLib.Combobox().CreateMap("cmbAccessRights", sAccessRightsNames, sAccessRightsValues) + '</td></tr>';

                    html += '</table>';
                    html += '<br>';
                }

                // Add Share-Title with a button to save the share
                html += '<table style="margin-bottom: 5px"><tr>';
                html += ' <td class="td_trans"><h4>Add Share</h4></td>';
                html += ' <td class="td_Action_trans">' + new ControlLib.SmallButton().Create("btnAddShare", "save", "Add Share");
                html += '</tr></table>';

                html += '<table>';
                html += ' <tr><td class="td_FirstColumn">Share-Name</td><td>' + new ControlLib.Textbox().Create("txtShareName") + '</td></tr>';
                html += ' <tr><td class="td_FirstColumn">Path to folder</td><td>' + new ControlLib.Textbox().Create("txtSharePath", "99%") + '</td></tr>';
                html += ' <tr><td class="td_FirstColumn"></td> <td><div id="divSelectDirectory"></div></td></tr>';
                html += '</table>';
                html += '<br>';

                html += '<div id="status"></div>';  // div for user-information
                // write innerHTML of page
                base.writeActivePage(html);


                if (RequestParamIDs[0].getHasValues() &&
                    RequestParamIDs[4].getHasValues()) {

                    base.setElementOnChange("cmbUserName", function (_id) { return function () { CheckUserInputEx(_id); }; }(0));

                    base.setElementOnClick("btnSetUserAccessRights", function (_id) { return function () { SetUserAccessRights(_id); }; }(0));
                    base.setElementOnClick("btnSetUserAccessRights_cancel", function (_id) { return function () { SetUserAccessRights_Cancel(_id); }; }(0));
                    base.setElementDisabled("txtUserNameEx", true);
                }

                var sRootDir = "\\";    // winCE
                if (winxp) {
                    sRootDir = "C:\\";     // win32
                }
                Browse(sRootDir, false);

                base.setElementOnClick("btnAddShare", function (_id) { return function () { AddShare(_id); }; }(0));
                base.setElementOnKeyUp("txtSharePath", function () { OnSharePathKeyUp(event); });

                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                if (RequestParamIDs[0].getHasValues() ||
                    RequestParamIDs[1].getHasValues()) {

                    // SHARES
                    var html = "";

                    html += '<table>';
                    html += '<tr><th>Name</th><th>Path</th><th></th></tr>';

                    var RowsNames = 0;
                    if (RequestParamIDs[0].getHasValues()) { RowsNames = RequestParamIDs[0].values[0].length; }

                    var RowsPaths = 0;
                    if (RequestParamIDs[1].getHasValues()) { RowsPaths = RequestParamIDs[1].values[0].length; }

                    var Rows = Math.max(RowsNames, RowsPaths);

                    for (var i = 0; i < Rows; i++) {

                        html += '<tr>';

                        // SMB Share Names
                        try {
                            html += '<td class="td_FirstColumn"><div id="' + RequestParamIDs[0].parameterName + i + '">' + RequestParamIDs[0].values[0][i].getOutput() + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        // Paths
                        try {
                            html += '<td><div id="' + RequestParamIDs[1].parameterName + i + '">' + RequestParamIDs[1].values[0][i].getOutput() + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        // Delete buttons
                        try {
                            html += '<td><div align="right" id="">' + new ControlLib.SmallButton().Create("btnDeleteShare" + i, "delete", "") + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        html += '</tr>';
                    }
                    html += "</table>";

                    base.writeElement("smb_shares", html);

                    // Add Events
                    for (var i = 0; i < Rows; i++) {
                        try {
                            base.setElementOnClick("btnDeleteShare" + i, function (_id) { return function () { DeleteShare(_id); }; }(i));
                        }
                        catch (e) { }
                    }
                }
                else {
                    base.writeElement("smb_shares", "No items available");
                }


                // SET USERNAME INPUT - UPDATE Sharenames
                // Sharenames
                if (RequestParamIDs[0].getHasValues &&
                    !base.isLocked("cmbShareName")) {

                    var html = "";

                    var sShareNames = [];
                    sShareNames.push("");

                    for (var i = 0; i < RequestParamIDs[0].values[0].length; i++) {
                        if (RequestParamIDs[0].values[0][i].error == 0) {
                            sShareNames.push(RequestParamIDs[0].values[0][i].data);
                        }
                    }

                    html = new ControlLib.Combobox().CreateMap("cmbShareName", sShareNames, sShareNames);
                    base.writeElement("cmbShareNameDiv", html);

                    base.addLockListener("cmbShareName");
                }
                
                if (RequestParamIDs[0].getHasValues() ||
                    RequestParamIDs[2].getHasValues() ||
                    RequestParamIDs[3].getHasValues()) {

                    // ACCESS RIGHTS
                    var html = "";

                    html += '<table>';
                    html += '<tr><th>Name</th><th>Userlist</th><th>Access Rights</th></tr>';

                    var RowsNames = 0;
                    if (RequestParamIDs[0].getHasValues()) { RowsNames = RequestParamIDs[0].values[0].length; }

                    var RowsUserlist = 0;
                    if (RequestParamIDs[2].getHasValues()) { RowsUserlist = RequestParamIDs[2].values[0].length; }

                    var RowsAccessRights = 0;
                    if (RequestParamIDs[3].getHasValues()) { RowsAccessRights = RequestParamIDs[3].values[0].length; }

                    var Rows = Math.max(RowsNames, RowsUserlist, RowsAccessRights);

                    for (var i = 0; i < Rows; i++) {

                        html += '<tr>';

                        // SMB Share Names
                        try {
                            html += '<td class="td_FirstColumn"><div id="' + RequestParamIDs[0].parameterName + i + '">' + RequestParamIDs[0].values[0][i].getOutput() + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        // Userlist
                        try {
                            if (RequestParamIDs[2].values[0][i].error == 0) {

                                var strUsers = RequestParamIDs[2].values[0][i].data;
                                var strUsersArr = strUsers.split(";");

                                html += '<td><div id="' + RequestParamIDs[2].parameterName + i + '">';
                                for (var j = 0; j < strUsersArr.length; j++) {

                                    html += (j + 1) + ": " + strUsersArr[j] + "<br>";
                                }
                                html += '</div></td>';
                            }
                            else {
                                html += '<td>-</td>';
                            }
                        }
                        catch (e) {
                            html += '<td>-</td>';
                        }

                        // Access rights
                        try {

                            if (RequestParamIDs[3].values[0][i].error == 0) {

                                var strAccessRights = RequestParamIDs[3].values[0][i].data;

                                html += '<td><div id="' + RequestParamIDs[3].parameterName + i + '">';
                                for (var j = 0, k = 0; j < strAccessRights.length; j += 4, k++) {

                                    var strAccessRightsName = Helper.parseAccessRights(strAccessRights.substr(j, 4));
                                    html += (k + 1) + ": " + strAccessRightsName + "<br>";
                                }
                                html += '</div></td>';
                            }
                            else {
                                html += '<td>-</td>';
                            }
                        }
                        catch (e) {
                            html += '<td>-</td>';
                        }

                        html += '</tr>';
                        
                    }

                    base.writeElement("smb_accessrights", html);   
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

                // Errors of "FSO_Function_Dir" will be displayed in the directorylist
                if (serviceTransferResponse.moduleItem.name == "FSO_Function_Dir") {

                    if (serviceTransferResponse.hasError) {
                        var ErrorMessage = CommunicationModule_ERROR.ErrorCodeToErrorMessage(serviceTransferResponse.errCode);
                        if (ErrorMessage.length == 0) {
                            ErrorMessage = "Unknown error!";
                        }

                        ListDirectoriesWithError(ErrorMessage);
                    }
                    else {
                        var Dirs = Helper.parseDirs(serviceTransferResponse.result);
                        ListDirectories(Dirs);
                    }

                    base.setElementValue("txtSharePath", RootDir);
                    
                    if (bScrollToBottom) {
                        base.scrollToElement("txtSharePath");
                        bScrollToBottom = false;
                    }
                }
                else {

                    // Other errors will be displayed in the default overlay error-div!
                    if (serviceTransferResponse.hasError) {

                        // MDP Errorcode-fix
                        var highWord = (serviceTransferResponse.errCode >>> 16);
                        if (highWord == 0x8000) {
                            var lowWord = (serviceTransferResponse.errCode & 0xFFFF);
                            serviceTransferResponse.errCode = 0xECA70000 + lowWord;
                        }

                        window.DevMan.getErrorQueue().AddError(serviceTransferResponse.errCode);
                    }
                    else {

                        // ...do something when other service transfers succeeded
                        if (serviceTransferResponse.moduleItem.name == "SMB_Function_Add_Share") {

                            base.setElementValue("txtShareName", "");  // clear the Share name textbox if succeeded
                            SetUserAccessRights_Cancel(0);             // remove lock to update combobox's
                        }
                        else if (serviceTransferResponse.moduleItem.name == "SMB_Function_Del_Share") {

                            SetUserAccessRights_Cancel(0);             // remove lock to update combobox's
                        }
                        else if (serviceTransferResponse.moduleItem.name == "SMB_Function_SetUserAccessRights") {
                            
                            SetUserAccessRights_Cancel(0);             // remove lock to update combobox's
                        }
                    }
                }

            }

            var DeleteShare = function (idx) {

                var RequestParamIDs = base.getRequestParamIDs();
                var ShareName = base.readElement(RequestParamIDs[0].parameterName + idx);

                if (confirm("Do you really want to delete the share " + ShareName + "?")) {

                    var CommandParamID = "SMB_Function_Del_Share";

                    var paramValues = [];
                    paramValues.push(ShareName.length);
                    paramValues.push(ShareName);

                    base.executeCommand(CommandParamID, 0, paramValues);
                    Helper.ShowLoading();
                }
            }

            var AddShare = function (idx) {

                var CommandParamID = "SMB_Function_Add_Share";

                var szName = base.getElementValue("txtShareName");
                var szPath = base.getElementValue("txtSharePath");

                if (Helper.StringEndsWith(szPath, "\\")) {
                    szPath = szPath.substr(0, szPath.length - 1);
                }

                // calc length of data
                var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID)
                                  + szName.length
                                  + szPath.length;

                var paramValues = [];
                paramValues.push(cbInputData);
                paramValues.push(szName.length);
                paramValues.push(szPath.length);
                paramValues.push(szName);
                paramValues.push(szPath);

                base.executeCommand(CommandParamID, idx, paramValues);
                Helper.ShowLoading();
            }

            var Browse = function (sRootDir, bScroll) {

                if (!Helper.StringEndsWith(sRootDir, "\\")) {
                    sRootDir += "\\";
                }

                sRootDir += "*";

                var CommandParamID = "FSO_Function_Dir";
                var cbsRootDir = sRootDir.length;

                var paramValues = [];
                paramValues.push(cbsRootDir);
                paramValues.push(sRootDir);

                // Remove "*" from end of path 
                RootDir = sRootDir.substr(0, sRootDir.length - 1);

                bScrollToBottom = bScroll;

                base.executeCommand(CommandParamID, 0, paramValues);
                base.showLoading("divSelectDirectory");
            }

            var SetUserAccessRights = function (idx) {

                var CommandParamID = "SMB_Function_SetUserAccessRights";

                var szShareName = base.getElementValue("cmbShareName");
                var szUserName = base.getElementValue("cmbUserName");
                if (szUserName == "Other") {
                    szUserName = base.getElementValue("txtUserNameEx");
                }
                var uiAccessRights = base.getElementValue("cmbAccessRights");

                if (szShareName.length > 0 &&
                   szUserName.length > 0 &&
                   uiAccessRights != "") {

                    var paramValues = [];
                    paramValues.push(szShareName.length);
                    paramValues.push(szUserName.length);
                    paramValues.push(uiAccessRights);
                    paramValues.push(szShareName);
                    paramValues.push(szUserName);

                    base.executeCommand(CommandParamID, idx, paramValues);
                    Helper.ShowLoading();
                }
                else {
                    window.DevMan.getErrorQueue().AddError(0x80050031);
                }

            }

            var SetUserAccessRights_Cancel = function (idx) {

                base.removeLock("cmbShareName");

                base.setElementValue("cmbShareName", "");
                base.setElementValue("cmbUserName", "");
                base.setElementValue("cmbAccessRights", "");

                CheckUserInputEx();
            }


            ////////////////////////////////////////////////////////////////////////////////////////////
            // Further Functions
            /////////////////////////////////////////////////////////////////////////////////////////
            var OnSharePathKeyUp = function (e) {

                if (e.keyCode === 13) {

                    var newPath = base.getElementValue("txtSharePath");

                    // Replace ALL "/" by "\"
                    var regex = new RegExp("/", "g");
                    newPath = newPath.replace(regex, "\\");

                    Browse(newPath, true);
                }

            }

            var ListDirectories = function (Dirs) {

                var html = "";

                if (!IsRootFolder(RootDir)) {
                    Dirs.splice(0, 0, ".."); // Add a link with ".." to go back
                }

                for (var i = 0; i < Dirs.length; i++) {

                    var sDirImage = "res/website/other/dir.png";

                    if (Dirs[i] == "..") {
                        sDirImage = "res/website/other/dir_back.png"
                    }

                    html += new ControlLib.SMBFolder().Create("dir_" + Dirs[i], Dirs[i], "#Software&Shares", sDirImage);
                }

                base.writeElement("divSelectDirectory", html);

                for (var i = 0; i < Dirs.length; i++) {
                    base.setElementOnClick("dir_" + Dirs[i], function (_dir) { return function () { ChangeDirectory(_dir); }; }(Dirs[i]));
                }
            }

            var ListDirectoriesWithError = function (ErrorMsg) {

                var Dir = "";

                if (!IsRootFolder(RootDir)) {
                    Dir = "..";
                }


                var html = "";

                if (Dir.length > 0) {
                    html += new ControlLib.SMBFolder().Create("dir_" + Dir, Dir, "#Software&Shares", "res/website/other/dir_back.png");
                }
                html += ErrorMsg + '<br>';


                base.writeElement("divSelectDirectory", html);

                if (Dir.length > 0) {
                    base.setElementOnClick("dir_" + Dir, function (_dir) { return function () { ChangeDirectory(_dir); }; }(Dir));
                }
            }

            var IsRootFolder = function (Path) {

                if (Path.length > 3) {
                    return false;
                }
                else
                {
                    if(Path.length == 3 && Path.charAt(1) == ':' && (Path.charAt(2) == '\\' || Path.charAt(2) == '/'))
                    {
                        return true;
                    }
                    else if (Path.length == 2 && Path.charAt(1) == ':') {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }

            var RemoveLastFolder = function (Path) {

                var bak = Path;

                if (Helper.StringEndsWith(Path, "\\")) {
                    Path = Path.substr(0, Path.length - 1);
                }

                var Pos = Path.lastIndexOf("\\");
                if (Pos > -1) {
                    Path = Path.substr(0, Pos);

                    return Path;
                }

                return bak;
            }

            var ChangeDirectory = function (NewDir) {

                if (NewDir == "..") {
                    Browse(RemoveLastFolder(RootDir), true);
                }
                else {
                    Browse(RootDir + NewDir, true);
                }
            }

            var CheckUserInputEx = function () {

                var bSetElementEx = (base.getElementValue("cmbUserName") == "Other");
                base.setElementDisabled("txtUserNameEx", !bSetElementEx);

                if (!bSetElementEx) {
                    base.setElementValue("txtUserNameEx", "");
                }
            }


        }

        this.SMB.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Software_SMB.SMB(), window.DevMan.ModuleType.Website);

})(window);
