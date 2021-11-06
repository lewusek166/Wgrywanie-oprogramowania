(function (window) {

    // namespace
    var Page_Hardware_Mainboard = new (function () {

        this.Mainboard = function () {

            this.category = "Hardware";
            this.name = "Mainboard";
            this.subnavigationicon = "sec-nav-mainboard.png";

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
                base.addParameter("Mainboard_Information_Property_MainboardType", false);               // 0
                base.addParameter("Mainboard_Information_Property_SerialNumber", false);
                base.addParameter("Mainboard_Information_Property_ProductionDate", false);
                base.addParameter("Mainboard_Information_Property_BootCount", false);
                base.addParameter("Mainboard_Information_Property_OperatingTime", true);
                base.addParameter("Mainboard_Information_Property_MinBoardTemperature", true);          // 5
                base.addParameter("Mainboard_Information_Property_MaxBoardTemperature", true);
                base.addParameter("Mainboard_Information_Property_MinInputVoltage", true);
                base.addParameter("Mainboard_Information_Property_MaxInputVoltage", true);
                base.addParameter("Mainboard_Information_Property_MainboardTemperature", true);

                // version
                base.addParameter("Mainboard_VersionInformation_Property_MainboardRevision", false);    // 10
                base.addParameter("Mainboard_VersionInformation_Property_BiosMajorVersion", false);
                base.addParameter("Mainboard_VersionInformation_Property_BiosMinorVersion", false);

                // voltage
                base.addParameter("Mainboard_VoltageInformationName_Property_Len", false);
                base.addParameter("Mainboard_VoltageInformationLocation_Property_Len", false);
                base.addParameter("Mainboard_VoltageInformationVoltage_Property_Len", true);            // 15
                base.addParameter("Mainboard_VoltageInformationNominalVoltage_Property_Len", false);


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

                if (RequestParamIDs[0].getHasValues() ||
                    RequestParamIDs[1].getHasValues() ||
                    RequestParamIDs[2].getHasValues() ||
                    RequestParamIDs[3].getHasValues() ||
                    RequestParamIDs[4].getHasValues() ||
                    RequestParamIDs[5].getHasValues() ||
                    RequestParamIDs[6].getHasValues() ||
                    RequestParamIDs[7].getHasValues() ||
                    RequestParamIDs[8].getHasValues() ||
                    RequestParamIDs[9].getHasValues()) {

                    html += '<h3>Mainboard information</h3>';
                    html += '<table>';

                    if (RequestParamIDs[0].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Type</td><td><div id="' + RequestParamIDs[0].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[1].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Serialnumber</td><td><div id="' + RequestParamIDs[1].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[2].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Productiondate</td><td><div id="' + RequestParamIDs[2].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[3].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Boot count</td><td><div id="' + RequestParamIDs[3].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[4].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Operating time (min)</td><td><div id="' + RequestParamIDs[4].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[5].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Min temperature (°C)</td><td><div id="' + RequestParamIDs[5].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[6].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Max temperature (°C)</td><td><div id="' + RequestParamIDs[6].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[7].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Min input voltage (mV)</td><td><div id="' + RequestParamIDs[7].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[8].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Max input voltage (mV)</td><td><div id="' + RequestParamIDs[8].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[9].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Temperature (°C)</td><td><div id="' + RequestParamIDs[9].parameterName + '"></div></td></tr> ';
                    }
                    
                    html += '</table>';
                    html += '<br>';
                }

                if (RequestParamIDs[10].getHasValues() ||
                    RequestParamIDs[11].getHasValues() ||
                    RequestParamIDs[12].getHasValues()) {

                    html += '<h3>Version</h3>';

                    html += '<table>';
                    if (RequestParamIDs[10].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Mainboard revision</td><td><div id="' + RequestParamIDs[10].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[11].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Bios major</td><td><div id="' + RequestParamIDs[11].parameterName + '"></div></td></tr> ';
                    }
                    if (RequestParamIDs[12].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Bios minor</td><td><div id="' + RequestParamIDs[12].parameterName + '"></div></td></tr> ';
                    }
                    html += '</table>';
                    html += '<br>';
                }

                if (RequestParamIDs[13].getHasValues() ||
                    RequestParamIDs[14].getHasValues() ||
                    RequestParamIDs[15].getHasValues() ||
                    RequestParamIDs[16].getHasValues()) {

                    html += '<h3>Voltage</h3>';
                    html += '<table>';
                    html += '<tr><th>Name</th><th>Location</th><th>Voltage [mV]</th><th>Nominal Voltage [mV]</th>';


                    var RowsNames = 0;
                    if (RequestParamIDs[13].getHasValues()) { RowsNames = RequestParamIDs[13].values[0].length; }

                    var RowsLocations = 0;
                    if (RequestParamIDs[14].getHasValues()) { RowsLocations = RequestParamIDs[14].values[0].length; }

                    var RowsVoltages = 0;
                    if (RequestParamIDs[15].getHasValues()) { RowsVoltages = RequestParamIDs[15].values[0].length; }

                    var RowsNominalVoltages = 0;
                    if (RequestParamIDs[16].getHasValues()) { RowsNominalVoltages = RequestParamIDs[16].values[0].length; }

                    var Rows = Math.max(RowsNames, RowsLocations, RowsVoltages, RowsNominalVoltages);

                    for (var i = 0; i < Rows; i++) {

                        html += '<tr>';
                        html += '<td class="td_FirstColumn"><div id="' + RequestParamIDs[13].parameterName + i + '"></div></td>';
                        html += '<td><div id="' + RequestParamIDs[14].parameterName + i + '"></div></td>';
                        html += '<td><div id="' + RequestParamIDs[15].parameterName + i + '"></div></td>';
                        html += '<td><div id="' + RequestParamIDs[16].parameterName + i + '"></div></td>';
                        html += '</tr>';
                    }
                    html += '</table><br>';
                }


                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);
                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                if (RequestParamIDs[0].getHasValues()) {
                    base.writeElement(RequestParamIDs[0].parameterName, RequestParamIDs[0].values[0].data);
                }
                if (RequestParamIDs[1].getHasValues()) {
                    base.writeElement(RequestParamIDs[1].parameterName, RequestParamIDs[1].values[0].data);
                }
                if (RequestParamIDs[2].getHasValues()) {
                    base.writeElement(RequestParamIDs[2].parameterName, RequestParamIDs[2].values[0].data);
                }
                if (RequestParamIDs[3].getHasValues()) {
                    base.writeElement(RequestParamIDs[3].parameterName, RequestParamIDs[3].values[0].data);
                }
                if (RequestParamIDs[4].getHasValues()) {
                    base.writeElement(RequestParamIDs[4].parameterName, RequestParamIDs[4].values[0].data);
                }
                if (RequestParamIDs[5].getHasValues()) {
                    base.writeElement(RequestParamIDs[5].parameterName, RequestParamIDs[5].values[0].data);
                }
                if (RequestParamIDs[6].getHasValues()) {
                    base.writeElement(RequestParamIDs[6].parameterName, RequestParamIDs[6].values[0].data);
                }
                if (RequestParamIDs[7].getHasValues()) {
                    base.writeElement(RequestParamIDs[7].parameterName, RequestParamIDs[7].values[0].data);
                }
                if (RequestParamIDs[8].getHasValues()) {
                    base.writeElement(RequestParamIDs[8].parameterName, RequestParamIDs[8].values[0].data);
                }
                if (RequestParamIDs[9].getHasValues()) {
                    base.writeElement(RequestParamIDs[9].parameterName, RequestParamIDs[9].values[0].data);
                }
                if (RequestParamIDs[10].getHasValues()) {
                    base.writeElement(RequestParamIDs[10].parameterName, RequestParamIDs[10].values[0].data);
                }
                if (RequestParamIDs[11].getHasValues()) {
                    base.writeElement(RequestParamIDs[11].parameterName, RequestParamIDs[11].values[0].data);
                }
                if (RequestParamIDs[12].getHasValues()) {
                    base.writeElement(RequestParamIDs[12].parameterName, RequestParamIDs[12].values[0].data);
                }


                // Voltage
                var RowsVoltageNames = 0;
                if (RequestParamIDs[13].getHasValues()) { RowsVoltageNames = RequestParamIDs[13].values[0].length; }
                for (var i = 0; i < RowsVoltageNames; i++) {
                    base.writeElement(RequestParamIDs[13].parameterName + i, RequestParamIDs[13].values[0][i].getOutput());
                }

                var RowsVoltageLocations = 0;
                if (RequestParamIDs[14].getHasValues()) { RowsVoltageLocations = RequestParamIDs[14].values[0].length; }
                for (var i = 0; i < RowsVoltageLocations; i++) {
                    base.writeElement(RequestParamIDs[14].parameterName + i, Helper.getMainboardVoltageLocation(RequestParamIDs[14].values[0][i].data));
                }

                var RowsVoltageVoltages = 0;
                if (RequestParamIDs[15].getHasValues()) { RowsVoltageVoltages = RequestParamIDs[15].values[0].length; }
                for (var i = 0; i < RowsVoltageLocations; i++) {
                    base.writeElement(RequestParamIDs[15].parameterName + i, RequestParamIDs[15].values[0][i].getOutput());
                }

                var RowsVoltageNominalVoltages = 0;
                if (RequestParamIDs[16].getHasValues()) { RowsVoltageNominalVoltages = RequestParamIDs[16].values[0].length; }
                for (var i = 0; i < RowsVoltageNominalVoltages; i++) {
                    base.writeElement(RequestParamIDs[16].parameterName + i, RequestParamIDs[16].values[0][i].getOutput());
                }

            }

        }

        this.Mainboard.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Hardware_Mainboard.Mainboard(), window.DevMan.ModuleType.Website);

})(window);
