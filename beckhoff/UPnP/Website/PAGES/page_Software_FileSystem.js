(function (window) {

    // namespace
    var Page_Software_FileSystem = new (function () {

        this.FileSystem = function () {

            this.category = "Software";
            this.name = "Filesystem";
            this.subnavigationicon = "sec-nav-filesystem.png";

            var CycleTime = 2000;
            var base = undefined;
            var bScrollToBottom = false;
            var nLastDisksCount = -1;
            
            var IDX_DSKMGNT_DRIVELETTER = 0;
            var IDX_DSKMGNT_VOLUMELABEL = 0;
            var IDX_DSKMGNT_FILESYSTEM = 0;
            var IDX_DSKMGNT_DRIVETYPE = 0;
            var IDX_DSKMGNT_TOTALSIZE = 0;
            var IDX_DSKMGNT_FREEBYTES = 0;

            var IDX_EWF_VolumeName = 0;
            var IDX_EWF_VolumeID = 0;
            var IDX_EWF_State = 0;
            var IDX_EWF_Type = 0;
            var IDX_EWF_BootCommand = 0;

            var IDX_FBWF_Current_State = 0;
            var IDX_FBWF_Current_Compression = 0;
            var IDX_FBWF_Current_PreAllocation = 0;
            var IDX_FBWF_Next_State = 0;
            var IDX_FBWF_Next_Compression = 0;
            var IDX_FBWF_Next_PreAllocation = 0;
            var IDX_FBWF_Volumes = 0;
            var IDX_FBWF_Exclusions = 0;
    
            var IDX_UWF_CurrentState = 0;
            var IDX_UWF_CurrentOverlayMode = 0;
            var IDX_UWF_CurrentOverlaySize = 0;
            var IDX_UWF_NextState = 0;
            var IDX_UWF_NextOverlayMode = 0;
            var IDX_UWF_NextOverlaySize = 0;
            var IDX_UWF_Volumes = 0;
            var IDX_UWF_VolumeProtectionCurrentStates = 0;
            var IDX_UWF_VolumeProtectionNextStates = 0;
            var IDX_UWF_FileExclusions = 0;
            
            var NextStateParameters_State = ["Disabled", "Enabled"];
            var NextStateParameters_OverlayMode = ["RAM", "DISK"];

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
                // DiskManagement
                IDX_DSKMGNT_DRIVELETTER = base.addParameter("DiskManagement_DriveLetter_Property_Len", true);             
                IDX_DSKMGNT_VOLUMELABEL = base.addParameter("DiskManagement_VolumeLabel_Property_Len", true);
                IDX_DSKMGNT_FILESYSTEM = base.addParameter("DiskManagement_FileSystem_Property_Len", true);
                IDX_DSKMGNT_DRIVETYPE = base.addParameter("DiskManagement_DriveType_Property_Len", true);
                IDX_DSKMGNT_TOTALSIZE = base.addParameter("DiskManagement_TotalSize_Property_Len", true);
                IDX_DSKMGNT_FREEBYTES = base.addParameter("DiskManagement_FreeBytes_Property_Len", true);               
                // EWF
                IDX_EWF_VolumeName = base.addParameter("EWF_VolumeName_Property_Len", false);
                IDX_EWF_VolumeID = base.addParameter("EWF_VolumeID_Property_Len", false);
                IDX_EWF_State = base.addParameter("EWF_State_Property_Len", true);
                IDX_EWF_Type = base.addParameter("EWF_Type_Property_Len", false);
                IDX_EWF_BootCommand = base.addParameter("EWF_BootCommand_Property_Len", true);
                // FBWF
                IDX_FBWF_Current_State = base.addParameter("FBWF_CurrentState_Property_State", true); // 11
                IDX_FBWF_Current_Compression = base.addParameter("FBWF_CurrentState_Property_Compression", true);
                IDX_FBWF_Current_PreAllocation = base.addParameter("FBWF_CurrentState_Property_PreAllocation", true);
                IDX_FBWF_Next_State = base.addParameter("FBWF_NextState_Property_State", true);
                IDX_FBWF_Next_Compression = base.addParameter("FBWF_NextState_Property_Compression", true);                 // 15
                IDX_FBWF_Next_PreAllocation = base.addParameter("FBWF_NextState_Property_PreAllocation", true);
                IDX_FBWF_Volumes = base.addParameter("FBWF_Volumes_Property_Len", true);
                IDX_FBWF_Exclusions = base.addParameter("FBWF_Exclusions_Property_Len", true);
                // UWF
                IDX_UWF_CurrentState = base.addParameter("UWF_Properties_CurrentState", true);
                IDX_UWF_CurrentOverlayMode = base.addParameter("UWF_Properties_CurrentOverlayMode", true);
                IDX_UWF_CurrentOverlaySize = base.addParameter("UWF_Properties_CurrentOverlaySize_MB", true);
                IDX_UWF_NextState = base.addParameter("UWF_Properties_NextState", true);
                IDX_UWF_NextOverlayMode = base.addParameter("UWF_Properties_NextOverlayMode", true);
                IDX_UWF_NextOverlaySize = base.addParameter("UWF_Properties_NextOverlaySize_MB", true);
                IDX_UWF_Volumes = base.addParameter("UWF_Properties_Volumes", true);
                IDX_UWF_VolumeProtectionCurrentStates = base.addParameter("UWF_Properties_VolumeProtectionCurrentStates", true);
                IDX_UWF_VolumeProtectionNextStates = base.addParameter("UWF_Properties_VolumeProtectionNextStates", true);
                IDX_UWF_FileExclusions = base.addParameter("UWF_Properties_FileExclusions", true);

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

                // Drives
                if (RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].getHasValues() || wince) {

                    nLastDisksCount = -1;

                    // Volume-Title with buttons
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += '<td class="td_trans"><h3>Volume</h3></td>';

                    // changing harddisk name not supported under winCE
                    if (winxp) {

                        html += '<td class="td_Action_trans">' +
                            new ControlLib.SmallButton().Create("btnSaveVolumeLabels", "save", "Save Volume Labels") +
                            new ControlLib.SmallButton().Create("btnSaveVolumeLabels_Cancel", "delete") + '</td>';
                    }
                    html += '</tr></table>';

                    html += '<div id="drives"></div>';
                    html += '<br>';
                }

                // EWF
                if (RequestParamIDs[IDX_EWF_VolumeName].getHasValues()) {

                    // EWF-Title with buttons
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += '<td class="td_trans"><h3>Enhanced Write Filter (EWF)</h3></td>';
                    html += '<td class="td_Action_trans">' +
                        //new ControlLib.SmallButton().Create("btnEWF_CommitDisableLive", "power", "Commit and Disable Live") +
                        new ControlLib.SmallButton().Create("btnSaveEWFSettings", "save", "Save EWF Settings") + '</td>';
                    html += '</tr></table>';


                    // volume properties
                    var sEWFVolumeNameArr = [];
                    for (var i = 0; i < RequestParamIDs[IDX_EWF_VolumeName].values[0].length; i++) {
                        try { sEWFVolumeNameArr.push(RequestParamIDs[IDX_EWF_VolumeName].values[0][i].data); } catch (e) { }
                    }
                    
                    html += '<table>';
                    html += '<tr><td class="td_FirstColumn">Volume name</td><td>' + new ControlLib.Combobox().Create(RequestParamIDs[IDX_EWF_VolumeName].parameterName, sEWFVolumeNameArr) + '</td></tr>';
                    html += '<tr><td class="td_FirstColumn">Volume ID</td><td><div id="' + RequestParamIDs[IDX_EWF_VolumeID].parameterName + '"></div></td></tr>';
                    html += '<tr><td class="td_FirstColumn">State</td><td><div id="' + RequestParamIDs[IDX_EWF_State].parameterName + '"></div></td></tr>';
                    html += '<tr><td class="td_FirstColumn">Type</td><td><div id="' + RequestParamIDs[IDX_EWF_Type].parameterName + '"></div></td></tr>';
                    html += '<tr><td class="td_FirstColumn">Boot command</td><td><div id="' + RequestParamIDs[IDX_EWF_BootCommand].parameterName + '"></div></td></tr>';
                    html += '<tr><td class="td_FirstColumn">Change Boot command</td><td>' + new ControlLib.Combobox().Create("cmbSetBootCommand", Helper.getEWFBootCommandsIn()) + '</td></tr>';
                    html += '</table>';

                    html += '<br>';
                }

                // FBWF
                if (RequestParamIDs[IDX_FBWF_Current_State].getHasValues() ||
                    RequestParamIDs[IDX_FBWF_Current_Compression].getHasValues() ||
                    RequestParamIDs[IDX_FBWF_Current_PreAllocation].getHasValues() ||
                    RequestParamIDs[IDX_FBWF_Next_State].getHasValues() ||
                    RequestParamIDs[IDX_FBWF_Next_Compression].getHasValues() ||
                    RequestParamIDs[IDX_FBWF_Next_PreAllocation].getHasValues()) {

                    // FBWF-Title with buttons
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += '<td class="td_trans"><h3>Filebased Write Filter (FBWF)</h3></td>';
                    html += '<td class="td_Action_trans">' +
                        new ControlLib.SmallButton().Create("btnSaveFBWFStates", "save", "Save FBWF Settings") +
                        new ControlLib.SmallButton().Create("btnSaveFBWFStates_Cancel", "delete") + '</td>';
                    html += '</tr></table>';


                    var NextStateParameters = ["Disabled", "Enabled"];

                    html += '<table>';
                    html += '<tr><th></th><th>Current</th><th>Next</th></tr>';

                    html += '<tr><td class="td_FirstColumn">State</td>';
                    if (RequestParamIDs[IDX_FBWF_Current_State].getHasValues()) {
                        html += '<td><div id="' + RequestParamIDs[IDX_FBWF_Current_State].parameterName + '"></div></td>';
                    }
                    if (RequestParamIDs[IDX_FBWF_Next_State].getHasValues()) {
                        html += '<td>' + new ControlLib.Combobox().Create(RequestParamIDs[IDX_FBWF_Next_State].parameterName, NextStateParameters) + '</td>';
                    }
                    html += '</tr>';

                    html += '<tr><td class="td_FirstColumn">Compression</td>';
                    if (RequestParamIDs[IDX_FBWF_Current_Compression].getHasValues()) {
                        html += '<td><div id="' + RequestParamIDs[IDX_FBWF_Current_Compression].parameterName + '"></div></td>';
                    }
                    if (RequestParamIDs[IDX_FBWF_Next_Compression].getHasValues()) {
                        html += '<td>' + new ControlLib.Combobox().Create(RequestParamIDs[IDX_FBWF_Next_Compression].parameterName, NextStateParameters) + '</td>';
                    }
                    html += '</tr>';

                    html += '<tr><td class="td_FirstColumn">PreAllocation</td>';
                    if (RequestParamIDs[IDX_FBWF_Current_PreAllocation].getHasValues()) {
                        html += '<td><div id="' + RequestParamIDs[IDX_FBWF_Current_PreAllocation].parameterName + '"></div></td>';
                    }
                    if (RequestParamIDs[IDX_FBWF_Next_PreAllocation].getHasValues()) {
                        html += '<td>' + new ControlLib.Combobox().Create(RequestParamIDs[IDX_FBWF_Next_PreAllocation].parameterName, NextStateParameters) + '</td>';
                    }
                    html += '</tr>';

                    html += '</table>';
                    html += '<br>';

                    // List FBWF Volumes
                    html += '<table>';
                    html += '<tr><td class="td_trans"><h4>Volumes</h4></td>';
                    html += '</table>';

                    html += '<div id="FBWF_Volumes">No volumes available</div>';
                    html += '<br>';

                    // List FBWF Exclusions  
                    html += '<table>';
                    html += '<tr><td class="td_trans"><h4>Configured Exclusions</h4></td>';
                    html += '</table>';

                    html += '<div id="FBWF_VolumesExclusions">No exclusions available</div>';
                    html += '<br>';

                    // Add Exclusion
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += ' <td class="td_trans"><h4>Add Exclusions</h4></td>';
                    html += ' <td class="td_Action_trans">' + new ControlLib.SmallButton().Create("btnAddExclusion", "save", "Add Exclusion") + '</td>';
                    html += '</tr></table>';

                    html += '<table>';
                    html += ' <tr><td class="td_FirstColumn">Exclusion</td><td>' + new ControlLib.Textbox().Create("txtAddExclusion", "99%") + '</td></tr>';
                    html += ' <tr><td class="td_FirstColumn"></td> <td><div id="divSelectDirectory"></div></td></tr>';
                    html += '</table>';
                    html += '<br>';
                }

                // UWF
                if (RequestParamIDs[IDX_UWF_CurrentState].getHasValues() ||
                    RequestParamIDs[IDX_UWF_CurrentOverlayMode].getHasValues() ||
                    RequestParamIDs[IDX_UWF_CurrentOverlaySize].getHasValues() ||
                    RequestParamIDs[IDX_UWF_NextState].getHasValues() ||
                    RequestParamIDs[IDX_UWF_NextOverlayMode].getHasValues() ||
                    RequestParamIDs[IDX_UWF_NextOverlaySize].getHasValues()) {

                    // UWF-Title with buttons
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += '<td class="td_trans"><h3>Unified Write Filter (UWF)</h3></td>';
                    html += '<td class="td_Action_trans">' +
                        new ControlLib.SmallButton().Create("btnSaveUWFStates", "save", "Save UWF Settings") +
                        new ControlLib.SmallButton().Create("btnSaveUWFStates_Cancel", "delete") + '</td>';
                    html += '</tr></table>';

                    html += '<table>';
                    html += '<tr><th></th><th>Current</th><th>Next</th></tr>';
                    html += '<tr><td class="td_FirstColumn">State</td>';
                    if (RequestParamIDs[IDX_UWF_CurrentState].getHasValues()) {
                        html += '<td><div id="' + RequestParamIDs[IDX_UWF_CurrentState].parameterName + '"></div></td>';
                    }
                    if (RequestParamIDs[IDX_UWF_NextState].getHasValues()) {
                        html += '<td>' + new ControlLib.Combobox().Create(RequestParamIDs[IDX_UWF_NextState].parameterName, NextStateParameters_State) + '</td>';
                    }
                    html += '</tr>';

                    html += '<tr><td class="td_FirstColumn">Overlay Mode</td>';
                    if (RequestParamIDs[IDX_UWF_CurrentOverlayMode].getHasValues()) {
                        html += '<td><div id="' + RequestParamIDs[IDX_UWF_CurrentOverlayMode].parameterName + '"></div></td>';
                    }
                    if (RequestParamIDs[IDX_UWF_NextOverlayMode].getHasValues()) {
                        html += '<td>' + new ControlLib.Combobox().Create(RequestParamIDs[IDX_UWF_NextOverlayMode].parameterName, NextStateParameters_OverlayMode) + '</td>';
                    }
                    html += '</tr>';

                    html += '<tr><td class="td_FirstColumn">Overlay Size (MB)</td>';
                    if (RequestParamIDs[IDX_UWF_CurrentOverlaySize].getHasValues()) {
                        html += '<td><div id="' + RequestParamIDs[IDX_UWF_CurrentOverlaySize].parameterName + '"></div></td>';
                    }
                    if (RequestParamIDs[IDX_UWF_NextOverlaySize].getHasValues()) {
                        html += '<td>' + new ControlLib.Textbox().Create(RequestParamIDs[IDX_UWF_NextOverlaySize].parameterName) + '</td>';
                    }
                    html += '</tr>';

                    html += '</table>';
                    html += '<br>';

                    // List UWF Volumes
                    html += '<table>';
                    html += '<tr><td class="td_trans"><h4>Volumes</h4></td>';
                    html += '</table>';

                    html += '<div id="UWF_Volumes">No volumes available</div>';
                    html += '<br>';
                    html += '<div id="UWF_CurrentVolumeState"></div>';
                    html += '<br>';

                    // List UWF Exclusions  
                    html += '<table>';
                    html += '<tr><td class="td_trans"><h4>Configured Exclusions</h4></td>';
                    html += '</table>';

                    html += '<div id="UWF_VolumesExclusions">No exclusions available</div>';
                    html += '<br>';

                    // Add Exclusion
                    html += '<table style="margin-bottom: 5px"><tr>';
                    html += ' <td class="td_trans"><h4>Add Exclusions</h4></td>';
                    html += ' <td class="td_Action_trans">' + new ControlLib.SmallButton().Create("btnAddExclusion", "save", "Add Exclusion") + '</td>';
                    html += '</tr></table>';

                    html += '<table>';
                    html += ' <tr><td class="td_FirstColumn">Exclusion</td><td>' + new ControlLib.Textbox().Create("txtAddExclusion", "99%") + '</td></tr>';
                    html += ' <tr><td class="td_FirstColumn"></td> <td><div id="divSelectDirectory"></div></td></tr>';
                    html += '</table>';
                    html += '<br>';
                }

                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);

                // Add Events

                // Drives
                if (RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].getHasValues()) {
                    // changing harddisk name supported since xp
                    if (winxp) {
                        base.setElementOnClick("btnSaveVolumeLabels", function (_id) { return function () { WriteLabels(_id); }; }(0));
                        base.setElementOnClick("btnSaveVolumeLabels_Cancel", function (_id) { return function () { WriteLabels_Cancel(_id); }; }(0));
                    }
                }

                // EWF
                if (RequestParamIDs[IDX_EWF_VolumeName].getHasValues()) {

                    UpdateEWFVolume();
                    base.setElementOnChange(RequestParamIDs[IDX_EWF_VolumeName].parameterName, function (_id) { return function () { UpdateEWFVolume(_id); }; }(0));
                    base.setElementOnClick("btnSaveEWFSettings", function (_id) { return function () { WriteEWFSettings(_id); }; }(0));
                }

                // FBWF
                if (RequestParamIDs[IDX_FBWF_Next_State].getHasValues() ||
                    RequestParamIDs[IDX_FBWF_Next_Compression].getHasValues() ||
                    RequestParamIDs[IDX_FBWF_Next_PreAllocation].getHasValues()) {

                    base.addLockListener(RequestParamIDs[IDX_FBWF_Next_State].parameterName);
                    base.addLockListener(RequestParamIDs[IDX_FBWF_Next_Compression].parameterName);
                    base.addLockListener(RequestParamIDs[IDX_FBWF_Next_PreAllocation].parameterName);

                    base.setElementOnClick("btnSaveFBWFStates", function (_id) { return function () { WriteFBWFNextState(_id); }; }(0));
                    base.setElementOnClick("btnSaveFBWFStates_Cancel", function (_id) { return function () { WriteFBWFNextState_Cancel(_id); }; }(0));
                }

                if (RequestParamIDs[IDX_FBWF_Volumes].getHasValues() ||
                    RequestParamIDs[IDX_FBWF_Exclusions].getHasValues()) {

                    base.setElementOnClick("btnAddExclusion", function (_id) { return function () { FBWFAddExclusion(_id); }; }(0));
                    base.setElementOnKeyUp("txtAddExclusion", function () { OnSharePathKeyUp(event); });
                }

                // UWF
                if (RequestParamIDs[IDX_UWF_NextState].getHasValues() ||
                    RequestParamIDs[IDX_UWF_NextOverlayMode].getHasValues() ||
                    RequestParamIDs[IDX_UWF_NextOverlaySize].getHasValues()) {

                    base.addLockListener(RequestParamIDs[IDX_UWF_NextState].parameterName);
                    base.addLockListener(RequestParamIDs[IDX_UWF_NextOverlayMode].parameterName);
                    base.addLockListener(RequestParamIDs[IDX_UWF_NextOverlaySize].parameterName);

                    base.setElementOnClick("btnSaveUWFStates", function (_id) { return function () { WriteUWFNextState(_id); }; }(0));
                    base.setElementOnClick("btnSaveUWFStates_Cancel", function (_id) { return function () { WriteUWFNextState_Cancel(_id); }; }(0));
                }

                if (RequestParamIDs[IDX_UWF_Volumes].getHasValues() ||
                    RequestParamIDs[IDX_UWF_FileExclusions].getHasValues()) {

                    base.setElementOnClick("btnAddExclusion", function (_id) { return function () { UWFAddExclusion(_id); }; }(0));
                    base.setElementOnKeyUp("txtAddExclusion", function () { OnSharePathKeyUp(event); });
                }
                
                if (winxp) {
                    // Dir-browser for EWF/FBWF exclusion list
                    var sRootDir = "C:\\";
                    Browse(sRootDir, false)
                }

                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                // DISKS
                var bUpdateDisks = false;
                if (RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].getHasValues() || wince) // CE may have no disks (OS runs in memory)
                {
                    var Rows = RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].values[0].length;
                    if (Rows != nLastDisksCount) {
                        bUpdateDisks = true;
                        nLastDisksCount = Rows;
                    }

                    if (bUpdateDisks) {

                        var html = "";
                        html += '<table>';

                        if (winxp || wince) {
                            html += '<tr><th>Volume</th><th>Label</th><th>File System</th><th>Type</th><th>Total Size</th><th>Free Space</th></tr>';
                        }
                        else {
                            // No volumes under TCBSD & TCRTOS
                            html += '<tr><th>Label</th><th>File System</th><th>Type</th><th>Total Size</th><th>Free Space</th></tr>';
                        }

                        for (var i = 0; i < Rows; i++) {

                            html += '<tr>';

                            if (winxp || wince) {
                                try {
                                    html += '<td class="td_FirstColumn"><div id="' + RequestParamIDs[IDX_DSKMGNT_DRIVELETTER].parameterName + i + '">' + RequestParamIDs[IDX_DSKMGNT_DRIVELETTER].values[0][i].getOutput() + '</div></td>';
                                }
                                catch (e) {
                                    html += '<td></td>';
                                }
                            }

                            if (winxp) {
                                try {
                                    html += '<td style="width:150px">' + new ControlLib.Textbox().Create(RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].parameterName + i) + '</td>';
                                }
                                catch (e) {
                                    html += '<td></td>';
                                }
                            }
                            else {
                                try {
                                    // changing harddisk name not supported under winCE
                                    html += '<td><div id="' + RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].parameterName + i + '"></div></td>';
                                }
                                catch (e) {
                                    html += '<td></td>';
                                }
                            }

                            try {
                                html += '<td><div id="' + RequestParamIDs[IDX_DSKMGNT_FILESYSTEM].parameterName + i + '">' + RequestParamIDs[IDX_DSKMGNT_FILESYSTEM].values[0][i].getOutput() + '</div></td>';
                            }
                            catch (e) {
                                html += '<td></td>';
                            }

                            try {
                                html += '<td><div id="' + RequestParamIDs[IDX_DSKMGNT_DRIVETYPE].parameterName + i + '">' + window.Helper.getDriveType(RequestParamIDs[IDX_DSKMGNT_DRIVETYPE].values[0][i].getOutput()) + '</div></td>';
                            }
                            catch (e) {
                                html += '<td></td>';
                            }

                            try {
                                html += '<td><div id="' + RequestParamIDs[IDX_DSKMGNT_TOTALSIZE].parameterName + i + '" align="right"></div></td>';
                            }
                            catch (e) {
                                html += '<td></td>';
                            }

                            try {
                                html += '<td align="right"><div id="' + RequestParamIDs[IDX_DSKMGNT_FREEBYTES].parameterName + i + '" align="right"></div></td>';
                            }
                            catch (e) {
                                html += '<td></td>';
                            }

                            html += '</tr>';
                        }
                        html += "</table>";
                        html += "<br>";

                        base.writeElement("drives", html);


                        // Add Events
                        for (var i = 0; i < Rows; i++) {

                            base.addLockListener(RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].parameterName + i);

                            // enable/disable textbox[i]
                            var DriveType = RequestParamIDs[IDX_DSKMGNT_DRIVETYPE].values[0][i].getOutput();
                            if (DriveType === 0 || DriveType === 4) {
                                base.setElementDisabled(RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].parameterName + i, true);
                            }
                        }
                    }
                }

                // Update Disks-labels
                nLastDisksCount = Math.max(nLastDisksCount, 0); // if nLastDisksCount == -1 set to 0
                for (var i = 0; i < nLastDisksCount; i++) {

                    if (winxp) {
                        base.setElementValue(RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].parameterName + i, RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].values[0][i].data);
                    }
                    else {
                        base.writeElement(RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].parameterName + i, RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].values[0][i].data);
                    }
                    
                    base.writeElement(RequestParamIDs[IDX_DSKMGNT_TOTALSIZE].parameterName + i, window.Helper.getBestMemoryUnity(RequestParamIDs[IDX_DSKMGNT_TOTALSIZE].values[0][i].data, 1));
                    base.writeElement(RequestParamIDs[IDX_DSKMGNT_FREEBYTES].parameterName + i, window.Helper.getBestMemoryUnity(RequestParamIDs[IDX_DSKMGNT_FREEBYTES].values[0][i].data, 1));
                }

                // EWF
                if (RequestParamIDs[IDX_EWF_VolumeName].getHasValues()) {
                    UpdateEWFVolume();
                }

                // FBWF
                // State
                if (RequestParamIDs[IDX_FBWF_Current_State].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_FBWF_Current_State].parameterName, Helper.getStatusString(RequestParamIDs[IDX_FBWF_Current_State].values[0].data));
                }
                if (RequestParamIDs[IDX_FBWF_Current_Compression].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_FBWF_Current_Compression].parameterName, Helper.getStatusString(RequestParamIDs[IDX_FBWF_Current_Compression].values[0].data));
                }
                if (RequestParamIDs[IDX_FBWF_Current_PreAllocation].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_FBWF_Current_PreAllocation].parameterName, Helper.getStatusString(RequestParamIDs[IDX_FBWF_Current_PreAllocation].values[0].data));
                }
                // Next State
                if (RequestParamIDs[IDX_FBWF_Next_State].getHasValues()) {
                    base.setElementValue(RequestParamIDs[IDX_FBWF_Next_State].parameterName, RequestParamIDs[IDX_FBWF_Next_State].values[0].data);
                }
                if (RequestParamIDs[IDX_FBWF_Next_Compression].getHasValues()) {
                    base.setElementValue(RequestParamIDs[IDX_FBWF_Next_Compression].parameterName, RequestParamIDs[IDX_FBWF_Next_Compression].values[0].data);
                }
                if (RequestParamIDs[IDX_FBWF_Next_PreAllocation].getHasValues()) {
                    base.setElementValue(RequestParamIDs[IDX_FBWF_Next_PreAllocation].parameterName, RequestParamIDs[IDX_FBWF_Next_PreAllocation].values[0].data);
                }

                // compare fbwf volumes from mdp with the volumes listed in combobox
                {
                    var nFBWFVolumes = 0;
                    if (RequestParamIDs[IDX_FBWF_Volumes].getHasValues()) {
                        nFBWFVolumes = RequestParamIDs[IDX_FBWF_Volumes].values[0].length;
                    }

                    var nFBWFVolumes_Combobox = 0;
                    try {
                        var cmbFBWFVolumes = document.getElementById("cmbListExclusionVolume");
                        if (cmbFBWFVolumes) {
                            nFBWFVolumes_Combobox = cmbFBWFVolumes.length;
                        }
                    }
                    catch (e) { }

                    if (nFBWFVolumes != nFBWFVolumes_Combobox) {
                        UpdateFBWFVolumes();
                    }
                }

                if (RequestParamIDs[IDX_FBWF_Current_State].getHasValues() &&
                    RequestParamIDs[IDX_FBWF_Next_State].getHasValues()) {

                    var bExclusionsListed = false;

                    if (RequestParamIDs[IDX_FBWF_Current_State].values[0].error == 0 &&
                        RequestParamIDs[IDX_FBWF_Next_State].values[0].error == 0) {

                        var bFBWFCurrentState = Number(RequestParamIDs[IDX_FBWF_Current_State].values[0].data);
                        var bFBWFNextState = Number(RequestParamIDs[IDX_FBWF_Next_State].values[0].data);

                        // FBWF Exclusion-list is only available if CurrentState and NextState == true
                        if (bFBWFCurrentState == 1 &&
                            bFBWFNextState == 1) {

                            var iSelectedVolume = base.getElementSelectedIndex("cmbListExclusionVolume");

                            var sVolume = "";
                            if (RequestParamIDs[IDX_FBWF_Volumes].getHasValues() &&
                                RequestParamIDs[IDX_FBWF_Volumes].values[0].length > iSelectedVolume) {

                                sVolume = RequestParamIDs[IDX_FBWF_Volumes].values[0][iSelectedVolume].data;
                            }

                            if (sVolume != "") {

                                var sExclusionsArr = [];
                                if (RequestParamIDs[IDX_FBWF_Exclusions].getHasValues() &&
                                    RequestParamIDs[IDX_FBWF_Exclusions].values[0].length > iSelectedVolume) {
                                    sExclusionsArr = Helper.getExclustionListArr(RequestParamIDs[IDX_FBWF_Exclusions].values[0][iSelectedVolume].data);
                                }

                                if (sExclusionsArr.length > 0) {

                                    bExclusionsListed = true;

                                    var html = "";
                                    html += '<table>';
                                    html += '<th>Exclusion</th><th></th>';

                                    for (var i = 0; i < sExclusionsArr.length; i++) {

                                        html += '<tr>';
                                        html += '  <td>' + sExclusionsArr[i] + '</td>';
                                        html += '  <td><div align="right" id="">' + new ControlLib.SmallButton().Create("DeleteExclusion" + i, "delete", "") + '</div></td>';
                                        html += '</tr>';

                                    }
                                    html += '</table>';

                                    base.writeElement("FBWF_VolumesExclusions", html);

                                    // Add Button Events
                                    for (var i = 0; i < sExclusionsArr.length; i++) {
                                        base.setElementOnClick("DeleteExclusion" + i, function (volume, exclusion) { return function () { FBWFRemoveExclusion(volume, exclusion); }; }(sVolume, sExclusionsArr[i]));
                                    }
                                }
                            }
                        }
                    }

                    if (!bExclusionsListed) {
                        base.writeElement("FBWF_VolumesExclusions", "No exclusions available");    // Exclusions are not available, ...clear exclusions
                    }
                }


                // UWF
                // State
                if (RequestParamIDs[IDX_UWF_CurrentState].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_UWF_CurrentState].parameterName, Helper.getStatusString(RequestParamIDs[IDX_UWF_CurrentState].values[0].data));
                }
                if (RequestParamIDs[IDX_UWF_CurrentOverlayMode].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_UWF_CurrentOverlayMode].parameterName, Helper.getStatusString(RequestParamIDs[IDX_UWF_CurrentOverlayMode].values[0].data));
                }
                if (RequestParamIDs[IDX_UWF_CurrentOverlaySize].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_UWF_CurrentOverlaySize].parameterName, Helper.getStatusString(RequestParamIDs[IDX_UWF_CurrentOverlaySize].values[0].data));
                }
                // Next State
                if (RequestParamIDs[IDX_UWF_NextState].getHasValues()) {
                    base.setElementValue(RequestParamIDs[IDX_UWF_NextState].parameterName, RequestParamIDs[IDX_UWF_NextState].values[0].data);
                }
                if (RequestParamIDs[IDX_UWF_NextOverlayMode].getHasValues()) {
                    base.setElementValue(RequestParamIDs[IDX_UWF_NextOverlayMode].parameterName, RequestParamIDs[IDX_UWF_NextOverlayMode].values[0].data);
                }
                if (RequestParamIDs[IDX_UWF_NextOverlaySize].getHasValues()) {
                    base.setElementValue(RequestParamIDs[IDX_UWF_NextOverlaySize].parameterName, RequestParamIDs[IDX_UWF_NextOverlaySize].values[0].data);
                }

                // compare uwf volumes from mdp with the volumes listed in combobox
                {
                    var nUWFVolumes = 0;
                    if (RequestParamIDs[IDX_UWF_Volumes].getHasValues()) {
                        nUWFVolumes = RequestParamIDs[IDX_UWF_Volumes].values[0].length;
                    }

                    var nUWFVolumes_Combobox = 0;
                    try {
                        var cmbUWFVolumes = document.getElementById("cmbListExclusionVolume");
                        if (cmbUWFVolumes) {
                            nUWFVolumes_Combobox = cmbUWFVolumes.length;
                        }
                    }
                    catch (e) { }

                    if (nUWFVolumes != nUWFVolumes_Combobox) {
                        UpdateUWFVolumes();
                    }
                }

                var sVolume = "";
                
                var iSelectedVolume = base.getElementSelectedIndex("cmbListExclusionVolume");

                if (RequestParamIDs[IDX_UWF_Volumes].getHasValues() &&
                    RequestParamIDs[IDX_UWF_Volumes].values[0].length > iSelectedVolume) {

                    sVolume = RequestParamIDs[IDX_UWF_Volumes].values[0][iSelectedVolume].data;
                }

                var bExclusionsListed = false;
                if (sVolume != "") {

                    // Current & Next Protection State
                    if (RequestParamIDs[IDX_UWF_VolumeProtectionCurrentStates].getHasValues() &&
                        RequestParamIDs[IDX_UWF_VolumeProtectionNextStates].getHasValues() &&
                        RequestParamIDs[IDX_UWF_VolumeProtectionCurrentStates].values[0].length > iSelectedVolume &&
                        RequestParamIDs[IDX_UWF_VolumeProtectionNextStates].values[0].length > iSelectedVolume) {

                        // Protection
                        var html = "";
                        html += '<table style="margin-bottom: 5px"><tr>';
                        html += '<td class="td_trans"><h4>Protection</h4></td>';
                        html += '<td class="td_Action_trans"></td>';
                        html += '</tr></table>';

                        var bVolumeProtectionCurrentState = RequestParamIDs[IDX_UWF_VolumeProtectionCurrentStates].values[0][iSelectedVolume].data;
                        var bVolumeProtectionNextState = RequestParamIDs[IDX_UWF_VolumeProtectionNextStates].values[0][iSelectedVolume].data;
                        var bVolumeProtectionNextState_New = !bVolumeProtectionNextState;
                        var lblSetUWFProtectionNextState_New = bVolumeProtectionNextState ? "Disable" : "Enable";

                        html += '<table>';
                        html += ' <tr><th></th><th>Current</th><th>Next</th><th></th></tr>';
                        html += ' <tr>';
                        html += '  <td class="td_FirstColumn">State of ' + sVolume + '</td>';
                        html += '  <td>' + Helper.getStatusString(bVolumeProtectionCurrentState) + '</td>';
                        html += '  <td>' + Helper.getStatusString(bVolumeProtectionNextState) + '</td>';
                        html += '  <td><div align="right" id="">' + new ControlLib.SmallButton().Create("btnSetUWFProtectionNextState", "power", lblSetUWFProtectionNextState_New) + '</div></td>';
                        html += ' </tr>';
                        html += '</table>';

                        base.writeElement("UWF_CurrentVolumeState", html);

                        // Add Button Event
                        base.setElementOnClick("btnSetUWFProtectionNextState", function (sVolume, bVolumeProtectionNextState_New) { return function () { UWFProtectVolume(sVolume, bVolumeProtectionNextState_New); }; }(sVolume, bVolumeProtectionNextState_New));
                    }
                    else {
                        base.writeElement("FBWF_VolumesExclusions", "No exclusions available");    // Exclusions are not available, ...clear exclusions
                    }

                    // Exclusions
                    var sExclusionsArr = [];
                    if (RequestParamIDs[IDX_UWF_FileExclusions].getHasValues() &&
                        RequestParamIDs[IDX_UWF_FileExclusions].values[0].length > iSelectedVolume) {
                        sExclusionsArr = Helper.getExclustionListArr(RequestParamIDs[IDX_UWF_FileExclusions].values[0][iSelectedVolume].data);
                    }

                    if (sExclusionsArr.length > 0) {
                        bExclusionsListed = true;
                        var html = "";
                        html += '<table>';
                        html += '<th>Exclusions of ' + sVolume + '</th><th></th>';

                        for (var i = 0; i < sExclusionsArr.length; i++) {
                            html += '<tr>';
                            html += '  <td>' + sExclusionsArr[i] + '</td>';
                            html += '  <td><div align="right" id="">' + new ControlLib.SmallButton().Create("DeleteExclusion" + i, "delete", "") + '</div></td>';
                            html += '</tr>';
                        }
                        html += '</table>';

                        base.writeElement("UWF_VolumesExclusions", html);

                        // Add Button Events
                        for (var i = 0; i < sExclusionsArr.length; i++) {
                            base.setElementOnClick("DeleteExclusion" + i, function (volume, exclusion) { return function () { UWFRemoveExclusion(volume, exclusion); }; }(sVolume, sExclusionsArr[i]));
                        }
                    }
                }

                if (!bExclusionsListed) {
                    base.writeElement("UWF_VolumesExclusions", "No exclusions available");    // Exclusions are not available, ...clear exclusions
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
                    if (Helper.StringStartsWith(ModuleItemsWritten[i].name, "EWF_")) {
                        WriteEWFSettings_Cancel();
                    }
                    else if (Helper.StringStartsWith(ModuleItemsWritten[i].name, "FBWF_")) {
                        WriteFBWFNextState_Cancel();
                    }
                    else if (Helper.StringStartsWith(ModuleItemsWritten[i].name, "DiskManagement_")) {
                        WriteLabels_Cancel();
                    }
                    else if (Helper.StringStartsWith(ModuleItemsWritten[i].name, "UWF_")) {
                        WriteUWFNextState_Cancel();
                    }
                }

                // other functions
                for (var i = 0; i < ModuleItemsWritten.length; i++) {
                    if (ErrorCodes[i] == 0) {
                        if (Helper.StringStartsWith(ModuleItemsWritten[i].name, "FBWF_")) {
                            RebootMachine(true);    // needs reboot
                            break;
                        }
                        else if (Helper.StringStartsWith(ModuleItemsWritten[i].name, "EWF_")) {
                            if (base.getElementValue("cmbSetBootCommand") != "0") {
                                RebootMachine(true);    // needs reboot (if not "Clear Command")
                                break;
                            }
                        }
                        else if (Helper.StringStartsWith(ModuleItemsWritten[i].name, "UWF_")) {
                            RebootMachine(true);    // needs reboot
                            break;
                        }
                    }
                }
            }


            var WriteLabels = function (idx) {

                var writeParams = [];
                var idxs = [];
                var arrayIdxs = [];
                var writeValues = [];

                var iVolumeLabelCount = base.getRequestParamIDs()[1].values[0].length;

                for (var i = 0; i < iVolumeLabelCount; i++) {

                    if (base.isLocked("DiskManagement_VolumeLabel_Property_Len" + i)) {

                        writeParams.push("DiskManagement_VolumeLabel_Property_Len");
                        idxs.push(0);
                        arrayIdxs.push(i + 1);
                        writeValues.push(base.getElementValue("DiskManagement_VolumeLabel_Property_Len" + i));

                        base.removeLock("DiskManagement_VolumeLabel_Property_Len" + i);
                    }
                }

                if (writeParams.length > 0) {
                    base.WriteArray(writeParams, idxs, arrayIdxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var WriteLabels_Cancel = function () {

                try
                {
                    var iVolumeLabelCount = base.getRequestParamIDs()[1].values[0].length;

                    for (var i = 0; i < iVolumeLabelCount; i++) {

                        var sCurTextbox = "DiskManagement_VolumeLabel_Property_Len" + i;
                        if (base.isLocked(sCurTextbox)) {
                            base.removeLock(sCurTextbox);
                            if (winxp) { base.setElementValue(sCurTextbox, ""); }
                        }
                    }
                }
                catch (e) { }

            }


            var WriteEWFSettings = function () {

                var writeParams = [];
                var idxs = [];
                var arrayIdxs = [];
                var writeValues = [];

                var RequestParameters = base.getRequestParamIDs();
                if (RequestParameters) {

                    var iSelectedVolume = base.getElementValue(RequestParameters[6].parameterName);
                    if (!isNaN(iSelectedVolume)) {

                        iSelectedVolume = Number(iSelectedVolume);
                        if (iSelectedVolume >= 0) {

                            writeParams.push(RequestParameters[10].parameterName);
                            idxs.push(0);
                            arrayIdxs.push(iSelectedVolume + 1);
                            writeValues.push(base.getElementValue("cmbSetBootCommand"));
                        }
                    }
                }

                if (writeParams.length > 0) {
                    base.WriteArray(writeParams, idxs, arrayIdxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var WriteEWFSettings_Cancel = function () {

                base.removeLock("EWF_BootCommand_Property_Len");
            }


            var WriteFBWFNextState = function () {

                var writeParams = [];
                var idxs = [];
                var arrayIdxs = [];
                var writeValues = [];

                if (base.isLocked("FBWF_NextState_Property_State")) {
                    writeParams.push("FBWF_NextState_Property_State");
                    idxs.push(0);
                    writeValues.push(base.getElementValue("FBWF_NextState_Property_State"));
                }

                if (base.isLocked("FBWF_NextState_Property_Compression")) {
                    writeParams.push("FBWF_NextState_Property_Compression");
                    idxs.push(0);
                    writeValues.push(base.getElementValue("FBWF_NextState_Property_Compression"));
                }

                if (base.isLocked("FBWF_NextState_Property_PreAllocation")) {
                    writeParams.push("FBWF_NextState_Property_PreAllocation");
                    idxs.push(0);
                    writeValues.push(base.getElementValue("FBWF_NextState_Property_PreAllocation"));
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var WriteFBWFNextState_Cancel = function () {

                base.removeLock("FBWF_NextState_Property_State");
                base.removeLock("FBWF_NextState_Property_Compression");
                base.removeLock("FBWF_NextState_Property_PreAllocation");
            }

            var WriteUWFNextState = function () {

                var writeParams = [];
                var idxs = [];
                var arrayIdxs = [];
                var writeValues = [];

                if (base.isLocked("UWF_Properties_NextState")) {
                    writeParams.push("UWF_Properties_NextState");
                    idxs.push(0);
                    writeValues.push(base.getElementValue("UWF_Properties_NextState"));
                }

                if (base.isLocked("UWF_Properties_NextOverlayMode")) {
                    writeParams.push("UWF_Properties_NextOverlayMode");
                    idxs.push(0);
                    writeValues.push(base.getElementValue("UWF_Properties_NextOverlayMode"));
                }

                if (base.isLocked("UWF_Properties_NextOverlaySize_MB")) {
                    writeParams.push("UWF_Properties_NextOverlaySize_MB");
                    idxs.push(0);
                    writeValues.push(base.getElementValue("UWF_Properties_NextOverlaySize_MB"));
                }

                if (writeParams.length > 0) {
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var WriteUWFNextState_Cancel = function () {

                base.removeLock("UWF_Properties_NextState");
                base.removeLock("UWF_Properties_NextOverlayMode");
                base.removeLock("UWF_Properties_NextOverlaySize_MB");
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

                    base.setElementValue("txtAddExclusion", RootDir);

                    if (bScrollToBottom) {
                        base.scrollToElement("txtAddExclusion");
                        bScrollToBottom = false;
                    }
                }
                else {

                    if (serviceTransferResponse.hasError) {

                        window.DevMan.getErrorQueue().AddError(serviceTransferResponse.errCode);
                    }
                    else {

                        if (serviceTransferResponse.moduleItem.name == "UWF_Function_ProtectVolume" ||
                            serviceTransferResponse.moduleItem.name == "UWF_Function_UnprotectVolume")
                        {
                            
                        }
                    }
                }
            }

            var FBWFAddExclusion = function (idx) {

                var RequestParameters = base.getRequestParamIDs();
                if (RequestParameters) {

                    if (RequestParameters[11].values[0].error == 0 &&
                       RequestParameters[14].values[0].error == 0) {

                        var bFBWFCurrentState = Number(RequestParameters[11].values[0].data);
                        var bFBWFNextState = Number(RequestParameters[14].values[0].data);

                        if (bFBWFCurrentState == 1 &&
                            bFBWFNextState == 1) {

                            var CommandParamID = "FBWF_Function_AddExclusion";

                            var Volume = base.getElementValue("cmbListExclusionVolume");
                            var Exclusion = base.getElementValue("txtAddExclusion");
                            if (Exclusion.indexOf(":\\") == 1) {
                                Exclusion = Exclusion.substr(2, Exclusion.length - 2);
                            }

                            var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID) +
                                                Volume.length +
                                                Exclusion.length;

                            var paramValues = [];
                            paramValues.push(cbInputData);
                            paramValues.push(Volume.length);
                            paramValues.push(Exclusion.length);
                            paramValues.push(Volume);
                            paramValues.push(Exclusion);

                            base.executeCommand(CommandParamID, 0, paramValues);
                            Helper.ShowLoading();
                        }

                        else {
                            var nErrorCode = 0x80050035;    // Error : Could not add exclusion. FBWF is disabled!
                            window.DevMan.getErrorQueue().AddError(nErrorCode);
                        }
                    }
                }
            }

            var FBWFRemoveExclusion = function (Volume, Exclusion) {

                if (confirm("Do you really want to delete the Exclusion: " + Exclusion + "?")) {

                    var CommandParamID = "FBWF_Function_RemoveExclusion";

                    var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID) +
                                        Volume.length + 
                                        Exclusion.length;

                    var paramValues = [];
                    paramValues.push(cbInputData);
                    paramValues.push(Volume.length);
                    paramValues.push(Exclusion.length);
                    paramValues.push(Volume);
                    paramValues.push(Exclusion);

                    base.executeCommand(CommandParamID, 0, paramValues);
                    Helper.ShowLoading();
                }
            }

            var UWFProtectVolume = function (Volume, bProtect) {

                var CommandParamID = "UWF_Function_ProtectVolume";

                if (!bProtect)
                    CommandParamID = "UWF_Function_UnprotectVolume";

                var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID) +
                                    Volume.length;

                var paramValues = [];
                paramValues.push(cbInputData);
                paramValues.push(Volume.length);
                paramValues.push(Volume);

                base.executeCommand(CommandParamID, 0, paramValues);
                Helper.ShowLoading();
            }

            var UWFAddExclusion = function (idx) {

                var CommandParamID = "UWF_Function_AddExclusion";

                var Volume = base.getElementValue("cmbListExclusionVolume");
                var Exclusion = base.getElementValue("txtAddExclusion");
                if (Exclusion.indexOf(":\\") == 1) {
                    Exclusion = Exclusion.substr(2, Exclusion.length - 2);
                }

                var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID) +
                                    Volume.length +
                                    Exclusion.length;

                var paramValues = [];
                paramValues.push(cbInputData);
                paramValues.push(Volume.length);
                paramValues.push(Exclusion.length);
                paramValues.push(Volume);
                paramValues.push(Exclusion);

                base.executeCommand(CommandParamID, 0, paramValues);
                Helper.ShowLoading();
            }

            var UWFRemoveExclusion = function (Volume, Exclusion) {

                if (confirm("Do you really want to delete the Exclusion: " + Exclusion + "?")) {

                    var CommandParamID = "UWF_Function_RemoveExclusion";

                    var cbInputData = base.getCommunicationObj().getServiceTransferParameterSize(CommandParamID) +
                                        Volume.length +
                                        Exclusion.length;

                    var paramValues = [];
                    paramValues.push(cbInputData);
                    paramValues.push(Volume.length);
                    paramValues.push(Exclusion.length);
                    paramValues.push(Volume);
                    paramValues.push(Exclusion);

                    base.executeCommand(CommandParamID, 0, paramValues);
                    Helper.ShowLoading();
                }
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


            ////////////////////////////////////////////////////////////////////////////////////////////
            // Further Functions
            /////////////////////////////////////////////////////////////////////////////////////////
            var UpdateEWFVolume = function (idx) {

                var RequestParameters = base.getRequestParamIDs();
                if (RequestParameters) {

                    var iSelectedVolume = base.getElementValue(RequestParameters[6].parameterName);
                    if (!isNaN(iSelectedVolume)) {

                        iSelectedVolume = Number(iSelectedVolume);
                        if (iSelectedVolume >= 0) {

                            // RequestParameters[ParameterX].values[Module0][iSelectedVolume].data);
                            try { base.writeElement(RequestParameters[7].parameterName, RequestParameters[7].values[0][iSelectedVolume].data); } catch (e) { }
                            try { base.writeElement(RequestParameters[8].parameterName, Helper.getEWFStatusString(RequestParameters[8].values[0][iSelectedVolume].data)); } catch (e) { }
                            try { base.writeElement(RequestParameters[9].parameterName, Helper.getEWFType(RequestParameters[9].values[0][iSelectedVolume].data)); } catch (e) { }
                            try { base.writeElement(RequestParameters[10].parameterName, Helper.getEWFBootCommandOut(RequestParameters[10].values[0][iSelectedVolume].data)); } catch (e) { }
                        }
                    }
                }
            }

            var UpdateFBWFVolumes = function (idx) {

                var RequestParameters = base.getRequestParamIDs();
                if (RequestParameters) {

                    var sFBWFVolumeNameArr = [];
                    if (RequestParameters[17].getHasValues()) {
                        for (var i = 0; i < RequestParameters[17].values[0].length; i++) {
                            // RequestParameters[ParameterX].values[Module0][i].data
                            try { sFBWFVolumeNameArr.push(RequestParameters[17].values[0][i].data); } catch (e) { }
                        }
                    }

                    var html = "No volumes available";

                    if (sFBWFVolumeNameArr.length > 0) {

                        html = "";
                        html += '<table>';
                        html += '<tr><td class="td_FirstColumn">Volume name</td><td>' + new ControlLib.Combobox().CreateMap("cmbListExclusionVolume", sFBWFVolumeNameArr, sFBWFVolumeNameArr, "100%") + '</td></tr>';
                        html += '</table>';
                    }
                    
                    base.writeElement("FBWF_Volumes", html);
                }
            }

            var UpdateUWFVolumes = function (idx) {

                var RequestParameters = base.getRequestParamIDs();
                if (RequestParameters) {

                    var sUWFVolumeNameArr = [];
                    if (RequestParameters[IDX_UWF_Volumes].getHasValues()) {
                        for (var i = 0; i < RequestParameters[IDX_UWF_Volumes].values[0].length; i++) {
                            // RequestParameters[ParameterX].values[Module0][i].data
                            try { sUWFVolumeNameArr.push(RequestParameters[IDX_UWF_Volumes].values[0][i].data); } catch (e) { }
                        }
                    }

                    var html = "No volumes available";

                    if (sUWFVolumeNameArr.length > 0) {

                        html = "";
                        html += '<table>';
                        html += '<tr><td class="td_FirstColumn">Volume name</td><td>' + new ControlLib.Combobox().CreateMap("cmbListExclusionVolume", sUWFVolumeNameArr, sUWFVolumeNameArr, "100%") + '</td></tr>';
                        html += '</table>';
                    }

                    base.writeElement("UWF_Volumes", html);

                    if (sUWFVolumeNameArr.length > 0) {
                        base.setElementOnChange("cmbListExclusionVolume", OnVolumeChanged);
                    }
                }
            }

            var OnVolumeChanged = function () {
                var sSelectedVolume = base.getElementValue("cmbListExclusionVolume");
                Browse(sSelectedVolume, false);
            }

            var OnSharePathKeyUp = function (e) {

                if (e.keyCode === 13) {

                    var newPath = base.getElementValue("txtAddExclusion");

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

                    html += new ControlLib.SMBFolder().Create("dir_" + Dirs[i], Dirs[i], "#", sDirImage);
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
                    html += new ControlLib.SMBFolder().Create("dir_" + Dir, Dir, "#", "res/website/other/dir_back.png");
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
                else {
                    if (Path.length == 3 && Path.charAt(1) == ':' && (Path.charAt(2) == '\\' || Path.charAt(2) == '/')) {
                        return true;
                    }
                    else if (Path.length == 2 && Path.charAt(1) == ':') {
                        return true;
                    }
                    else {
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

        this.FileSystem.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Software_FileSystem.FileSystem(), window.DevMan.ModuleType.Website);

})(window);



