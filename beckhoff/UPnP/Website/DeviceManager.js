(function (window) {

    var DevMan = new (function () {

        var _communicationModules = [];
        var _websites = [];
        var lastPageID = undefined;

        ////////////////////////////////////////////////////////////////////////////////
        // Public Methods
        //////////////////////////////////////////////////////////////////////////////
        this.Start = function () {

            var LoadingModule = CheckCommunicationState();

            if (LoadingModule > -1) {

                var ModuleState = _communicationModules[LoadingModule].getState();

                if (ModuleState.isBusy) {
                    Helper.ShowLoading();
                }

                if (ModuleState.hasError) {
                    if (window.Helper.getStartSecurityWizard()) {
                        Helper.ShowLoading("Initializing IPC-Diagnostics...");
                    }
                    else {
                        Helper.ShowLoading();
                        ErrorQueue.AddError(ModuleState.error.requestStatus, ModuleState.error.requestStatusText, 15);
                    }
                }

                setTimeout(window.DevMan.Start, 2000);
            }
            else {

                initWebsites();

                CreateMainNavigation();
                ShowStartPage();
                Helper.HideLoading();
            }
        }

        var ShowStartPage = function () {

            var startCategory = "Device"
            var startWebsitename = "System";

            // check SecWiz state
            if (window.Helper.getStartSecurityWizard()) {
                startCategory = "Security";
                startWebsitename = "Wizard";
            }

            ChangePage(startCategory, startWebsitename);
        }

        /// checks the state of the communication modules
        /// returns the index of the first module that is not ready
        /// else -1;
        var CheckCommunicationState = function () {

            for (var i = 0; i < _communicationModules.length; i++) {

                var ModuleState = _communicationModules[i].getState();

                if (ModuleState.hasError || ModuleState.isBusy) {
                    return i;
                }
            }

            return -1;
        }

        var initWebsites = function () {

            for (var i = 0; i < _websites.length; i++) {

                _websites[i].Init();
            }

        }

        var writeElement = function (element, text) {

            try {
                document.getElementById(element).innerHTML = text;
            }
            catch (e) { }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Communication-Modules / Websits
        //////////////////////////////////////////////////////////////////////////////

        this.ModuleType = {
            "CommunicationModule": 1,
            "Website": 2
        };

        this.RegisterModule = function (module, moduletype) {

            switch (moduletype) {

                case this.ModuleType.CommunicationModule:
                    _communicationModules.push(module);
                    break;

                case this.ModuleType.Website:
                    _websites.push(module);
                    break;
            }
        }

        this.CommunicationType = {
            "mdp": 1,
            "ads": 2
        }

        this.getCommunicationModule = function (communicationtype) {

            for (var i = 0; i < _communicationModules.length; i++) {

                var type = _communicationModules[i].communicationtype;

                if (type == communicationtype) {
                    return _communicationModules[i];
                }
            }
        }


        ////////////////////////////////////////////////////////////////////////////////
        // Navigation
        //////////////////////////////////////////////////////////////////////////////

        var nav_main_Click = function (Category) {
            ChangePage(Category, GetFirstWebsiteName(Category));
        }

        var nav_sub_Click = function (Category, WebsiteName) {
            ChangePage(Category, WebsiteName);
        }

        var bMainMenue = [];

        var IsInMenue = function (Category) {

            if (bMainMenue[Category] == null ||
                bMainMenue[Category] == false) {

                bMainMenue[Category] = true;
                return false;   // Category was not in menue, yet
            }

            return true;    // Category was already in menue
        }

        var CreateMainNavigation = function () {

            try {
                document.getElementById("Body").innerHTML = "";
                document.getElementById("Body").innerHTML += '<div id="MainNavigationMenue"></div>';
                document.getElementById("Body").innerHTML += '<div id="SubNavigationMenue"></div>';
                document.getElementById("Body").innerHTML += '<div id="ActivePage"></div>';
                document.getElementById("Body").innerHTML += '<div style="clear:both;"></div>';
            }
            catch (e) { }


            var MainNavigationButtons = "";

            for (var i = 0; i < _websites.length; i++) {

                var category = _websites[i].category;

                if (_websites[i].visible) {

                    if (!IsInMenue(category)) {

                        MainNavigationButtons += new ControlLib.MainNavigationButton().Create(
                            category,
                            category,
                            "res/website/nav/main/" + category + ".png");
                    }
                }
            }

            try {
                document.getElementById("MainNavigationMenue").innerHTML = MainNavigationButtons;
            }
            catch (e) { }

            for (var i = 0; i < _websites.length; i++) {
                if (_websites[i].visible) {

                    var category = _websites[i].category;

                    document.getElementById(category + "_MainButton").onclick =
                            function (_category) { return function () { nav_main_Click(_category); }; }(category);
                }
            }
        }

        var CheckSecurityState = function (Category, WebsiteName) {

            if (Category == "Security" && WebsiteName == "Wizard") {
                ShowSecurityWarning(false);
            }
            else {
                ShowSecurityWarning(window.Helper.getStartSecurityWizard());
            }
        }

        var ShowSecurityWarning = function (bShow) {

            if (bShow) {
                Helper.ShowSecurityWarning();
            }
            else {
                Helper.HideSecurityWarning();
            }
        }

        var activateMainNavigation = function (Category) {

            deactivateMainNavigations();
            deactivateSubNavigations();

            if (Category != "") {
                document.getElementById(Category + "_body_MainButton").className = "MainNavigationTile_Body_Selected";
            }
        }

        var deactivateMainNavigations = function () {

            var topDiv = document.getElementById("MainNavigationMenue");
            var subDivs = topDiv.getElementsByTagName("div");

            for (var i = 0; i < subDivs.length; i++) {
                var subDivName = subDivs[i].id;

                if (subDivName.indexOf("_body") > -1) {
                    subDivs[i].className = "MainNavigationTile_Body_Unselected";
                }
            }
        }


        var CreateSubNavigation = function (Category) {

            var SubNavigationButtons = "";

            for (var i = 0; i < _websites.length; i++) {

                if (_websites[i].category == Category && _websites[i].visible) {

                    var WebsiteName = _websites[i].name;
                    var WebsiteSubnavigationicon = _websites[i].subnavigationicon;

                    SubNavigationButtons += new ControlLib.SubNavigationButton().Create(
                        WebsiteName,
                        WebsiteName,
                        "res/website/nav/sub/" + WebsiteSubnavigationicon);
                }
            }

            document.getElementById("SubNavigationMenue").innerHTML = SubNavigationButtons;

            // Add onlick event to SubNavButtons
            for (var i = 0; i < _websites.length; i++) {

                if (_websites[i].category == Category && _websites[i].visible) {

                    var WebsiteName = _websites[i].name;
                    document.getElementById(WebsiteName + "_SubButton").onclick = function (_category, _websitename) { return function () { nav_sub_Click(_category, _websitename) }; }(Category, WebsiteName);
                }
            }
        }

        var activateSubNavigation = function (TileName) {

            deactivateSubNavigations();

            if (TileName != "") {
                document.getElementById(TileName + "_body_SubButton").className = "SubNavigationTile_Body_Selected";
            }
        }

        var deactivateSubNavigations = function () {

            var topDiv = document.getElementById("SubNavigationMenue");
            var subDivs = topDiv.getElementsByTagName("div");

            for (var i = 0; i < subDivs.length; i++) {
                var subDivName = subDivs[i].id;

                if (subDivName.indexOf("_body") > -1) {
                    subDivs[i].className = "SubNavigationTile_Body_Unselected";
                }
            }

        }

        // If a main-category was selected, show the first page with that category
        var GetFirstWebsiteName = function (Category) {

            var FirstPage = "";

            for (var i = 0; i < _websites.length; i++) {
                if (_websites[i].category == Category && _websites[i].visible) {
                    FirstPage = _websites[i].name;
                    break;
                }
            }

            return FirstPage;
        }

        this.ChangePage = function (Category, WebsiteName) {
            ChangePage(Category, WebsiteName);
        }
        
        var IsValidPage = function (Category, WebsiteName) {

            return (getWebsiteIdByName(Category, WebsiteName) > -1);
        }

        var ChangePage = function (Category, WebsiteName) {

            var StartPageID = getWebsiteIdByName(Category, WebsiteName);
            if (StartPageID == undefined) { return; }
            if (StartPageID >= _websites.length) { return; }

            if (StartPageID < 0)
            {
                Category = "Device";
                WebsiteName = "System";
                StartPageID = getWebsiteIdByName(Category, WebsiteName);
            }

            if (StartPageID < 0) { return; }


            activateMainNavigation(Category);
            CreateSubNavigation(Category);

            ShowPage(StartPageID);

            CheckSecurityState(Category, WebsiteName);
        }

        var getWebsiteIdByName = function (Category, Name) {

            for (var i = 0; i < _websites.length; i++) {
                if (_websites[i].category == Category &&
                    Helper.StringStartsWith(Name, _websites[i].name) &&
                    _websites[i].visible) {
                    return i;
                }
            }

            return -1;
        }

        this.ReloadActivePage = function () {

            ShowPage(lastPageID, true);
        }

        var ShowPage = function (ID, bLoadSamePage) {

            if (ID == undefined) { return; }
            if (ID < 0) { return; }
            if (ID >= _websites.length) { return; }

            if (bLoadSamePage == undefined) { bLoadSamePage = false; }

            activateSubNavigation(_websites[ID].name);

            if (ID != lastPageID ||     // do not load the same page again
                bLoadSamePage) {        // ...except for the case...

                ErrorQueue.ClearErrorQueue();   // Clear errors that occurred in other pages, before
                
                StopCurrentPage();
                _websites[ID].ShowPage();

                lastPageID = ID;
            }
        }

        var StopCurrentPage = function () {

            if (lastPageID == undefined) { return; }
            if (lastPageID < 0) { return; }
            if (lastPageID >= _websites.length) { return; }

            _websites[lastPageID].Stop();

            lastPageID = undefined;
        }


        ////////////////////////////////////////////////////////////////////////////////
        // SOAP
        //////////////////////////////////////////////////////////////////////////////

        var createXMLHttpObject = function () {

            try {
                return new XMLHttpRequest();
            }
            catch (e) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");  // MS Internet Explorer (ab v6)
                }
                catch (e) {
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP"); // MS Internet Explorer (ab v5)
                    }
                    catch (e) {
                        return null;
                    }
                }
            }

        }

        var SoapRequest = function (requestData, method, _callback) {

            var _req = null;

            var timeoutID = undefined;
            var timeoutTime = 20000;
            var requestAborted = false;

            var dateStart = new Date();
            var requestStart = dateStart.getTime();

            var getRequestDuration = function () {

                var dateEnd = new Date();
                return dateEnd.getTime() - requestStart;
            }

            this.Start = function () {

                dateStart = new Date();
                requestStart = dateStart.getTime();

                _req = createXMLHttpObject();

                if (_req == null) {

                    // ActiveX
                    var soap_resp = new dataStream.Response(true,
                                                                new dataStream.RequestError(
                                                                    0x80050010,
                                                                    CommunicationModule_ERROR.ErrorCodeToErrorMessage(0x80050010)),
                                                                undefined,
                                                                false);


                    if (_callback != undefined && typeof _callback == 'function') _callback(soap_resp);

                    return;
                }

                if (tcbsd) {
                    device_url = "./MdpWebService/MdpWebService.dll";
                }
                else {
                    device_url = "/MdpWebService/MdpWebService.dll";
                }

                _req.open("POST", device_url, true);
                _req.setRequestHeader("SOAPAction", "urn:beckhoff.com:service:cxconfig:1#" + method);
                _req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                _req.setRequestHeader("dataType", "text/xml");
                _req.onreadystatechange = Response;

                // set timeout
                requestAborted = false;
                timeoutID = setTimeout(timeoutFunc, timeoutTime);
                _req.send(requestData);
            }

            var timeoutFunc = function () {

                if (_req != null && _req.readyState != 4) {

                    // timout function raised and the request has not finished yet
                    // cancel the request and raise the callback function
                    requestAborted = true;
                    _req.abort();

                    var soap_resp = new dataStream.Response(true,
                                                                new dataStream.RequestError(
                                                                    0x80050011,
                                                                    CommunicationModule_ERROR.ErrorCodeToErrorMessage(0x80050011)),
                                                                undefined,
                                                                false);


                    if (_callback != undefined && typeof _callback == 'function') _callback(soap_resp);

                    SoapQueue.RequestFinished(getRequestDuration(), "timed out");

                    _req.onreadystatechange = null;
                    _req = null;
                }

            }

            var Response = function () {

                if (_req != null && _req.readyState == 4 && !requestAborted) {

                    // stop the timeout
                    if (timeoutID) { clearTimeout(timeoutID); }

                    var soap_resp;

                    if (_req.status == 200) {

                        try {
                            
                            if (_req.responseXML != null ||
                                _req.responseXML.documentElement != null) {

                                sSoapResponse = _req.responseXML.documentElement;

                                var faultCodeNodes = sSoapResponse.getElementsByTagName('faultcode');
                                if (faultCodeNodes.length != 0) {

                                    var sFaultCode = "";
                                    if (faultCodeNodes[0].textContent) {
                                        sFaultCode = faultCodeNodes[0].textContent;
                                    }
                                    else if (faultCodeNodes[0].text) {
                                        sFaultCode = faultCodeNodes[0].text;
                                    }

                                    var nFaultCode = 0;
                                    if (!isNaN(sFaultCode)) {
                                        nFaultCode = Number(sFaultCode) >>> 0;
                                    }

                                    soap_resp = new dataStream.Response(true,
                                                                        new dataStream.RequestError(
                                                                            nFaultCode,
                                                                            CommunicationModule_ERROR.ErrorCodeToErrorMessage(nFaultCode)),
                                                                            undefined,
                                                                            false);

                                }
                                else {
                                    var ppDataNodes = sSoapResponse.getElementsByTagName('ppData');
                                    var ppRdDataNodes = sSoapResponse.getElementsByTagName('ppRdData');

                                    var soapData = "";
                                    if (ppDataNodes.length != 0) {
                                        //read
                                        for (var i = 0; i < ppDataNodes[0].childNodes.length; i++) {
                                            soapData += ppDataNodes[0].childNodes[i].data;
                                        }
                                    } else if (ppRdDataNodes.length != 0) {
                                        // readwrite
                                        for (var i = 0; i < ppRdDataNodes[0].childNodes.length; i++) {
                                            soapData += ppRdDataNodes[0].childNodes[i].data;
                                        }
                                    }

                                    soap_resp = new dataStream.Response(false,
                                                                    undefined,
                                                                    new dataStream.DataReader(soapData),
                                                                    false);
                                }
                            }
                            else {


                                soap_resp = new dataStream.Response(true,
                                                                            new dataStream.RequestError(
                                                                                0x80050013,
                                                                                CommunicationModule_ERROR.ErrorCodeToErrorMessage(0x80050013)),
                                                                            undefined,
                                                                            false);
                            }
                        }
                        catch (e) {

                            soap_resp = new dataStream.Response(true,
                                                                        new dataStream.RequestError(
                                                                            0x80050013,
                                                                            CommunicationModule_ERROR.ErrorCodeToErrorMessage(0x80050013)),
                                                                        undefined,
                                                                        false);

                        }

                    }
                    else {

                        soap_resp = new dataStream.Response(true,
                                                                new dataStream.RequestError(
                                                                    _req.status,
                                                                    _req.statusText),
                                                                undefined,
                                                                false);
                    }

                    if (_callback != undefined && typeof _callback == 'function') _callback(soap_resp);
                    
                    SoapQueue.RequestFinished(getRequestDuration(), _req.status);

                    _req.onreadystatechange = null;
                    _req = null;
                }
            }
        }


        ////////////////////////////////////////////////////////////////////////////////
        // SOAP Queue
        //////////////////////////////////////////////////////////////////////////////

        this.getSoapQueue = function () {
            return SoapQueue;
        }

        var SoapQueue = new function () {

            var Requests = [];
            var RequestsMax = 50;   // size of Request Array

            var RequestMaxCount = 1;   // max running requests at the same time          //window.Helper.getMaxSoapRequestsCount();
            var RequestCount = 0;      // currently running requests

            // returns false, if the maximum amount of requests is reached
            this.AddRequest = function (requestData, method, Response) {

                if (Requests.length <= RequestsMax) {

                    Requests.push(new SoapRequest(requestData, method, Response));

                    // Try to start the next Request
                    StartNext();

                    return true;
                }
                else {
                    return false;
                }

            }

            this.RequestFinished = function (requestDuration, result) {

                if (RequestCount > 0) {

                    // !DEBUG!
                    //window.DebugPrint("=> In  | requestDuration: " + requestDuration + " | result: " + result);

                    RequestCount--;
                    // Try to start the next Request
                    // if RequestMaxCount was reached before there will be an open request, now
                    StartNext();
                }
            }

            var StartNext = function () {

                if (RequestCount < RequestMaxCount && Requests.length > 0) {

                    var NextRequest = Requests.shift();
                    NextRequest.Start();

                    RequestCount++;
                    
                    // !DEBUG!
                    //if (lastPageID != undefined) { window.DebugPrint("Page: " + _websites[lastPageID].category + "\\" + _websites[lastPageID].name); }
                    //window.DebugPrint("<= Out | RequestCount: " + RequestCount + " | Max: " + RequestMaxCount);
                }
            }
        }


        this.getErrorQueue = function () {
            return ErrorQueue;
        }

        var ErrorQueue = new function () {

            var errorActive = false;
            var errors = [];

            this.AddError = function (errorCode, errorMessage, occurrenceMax) {

                if (errorCode != undefined) {

                    errorCode = CommunicationModule_ERROR.ErrorCodeDisplay(errorCode);
                    if (Helper.DisplayError(errorCode)) {

                        if (errorMessage == undefined) {
                            // try to find an error message
                            errorMessage = CommunicationModule_ERROR.ErrorCodeToErrorMessage(errorCode);
                        }

                        if (occurrenceMax == undefined) {
                            occurrenceMax = 1;
                        }

                        if (!ErrorExists(errorCode)) {
                            errors.push(new Defines.UniversalError(errorCode, errorMessage, occurrenceMax));
                        }

                        if (!errorActive) {
                            ShowNextError();
                        }
                    }
                }
            }

            this.ClearErrorQueue = function () {

                // Clear Array 
                while (errors.length > 0) {
                    errors.pop();
                }
            }

            // Checks if the error "errorCode" already exists in the array
            // increments the occurrence of an error 
            var ErrorExists = function (errorCode) {

                for (var i = 0; i < errors.length; i++) {
                    if (errors[i].errorCode == errorCode) {

                        errors[i].errorOccurrenceCount++;
                        return true;
                    }
                }

                return false;
            }

            var ShowNextError = function () {

                var errorIdx = -1;
                for (var i = 0; i < errors.length; i++) {
                    if (errors[i].errorOccurrenceCount >= errors[i].errorOccurrenceMax) {
                        errorIdx = i;
                    }
                }

                if (errorIdx > -1) {

                    Helper.HideLoading();
                    errorActive = true;

                    var message = "";
                    var errType = CommunicationModule_ERROR.GetErrorTypeStr(errors[errorIdx].errorCode);
                    if (errType == "") {
                        message = "Error: ";
                    }
                    else {
                        message = "Error (" + errType + "): ";
                    }
                    message += errors[errorIdx].errorMessage;

                    var button = '<button id="Btn_closeError">OK</button>'
                    var errorDiv = '<div class="ErrorDiv"><div class="Message">' + message + '<br/>' + button + '</div></div>';

                    try {

                        document.getElementById("OverlayError").style.zIndex = 101;
                        document.getElementById("OverlayError").innerHTML = errorDiv;

                        document.getElementById("Btn_closeError").onclick = function (errorIndex) { return function () { ErrorMessageClose(errorIndex); } }(errorIdx);
                    }
                    catch (e) { }
                }
            }

            var ErrorMessageClose = function (errorIndex) {

                errors.splice(errorIndex, 1);
                errorActive = false;

                // Hide the error overlay-div
                try {
                    document.getElementById("OverlayError").style.zIndex = -1;
                    document.getElementById("OverlayError").innerHTML = "";
                }
                catch (e) { }

                if (errors.length > 0) {
                    ShowNextError();
                }
            }

        }

        // Productversion
        window.ProductName = "BECKHOFF Device Manager";
        window.ProductMajor = 2;
        window.ProductMinor = 0;
        window.ProductRevision = 3;
        window.ProductBuild = 3;

    })

    // Expose DeviceManager (DevMan) instance to window object !!!
    window.DevMan = DevMan;

    /*  !DEBUG!
    window.DebugPrint = function (msg) {
        if (console != null) {
            console.log(msg);
        }
    }
    */

})(window);