(function (window) {

    // namespace
    var Page_Hardware_HDD = new (function () {

        this.HDD = function () {

            this.category = "Hardware";
            this.name = "Storage";
            this.subnavigationicon = "sec-nav-hdd.png";

            var CycleTime = 2000;
            var base = undefined;

            var IDX_DSKMGNT_DRIVELETTER = 0;
            var IDX_DSKMGNT_VOLUMELABEL = 0;
            var IDX_DSKMGNT_FILESYSTEM= 0;
            var IDX_DSKMGNT_DRIVETYPE = 0;
            var IDX_DSKMGNT_TOTALSIZE = 0;
            var IDX_DSKMGNT_FREEBYTES = 0;

            var IDX_SILICON_TOTALERASECOUNTS = 0;
            var IDX_SILICON_DRIVEUSAGE = 0;
            var IDX_SILICON_SPARES= 0;
            var IDX_SILICON_SPARESUSED = 0;

            var IDX_MASSSTORMON_SERIALNUMBER = 0;
            var IDX_MASSSTORMON_SLOT = 0;
            var IDX_MASSSTORMON_DRIVELETTERS= 0;
            var IDX_MASSSTORMON_DRIVENAME = 0;
            var IDX_MASSSTORMON_DRIVETYPE = 0;
            var IDX_MASSSTORMON_ERASECOUNTAVG= 0;
            var IDX_MASSSTORMON_ERASECOUNTSPEC = 0;
            var IDX_MASSSTORMON_ERASECYCLESLEFTPERCENT = 0;
            var IDX_MASSSTORMON_SPAREBLOCKSREMAINING = 0;
            var IDX_MASSSTORMON_SPAREBLOCKSINITIAL = 0;
            var IDX_MASSSTORMON_SPAREBLOCKSLEFTPERCENT = 0;
            var IDX_MASSSTORMON_REALLOCATEDSECTORS = 0;
            var IDX_MASSSTORMON_SPINRETRIES = 0;
            var IDX_MASSSTORMON_PENDINGSECTORS = 0;
            var IDX_MASSSTORMON_ULTRADMACRCERRORS = 0;
            
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
                IDX_DSKMGNT_DRIVELETTER = base.addParameter("DiskManagement_DriveLetter_Property_Len", true);
                IDX_DSKMGNT_VOLUMELABEL = base.addParameter("DiskManagement_VolumeLabel_Property_Len", true);
                IDX_DSKMGNT_FILESYSTEM = base.addParameter("DiskManagement_FileSystem_Property_Len", true);
                IDX_DSKMGNT_DRIVETYPE = base.addParameter("DiskManagement_DriveType_Property_Len", true);
                IDX_DSKMGNT_TOTALSIZE = base.addParameter("DiskManagement_TotalSize_Property_Len", true);
                IDX_DSKMGNT_FREEBYTES = base.addParameter("DiskManagement_FreeBytes_Property_Len", true);

                
                IDX_SILICON_TOTALERASECOUNTS = base.addParameter("SiliconDrive_Information_Property_TotalEraseCounts", false);
                IDX_SILICON_DRIVEUSAGE = base.addParameter("SiliconDrive_Information_Property_DriveUsage", false);
                IDX_SILICON_SPARES = base.addParameter("SiliconDrive_Information_Property_NumberOfSpares", false);
                IDX_SILICON_SPARESUSED = base.addParameter("SiliconDrive_Information_Property_SparesUsed", false);

                IDX_MASSSTORMON_SERIALNUMBER = base.addParameter("MassStorageMonitoring_Serialnumber_Property_Len", true);
                IDX_MASSSTORMON_SLOT = base.addParameter("MassStorageMonitoring_Slot_Property_Len", true);
                IDX_MASSSTORMON_DRIVELETTERS = base.addParameter("MassStorageMonitoring_DriveLetters_Property_Len", true);             // Idx: 10
                IDX_MASSSTORMON_DRIVENAME = base.addParameter("MassStorageMonitoring_DriveName_Property_Len", true);
                IDX_MASSSTORMON_DRIVETYPE= base.addParameter("MassStorageMonitoring_DriveType_Property_Len", true);
                IDX_MASSSTORMON_ERASECOUNTAVG = base.addParameter("MassStorageMonitoring_EraseCountAverage_Property_Len", false);           // Not supported anymore
                IDX_MASSSTORMON_ERASECOUNTSPEC = base.addParameter("MassStorageMonitoring_EraseCountSpecified_Property_Len", false);         // Not supported anymore
                IDX_MASSSTORMON_ERASECYCLESLEFTPERCENT = base.addParameter("MassStorageMonitoring_EraseCyclesLeftPercent_Property_Len", true);               // Idx: 15
                IDX_MASSSTORMON_SPAREBLOCKSREMAINING = base.addParameter("MassStorageMonitoring_SpareBlocksRemaining_Property_Len", true);
                IDX_MASSSTORMON_SPAREBLOCKSINITIAL = base.addParameter("MassStorageMonitoring_SpareBlocksInitial_Property_Len", true);
                IDX_MASSSTORMON_SPAREBLOCKSLEFTPERCENT = base.addParameter("MassStorageMonitoring_SpareBlocksLeftPercent_Property_Len", true);
                IDX_MASSSTORMON_REALLOCATEDSECTORS = base.addParameter("MassStorageMonitoring_ReallocatedSectors", true);
                IDX_MASSSTORMON_SPINRETRIES = base.addParameter("MassStorageMonitoring_SpinRetries", true);                           // Idx: 20
                IDX_MASSSTORMON_PENDINGSECTORS = base.addParameter("MassStorageMonitoring_PendingSectors", true);
                IDX_MASSSTORMON_ULTRADMACRCERRORS = base.addParameter("MassStorageMonitoring_UltraDmaCrcErrors", true);

                // init events
                base.setOnInitStaticPage(OnInitStaticPage);
                base.setOnDisplayValues(OnDisplayValues);
                //base.setOnWriteFailed(OnWriteFailed); not used in this page
                //base.setOnWriteResult(OnWriteResult); not used in this page
                //base.setOnServiceTransferFailed(OnServiceTransferFailed); not used in this page
                //base.setOnServiceTransferResult(OnServiceTransferResult); not used in this page

                return true;
            }

            var OnInitStaticPage = function (RequestParamIDs) {

                var html = "";

                if (RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].getHasValues() || wince) // CE may have no drives (since the OS runs in memory)
                {
                    if (winxp) {
                        html += '<table style="margin-bottom: 5px"><tr>';
                        html += '<td class="td_trans"><h3>Volumes</h3></td>';
                        html += '<td class="td_Action_trans">' + new ControlLib.SmallButton().Create("btnEditVolumeLabels", "configure", "Configure Volume Labels") + '</td>';
                        html += '</tr></table>';
                    }
                    else {
                        html += "<h3>Volumes</h3>";  // changing harddisk name not supported under wince & tcbsd
                    }

                    html += '<div id="drives"></div>';
                }

                if (RequestParamIDs[IDX_SILICON_TOTALERASECOUNTS].getHasValues() ||
                    RequestParamIDs[IDX_SILICON_DRIVEUSAGE].getHasValues() ||
                    RequestParamIDs[IDX_SILICON_SPARES].getHasValues() ||
                    RequestParamIDs[IDX_SILICON_SPARESUSED].getHasValues()) {

                    html += '<h3>Silicon Drives</h3>';
                    html += '<table>';

                    if (RequestParamIDs[IDX_SILICON_TOTALERASECOUNTS].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Total Erase Counts</td><td><div id="' + RequestParamIDs[IDX_SILICON_TOTALERASECOUNTS].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[IDX_SILICON_DRIVEUSAGE].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Drive Usage (%)</td><td><div id="' + RequestParamIDs[IDX_SILICON_DRIVEUSAGE].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[IDX_SILICON_SPARES].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Number Of Spares</td><td><div id="' + RequestParamIDs[IDX_SILICON_SPARES].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[IDX_SILICON_SPARESUSED].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Spares Used</td><td><div id="' + RequestParamIDs[IDX_SILICON_SPARESUSED].parameterName + '"></div></td></tr> ';
                    }
                    html += '</table>';
                    html += '<br>';
                }

                if (RequestParamIDs[IDX_MASSSTORMON_SERIALNUMBER].getHasValues())
                {
                    html += '<div id="div_drivetitle"></div>';
                    html += '<div id="div_drivenotes"></div>';
                    html += '<br>';
                    html += '<div id="div_drives"></div>';
                }

                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);

                if (RequestParamIDs[IDX_DSKMGNT_DRIVELETTER].getHasValues()) {
                    if (winxp) {
                        base.setElementOnClick("btnEditVolumeLabels", function (_id) { return function () { ChangePage(_id); }; }(0));
                    }
                }

                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                if (RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].getHasValues() || wince) // CE may have no drives (since the OS runs in memory)
                {
                    var html = "";
                    html += '<table>';
                    
                    if (winxp || wince) {
                        html += '<tr><th>Volume</th><th>Label</th><th>File System</th><th>Type</th><th>Total Size</th><th>Free Space</th></tr>';
                    }
                    else {
                        // No volumes under TCBSD & TCRTOS
                        html += '<tr><th>Label</th><th>File System</th><th>Type</th><th>Total Size</th><th>Free Space</th></tr>';
                    }
                    
                    var Rows = RequestParamIDs[IDX_DSKMGNT_DRIVELETTER].values[0].length;
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

                        try {
                            html += '<td><div id="' + RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].parameterName + i + '">' + RequestParamIDs[IDX_DSKMGNT_VOLUMELABEL].values[0][i].getOutput() + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
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
                            html += '<td><div id="' + RequestParamIDs[IDX_DSKMGNT_TOTALSIZE].parameterName + i + '" align="right">' + window.Helper.getBestMemoryUnity(RequestParamIDs[IDX_DSKMGNT_TOTALSIZE].values[0][i].getOutput(), 1) + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        try {
                            html += '<td><div id="' + RequestParamIDs[IDX_DSKMGNT_FREEBYTES].parameterName + i + '" align="right">' + window.Helper.getBestMemoryUnity(RequestParamIDs[IDX_DSKMGNT_FREEBYTES].values[0][i].getOutput(), 1) + '</div></td>';
                        }
                        catch (e) {
                            html += '<td></td>';
                        }

                        html += '</tr>';
                    }
                    html += "</table>";
                    html += "<br>";

                    base.writeElement("drives", html);
                }


                // Silicon Drive
                if (RequestParamIDs[IDX_SILICON_TOTALERASECOUNTS].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_SILICON_TOTALERASECOUNTS].parameterName, RequestParamIDs[IDX_SILICON_TOTALERASECOUNTS].values[0].data);
                }
                if (RequestParamIDs[IDX_SILICON_DRIVEUSAGE].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_SILICON_DRIVEUSAGE].parameterName, RequestParamIDs[IDX_SILICON_DRIVEUSAGE].values[0].data);
                }
                if (RequestParamIDs[IDX_SILICON_SPARES].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_SILICON_SPARES].parameterName, RequestParamIDs[IDX_SILICON_SPARES].values[0].data);
                }
                if (RequestParamIDs[IDX_SILICON_SPARESUSED].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_SILICON_SPARESUSED].parameterName, RequestParamIDs[IDX_SILICON_SPARESUSED].values[0].data);
                }

                // MassStorageMonitoring
                if (RequestParamIDs[IDX_MASSSTORMON_SERIALNUMBER].getHasValues()) {

                    var html = "";
                    var nHDDs = 0, nFlashdrives = 0;    // count of hdds and flashdrives
                    var bSpares = false;                // true if any flashdrive shows their spares
                    var Rows = RequestParamIDs[IDX_MASSSTORMON_SERIALNUMBER].values[0].length;

                    for (var i = 0; i < Rows; i++) {

                        if (!RequestParamIDs[IDX_MASSSTORMON_SERIALNUMBER].values[0][i].getHasError()) {

                            var bAnyDataAvailable = false;

                            //////////////////////
                            // HEAD
                            ////////////////////

                            var htmlDrive = "";
                            htmlDrive += '<h4>';

                            // Drivename
                            if (!RequestParamIDs[IDX_MASSSTORMON_DRIVENAME].values[0][i].getHasError()) {
                                htmlDrive += RequestParamIDs[IDX_MASSSTORMON_DRIVENAME].values[0][i].data;
                            }

                            // SATA-Port and Drive letter(s) if available
                            var bSataPortAvailable = !RequestParamIDs[IDX_MASSSTORMON_SLOT].values[0][i].getHasError();
                            var bDriveLettersAvailable = !RequestParamIDs[IDX_MASSSTORMON_DRIVELETTERS].values[0][i].getHasError();

                            if (bSataPortAvailable ||
                                bDriveLettersAvailable) {

                                htmlDrive += " (";

                                // SATA-Port
                                if (bSataPortAvailable) {
                                    htmlDrive += "SATA-Port: " + RequestParamIDs[IDX_MASSSTORMON_SLOT].values[0][i].data;
                                }

                                // Drive letter(s)
                                if (bDriveLettersAvailable) {
                                    if (bSataPortAvailable) { htmlDrive += ", "; } // Split data by ","
                                    htmlDrive += "Volumes: " + RequestParamIDs[IDX_MASSSTORMON_DRIVELETTERS].values[0][i].data;
                                }

                                htmlDrive += ")";
                            }

                            htmlDrive += '</h4>';

                            //////////////////////
                            // Flashdrives
                            ////////////////////

                            //if (!RequestParamIDs[IDX_MASSSTORMON_ERASECOUNTAVG].values[0][i].getHasError() ||
                            //    !RequestParamIDs[IDX_MASSSTORMON_ERASECOUNTSPEC].values[0][i].getHasError() ||
                            if (!RequestParamIDs[IDX_MASSSTORMON_ERASECYCLESLEFTPERCENT].values[0][i].getHasError()) {

                                bAnyDataAvailable = true;
                                nFlashdrives++;

                                htmlDrive += '<table>';

                                //if (!RequestParamIDs[IDX_MASSSTORMON_ERASECOUNTAVG].values[0][i].getHasError()) {
                                //    htmlDrive += '<tr>';
                                //    htmlDrive += '<td class="td_FirstColumn">Average Erase Count</td>';
                                //    htmlDrive += '<td><div id="' + RequestParamIDs[IDX_MASSSTORMON_ERASECOUNTAVG].parameterName + i + '">' + RequestParamIDs[IDX_MASSSTORMON_ERASECOUNTAVG].values[0][i].data + '</div></td>';
                                //    htmlDrive += '</tr>';
                                //}

                                //if (!RequestParamIDs[IDX_MASSSTORMON_ERASECOUNTSPEC].values[0][i].getHasError()) {
                                //    htmlDrive += '<tr>';
                                //    htmlDrive += '<td class="td_FirstColumn">Specified P/E Cycles</td>';
                                //    htmlDrive += '<td><div id="' + RequestParamIDs[IDX_MASSSTORMON_ERASECOUNTSPEC].parameterName + i + '">' + RequestParamIDs[IDX_MASSSTORMON_ERASECOUNTSPEC].values[0][i].data + '</div></td>';
                                //    htmlDrive += '</tr>';
                                //}

                                if (!RequestParamIDs[IDX_MASSSTORMON_ERASECYCLESLEFTPERCENT].values[0][i].getHasError()) {
                                    htmlDrive += '<tr>';
                                    htmlDrive += '<td class="td_FirstColumn">P/E Cycles Left</td>';
                                    htmlDrive += '<td><div id="' + RequestParamIDs[IDX_MASSSTORMON_ERASECYCLESLEFTPERCENT].parameterName + i + '">' + RequestParamIDs[IDX_MASSSTORMON_ERASECYCLESLEFTPERCENT].values[0][i].data + ' %</div></td>';
                                    htmlDrive += '</tr>';
                                }

                                htmlDrive += '</table>';
                                htmlDrive += "<br>";
                            }


                            if (!RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSREMAINING].values[0][i].getHasError() ||
                                !RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSINITIAL].values[0][i].getHasError() ||
                                !RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSLEFTPERCENT].values[0][i].getHasError()) {

                                bAnyDataAvailable = true;
                                nFlashdrives++;
                                bSpares = true;

                                htmlDrive += '<table>';

                                if (!RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSREMAINING].values[0][i].getHasError()) {
                                    htmlDrive += '<tr>';
                                    htmlDrive += '<td class="td_FirstColumn">Remaining Spare Blocks</td>';
                                    htmlDrive += '<td><div id="' + RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSREMAINING].parameterName + i + '">' + RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSREMAINING].values[0][i].data + '</div></td>';
                                    htmlDrive += '</tr>';
                                }

                                if (!RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSINITIAL].values[0][i].getHasError()) {
                                    htmlDrive += '<tr>';
                                    htmlDrive += '<td class="td_FirstColumn">Initial Spare Blocks</td>';
                                    htmlDrive += '<td><div id="' + RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSINITIAL].parameterName + i + '">' + RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSINITIAL].values[0][i].data + '</div></td>';
                                    htmlDrive += '</tr>';
                                }

                                if (!RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSLEFTPERCENT].values[0][i].getHasError()) {
                                    htmlDrive += '<tr>';
                                    htmlDrive += '<td class="td_FirstColumn">Spare Blocks Left</td>';
                                    htmlDrive += '<td><div id="' + RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSLEFTPERCENT].parameterName + i + '">' + RequestParamIDs[IDX_MASSSTORMON_SPAREBLOCKSLEFTPERCENT].values[0][i].data + ' %</div></td>';
                                    htmlDrive += '</tr>';
                                }

                                htmlDrive += '</table>';
                                htmlDrive += "<br>";
                            }


                            //////////////////////
                            // HDDs
                            ////////////////////

                            if (!RequestParamIDs[IDX_MASSSTORMON_REALLOCATEDSECTORS].values[0][i].getHasError() ||
                                !RequestParamIDs[IDX_MASSSTORMON_SPINRETRIES].values[0][i].getHasError() ||
                                !RequestParamIDs[IDX_MASSSTORMON_PENDINGSECTORS].values[0][i].getHasError() ||
                                !RequestParamIDs[IDX_MASSSTORMON_ULTRADMACRCERRORS].values[0][i].getHasError()) {

                                bAnyDataAvailable = true;
                                nHDDs++;

                                htmlDrive += '<table>';

                                if (!RequestParamIDs[IDX_MASSSTORMON_REALLOCATEDSECTORS].values[0][i].getHasError()) {
                                    htmlDrive += '<tr>';
                                    htmlDrive += '<td class="td_FirstColumn">Reallocated Sectors</td>';
                                    htmlDrive += '<td><div id="' + RequestParamIDs[IDX_MASSSTORMON_REALLOCATEDSECTORS].parameterName + i + '">' + RequestParamIDs[IDX_MASSSTORMON_REALLOCATEDSECTORS].values[0][i].data + '</div></td>';
                                    htmlDrive += '</tr>';
                                }

                                if (!RequestParamIDs[IDX_MASSSTORMON_SPINRETRIES].values[0][i].getHasError()) {
                                    htmlDrive += '<tr>';
                                    htmlDrive += '<td class="td_FirstColumn">Spin Retries</td>';
                                    htmlDrive += '<td><div id="' + RequestParamIDs[IDX_MASSSTORMON_SPINRETRIES].parameterName + i + '">' + RequestParamIDs[IDX_MASSSTORMON_SPINRETRIES].values[0][i].data + '</div></td>';
                                    htmlDrive += '</tr>';
                                }

                                if (!RequestParamIDs[IDX_MASSSTORMON_PENDINGSECTORS].values[0][i].getHasError()) {
                                    htmlDrive += '<tr>';
                                    htmlDrive += '<td class="td_FirstColumn">Pending Sectors</td>';
                                    htmlDrive += '<td><div id="' + RequestParamIDs[IDX_MASSSTORMON_PENDINGSECTORS].parameterName + i + '">' + RequestParamIDs[IDX_MASSSTORMON_PENDINGSECTORS].values[0][i].data + '</div></td>';
                                    htmlDrive += '</tr>';
                                }

                                if (!RequestParamIDs[IDX_MASSSTORMON_ULTRADMACRCERRORS].values[0][i].getHasError()) {
                                    htmlDrive += '<tr>';
                                    htmlDrive += '<td class="td_FirstColumn">Ultra DMA CRC Errors</td>';
                                    htmlDrive += '<td><div id="' + RequestParamIDs[IDX_MASSSTORMON_ULTRADMACRCERRORS].parameterName + i + '">' + RequestParamIDs[IDX_MASSSTORMON_ULTRADMACRCERRORS].values[0][i].data + '</div></td>';
                                    htmlDrive += '</tr>';
                                }

                                htmlDrive += '</table>';
                                htmlDrive += "<br>";
                            }

                            if (bAnyDataAvailable) {
                                html += htmlDrive;
                            }
                            else {
                                htmlDrive = "";  // hide this drive
                            }

                        }
                    }


                    var htmlDriveNotes = "";
                    
                    if (nHDDs > 0) {
                        htmlDriveNotes += '<h4>Notes regarding harddisks</h4>';
                        htmlDriveNotes += '<p><b>Lifetime:</b> Beckhoff recommends to replace HDDs after 5 years at the latest - independent of Reallocated Sectors, Spin Retries, Pending Sectors and Ultra DMA CRC Errors.</p>';
                    }

                    if (nFlashdrives > 0) {
                        htmlDriveNotes += '<h4>Notes regarding flash devices</h4>';
                        htmlDriveNotes += '<p><b>Lifetime:</b> Beckhoff recommends to replace flash devices after 10 years at the latest - independent of Erase Count and Spare Block usage.</p>';
                        if (bSpares) {
                            htmlDriveNotes += '<p><b>Spares:</b> Beckhoff recommends to replace flash devices after consumption of 50% spare blocks at the latest. The consumption of spare blocks speeds up exponentially and the device may fail immediately when all spare blocks are used up.</p>';
                        }
                    }


                    var htmlDriveTitle = "";

                    if (nHDDs > 0 ||
                        nFlashdrives > 0) {

                        htmlDriveTitle += '<h3>SATA & IDE Drives</h3>';
                    }

                    base.writeElement("div_drivetitle", htmlDriveTitle);
                    base.writeElement("div_drivenotes", htmlDriveNotes);
                    base.writeElement("div_drives", html);
                }

            }

            var ChangePage = function (idx) {
                base.ChangePage("Software", "Filesystem");
            }

        }

        this.HDD.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Hardware_HDD.HDD(), window.DevMan.ModuleType.Website);

})(window);
