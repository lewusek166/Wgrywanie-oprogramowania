(function (window) {

    // namespace
    var Page_Template = new (function () {

        this.Template = function () {

            this.name = "";
            this.category = "";
            this.subnavigationicon = "";
            this.visible = false;

            var doc = null;
            var activePageObj = null;

            var pageStop = true;
            var lastTimeoutHandle = 0; // the last setTimeout handle
            var IntervalTime = 2000; // ms
            var pageInitialized = false;

            var communicationObj = undefined;

            var RequestParamIDs = [];
            var RequestErrors = [];
            var ActiveRequestsCount = new Helper.CActiveRequestCount();
            
            // this array (Lock[]) specifies if a control (@ position Lock[i]) is locked and must not be overwritten by OnDisplayValues
            // --> So always use setElementValue (specified in this class) in a page to refresh a parameters value!!!
            var Lock = [];

            //////////////////////////////////////////////////////////////////
            // Events
            ///////////////////////////////////////////////////////////////
            var OnInitStaticPage = undefined;
            var OnDisplayValues = undefined;

            var OnWriteFailed = undefined;
            var OnWriteResult = undefined;

            var OnServiceTransferFailed = undefined;
            var OnServiceTransferResult = undefined;

            //////////////////////////////////////////////////////////////////
            // public getter & setter
            ////////////////////////////////////////////////////////////////
            this.setCycleTime = function (ms) {

                //if (!winxp) {
                //    ms = Math.max(ms, 4000);    // CE - Minimum 4 sek interval
                //}

                IntervalTime = ms;
            };

            this.setCommunicationObj = function (obj) {
                communicationObj = obj;
            };
            this.getCommunicationObj = function () {
                return communicationObj;
            };

            this.setRequestParamIDs = function (paramIDs) {
                RequestParamIDs = paramIDs;
            };
            this.getRequestParamIDs = function () {
                return RequestParamIDs;
            };

            this.setResponseData = function (responseData) {
                RequestResponse = responseData;
            };

            this.setPageInitialized = function (Status) {
                pageInitialized = Status;
            };

            // events
            this.setOnInitStaticPage = function (callback) {
                OnInitStaticPage = callback;
            };
            this.setOnDisplayValues = function (callback) {
                OnDisplayValues = callback;
            };

            this.setOnServiceTransferFailed = function (callback) {
                OnServiceTransferFailed = callback;
            };
            this.setOnServiceTransferResult = function (callback) {
                OnServiceTransferResult = callback;
            };

            this.setOnWriteFailed = function (callback) {
                OnWriteFailed = callback;
            };
            this.setOnWriteResult = function (callback) {
                OnWriteResult = callback;
            };


            this.ShowPage = function () {

                pageStop = false;
                initInternal();     // initialize properties
                initErrorPage();    // Create a status-div for errors, etc.

                showLoading("status");
                initTimer();        // Read Values every x seconds
            };

            var initInternal = function () {

                doc = document;
                activePageObj = doc.getElementById('ActivePage');
                pageInitialized = false;

                RequestResponse = undefined;
                ActiveRequestsCount.Init();
                clearLocks();   // Lock = [];
            };

            var initErrorPage = function () {

                // div for errors, etc.
                writeActivePage('<div id="status"></div>');
            };

            var initTimer = function () {

                // this method creates a request with all parameters.
                // the request response will call the function displayValues
                // --> in that method the timer will be set when the request was successfull
                // --> if it was not successfull, the error handler will call refreshAllParameters as long as an error occurs
                refreshAllParameters();
            };

            this.Stop = function () {

                pageStop = true;

                if (lastTimeoutHandle > 0) {
                    clearTimeout(lastTimeoutHandle);
                    lastTimeoutHandle = 0;
                }

                clearPage();
            };

            this.ChangePage = function (Category, WebsiteName) {

                window.DevMan.ChangePage(Category, WebsiteName);
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //  overrides
            ///////////////////////////////////////////////////////////////////////////////////

            this.Init = function () {

                // override in page_X.js
                return false;
            };


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //  Input Locks
            //
            //  If a user would change a cyclic refreshed value, his changes will be overwritten with every cyclic read.
            //  If a control implements a lock listener, the control gets locked when it gets the focus or the value is changed by the user.
            //  The cyclic read will not override the value of the control as long as the control is locked.
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            this.addLockListener = function (controlName) {

                try
                {
                    var control = document.getElementById(controlName);
                    if (control) {
                        if (control.tagName == "SELECT") {
                            setElementOnFocus(controlName, function (_controlName) { return function () { OnLockCombobox(_controlName); }; }(controlName));
                            setElementOnChange(controlName, function (_controlName) { return function () { OnChangeCombobox(_controlName); }; }(controlName));
                        }
                        else {
                            setElementOnFocus(controlName, function (_controlName) { return function () { OnLockElement(_controlName); }; }(controlName));
                        }
                    }
                }
                catch (e) { }
            };
            var OnLockElement = function (controlName) {
                if (!isLocked(controlName)) {
                    Lock.push(controlName);
                    var elem = doc.getElementById(controlName)
                    if (elem != null) {
                        elem.style.background = "#FFFAF0"; // FloralWhite
                    }
                }
            };
            var OnLockCombobox = function (controlName) {
                if (!isLocked(controlName)) {
                    Lock.push(controlName);
                }
            };
            var OnChangeCombobox = function (controlName) {
                var elem = doc.getElementById(controlName);
                if (elem != null) {
                    elem.style.background = "#FFFAF0";  // FloralWhite
                }
            };

            this.isLocked = function (controlName) {
                return isLocked(controlName);
            };
            this.removeLock = function (controlName) {
                if (removeLock(controlName)) {
                    refreshCyclicParameters();
                }
            };
            this.clearLocks = function () {
                clearLocks();
                refreshCyclicParameters();
            };
            var isLocked = function (controlName) {
                for (var i = 0; i < Lock.length; i++) {
                    if (Lock[i] == controlName) {
                        return true;
                    }
                }
                return false;
            };
            var removeLock = function (controlName) {
                for (var i = 0; i < Lock.length; i++) {
                    if (Lock[i] == controlName) {
                        Lock.splice(i, 1);
                        var elem = doc.getElementById(controlName);
                        if (elem != null) {
                            doc.getElementById(controlName).style.background = "";
                            return true;
                        }
                    }
                }
                return false;
            };
            var clearLocks = function () {
                while (Lock.length > 0) {
                    if (!removeLock(Lock[0])) {
                        Lock.pop(); // if control was not removed in removeLock, just pop this entry -> no infinite loop
                    }
                }
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //  write innerHTML helper
            ///////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            // public Methods
            ///////////////////////////////////////////////////////////////////////////////////
            this.showLoading = function (targetDiv) {
                showLoading(targetDiv);
            };
            this.writeStatus = function (Text) {
                writeStatus(Text);
            };
            this.writeActivePage = function (Text) {
                writeActivePage(Text);
            };
            this.readElement = function (ElementID) {
                return readElement(ElementID);
            };
            this.writeElement = function (ElementID, Text) {
                writeElement(ElementID, Text);
            };
            this.getElementValue = function (ElementID) {
                return getElementValue(ElementID);
            };
            this.setElementValue = function (ElementID, Value) {
                return setElementValue(ElementID, Value);
            };
            this.getElementText = function (ElementID) {
                return getElementText(ElementID);
            };
            this.clearPage = function () {
                clearPage();
            };

            this.getCheckedRadioButtonValue = function (RadioButtonGroup) {
                return getCheckedRadioButtonValue(RadioButtonGroup);
            };
            this.getElementChecked = function (ElementID) {
                return getElementChecked(ElementID);
            };
            this.setElementChecked = function (ElementID) {
                return setElementChecked(ElementID);
            };
            this.setElementUnchecked = function (ElementID) {
                return setElementUnchecked(ElementID);
            };
            this.setElementDisabled = function (ElementID, Disabled) {
                return setElementDisabled(ElementID, Disabled);
            };
            this.setElementOnClick = function (ElementID, OnClick) {
                return setElementOnClick(ElementID, OnClick);
            };
            this.setElementOnChange = function (ElementID, OnChange) {
                return setElementOnChange(ElementID, OnChange);
            };
            this.setElementOnKeyUp = function (ElementID, OnKeyUp) {
                return setElementOnKeyUp(ElementID, OnKeyUp);
            };
            this.setElementClass = function (ElementID, ElementClass) {
                return setElementClass(ElementID, ElementClass);
            };
            this.scrollToElement = function (ElementID) {
                return scrollToElement(ElementID);
            };
            this.getElementSelectedIndex = function (ElementID) {
                return getElementSelectedIndex(ElementID);
            };


            //////////////////////////////////////////////////////////////////////////////////////
            // private Methods
            ///////////////////////////////////////////////////////////////////////////////////
            var showLoading = function (targetDiv) {
                var loadingHTML = "";
                loadingHTML += '<div id="">';
                loadingHTML += '    <img id="" alt="" src="res/website/other/loading.gif"/>';
                loadingHTML += '</div>';

                // dont change the innerHtml if there is already a loding icon in the target div
                // -> the gif would start its animation from beginning!
                var targetInnerHtml = readElement(targetDiv);
                if (targetInnerHtml.indexOf("res/website/other/loading.gif") == -1) {
                    writeElement(targetDiv, loadingHTML);
                }
            };
            var clearLoading = function (targetDiv) {
                var targetInnerHtml = readElement(targetDiv);
                if (targetInnerHtml.indexOf("res/website/other/loading.gif") >= 0) {
                    writeElement(targetDiv, "");
                }
            };

            // change innerHTML of div 'ActivePage' and its child 'status' by the local variable activePageObj (performance)
            var writeActivePage = function (Text) {
                try {
                    activePageObj.innerHTML = Text;
                }
                catch (e) { };
            };
            var writeStatus = function (Text) {
                try {
                    activePageObj.children['status'].innerHTML = Text;
                }
                catch (e) { };
            };


            // change innerHTML of any child of ActivePage by the copy of the global document => doc (performance)
            var readElement = function (ElementID) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    return elem.innerHTML;
                }
                return "";
            };
            var writeElement = function (ElementID, Text) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    // Change content only if data has changed
                    if (elem.innerHTML.toString() != Text.toString()) {
                        elem.innerHTML = Text;
                    }
                }
            };
            
            var getElementText = function (ElementID) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    return elem.value;
                }
                return "";
            };
            var getElementValue = function (ElementID) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    return window.Helper.escapeHtml(elem.value); // escape userinput
                }
                return "";
            };
            var setElementValue = function (ElementID, Value) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    if (!isLocked(ElementID)) {
                        if (elem.value.toString() != Value.toString()) {
                            elem.value = Value;
                        }
                    }
                    return true;
                }
                return false;
            };

            var clearPage = function () {
                initErrorPage();    // ActivePage + status div
            };

            var getCheckedRadioButtonValue = function (RadioButtonGroup) {
                try {
                    var radioBtns = doc.getElementsByName(RadioButtonGroup);
                    for (var i = 0; i < radioBtns.length; i++) {
                        if (radioBtns[i].checked) {
                            return radioBtns[i].value;
                        }
                    }
                    return 0;
                }
                catch (e) { return 0; }
            };
            var getElementChecked = function (ElementID) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    return elem.checked;
                }
                return 0;
            };
            var setElementChecked = function (ElementID) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    if (!isLocked(ElementID)) {
                        elem.checked = true;
                    }
                    return true;
                }
                return false;
            };
            var setElementUnchecked = function (ElementID) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    if (!isLocked(ElementID)) {
                        elem.checked = false;
                    }
                    return true;
                }
                return false;
            };
            var setElementDisabled = function (ElementID, Disabled) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    elem.disabled = Disabled;
                    return true;
                }
                return false;
            };
            var setElementOnClick = function (ElementID, OnClick) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    elem.onclick = OnClick;
                    return true;
                }
                return false;
            };
            var setElementOnFocus = function (ElementID, OnFocus) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    elem.onfocus = OnFocus;
                    return true;
                }
                return false;
            };
            var setElementOnChange = function (ElementID, OnChange) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    elem.onchange = OnChange;
                    return true;
                }
                return false;
            };
            var setElementOnKeyUp = function (ElementID, OnKeyUp) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    elem.onkeyup = OnKeyUp;
                    return true;
                }
                return false;
            };
            var setElementClass = function (ElementID, ElementClass) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    elem.className = ElementClass;
                    return true;
                }
                return false;
            };
            var scrollToElement = function (ElementID) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    elem.scrollIntoView();
                    return true;
                }
                return false;
            };
            var getElementSelectedIndex = function (ElementID) {
                var elem = doc.getElementById(ElementID);
                if (elem != null) {
                    return elem.selectedIndex;
                }
                return 0;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //  ReadRequest-operations
            ///////////////////////////////////////////////////////////////////////////////////

            // Check if mdp contains the specific module
            // Returns the amount of modules of the given type "paramName"
            var getModuleItemCount = function (paramName) {
                if (communicationObj != undefined) {
                    return communicationObj.getModuleItemCount(paramName);
                }
                else {
                    return 0;
                }
            };

            this.addParameter = function (paramName, bCyclic) {

                var moduleCount = getModuleItemCount(paramName);

                // enable the visibility of the page, if any module is available in mdp
                if (!this.visible) {
                    this.visible = (moduleCount > 0);
                }

                // Add all parameters, even if the module is not available!
                // So the parameters will always have the same IDs!!!
                var reqParamIDsLen = RequestParamIDs.push(new Defines.RequestParameter(paramName, bCyclic, moduleCount));

                return reqParamIDsLen - 1;
            };

            var displayValues = function () {

                if (pageStop) {
                    return;
                }

                if (ActiveRequestsCount.RequestsFinished()) {

                    // Try to find a RequestResponse with error
                    if (RequestErrors.length > 0) {

                        // Display the first error
                        window.DevMan.getErrorQueue().AddError(RequestErrors[0].requestStatus, RequestErrors[0].requestStatusText, 3);

                        // try to read all parameters again, after the same time as the cyclic refresh would happen 
                        setTimeout(refreshAllParameters, IntervalTime);
                    }
                    else {

                        if (!pageInitialized) {

                            // first time the request was successfull
                            if (OnInitStaticPage != undefined) {
                                pageInitialized = OnInitStaticPage(RequestParamIDs);
                            }
                        }

                        // If page was successfully initialized before
                        if (pageInitialized) {

                            clearLoading("status"); // hide loading

                            if (OnDisplayValues != undefined) {
                                OnDisplayValues(RequestParamIDs);
                            }
                        }

                        lastTimeoutHandle = setTimeout(refreshCyclicParameters, IntervalTime);
                    }
                }
                else {

                    if (!pageInitialized) {
                        showLoading("status");  // just wait for the next response and show the small loding icon
                    }
                }
            };


            var ClearCurrentTimeout = function () {

                // ! very important !
                // -> The function getValues is automatically called after "IntervalTime"-seconds.
                //    it is also called after a write-process or a service-transfer!
                //    so if the current timeout is not cleared, another parallel-timeout will be created for every call of getValues !!!

                if (lastTimeoutHandle > 0) {
                    clearTimeout(lastTimeoutHandle);
                    lastTimeoutHandle = 0;
                }
            };

            var refreshAllParameters = function () {

                ClearCurrentTimeout();
                getValues(false);
            };

            var refreshCyclicParameters = function () {

                ClearCurrentTimeout();
                getValues(true);
            };
            
            //////////////////////////////////////////////////////////////////////////////////////
            //  Read-Requests
            ///////////////////////////////////////////////////////////////////////////////////

            var getValues = function (CyclicOnly) {

                // Clear Array 
                while (RequestErrors.length > 0) {
                    RequestErrors.pop();
                }

                var CurrentRequestParamIDs = [];

                for (var i = 0; i < RequestParamIDs.length; i++) {

                    if (RequestParamIDs[i].cyclic && CyclicOnly || !CyclicOnly) {
                        CurrentRequestParamIDs.push(RequestParamIDs[i].parameterName);
                    }
                }

                if (CurrentRequestParamIDs.length > 0) {

                    var Request = new communicationObj.Request(CurrentRequestParamIDs, Response);
                    if (Request.Start()) {
                        // the request was successfully added to the SOAP Queue
                        ActiveRequestsCount.Increment();
                    }
                }

            };

            var getParameterPosition = function (paramName) {

                for (var i = 0; i < RequestParamIDs.length; i++) {

                    if (paramName == RequestParamIDs[i].parameterName) {

                        return i;
                    }
                }

                return -1;
            };

            var Response = function (DeviceManagerResponse) {

                ActiveRequestsCount.Decrement();

                // Gather Errors of SOAP-Requests
                if (DeviceManagerResponse.hasError) {
                    RequestErrors.push(DeviceManagerResponse.error);
                }

                if (!DeviceManagerResponse.hasError && !DeviceManagerResponse.isBusy) {

                    var ModuleValueInfos = DeviceManagerResponse.data;

                    for (var i = 0; i < ModuleValueInfos.length; i++) {
                        
                        if (ModuleValueInfos[i].value.length > 0 &&
                            ModuleValueInfos[i].value[0].constructor == window.Defines.ArrayInfo) {

                            var paramName = ModuleValueInfos[i].parameterName; // Name of Parameter
                            var responsePosition = getParameterPosition(paramName);
                            if (responsePosition >= 0) {

                                // RequestParamIDs[responsePosition].clearValues();

                                for (var j = 0; j < ModuleValueInfos[i].value.length; j++) {

                                    if (ModuleValueInfos[i].value[j].length == 0) {

                                        // array-module does not contain any data
                                        RequestParamIDs[responsePosition].isArray = true;
                                        RequestParamIDs[responsePosition].values[j] = new Array();
                                    }
                                    else {

                                        var ArrayRequest = new communicationObj.ArrayRequest(ModuleValueInfos[i].value[j], ArrayResponse);
                                        if (ArrayRequest.Start()) {
                                            // the request was successfully added to the SOAP Queue
                                            ActiveRequestsCount.Increment();
                                        }
                                    }
                                }

                            }
                        }
                        else {

                            var paramName = ModuleValueInfos[i].parameterName; // Name of Parameter
                            var responsePosition = getParameterPosition(paramName);
                            if (responsePosition >= 0) {

                                RequestParamIDs[responsePosition].clearValues();

                                if (ModuleValueInfos[i].value.length == 0) {

                                    // mdp-module did not exist, so add the error NOT SUPPORTED
                                    RequestParamIDs[responsePosition].values.push(new Defines.ResponseInfo("", 0xECA61000));
                                }
                                else {

                                    for (var j = 0; j < ModuleValueInfos[i].value.length; j++) {

                                        RequestParamIDs[responsePosition].values.push(
                                            new Defines.ResponseInfo(ModuleValueInfos[i].value[j],
                                                                     ModuleValueInfos[i].error[j]));
                                    }
                                }
                            }
                        }
                    }
                }

                displayValues();
            };

            var ArrayResponse = function (DeviceManagerResponse) {

                ActiveRequestsCount.Decrement();

                // Gather Errors of SOAP-Requests
                if (DeviceManagerResponse.hasError) {
                    RequestErrors.push(DeviceManagerResponse.error);
                }

                if (!DeviceManagerResponse.hasError) {

                    var ModuleValueInfo = DeviceManagerResponse.data;

                    // Store the ArrayData in the ResponseData-Array at the correct idx!
                    var paramName = ModuleValueInfo.parameterName.name;
                    var responsePosition = getParameterPosition(paramName);
                    if (responsePosition >= 0) {

                        //RequestParamIDs[responsePosition].clearValues();
                        RequestParamIDs[responsePosition].isArray = true;

                        var SubArray = new Array();
                        for (var j = 0; j < ModuleValueInfo.value.length; j++) {

                            SubArray.push(new Defines.ResponseInfo(
                                                        ModuleValueInfo.value[j],
                                                        ModuleValueInfo.error[j]));
                        }

                        // Check that the array "values" does not contain any undefined fields
                        for (var j = 0; j <= ModuleValueInfo.parameterName.id; j++) {
                            if (RequestParamIDs[responsePosition].values[j] == undefined) {
                                RequestParamIDs[responsePosition].values[j] = new Array();
                            }
                        }

                        RequestParamIDs[responsePosition].values[ModuleValueInfo.parameterName.id] = SubArray;
                    }

                }

                displayValues();
            };


            //////////////////////////////////////////////////////////////////////////////////////
            //  Service Transfers
            ///////////////////////////////////////////////////////////////////////////////////

            this.executeCommand = function (CommandParamID, idx, paramValues) {

                var command = new communicationObj.SingleCommand(CommandParamID, idx, paramValues, CommandResponse);
                command.Start();
            };

            var CommandResponse = function (Response) {

                if (Response.isBusy) {

                    // Communication module was too busy for the service transfer ...handle this case as error!
                    if (OnServiceTransferFailed) {

                        var errorCode = 0x80050020;
                        var errorMessage = CommunicationModule_ERROR.ErrorCodeToErrorMessage(errorCode);
                        OnServiceTransferFailed(new dataStream.Error(errorMessage, errorCode, undefined));
                    }
                }
                else if (Response.hasError) {

                    // The servicetransfer-REQUEST could not be sent!
                    if (OnServiceTransferFailed) {
                        OnServiceTransferFailed(Response.error);
                    }
                }
                else if (!Response.hasError) {

                    refreshCyclicParameters();

                    var serviceTransferResponse = Response.data;

                    // The servicetransfer-REQUEST was successfull.
                    // --> This does not mean that the servicetransfer was successfull, too!!!
                    if (OnServiceTransferResult) {
                        OnServiceTransferResult(serviceTransferResponse);
                    }
                }
            };



            ////////////////////////////////////////////////////////////////////////////////////
            //  Write-Requests
            /////////////////////////////////////////////////////////////////////////////////

            this.Write = function (writeParams, idxs, writeValues) {

                var Writer = new communicationObj.Writer(writeParams, idxs, writeValues, WriteResponse);
                Writer.Start();
            };

            this.WriteArray = function (writeParams, idxs, arrayIdxs, writeValues) {

                var ArrayWriter = new communicationObj.ArrayWriter(writeParams, idxs, arrayIdxs, writeValues, WriteResponse);
                ArrayWriter.Start();
            };

            var WriteResponse = function (Response) {

                if (Response.isBusy) {

                    // Communication module was too busy for the write request...handle this case as error!
                    if (OnWriteFailed) {

                        var errorCode = 0x80050020;
                        var errorMessage = CommunicationModule_ERROR.ErrorCodeToErrorMessage(errorCode);
                        OnWriteFailed(new dataStream.Error(errorMessage, errorCode, undefined));
                    }
                }
                else if (Response.hasError) {

                    // The write-REQUEST could not be sent!
                    if (OnWriteFailed != undefined) {
                        OnWriteFailed(Response.error);
                    }
                }
                else if (!Response.hasError) {

                    refreshCyclicParameters();

                    var WriteResponse = Response.data;

                    // The write-REQUEST was successfull.
                    // --> This does not mean that the write-operation was successfull, too!!!
                    // ----> the error codes of the write-response specify wether a value could be set or not
                    if (OnWriteResult != undefined) {
                        OnWriteResult(WriteResponse.moduleItemsWritten, WriteResponse.errorCodes);
                    }
                }
            };
        }

    });

    // Expose instance to window object !!!
    window.Page_Template = Page_Template;

})(window);