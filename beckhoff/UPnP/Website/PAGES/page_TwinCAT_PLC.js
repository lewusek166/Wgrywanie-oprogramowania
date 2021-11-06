(function (window) {

    // namespace
    var Page_TwinCAT_PLC = new (function () {

        this.PLC = function () {

            this.category = "TwinCAT";
            this.name = "PLC";
            this.subnavigationicon = "sec-nav-plc.png";

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
                //base.addParameter("", false);
                
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

                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);
                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

            }

        }

        this.PLC.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_TwinCAT_PLC.PLC(), window.DevMan.ModuleType.Website);

})(window);
