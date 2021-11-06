(function (window) {

    // namespace
    var Page_Software_OperatingSystem = new (function () {

        this.OperatingSystem = function () {

            this.category = "Software";
            this.name = "OS";
            this.subnavigationicon = "sec-nav-os.png";

            var CycleTime = 2000;
            var base = undefined;

            var IDX_OS_Name = 0;
            var IDX_OS_MajorVersion = 0;
            var IDX_OS_MinorVersion = 0;
            var IDX_OS_Build = 0;
            var IDX_OS_CSDVersion = 0;
            var IDX_SOFTWARE_Name = 0;
            var IDX_SOFTWARE_Company = 0;
            var IDX_SOFTWARE_Date = 0;
            var IDX_SOFTWARE_Version = 0;

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
                IDX_OS_Name = base.addParameter("OS_Header_Property_OSName", false);
                IDX_OS_MajorVersion = base.addParameter("OS_Property_MajorVersion", false);
                IDX_OS_MinorVersion = base.addParameter("OS_Property_MinorVersion", false);
                IDX_OS_Build = base.addParameter("OS_Property_Build", false);
                IDX_OS_CSDVersion = base.addParameter("OS_Property_CSDVersion", false);
                IDX_SOFTWARE_Name = base.addParameter("Software_Property_Name_Len", false);
                IDX_SOFTWARE_Company = base.addParameter("Software_Property_Company_Len", false);
                IDX_SOFTWARE_Date = base.addParameter("Software_Property_Date_Len", false);
                IDX_SOFTWARE_Version = base.addParameter("Software_Property_Version_Len", false);

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

                if (RequestParamIDs[IDX_OS_Name].getHasValues() ||
                    RequestParamIDs[IDX_OS_MajorVersion].getHasValues() ||
                    RequestParamIDs[IDX_OS_MinorVersion].getHasValues() ||
                    RequestParamIDs[IDX_OS_Build].getHasValues() ||
                    RequestParamIDs[IDX_OS_CSDVersion].getHasValues()) {

                    html += '<h3>Operating System</h3>';
                    html += "<table>";

                    if (RequestParamIDs[IDX_OS_Name].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Operating System</td><td><div id="' + RequestParamIDs[IDX_OS_Name].parameterName + '"></div>';
                    }
                    if (RequestParamIDs[IDX_OS_MajorVersion].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Major Version</td><td><div id="' + RequestParamIDs[IDX_OS_MajorVersion].parameterName + '"></div>';
                    }
                    if (RequestParamIDs[IDX_OS_MinorVersion].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Minor Version</td><td><div id="' + RequestParamIDs[IDX_OS_MinorVersion].parameterName + '"></div>';
                    }
                    if (RequestParamIDs[IDX_OS_Build].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">Build</td><td><div id="' + RequestParamIDs[IDX_OS_Build].parameterName + '"></div>';
                    }
                    if (RequestParamIDs[IDX_OS_CSDVersion].getHasValues()) {
                        html += '<tr><td class="td_FirstColumn">CSD Version</td><td><div id="' + RequestParamIDs[IDX_OS_CSDVersion].parameterName + '"></div>';
                    }

                    html += "</table>";
                    html += "<br>";
                }


                if (RequestParamIDs[IDX_SOFTWARE_Name].getHasValues() ||
                    RequestParamIDs[IDX_SOFTWARE_Company].getHasValues() ||
                    RequestParamIDs[IDX_SOFTWARE_Date].getHasValues() ||
                    RequestParamIDs[IDX_SOFTWARE_Version].getHasValues()) {

                    html += "<h3>Apps & Drivers</h3>";
                    html += '<table style="table-layout:fixed;">';

                    if (tcbsd) {
                        html += '<tr><th style="width:200px;">Name</th><th style="width:125px;">Company</th><th style="width:250px;">Version</th></tr>';
                    }
                    else {
                        html += '<tr><th style="width:300px;">Name</th><th style="width:125px;">Company</th><th style="width:75px;">Date</th><th style="width:75px;">Version</th></tr>';
                    }

                    var RowsNames = 0;
                    if (RequestParamIDs[IDX_SOFTWARE_Name].getHasValues()) { RowsNames = RequestParamIDs[IDX_SOFTWARE_Name].values[0].length; }

                    var RowsCompanies = 0;
                    if (RequestParamIDs[IDX_SOFTWARE_Company].getHasValues()) { RowsCompanies = RequestParamIDs[IDX_SOFTWARE_Company].values[0].length; }

                    var RowsDates = 0;
                    if (RequestParamIDs[IDX_SOFTWARE_Date].getHasValues()) { RowsDates = RequestParamIDs[IDX_SOFTWARE_Date].values[0].length; }
                    
                    var RowsVersions = 0;
                    if (RequestParamIDs[IDX_SOFTWARE_Version].getHasValues()) { RowsVersions = RequestParamIDs[IDX_SOFTWARE_Version].values[0].length; }

                    var Rows = Math.max(RowsNames, RowsCompanies, RowsDates, RowsVersions);

                    if (tcbsd) {
                        for (var i = 0; i < Rows; i++) {
                            html += '<td style="word-wrap:break-word;width:200px;"><div id="' + RequestParamIDs[IDX_SOFTWARE_Name].parameterName + i + '"></div></td>';
                            html += '<td style="word-wrap:break-word;width:125px;"><div id="' + RequestParamIDs[IDX_SOFTWARE_Company].parameterName + i + '"></div></td>';
                            html += '<td style="word-wrap:break-word;width:250px;"><div id="' + RequestParamIDs[IDX_SOFTWARE_Version].parameterName + i + '"></div></td>';
                            html += "</tr>";
                        }
                    }
                    else {
                        for (var i = 0; i < Rows; i++) {
                            html += '<td style="word-wrap:break-word;width:300px;"><div id="' + RequestParamIDs[IDX_SOFTWARE_Name].parameterName + i + '"></div></td>';
                            html += '<td style="word-wrap:break-word;width:125px;"><div id="' + RequestParamIDs[IDX_SOFTWARE_Company].parameterName + i + '"></div></td>';
                            html += '<td style="word-wrap:break-word;width:75px;"><div id="' + RequestParamIDs[IDX_SOFTWARE_Date].parameterName + i + '"></div></td>';
                            html += '<td style="word-wrap:break-word;width:75px;"><div id="' + RequestParamIDs[IDX_SOFTWARE_Version].parameterName + i + '"></div></td>';
                            html += "</tr>";
                        }
                    }
                    html += '</table>';
                    html += '<br>';
                }

                // html += "<h3>App.start order</h3>";
                // html += "<table>";
                // html += "</table>";

                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);
                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                if (RequestParamIDs[IDX_OS_Name].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_OS_Name].parameterName, RequestParamIDs[IDX_OS_Name].values[0].data); // OS  
                }
                if (RequestParamIDs[IDX_OS_MajorVersion].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_OS_MajorVersion].parameterName, RequestParamIDs[IDX_OS_MajorVersion].values[0].data); // Major        
                }
                if (RequestParamIDs[IDX_OS_MinorVersion].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_OS_MinorVersion].parameterName, RequestParamIDs[IDX_OS_MinorVersion].values[0].data); // Minor    
                }
                if (RequestParamIDs[IDX_OS_Build].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_OS_Build].parameterName, RequestParamIDs[IDX_OS_Build].values[0].data); // Build    
                }
                if (RequestParamIDs[IDX_OS_CSDVersion].getHasValues()) {
                    base.writeElement(RequestParamIDs[IDX_OS_CSDVersion].parameterName, RequestParamIDs[IDX_OS_CSDVersion].values[0].data); // CSD    
                }
    

                // Names
                var RowsSoftwareNames = 0;
                if (RequestParamIDs[IDX_SOFTWARE_Name].getHasValues()) { RowsSoftwareNames = RequestParamIDs[IDX_SOFTWARE_Name].values[0].length; }
                for (var i = 0; i < RowsSoftwareNames; i++) {
                    base.writeElement(RequestParamIDs[IDX_SOFTWARE_Name].parameterName + i, RequestParamIDs[IDX_SOFTWARE_Name].values[0][i].getOutput());
                }

                // Company
                var RowsSoftwareCompanies = 0;
                if (RequestParamIDs[IDX_SOFTWARE_Company].getHasValues()) { RowsSoftwareCompanies = RequestParamIDs[IDX_SOFTWARE_Company].values[0].length; }
                for (var i = 0; i < RowsSoftwareCompanies; i++) {
                    base.writeElement(RequestParamIDs[IDX_SOFTWARE_Company].parameterName + i, RequestParamIDs[IDX_SOFTWARE_Company].values[0][i].getOutput());
                }

                if (!tcbsd) {
                    // Date
                    var RowsSoftwareDates = 0;
                    if (RequestParamIDs[IDX_SOFTWARE_Date].getHasValues()) { RowsSoftwareDates = RequestParamIDs[IDX_SOFTWARE_Date].values[0].length; }
                    for (var i = 0; i < RowsSoftwareDates; i++) {
                        base.writeElement(RequestParamIDs[IDX_SOFTWARE_Date].parameterName + i, RequestParamIDs[IDX_SOFTWARE_Date].values[0][i].getOutput());
                    }
                }

                // Version
                var RowsSoftwareVersions = 0;
                if (RequestParamIDs[IDX_SOFTWARE_Version].getHasValues()) { RowsSoftwareVersions = RequestParamIDs[IDX_SOFTWARE_Version].values[0].length; }
                for (var i = 0; i < RowsSoftwareVersions; i++) {
                    base.writeElement(RequestParamIDs[IDX_SOFTWARE_Version].parameterName + i, RequestParamIDs[IDX_SOFTWARE_Version].values[0][i].getOutput());
                }

            }

        }

        this.OperatingSystem.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Software_OperatingSystem.OperatingSystem(), window.DevMan.ModuleType.Website);

})(window);
