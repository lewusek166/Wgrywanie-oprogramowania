(function (window) {

    // namespace
    var CommunicationModule_MDP = new (function () {

        // class
        this.MDP = new function () {

            ///////////////////////////////////////////////////////////////////////////
            // Variables
            ////////////////////////////////////////////////////////////////////////

            this.communicationtype = window.DevMan.CommunicationType.mdp;

            this.getState = function () {
                return _ModuleContainer.getRequest();
            }


            ///////////////////////////////////////////////////////////////////////////
            // private Methods
            ////////////////////////////////////////////////////////////////////////
            var GetModuleItemsByParamName = function (paramName) {

                var RetVal = [];

                var ModuleListObj = _ModuleContainer.getModuleListObj();
                if (ModuleListObj == undefined) { return RetVal; }

                var ModuleList = ModuleListObj.getModules();
                if (ModuleList == undefined) { return RetVal; }

                for (var i = 0; i < ModuleList.length; i++) {

                    // compare paramId
                    if (ModuleList[i].name == paramName) {
                        RetVal.push(ModuleList[i]);
                    }
                }

                return RetVal;
            }

            var GetModuleItemByParamNameAndIdx = function (paramName, idx) {

                var ModuleList = _ModuleContainer.getModuleListObj().getModules();
                if (ModuleList == undefined) { return undefined; }

                for (var i = 0; i < ModuleList.length; i++) {

                    // compare paramId and idx
                    if (ModuleList[i].name == paramName && ModuleList[i].id == idx) {
                        return ModuleList[i];
                    }
                }

                return undefined;
            }

            var CreateAjaxQuery = function (method, tags, values) {

                var srData = '<?xml version=\"1.0\" encoding="utf-8"?>'
                    + '<s:Envelope s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">'
                    + '<s:Body>'
                    + '<u:' + method + ' xmlns:u=\"urn:beckhoff.com:service:cxconfig:1\">';

                if (tags) {

                    for (var i = 0; i < tags.length; i++) {

                        srData += "<" + tags[i] + ">" + values[i] + "</" + tags[i] + ">";
                    }
                }

                srData += '</u:' + method + '>'
                       + '</s:Body>'
                       + '</s:Envelope>';

                return srData;
            }

            var getMDPOffset = function (Index, SubIndex, Flags) {
                return Index << 16 | Flags << 8 | SubIndex;
            }


            ///////////////////////////////////////////////////////////////////////////
            // public Methods
            ////////////////////////////////////////////////////////////////////////

            this.getModuleItemCount = function (paramName) {

                var ModuleItems = GetModuleItemsByParamName(paramName);

                if (ModuleItems != undefined) {
                    return ModuleItems.length;
                }

                return 0;
            }

            this.getServiceTransferParameterSize = function (serviceTransferName) {

                var ModuleItems = GetModuleItemsByParamName(serviceTransferName);
                if (ModuleItems != undefined) {

                    var ServiceTransferParametersSize = 0;

                    for (var j = 0; j < ModuleItems[0].parameters.length; j++) {

                        switch (ModuleItems[0].parameters[j].type) {

                            case "BOOLEAN":
                                ServiceTransferParametersSize += 1;
                                break;

                            case "SIGNED8":
                            case "UNSIGNED8":
                                ServiceTransferParametersSize += 1;
                                break;

                            case "SIGNED16":
                            case "UNSIGNED16":
                                ServiceTransferParametersSize += 2;
                                break;

                            case "SIGNED32":
                            case "UNSIGNED32":
                                ServiceTransferParametersSize += 4;
                                break;

                            case "UNSIGNED64":
                                // not implemented yet
                                break;

                            case "REAL32":
                                ServiceTransferParametersSize += 4;
                                break;

                            case "STRING":
                            case "VISIBLE STRING":
                                // size of string is unknown at this point
                                // it has to be added when the function is called and the length 
                                // of the string-parameter is known
                                ServiceTransferParametersSize += 0;
                                break;

                            case "RAW":
                                // raw-paramater has property "size"
                                ServiceTransferParametersSize += ModuleItems[0].parameters[j].size;
                                break;

                            default:
                                // structs, ...
                                ServiceTransferParametersSize += 0;
                                break;
                        }
                    }

                    return ServiceTransferParametersSize;

                }

                return 0;
            }


            ///////////////////////////////////////////////////////////////////////////
            // Subclasses
            ////////////////////////////////////////////////////////////////////////

            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            //  0xB000-0xBFFF – ServiceTransfer Area
            //  SingleCommand
            //  - executes a ServiceTransfer
            // 
            //  process description:
            //      - The service transfer will be executed
            //      - When the response is received the operation status will be read
            ///////////////////////////////////////////////////////////////////////////////////////////////////

            this.SingleCommand = function (paramName, ModuleIdx, parameterValues, _callback) {

                var _ModuleItem = undefined;

                /// summary
                /// paramID         = function id
                /// ModuleIdx       = id of module (example 2NICs ..use Nic with idx 1)
                /// parameterValues = array of parameter arrays for the function
                this.Start = function () {

                    // Check if ModuleList is prepared

                    if (_ModuleContainer.getRequest().hasError) {

                        DevManResponse = new Defines.Response(true,
                                                                                _ModuleContainer.getRequest().error,
                                                                                undefined,
                                                                                false);

                        if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);

                        return;
                    }

                    if (_ModuleContainer.getRequest().isBusy) {

                        DevManResponse = new Defines.Response(false,
                                                                                undefined,
                                                                                undefined,
                                                                                true);

                        if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);

                        return;
                    }

                    _ModuleItem = GetModuleItemByParamNameAndIdx(paramName, ModuleIdx);
                    if (_ModuleItem != undefined) {

                        var DataWriter = new dataStream.DataWriter();


                        // Calculate size of WriteBuffer
                        var ServiceTransferParametersSize = 0;

                        for (var i = 0; i < _ModuleItem.parameters.length; i++) {

                            var FunctionParameterValue = parameterValues[i];

                            switch (_ModuleItem.parameters[i].type) {

                                case "BOOLEAN":
                                    ServiceTransferParametersSize += 1;
                                    break;

                                case "SIGNED8":
                                case "UNSIGNED8":
                                    ServiceTransferParametersSize += 1;
                                    break;

                                case "SIGNED16":
                                case "UNSIGNED16":
                                    ServiceTransferParametersSize += 2;
                                    break;

                                case "SIGNED32":
                                case "UNSIGNED32":
                                    ServiceTransferParametersSize += 4;
                                    break;

                                case "UNSIGNED64":
                                    // there is no service transfer with ui64 input-values, yet
                                    break;

                                case "REAL32":
                                    ServiceTransferParametersSize += 4;
                                    break;

                                case "STRING":
                                case "VISIBLE STRING":
                                    ServiceTransferParametersSize += FunctionParameterValue.length;
                                    break;

                                case "RAW":
                                    ServiceTransferParametersSize += _ModuleItem.parameters[i].size;
                                    break;

                                default:
                                    // structs, ...
                                    ServiceTransferParametersSize += 0;
                                    break;
                            }

                        }


                        // Group
                        DataWriter.writeDINT(0);

                        // OFFSET
                        DataWriter.writeDINT(getMDPOffset(_ModuleItem.address, _ModuleItem.subIndex, _ModuleItem.flags));

                        // SIZE
                        DataWriter.writeDINT(ServiceTransferParametersSize);


                        for (var i = 0; i < _ModuleItem.parameters.length; i++) {

                            var FunctionParameterValue = parameterValues[i];

                            switch (_ModuleItem.parameters[i].type) {

                                case "BOOLEAN":
                                    DataWriter.writeBOOL(FunctionParameterValue);
                                    break;

                                case "SIGNED8":
                                case "UNSIGNED8":
                                    DataWriter.writeSINT(FunctionParameterValue);
                                    break;

                                case "SIGNED16":
                                case "UNSIGNED16":
                                    DataWriter.writeINT(FunctionParameterValue);
                                    break;

                                case "SIGNED32":
                                case "UNSIGNED32":
                                    DataWriter.writeDINT(FunctionParameterValue);
                                    break;

                                case "UNSIGNED64":
                                    // there is no service transfer with ui64 input-values, yet
                                    break;

                                case "REAL32":
                                    DataWriter.writeREAL(FunctionParameterValue);
                                    break;

                                case "VISIBLE STRING":
                                case "STRING":
                                    DataWriter.writeString(FunctionParameterValue, FunctionParameterValue.length);
                                    break;

                                case "RAW":
                                    DataWriter.writeByteArray(FunctionParameterValue, _ModuleItem.parameters[i].size);
                                    break;

                            }

                        }

                        var method = "ReadWrite";

                        var tags = [];
                        tags.push("netId");
                        tags.push("nPort");
                        tags.push("indexGroup");
                        tags.push("indexOffset");
                        tags.push("cbRdLen");
                        tags.push("pwrData");

                        var values = [];
                        values.push("");
                        values.push("0");
                        values.push(0xF081);    // Write
                        values.push(1);         // Single command
                        values.push(4);         // sizeof UINT32       
                        values.push(DataWriter.getBase64EncodedData());

                        var requestData = CreateAjaxQuery(method, tags, values);
                        return window.DevMan.getSoapQueue().AddRequest(requestData, method, Response);
                    }
                    else {

                        // Unknown ParamID
                        var err = new dataStream.RequestError(-1, "Unknown Function");

                        DevManResponse = new Defines.Response(true,
                                                                err,
                                                                undefined,
                                                                false);

                        if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);
                    }
                }

                var Response = function () {

                    // Command was sent to mdp
                    // Check the ExecutionState, now
                    ReadOperationStatus();
                }

                var ReadOperationStatus = function () {

                    // Every function has a FunctionName + "_State" and + "_Result" ID
                    // State = executionstate 
                    // Result = ErrorMessage, data, etc.
                    var ParamIDs = [];
                    ParamIDs.push(_ModuleItem.name + "_State");
                    ParamIDs.push(_ModuleItem.name + "_Result");

                    var statusRequest = new CommunicationModule_MDP.MDP.Request(ParamIDs, OperationStatusResponse);
                    statusRequest.Start();
                }

                var OperationStatusResponse = function (DeviceManagerResponse) {

                    var DevManResponse = undefined;

                    if (!DeviceManagerResponse.hasError) {

                        var serviceTransferResponse = new Defines.ServiceTransferResponse();
                        serviceTransferResponse.moduleItem = _ModuleItem;

                        var executionState = DeviceManagerResponse.data[0].value[ModuleIdx];

                        if (DeviceManagerResponse.data[1].error[ModuleIdx] != 0) {

                            // data could not be delivered: handle like ST_RES_ERRRES
                            serviceTransferResponse.hasError = true;
                            serviceTransferResponse.hasResult = true;
                            serviceTransferResponse.errCode = DeviceManagerResponse.data[1].error[ModuleIdx];

                            DevManResponse = new Defines.Response(false,
                                                                undefined,
                                                                serviceTransferResponse,
                                                                false);
                        }
                        else {

                            var result = DeviceManagerResponse.data[1].value[ModuleIdx];

                            switch (executionState) {

                                // NO ERROR                                                  
                                case 0: // ST_RES_NOERRNORES   
                                    serviceTransferResponse.hasError = false;
                                    serviceTransferResponse.hasResult = false;
                                    break;
                                case 1: // ST_RES_NOERRRES      
                                    serviceTransferResponse.hasError = false;
                                    serviceTransferResponse.hasResult = true;
                                    serviceTransferResponse.result = result;

                                    var status = result.charCodeAt(0);
                                    var padding = result.charCodeAt(1);
                                    break;

                                    // ERROR                                                  
                                case 2: // ST_RES_ERRNORES  
                                    serviceTransferResponse.hasError = true;
                                    serviceTransferResponse.hasResult = false;
                                    break;
                                case 3: // ST_RES_ERRRES  
                                    serviceTransferResponse.hasError = true;
                                    serviceTransferResponse.hasResult = true;
                                    var status = result.charCodeAt(0);
                                    var padding = result.charCodeAt(1);

                                    var errCode = (result.charCodeAt(5) << 24 | result.charCodeAt(4) << 16 | result.charCodeAt(3) << 8 | result.charCodeAt(2)) >>> 0;

                                    serviceTransferResponse.errCode = errCode;
                                    break;

                                    /*
                                    case undefined:
                                    ReadOperationStatus();
                                    return;
                                    */
                            }

                            if (executionState >= 100 && executionState <= 200) {

                                // busy, %complete
                                serviceTransferResponse.isBusy = true;
                                serviceTransferResponse.hasPercentage = true;
                                serviceTransferResponse.percentage = executionState - 100;

                                // read the next %-value if not finished
                                if (serviceTransferResponse.percentage < 100) {
                                    setTimeout(ReadOperationStatus, 200);
                                }
                            }
                            else if (executionState == 255) {

                                // busy, no %-index available
                                serviceTransferResponse.isBusy = true;
                                serviceTransferResponse.hasPercentage = false;

                                setTimeout(ReadOperationStatus, 200);
                            }

                            DevManResponse = new Defines.Response(false,
                                                                undefined,
                                                                serviceTransferResponse,
                                                                false);
                        }

                    }
                    else {

                        DevManResponse = new Defines.Response(true,
                                                            DeviceManagerResponse.error,
                                                            undefined,
                                                            false);
                    }

                    if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);

                }


            }


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //  Request (single or multiple reads are possible)
            //  - paramIDs: An array of parameters that will be read
            //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            this.Request = function (paramNames, _callback) {

                var paramCount = 0;
                var cbRdLen = 0;

                //  public method
                /// SUMMARY
                /// ParamIDs    -> Parameters like CPU-Temp,  -Frequency, ...
                /// callback    -> Method where the response will be delivered.
                ///
                this.Start = function () {

                    // Check if ModuleList is prepared
                    if (_ModuleContainer.getRequest().hasError) {

                        DevManResponse = new Defines.Response(true, _ModuleContainer.getRequest().error, undefined, false);
                        if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);
                        Destruct();
                        return;
                    }

                    if (_ModuleContainer.getRequest().isBusy) {

                        DevManResponse = new Defines.Response(false, undefined, undefined, true);
                        if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);
                        Destruct();
                        return;
                    }

                    var datawriter = new dataStream.DataWriter();

                    for (var i = 0; i < paramNames.length; i++) {

                        var ModuleItems = GetModuleItemsByParamName(paramNames[i]);

                        for (var j = 0; j < ModuleItems.length; j++) {

                            paramCount++;

                            // Group
                            datawriter.writeDINT(0);

                            // OFFSET
                            datawriter.writeDINT(getMDPOffset(ModuleItems[j].address, ModuleItems[j].subIndex, ModuleItems[j].flags));

                            // SIZE
                            datawriter.writeDINT(ModuleItems[j].size);

                            cbRdLen += ModuleItems[j].size;
                        }

                        while (ModuleItems.length > 0) { ModuleItems.pop(); }
                    }

                    var requestAdded = false;

                    if (paramCount > 0) {

                        cbRdLen += paramCount *
                                    2 /*result[i] + size[i]*/ *
                                    4/*sizeof(UINT32)*/;

                        var tags = [];
                        tags.push("netId");
                        tags.push("nPort");
                        tags.push("indexGroup");
                        tags.push("indexOffset");
                        tags.push("cbRdLen");
                        tags.push("pwrData");

                        var values = [];
                        values.push("");
                        values.push("0");
                        values.push(0xF080);    // Read
                        values.push(paramCount);
                        values.push(cbRdLen);
                        values.push(datawriter.getBase64EncodedData());

                        var method = "ReadWrite";
                        var requestData = CreateAjaxQuery(method, tags, values);
                        requestAdded = window.DevMan.getSoapQueue().AddRequest(requestData, method, Response);

                        while (tags.length > 0) { tags.pop(); }
                        while (values.length > 0) { values.pop(); }
                        requestData = null;
                    }

                    datawriter = null;
                    return requestAdded;
                }

                var Response = function (SoapResponse) {

                    var DevManResponse = null;

                    if (!SoapResponse.hasError) {

                        var DataReader = SoapResponse.reader;
                        var ErrorCodes = [];
                        var ActualLens = [];

                        for (var i = 0; i < paramNames.length; i++) {

                            var ModuleItems = GetModuleItemsByParamName(paramNames[i]);
                            var ModuleItemsErrorCodes = [];
                            var ModuleItemsActLens = [];

                            for (var j = 0; j < ModuleItems.length; j++) {

                                // ReturnCode of Data
                                ModuleItemsErrorCodes.push(CommunicationModule_ERROR.UPnPErrToMdpErr(DataReader.readDWORD()));

                                // Actual size of data
                                ModuleItemsActLens.push(DataReader.readDWORD());
                            }

                            ErrorCodes.push(ModuleItemsErrorCodes);
                            ActualLens.push(ModuleItemsActLens);

                            while (ModuleItems.length > 0) { ModuleItems.pop(); }
                        }

                        var Values = [];
                        for (var i = 0; i < paramNames.length; i++) {

                            var ModuleItems = GetModuleItemsByParamName(paramNames[i]);
                            var ModuleItemsValues = [];

                            for (var j = 0; j < ModuleItems.length; j++) {

                                if (ErrorCodes[i][j] == 0) {
                                    switch (ModuleItems[j].type) {

                                        case "BOOLEAN":
                                            ModuleItemsValues.push(DataReader.readBOOL());
                                            break;

                                        case "SIGNED8":
                                            ModuleItemsValues.push(DataReader.readSINT());
                                            break;
                                        case "UNSIGNED8":
                                            ModuleItemsValues.push(DataReader.readBYTE());
                                            break;
                                        case "SIGNED16":
                                            ModuleItemsValues.push(DataReader.readINT());
                                            break;
                                        case "UNSIGNED16":
                                            ModuleItemsValues.push(DataReader.readWORD());
                                            break;
                                        case "SIGNED32":
                                            ModuleItemsValues.push(DataReader.readDINT());
                                            break;
                                        case "UNSIGNED32":
                                            ModuleItemsValues.push(DataReader.readDWORD());
                                            break;
                                        case "UNSIGNED64":
                                            ModuleItemsValues.push(DataReader.readUINT64());
                                            break;
                                        case "REAL32":
                                            ModuleItemsValues.push(DataReader.readREAL());
                                            break;
                                        case "VISIBLE STRING":
                                            ModuleItemsValues.push(Helper.StringCut(DataReader.readString(ActualLens[i][j])));
                                            break;
                                    }

                                    // Check if current module item is an array
                                    var ArrayInfo = _ModuleContainer.getModuleListObj().IsArray(ModuleItems[j].name);
                                    if (ArrayInfo != undefined) {
                                        var moduleArrayInfo = new Defines.ArrayInfo(ModuleItems[j], ArrayInfo[0], ArrayInfo[1], ModuleItemsValues[j]);
                                        ModuleItemsValues[j] = moduleArrayInfo;
                                    }
                                }
                            }

                            while (ModuleItems.length > 0) { ModuleItems.pop(); }

                            var moduleValueInfo = new Defines.ValueInfo(paramNames[i], ModuleItemsValues, ErrorCodes[i]);
                            Values.push(moduleValueInfo);
                        }

                        DevManResponse = new Defines.Response(false, undefined, Values, false);
                        while (ActualLens.length > 0) { ActualLens.pop(); }
                        DataReader = null;
                    }
                    else {
                        DevManResponse = new Defines.Response(true, SoapResponse.error, undefined, false);
                    }

                    if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);
                    Destruct();
                }

                var Destruct = function () {
                    while (paramNames.length > 0) {
                        paramNames.pop();
                    }

                    _callback = null;
                }
            }


            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            // ArrayRequest
            // - process description: 
            //      An ArrayRequest must be performed after a paramID <ArrayParameterID>_Len is requested!
            //      Example: TIME_Property_Timezones_Len
            //      The Request reads the length of the array and returns a DeviceManager.ArrayInfo (see: helper/defines.js)
            //      Then the ArrayRequest must be performed (after the callback was raised in the pages) reading the values from that array
            //      The returned ArrayValues must be placed at the correct position in the ResponseData Array of the page
            //////////////////////////////////////////////////////////////////////////////////////////////////////

            this.ArrayRequest = function (moduleArrayInfo, _ArrayCallback) {

                this.Start = function () {

                    var cbRdLen = 0;
                    var requestData = "";
                    var datawriter = new dataStream.DataWriter();

                    for (var i = 1; i <= moduleArrayInfo.length; i++) {

                        var ParamAddress = moduleArrayInfo.moduleItem.address;
                        var ParamSubindex = i;
                        var ParamSize = moduleArrayInfo.size;

                        datawriter.writeDINT(0);    // Group
                        datawriter.writeDINT(getMDPOffset(ParamAddress, ParamSubindex, 0));
                        datawriter.writeDINT(ParamSize);

                        cbRdLen += ParamSize;
                    }

                    var requestAdded = false;

                    if (moduleArrayInfo.length > 0) {
                        var method = "ReadWrite";
                        cbRdLen += moduleArrayInfo.length *
                                    2 /*result[i] + size[i]*/ *
                                    4/*sizeof(UINT32)*/;

                        var tags = [];
                        tags.push("netId");
                        tags.push("nPort");
                        tags.push("indexGroup");
                        tags.push("indexOffset");
                        tags.push("cbRdLen");
                        tags.push("pwrData");

                        var values = [];
                        values.push("");
                        values.push("0");
                        values.push(0xF080);   // Read
                        values.push(moduleArrayInfo.length);
                        values.push(cbRdLen);
                        values.push(datawriter.getBase64EncodedData());

                        var requestData = CreateAjaxQuery(method, tags, values);
                        requestAdded = window.DevMan.getSoapQueue().AddRequest(requestData, method, ArrayResponse);

                        while (tags.length > 0) { tags.pop(); }
                        while (values.length > 0) { values.pop(); }
                        requestData = null;
                    }

                    datawriter = null;

                    return requestAdded;
                }

                var ArrayResponse = function (SoapResponse) {

                    var DevManResponse;

                    if (!SoapResponse.hasError) {

                        var DataReader = SoapResponse.reader;
                        var ErrorCodes = [];
                        var ActLens = [];

                        for (var i = 0; i < moduleArrayInfo.length; i++) {
                            ErrorCodes.push(CommunicationModule_ERROR.UPnPErrToMdpErr(DataReader.readDWORD()));
                            ActLens.push(DataReader.readDWORD());
                        }

                        var Values = [];
                        for (var i = 0; i < moduleArrayInfo.length; i++) {
                            if (ErrorCodes[i] == 0) {
                                switch (moduleArrayInfo.type) {
                                    case "BOOLEAN":
                                        Values.push(DataReader.readBOOL());
                                        break;
                                    case "SIGNED8":
                                        Values.push(DataReader.readSINT());
                                        break;
                                    case "UNSIGNED8":
                                        Values.push(DataReader.readBYTE());
                                        break;
                                    case "SIGNED16":
                                        Values.push(DataReader.readINT());
                                        break;
                                    case "UNSIGNED16":
                                        Values.push(DataReader.readWORD());
                                        break;
                                    case "SIGNED32":
                                        Values.push(DataReader.readDINT());
                                        break;
                                    case "UNSIGNED32":
                                        Values.push(DataReader.readDWORD());
                                        break;
                                    case "UNSIGNED64":
                                        Values.push(DataReader.readUINT64());
                                        break;
                                    case "REAL32":
                                        Values.push(DataReader.readREAL());
                                        break;
                                    case "VISIBLE STRING":
                                        Values.push(Helper.StringCut(DataReader.readString(ActLens[i])));
                                        break;
                                }
                            }
                            else {
                                Values.push("");
                            }
                        }

                        var ValueInfo = new Defines.ValueInfo(moduleArrayInfo.moduleItem, Values, ErrorCodes);
                        DevManResponse = new Defines.Response(false, undefined, ValueInfo, false);
                        while (ActLens.length > 0) { ActLens.pop(); }
                        DataReader = null;
                    }
                    else {
                        var ValueInfo = new Defines.ValueInfo(moduleArrayInfo.moduleItem, "", "");
                        DevManResponse = new Defines.Response(true, SoapResponse.error, ValueInfo, false);
                    }

                    if (_ArrayCallback != undefined && typeof _ArrayCallback == 'function') _ArrayCallback(DevManResponse);
                    SoapResponse = null;
                    Destruct();
                }

                var Destruct = function () {
                    moduleArrayInfo = null;
                    _ArrayCallback = null;
                }
            }


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //  Writer (single or multiple writes are possible)
            //  - writes the parameters (specified in paramIDs) to mdp.
            //    ModuleIdxs: Every paramerterID (for example: "NIC_Property_MAC_Address") needs an extra id to specify which module (here: NIC) will be used!
            //                Reason: Some modules (here: NIC) can appear several times in mdp (here: if a pc has more than one networkcard)
            //                The ids start with 0 for the first module, 1 for the second module, ...
            //    parameterValues: The writer needs a value for each paramID
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            this.Writer = function (paramNames, ModuleIdxs, parameterValues, _callback) {

                var _paramCount = 0;
                var _moduleItemsWritten = [];

                /// summary
                /// paramID         = function id
                /// ModuleIdx       = id of module (example 2NICs ..use Nic with idx 1)
                /// parameterValues = array of parameter arrays for the function
                this.Start = function () {

                    _paramCount = 0;

                    // Check if ModuleList is prepared

                    if (_ModuleContainer.getRequest().hasError) {

                        DevManResponse = new Defines.Response(true,
                                                                _ModuleContainer.getRequest().error,
                                                                undefined,
                                                                false);

                        if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);

                        return;
                    }

                    if (_ModuleContainer.getRequest().isBusy) {

                        DevManResponse = new Defines.Response(false,
                                                                undefined,
                                                                undefined,
                                                                true);

                        if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);

                        return;
                    }


                    var DataWriter = new dataStream.DataWriter();

                    for (var i = 0; i < paramNames.length; i++) {

                        var ModuleItem = GetModuleItemByParamNameAndIdx(paramNames[i], ModuleIdxs[i]);
                        if (ModuleItem != undefined) {

                            if (ModuleItem.access != "read-write" &&
                                ModuleItem.access != "write-only") {
                                continue;
                            }

                            var Size = ModuleItem.size;
                            if (ModuleItem.type == "VISIBLE STRING") {
                                Size = parameterValues[i].length;
                            }

                            // Group
                            DataWriter.writeDINT(0);

                            // OFFSET
                            DataWriter.writeDINT(getMDPOffset(ModuleItem.address, ModuleItem.subIndex, ModuleItem.flags));

                            // SIZE
                            DataWriter.writeDINT(Size);

                            _paramCount++;
                            _moduleItemsWritten.push(ModuleItem);

                        }
                    }


                    for (var i = 0; i < paramNames.length; i++) {

                        var ModuleItem = GetModuleItemByParamNameAndIdx(paramNames[i], ModuleIdxs[i]);
                        if (ModuleItem != undefined) {

                            var ParamValue = parameterValues[i];

                            if (ModuleItem.access != "read-write" &&
                                ModuleItem.access != "write-only") {
                                continue;
                            }

                            // Add paramValues to datawriter
                            switch (ModuleItem.type) {

                                case "BOOLEAN":
                                    DataWriter.writeBOOL(ParamValue);
                                    break;

                                case "SIGNED8":
                                    DataWriter.writeSINT(ParamValue);
                                case "UNSIGNED8":
                                    DataWriter.writeBYTE(ParamValue);
                                    break;

                                case "SIGNED16":
                                    DataWriter.writeINT(ParamValue);
                                case "UNSIGNED16":
                                    DataWriter.writeWORD(ParamValue);
                                    break;

                                case "SIGNED32":
                                    DataWriter.writeDINT(ParamValue);
                                case "UNSIGNED32":
                                    DataWriter.writeDWORD(ParamValue);
                                    break;

                                case "UNSIGNED64":
                                    // not implemented yet
                                    break;

                                case "REAL32":
                                    DataWriter.writeREAL(ParamValue);
                                    break;

                                case "VISIBLE STRING":
                                    DataWriter.writeString(ParamValue, ParamValue.length);
                                    break;

                            }
                        }
                    }

                    if (_paramCount > 0) {
                        var method = "ReadWrite";

                        var tags = [];
                        tags.push("netId");
                        tags.push("nPort");
                        tags.push("indexGroup");
                        tags.push("indexOffset");
                        tags.push("cbRdLen");
                        tags.push("pwrData");

                        var values = [];
                        values.push("");
                        values.push("0");
                        values.push(0xF081);            // Write
                        values.push(_paramCount);       // Count of subcommands
                        values.push(_paramCount * 4);   // n * sizeof(UINT32)
                        values.push(DataWriter.getBase64EncodedData());

                        var requestData = CreateAjaxQuery(method, tags, values);
                        return window.DevMan.getSoapQueue().AddRequest(requestData, method, Response);
                    }
                    else {
                        return false;
                    }
                }

                var Response = function (SoapResponse) {

                    var DevManResponse = undefined;

                    if (!SoapResponse.hasError) {

                        var DataReader = SoapResponse.reader;
                        var ErrorCodes = [];

                        for (var i = 0; i < _paramCount; i++) {

                            var errCode = DataReader.readDWORD();
                            errCode = CommunicationModule_ERROR.UPnPErrToMdpErr(errCode);
                            ErrorCodes.push(errCode);
                        }

                        var WriteResponse = new Defines.WriteResponse(_moduleItemsWritten,
                                                                      ErrorCodes);


                        DevManResponse = new Defines.Response(false,
                                                              undefined,
                                                              WriteResponse,
                                                              false);
                    }
                    else {

                        DevManResponse = new Defines.Response(true,
                                                              SoapResponse.error,
                                                              undefined,
                                                              false);
                    }

                    if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);


                }
            }

            this.ArrayWriter = function (arrayNames, ModuleIdxs, ArrayIdxs, parameterValues, _callback) {

                var _paramCount = 0;
                var _moduleItemsWritten = [];

                /// summary
                /// paramID         = function id
                /// ModuleIdx       = id of module (example 2NICs ..use Nic with idx 1)
                /// parameterValues = array of parameter arrays for the function
                this.Start = function () {

                    _paramCount = 0;

                    // Check if ModuleList is prepared

                    if (_ModuleContainer.getRequest().hasError) {

                        DevManResponse = new Defines.Response(true,
                                                            _ModuleContainer.getRequest().error,
                                                            undefined,
                                                            false);

                        if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);

                        return;
                    }

                    if (_ModuleContainer.getRequest().isBusy) {

                        DevManResponse = new Defines.Response(false,
                                                            undefined,
                                                            undefined,
                                                            true);

                        if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);

                        return;
                    }


                    var DataWriter = new dataStream.DataWriter();

                    for (var i = 0; i < arrayNames.length; i++) {

                        var ModuleItem = GetModuleItemByParamNameAndIdx(arrayNames[i], ModuleIdxs[i]);
                        if (ModuleItem != undefined) {

                            var ArrayInfoArr = _ModuleContainer.getModuleListObj().IsArray(ModuleItem.name);
                            if (!ArrayInfoArr) {
                                continue;
                            }

                            var Type = ArrayInfoArr[0];
                            var Size = ArrayInfoArr[1];
                            if (Type == "VISIBLE STRING") {
                                Size = parameterValues[i].length;
                            }

                            // Group
                            DataWriter.writeDINT(0);

                            // OFFSET
                            DataWriter.writeDINT(getMDPOffset(ModuleItem.address, ModuleItem.subIndex + ArrayIdxs[i], 0));

                            // SIZE
                            DataWriter.writeDINT(Size);

                            _paramCount++;
                            _moduleItemsWritten.push(ModuleItem);

                        }
                    }


                    for (var i = 0; i < arrayNames.length; i++) {

                        var ModuleItem = GetModuleItemByParamNameAndIdx(arrayNames[i], ModuleIdxs[i]);
                        if (ModuleItem != undefined) {

                            var ParamValue = parameterValues[i];

                            var ArrayInfoArr = _ModuleContainer.getModuleListObj().IsArray(ModuleItem.name);
                            if (!ArrayInfoArr) {
                                continue;
                            }

                            var Type = ArrayInfoArr[0];

                            // Add paramValues to datawriter
                            switch (Type) {

                                case "BOOLEAN":
                                    DataWriter.writeBOOL(ParamValue);
                                    break;

                                case "SIGNED8":
                                    DataWriter.writeSINT(ParamValue);
                                case "UNSIGNED8":
                                    DataWriter.writeBYTE(ParamValue);
                                    break;

                                case "SIGNED16":
                                    DataWriter.writeINT(ParamValue);
                                case "UNSIGNED16":
                                    DataWriter.writeWORD(ParamValue);
                                    break;

                                case "SIGNED32":
                                    DataWriter.writeDINT(ParamValue);
                                case "UNSIGNED32":
                                    DataWriter.writeDWORD(ParamValue);
                                    break;

                                case "UNSIGNED64":
                                    // not implemented yet
                                    break;

                                case "REAL32":
                                    DataWriter.writeREAL(ParamValue);
                                    break;

                                case "VISIBLE STRING":
                                    DataWriter.writeString(ParamValue, ParamValue.length);
                                    break;

                            }

                        }
                    }

                    if (_paramCount > 0) {
                        var method = "ReadWrite";

                        var tags = [];
                        tags.push("netId");
                        tags.push("nPort");
                        tags.push("indexGroup");
                        tags.push("indexOffset");
                        tags.push("cbRdLen");
                        tags.push("pwrData");

                        var values = [];
                        values.push("");
                        values.push("0");
                        values.push(0xF081);            // Write
                        values.push(_paramCount);       // Count of subcommands
                        values.push(_paramCount * 4);   // n * sizeof(UINT32)
                        values.push(DataWriter.getBase64EncodedData());

                        var requestData = CreateAjaxQuery(method, tags, values);
                        return window.DevMan.getSoapQueue().AddRequest(requestData, method, Response);
                    }
                    else {
                        return false;
                    }
                }

                var Response = function (SoapResponse) {

                    var DevManResponse = undefined;

                    if (!SoapResponse.hasError) {

                        var DataReader = SoapResponse.reader;
                        var ErrorCodes = [];

                        for (var i = 0; i < _paramCount; i++) {

                            var errCode = DataReader.readDWORD();
                            errCode = CommunicationModule_ERROR.UPnPErrToMdpErr(errCode);
                            ErrorCodes.push(errCode);
                        }

                        var WriteResponse = new Defines.WriteResponse(_moduleItemsWritten,
                                                                      ErrorCodes);


                        DevManResponse = new Defines.Response(false,
                                                              undefined,
                                                              WriteResponse,
                                                              false);
                    }
                    else {

                        DevManResponse = new Defines.Response(true,
                                                              SoapResponse.error,
                                                              undefined,
                                                              false);
                    }

                    if (_callback != undefined && typeof _callback == 'function') _callback(DevManResponse);


                }
            }


            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            //  ModuleContainer
            //  - reads all available modules from MDP
            //  - stores a moduleList object (info @ communication/moduleList.js) in the data field of the request
            //      getRequest().data
            //  - if an error occures, the request ("DeviceManager.Response") contains the error code and msg
            //      getRequest().error
            ////////////////////////////////////////////////////////////////////////////////////////////////////

            var ModuleContainer = function () {

                var Request = new Defines.Response(false,
                                                    undefined,
                                                    undefined,
                                                    true);

                this.getRequest = function () {
                    return Request;
                }

                this.getModuleListObj = function () {
                    if (Request.hasError || Request.isBusy) {
                        return undefined;
                    }
                    else {
                        return Request.data;
                    }
                }

                this.GetModules = function () {

                    GetModules();
                }

                var GetModules = function () {


                    var datawriter = new dataStream.DataWriter();
                    datawriter.writeDINT(0);    // Group
                    datawriter.writeDINT(getMDPOffset(0xF020, 0, 1)); // OFFSET
                    datawriter.writeDINT(1024);  // SIZE

                    var method = "ReadWrite";

                    var tags = [];
                    tags.push("netId");
                    tags.push("nPort");
                    tags.push("indexGroup");
                    tags.push("indexOffset");
                    tags.push("cbRdLen");
                    tags.push("pwrData");

                    var values = [];
                    values.push("");
                    values.push(0);
                    values.push(0xF080);
                    values.push(1);
                    values.push(1024);
                    values.push(datawriter.getBase64EncodedData())

                    var requestData = CreateAjaxQuery(method, tags, values);

                    window.DevMan.getSoapQueue().AddRequest(requestData, method, ResponseModules);
                }


                var ResponseModules = function (SoapResponse) {

                    if (!SoapResponse.hasError) {

                        var DataReader = SoapResponse.reader;
                        DataReader.offset = 0;

                        var ErrorCode = DataReader.readDWORD();
                        var DataLen = DataReader.readDWORD();



                        // Anzahl Module im ersten Byte
                        ModuleCount = DataReader.readSINT();
                        DataReader.offset++; // no important data^^

                        var ModuleAddress = [];
                        var ModuleFunctionAddress = [];
                        var ModuleType = [];

                        // ModulPosition & ModulTyp   = data[i] + data[i+1] = low word | data[i+2] + data[i+3] = high word
                        for (var i = 0; i < ModuleCount; i++) {

                            var ModulPos = DataReader.readINT(); // ModulPosition = ModulAddress

                            // Create ModuleBaseaddress => 0x8nn0
                            //  and FunctionBaseaddress => 0xBnn0
                            var nn = (ModulPos < 16 ? "0" : "") + ModulPos.toString(16) + "0";

                            ModuleAddress.push(parseInt("0x8" + nn, 16));           // Moduleindex @ 0x8nn0
                            ModuleFunctionAddress.push(parseInt("0xB" + nn, 16));   // ModuleFunctionindex @ 0xBnn0

                            ModuleType.push(DataReader.readINT());     // ModulTyp
                        }

                        Request = new Defines.Response(false,
                                                        undefined,
                                                        new window.CommunicationModule_moduleList.moduleList(ModuleAddress, ModuleFunctionAddress, ModuleType),
                                                        false);

                    }
                    else if (SoapResponse.isBusy) {

                        Request = new Defines.Response(false,
                                                        undefined,
                                                        undefined,
                                                        true);
                    }
                    else if (SoapResponse.hasError) {

                        Request = new Defines.Response(true,
                                                        SoapResponse.error,
                                                        undefined,
                                                        false);

                        setTimeout(GetModules, 1000);
                    }
                }

            }


            ///////////////////////////////////////////////////////////////////////////
            // "constructor"
            ////////////////////////////////////////////////////////////////////////
            var _construct = function () {

                _ModuleContainer = new ModuleContainer();
                _ModuleContainer.GetModules();
            }


            _construct();   // call constructor function
        }
    });

    // Expose MDP instance to DeviceManager !!!
    window.DevMan.RegisterModule(CommunicationModule_MDP.MDP, window.DevMan.ModuleType.CommunicationModule);

})(window);