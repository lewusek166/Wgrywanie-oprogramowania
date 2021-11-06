(function (window) {

    // namespace
    var Defines = new (function () {

        // used in DeviceManager.js
        //      specifies an Entry in the ErrorQueue
        this.UniversalError = function (errorCode, errorMessage, errorOccurrenceMax) {
            this.errorCode = errorCode;
            this.errorMessage = errorMessage;
            this.errorOccurrenceCount = 1;
            this.errorOccurrenceMax = errorOccurrenceMax;
        }

        // used in DeviceManger.js
        //      specifies an entry in the browser history
        this.HistoryEntry = function (category, page) {
            this.category = category;
            this.page = page;
        }

        // used in communication/mdp.js
        //      specifies if a request was successfull or not
        this.Response = function (hasError, error, data, isBusy) {

            this.isBusy = isBusy;
            this.hasError = hasError;
            this.error = error;                     // dataStream.RequestError
            this.data = data;                       // DeviceManager.ValueInfo
            this.getTypeString = (function () {
                return "DeviceManager.Response";
            });
        }

        // used in communication/mdp.js
        //      will contain the values after a request
        //      to identify a value to its parameter
        this.ValueInfo = function (parameterName, value, error) {

            this.parameterName = parameterName;
            this.value = value;     // value of the parameter or DeviceManager.ArrayInfo
            this.error = error;
            this.getTypeString = (function () {
                return "DeviceManager.ValueInfo";
            });

        }

        // used in communication/mdp.js
        //      if an array is requested, the length of the array will be returned.
        //      after that an arrayrequest will be performed which needs the following information
        this.ArrayInfo = function (moduleItem, type, size, length) {

            this.moduleItem = moduleItem;
            this.type = type;
            this.size = size;
            this.length = length;

            this.getTypeString = (function () {
                return "DeviceManager.ArrayInfo";
            });
        }

        // used in communication/moduleList.js
        //      can be a Property, a ServiceTransfer or a ServiceTransferState/Result
        this.ModuleItem = function (internalId, id, name, address, subIndex, flags, type, size, access, parameters) {

            // Property=0; ServiceTransfer=1, ServiceTransferState=2, ServiceTransferResult=3
            this.internalId = internalId;   

            // all
            this.id = id;
            this.name = name;
            this.address = address;
            this.subIndex = subIndex;
            this.flags = flags;

            // if this is a Property, ServiceTransferState or ServiceTransferResult
            this.type = type;
            this.size = size;
            this.access = access;

            // if this is a ServiceTransfer Object
            this.parameters = parameters;   
        }

        // used in communication/moduleList.js
        //      used to specify a parameter of a modulefunction
        //      a ServiceTransfer contains an array of this parameter(s)
        this.ServiceTransferParameter = function (name, type, size) {

            this.name = name;
            this.type = type;
            this.size = size;

            this.getTypeString = (function () {
                return "DeviceManager.ServiceTransferParameter";
            });
        }

        // used in communication/mdp
        //      if a service transfer was executed this response contains information about the status and return value
        this.ServiceTransferResponse = function () {

            this.isBusy = false;

            this.hasError = false;
            this.errCode = undefined;

            this.hasResult = false;
            this.result = undefined;

            this.hasPercentage = false;
            this.percentage = undefined;

            this.moduleItem = undefined;

            this.getTypeString = (function () {
                return "DeviceManager.ServiceTransferResponse";
            });
        }

        this.WriteResponse = function (moduleItemsWritten, errorCodes) {
            this.moduleItemsWritten = moduleItemsWritten;
            this.errorCodes = errorCodes;
        }

        // used in pages/*.js
        //      every page that makes requests has an array of RequestParameters called "RequestParamIDs"
        this.RequestParameter = function (parameterName, cyclic, moduleCount) {
            this.parameterName = parameterName;
            this.cyclic = cyclic;
            this.moduleCount = moduleCount;
            this.isArray = false;

            // Values
            this.values = [];   // Array auf ResponseInfo's

            this.getHasValues = function () {
                
                if (this.values.length == 0) {
                    return false;
                }
                else {
                    if (!this.isArray) {
                        for (var i = 0; i < this.values.length; i++) {
                            
                            if (this.values[i] != undefined && !this.values[i].getHasError()) {
                                // if any value has no error there is a value to display
                                return true;
                            }
                        }
                        // if every value has an error there is no value to display
                        return false;
                    }
                    else {
                        for (var i = 0; i < this.values.length; i++) {

                            if (this.values[i] != undefined) {
                                for (var j = 0; j < this.values[i].length; j++) {

                                    if (this.values[i][j] != undefined && !this.values[i][j].getHasError()) {
                                        // if any value has no error there is a value to display
                                        return true;
                                    }

                                }
                            }
                        }
                        // if every value has an error there is no value to display
                        return false;
                    }
                }
            }

            /* ToDo
            this.getErrorCodes = function () {

                if (this.values.length == 0) {
                    return 0;
                }
                else {

                    if (!this.isArray) {

                        // return array of error codes

                    }
                    else {

                        // return array of error codes !array!

                    }
                }
            }*/

            this.clearValues = function () {

                // Clear Array 
                while (this.values.length > 0) {
                    this.values.pop();
                }
            }
            
            this.getTypeString = (function () {
                return "DeviceManager.RequestParameter";
            });
        }

        this.ResponseInfo = function (data, error) {
            this.data = data;
            this.error = error;

            this.getOutput = function () {

                if (this.getHasFatalError()) {
                    // show the error message
                    return CommunicationModule_ERROR.ErrorCodeToErrorMessage(this.error);
                }
                else if (this.getHasError()) {
                    // hide the error message. "data" is not available from mdp
                    return "";
                }
                else {
                    return this.data;
                }

            }

            this.getHasError = function () {
                
                if (error === 0) {
                    return false;
                }
                else {
                    return true;
                }

            }

            this.getHasFatalError = function () {

                if (error === 0 ||
                    error === 0xECA60105 ||
                    error === 0xECA60F00 ||
                    error === 0xECA61000) {

                    // 0xECA60105 = No data available
                    // 0xECA60F00 = Not implemented
                    // 0xECA61000 = Not supported
                    return false;
                }
                else {

                    return true;
                }
            }

        }

        // used in helper/helper.js
        //      a struct for the name and version of the current browser
        this.BrowserInfo = function (name, version, major, agentStr) {

            this.name = name;
            this.version = version;
            this.major = major;
            this.agentStr = agentStr;
            this.getTypeString = (function () {
                return "DeviceManager.BrowserInfo";
            });

        }

    });

    // Expose DEFINES instance to window object !!!
    window.Defines = Defines;

})(window);