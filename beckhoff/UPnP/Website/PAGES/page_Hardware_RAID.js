(function (window) {

    // namespace
    var Page_Hardware_RAID = new (function () {

        this.RAID = function () {

            this.category = "Hardware";
            this.name = "RAID";
            this.subnavigationicon = "sec-nav-raid.png";

            var CycleTime = 2000;
            var base = undefined;

            var nRaidCtrl0 = 0; // RAID Controller 0

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
                base.addParameter("RAID_Property_ControllerInfo_State", true);                     // Idx: 0
                base.addParameter("RAID_Property_ControllerInfo_OfflineReason", true);
                base.addParameter("RAID_Property_SetsType_Len", true);
                base.addParameter("RAID_Property_SetsStateInfo_Len", true);
                base.addParameter("RAID_Property_SetsDrives_Len", true);                           
                base.addParameter("RAID_Property_DrivesSerialNumber_Len", true);                   // Idx: 5
                base.addParameter("RAID_Property_DrivesState_Len", true);                          

                base.addParameter("MassStorageMonitoring_Serialnumber_Property_Len", true);        // Idx: 7
                base.addParameter("MassStorageMonitoring_Slot_Property_Len", true);

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
                
                // RAID Controller 0
                if (RequestParamIDs[0].getHasValues() ||
                    RequestParamIDs[1].getHasValues()) {

                    html += '<h3>RAID Controller</h3>';

                    html += '<table>';

                    if (RequestParamIDs[0].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">State</td><td><div id="' + RequestParamIDs[0].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[1].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Offline reason</td><td><div id="' + RequestParamIDs[1].parameterName + '"></div></td></tr> ';
                    }

                    html += '</table>';
                    html += '<br>';
                }

                // List all RAID-Sets of RAID Controller 0 ==> nRaidCtrl0
                if (RequestParamIDs[2].getHasValues() ||
                    RequestParamIDs[3].getHasValues() ||
                    RequestParamIDs[4].getHasValues()) {

                    var RowsRaidSetsTypes = 0;
                    if (RequestParamIDs[2].getHasValues()) { RowsRaidSetsTypes = RequestParamIDs[2].values[nRaidCtrl0].length; }

                    var RowsRaidSetsStatusInfos = 0;
                    if (RequestParamIDs[3].getHasValues()) { RowsRaidSetsStatusInfos = RequestParamIDs[3].values[nRaidCtrl0].length; }

                    var RowsRaidSetsHarddisks = 0;
                    if (RequestParamIDs[4].getHasValues()) { RowsRaidSetsHarddisks = RequestParamIDs[4].values[nRaidCtrl0].length; }

                    var Rows = Math.max(RowsRaidSetsTypes, RowsRaidSetsStatusInfos, RowsRaidSetsHarddisks);

                    for (var i = 0; i < Rows; i++) {

                        html += '<h3>RAID Set ' + i + '</h3>';

                        html += '<table>';
                        if (RequestParamIDs[2].getHasValues()) {
                            html += '<tr><td class="td_FirstColumn">Type</td><td><div id="' + RequestParamIDs[2].parameterName + i + '"></div></td></tr> ';
                        }
                        if (RequestParamIDs[3].getHasValues()) {
                            html += '<tr><td class="td_FirstColumn">State & Info</td><td><div id="' + RequestParamIDs[3].parameterName + i + '"></div></td></tr> ';
                        }
                        html += '</table>';
                        html += '<br>';

                        if (RequestParamIDs[4].getHasValues()) {
                            html += '<div id="' + RequestParamIDs[4].parameterName + i + '"></div>'; // Container for inner table
                        }

                        html += '<br>';
                    }
                }

                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);

                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                // RAID Controller 0
                if (RequestParamIDs[0].getHasValues()) {
                    base.writeElement(RequestParamIDs[0].parameterName, window.Helper.getRaidState(RequestParamIDs[0].values[nRaidCtrl0].data));
                }
                if (RequestParamIDs[1].getHasValues()) {
                    base.writeElement(RequestParamIDs[1].parameterName, window.Helper.getRaidOfflineReason(RequestParamIDs[1].values[nRaidCtrl0].data));
                }


                // RAID Sets
                // List all RAID-Sets of RAID Controller 0 ==> nRaidCtrl0
                if (RequestParamIDs[2].getHasValues() ||
                    RequestParamIDs[3].getHasValues() ||
                    RequestParamIDs[4].getHasValues()) {

                    var RowsRaidSetsTypes = 0;
                    if (RequestParamIDs[2].getHasValues()) { RowsRaidSetsTypes = RequestParamIDs[2].values[nRaidCtrl0].length; }

                    var RowsRaidSetsStatusInfos = 0;
                    if (RequestParamIDs[3].getHasValues()) { RowsRaidSetsStatusInfos = RequestParamIDs[3].values[nRaidCtrl0].length; }

                    var RowsRaidSetsHarddisks = 0;
                    if (RequestParamIDs[4].getHasValues()) { RowsRaidSetsHarddisks = RequestParamIDs[4].values[nRaidCtrl0].length; }

                    var Rows = Math.max(RowsRaidSetsTypes, RowsRaidSetsStatusInfos, RowsRaidSetsHarddisks);

                    for (var i = 0; i < Rows; i++) {

                        if (RequestParamIDs[2].values[nRaidCtrl0].length > i) {
                            base.writeElement(RequestParamIDs[2].parameterName + i, window.Helper.getRaidSetType(RequestParamIDs[2].values[nRaidCtrl0][i].data));
                        }
                        if (RequestParamIDs[3].values[nRaidCtrl0].length > i) {
                            base.writeElement(RequestParamIDs[3].parameterName + i, window.Helper.getRaidSetStateAndInfo(RequestParamIDs[3].values[nRaidCtrl0][i].data));
                        }
                        if (RequestParamIDs[4].values[nRaidCtrl0].length > i) {

                            var nHarddiskIdxs = window.Helper.getRaidSetsHarddisks(RequestParamIDs[4].values[nRaidCtrl0][i].data);
                            if (nHarddiskIdxs.length > 0) {

                                var html = "";
                                html += '<table>';
                                html += '<tr>Harddisk<th></th><th>Serialnumber</th><th>Status</th></tr>';

                                for (var j = 0; j < nHarddiskIdxs.length; j++) {

                                    var nSubIdxJ = nHarddiskIdxs[j];

                                    // get SerialNo of current Harddisk
                                    var sCurSerialNumber = "";
                                    if (RequestParamIDs[5].values.length > 0 &&
                                        RequestParamIDs[5].values[nRaidCtrl0].length > nSubIdxJ) {
                                        sCurSerialNumber = RequestParamIDs[5].values[nRaidCtrl0][nSubIdxJ].data;
                                    }

                                    html += '<tr>';
                                    html += '<td class="td_FirstColumn">';

                                    // try to find SATA-Port of current HardDisk
                                    try {
                                        var bSerialNoFound = false;
                                        for (var k = 0; k < RequestParamIDs[7].values.length; k++) {
                                            if (RequestParamIDs[7].values[k][0].data == sCurSerialNumber) {
                                                html += 'Port: ' + RequestParamIDs[8].values[k][0].data;
                                                bSerialNoFound = true;
                                            }
                                        }

                                        if (!bSerialNoFound) { throw "SerialNumber not found!"; }
                                    }
                                    catch (e) {
                                        html += 'Port: N/A';
                                    }
                                    html += '</td>'

                                    if (sCurSerialNumber.length > 0) {
                                        html += '<td>' + sCurSerialNumber + '</td>';
                                    }
                                    else {
                                        html += '<td></td>';
                                    }

                                    if (RequestParamIDs[6].values.length > 0 &&
                                        RequestParamIDs[6].values[nRaidCtrl0].length > nSubIdxJ) {

                                        html += '<td>' + window.Helper.getRaidSetHarddiskState(RequestParamIDs[6].values[nRaidCtrl0][nSubIdxJ].data) + '</td>';
                                    }
                                    else
                                    {
                                        html += '<td></td>';
                                    }

                                    html += '</tr>';
                                }

                                html += '</table>';
                                base.writeElement(RequestParamIDs[4].parameterName + i, html);
                            }
                        }
                    }
                }
            }

        }

        this.RAID.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Hardware_RAID.RAID(), window.DevMan.ModuleType.Website);

})(window);
