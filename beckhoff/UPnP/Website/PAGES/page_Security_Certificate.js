(function (window) {

    // namespace
    var Page_Security_Certificate = new (function () {

        this.Certificate = function () {

            this.category = "Security";
            this.name = "Certificate";
            this.subnavigationicon = "sec-nav-certificate.png";

            var CycleTime = 2000;
            var base = undefined;
            
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

                // init parameter
                base.addParameter("Misc_Properties_GenerateCertificate", true);
                
                // init events
                base.setOnInitStaticPage(OnInitStaticPage);
                base.setOnDisplayValues(OnDisplayValues);
                base.setOnWriteFailed(OnWriteFailed); 
                base.setOnWriteResult(OnWriteResult); 
                //base.setOnServiceTransferFailed(OnServiceTransferFailed);
                //base.setOnServiceTransferResult(OnServiceTransferResult);

                return true;
            }

            var OnInitStaticPage = function (RequestParamIDs) {

                var html = "";

                html += '<h3>Server Certificate</h3>';
                
                html += '<table style="margin-bottom: 5px">';
                html += '<tr><td class="td_trans"><h4>Auto-generate new self signed certificate on changes of hostname</h4></td><td class="td_Action_trans">'
                    + new ControlLib.SmallButton().Create("btnSetCertificateGenerationState", "save", "Save")
                    + new ControlLib.SmallButton().Create("btnSetCertificateGenerationState_Cancel", "delete", "Discard Changes")
                    + '</td></tr>';
                html += '</table>';
                html += '<table>';
                var ComboItems = ["Disabled", "Enabled"];
                html += '<tr><td class="td_FirstColumn">Auto-generate certificate</td><td>' + new ControlLib.Combobox().Create(RequestParamIDs[0].parameterName, ComboItems) + '</td></tr>';
                html += '</table>';
                html += '<br>';

                html += '<div id="status"></div>';  // div for errors, etc.

                // write innerHTML of page
                base.writeActivePage(html);

                // Add Events
                base.setElementOnClick("btnSetCertificateGenerationState", function (_id) { return function () { SetCertificateGenerationState(_id); }; }(0));
                base.setElementOnClick("btnSetCertificateGenerationState_Cancel", function (_id) { return function () { SetCertificateGenerationState_Cancel(_id); }; }(0));

                base.addLockListener(RequestParamIDs[0].parameterName);

                return true;
            }

            var OnDisplayValues = function (RequestParamIDs) {

                if (RequestParamIDs[0].getHasValues()) {
                    base.setElementValue(RequestParamIDs[0].parameterName, RequestParamIDs[0].values[0].data);
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
                var bHasError = false;
                for (var i = 0; i < ModuleItemsWritten.length; i++) {
                    if (ErrorCodes[i] > 0) {
                        window.DevMan.getErrorQueue().AddError(ErrorCodes[i]);
                        bHasError = true;
                    }
                }

                if (!bHasError)
                {
                    base.clearLocks();
                }
            }

            var SetCertificateGenerationState = function (idx) {

                if (base.isLocked("Misc_Properties_GenerateCertificate")) {

                    var writeParams = [];
                    var idxs = [];
                    var writeValues = [];

                    // turn on DHCP
                    writeParams.push("Misc_Properties_GenerateCertificate");
                    idxs.push(idx);
                    writeValues.push(base.getElementValue("Misc_Properties_GenerateCertificate"));

                    iLastNicIdxWritten = idx;
                    base.Write(writeParams, idxs, writeValues);
                    Helper.ShowLoading();
                }
            }

            var SetCertificateGenerationState_Cancel = function (idx) {

                base.clearLocks();
            }

        }

        this.Certificate.prototype = new window.Page_Template.Template();

    });

    window.DevMan.RegisterModule(new Page_Security_Certificate.Certificate(), window.DevMan.ModuleType.Website);

})(window);
