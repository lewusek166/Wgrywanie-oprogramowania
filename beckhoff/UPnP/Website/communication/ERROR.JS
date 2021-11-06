(function (window) {

    // namespace
    var CommunicationModule_ERROR = new (function () {

        this.ErrorClass = {
            "None":         0x0000,
            "HTTP":         0x0001,
            "SYSTEM":       0xECA7,     // error contains system error code in low word
            "ADS":          0xECA8,     // error contains ads error code in low word
            "MDP":          0xECA6,     // common MDP errors
            "MDP_specific": 0xECAF,     // module specific errors
            "MDPWEB":       0xA03D,     // error code from mdp webservice
            "UPNP":         0x8004,     // error code from upnp control
            "DEVMAN":       0x8005      // error code from DeviceManager
        };

        // Get ErrorClass from HighWord to identify the errors source
        this.GetErrorType = function (ErrorCode) {

            if (isNaN(ErrorCode)) {
                return this.ErrorClass.None;
            }
            ErrorCode = Number(ErrorCode);
            
            if (ErrorCode == 0) {
                return this.ErrorClass.None;
            }
            else if (ErrorCode < 1000 && ErrorCode > 0) {
                return this.ErrorClass.HTTP;
            }
            else {
                // shift HighWord (unsigned)
                return ErrorCode >>> 16;
            }
        }

        this.GetErrorTypeStr = function (ErrorCode) {

            switch (this.GetErrorType(ErrorCode)) {
                case this.ErrorClass.None:      return "Unknown";
                case this.ErrorClass.HTTP:      return "HTTP";
                case this.ErrorClass.SYSTEM:    return "Windows";
                case this.ErrorClass.ADS:       return "ADS";
                case this.ErrorClass.MDP:
                case this.ErrorClass.MDP_specific:
                    return "MDP";
                case this.ErrorClass.MDPWEB:    return "MDP Webservice";
                case this.ErrorClass.UPNP:      return ""; // UPNP and WMI have the same error class -> So it must be added directly in the error message
                case this.ErrorClass.DEVMAN:    return "Device Manager";
            }
        }

        // Converts the UPnP ErrorCode to a MDP ErrorCode
        this.UPnPErrToMdpErr = function (ErrorCode) {

            if (isNaN(ErrorCode)) {
                return ErrorCode;
            }
            ErrorCode = Number(ErrorCode);

            /*
            // Upnp Errors                                                              MDP Errors  
            #define E_UPNP_INVALID_PORT _HRESULT_TYPEDEF_(0x80040300L+700)              -
            #define E_UPNP_INVALID_LENGTH _HRESULT_TYPEDEF_(0x80040300L+701)            -
            #define E_UPNP_INVALID_DATA _HRESULT_TYPEDEF_(0x80040300L+702)              -
            #define E_UPNP_MDP_LOAD _HRESULT_TYPEDEF_(0x80040300L+703)                  -

            #define E_UPNP_MDP_FAIL _HRESULT_TYPEDEF_(0x80040300L+710)                  0xECA60001 Fail - Unspecified error 
            #define E_UPNP_MDP_INDEX _HRESULT_TYPEDEF_(0x80040300L+711)                 0xECA60100 Invalid index
            #define E_UPNP_MDP_ACCESS _HRESULT_TYPEDEF_(0x80040300L+712)                0xECA60101 Invalid access
            #define E_UPNP_MDP_BUFFERTOOSMALL _HRESULT_TYPEDEF_(0x80040300L+713)        0xECA60102 Buffer too small 
            #define E_UPNP_MDP_TYPENOTSUPPORTED _HRESULT_TYPEDEF_(0x80040300L+714)      0xECA60103 Type not supported 
            #define E_UPNP_MDP_OUTOFMEMORY _HRESULT_TYPEDEF_(0x80040300L+715)           0xECA60104 Out of memory 
            #define E_UPNP_MDP_NODATAAVAILABLE _HRESULT_TYPEDEF_(0x80040300L+716)       0xECA60105 No data available            hide
            #define E_UPNP_MDP_INVALIDDATA _HRESULT_TYPEDEF_(0x80040300L+717)           0xECA60106 Invalid data
            #define E_UPNP_MDP_INVALIDARG _HRESULT_TYPEDEF_(0x80040300L+718)            0xECA60107 Invalid arg 
            #define E_UPNP_MDP_BUSY _HRESULT_TYPEDEF_(0x80040300L+719)                  0xECA60200 Server is busy 
            #define E_UPNP_MDP_NOTIMPL _HRESULT_TYPEDEF_(0x80040300L+720)               0xECA60F00 Not implemented              hide
            #define E_UPNP_MDP_NOTSUPPORTED _HRESULT_TYPEDEF_(0x80040300L+721)          0xECA61000 Not supported                hide
            */

            switch (ErrorCode) {

                case 0x800405BC: // "Invalid Port";
                case 0x800405BD: // "Invalid Length";
                case 0x800405BE: // "Invalid Data";
                case 0x800405BF: // "Load";
                    return ErrorCode;

                case 0x800405C6: return 0xECA60001; // Fail - Unspecified error 
                case 0x800405C7: return 0xECA60100; // Invalid index 
                case 0x800405C8: return 0xECA60101; // Invalid access 
                case 0x800405C9: return 0xECA60102; // Buffer too small 
                case 0x800405CA: return 0xECA60103; // Type not supported 
                case 0x800405CB: return 0xECA60104; // Out of memory 
                case 0x800405CC: return 0xECA60105; // No data available 
                case 0x800405CD: return 0xECA60106; // Invalid data 
                case 0x800405CE: return 0xECA60107; // Invalid arg 
                case 0x800405CF: return 0xECA60200; // Server is busy 
                case 0x800405D0: return 0xECA60F00; // Not implemented 
                case 0x800405D1: return 0xECA61000; // Not supported 

                default: return ErrorCode;
            }
        }

        // Returns an ErrorMessage depending on the ErrorCode
        this.ErrorCodeToErrorMessage = function (ErrorCode) {

            if (isNaN(ErrorCode)) {
                return ErrorCode;
            }
            ErrorCode = Number(ErrorCode);
            
            // Get ErrorClass from HighWord to identify the errors source
            var errorClass = this.GetErrorType(ErrorCode);

            if (errorClass == this.ErrorClass.None) {
                return "Success - No Error";
            }
            else if (errorClass == this.ErrorClass.HTTP) {
                
            }
            else if (errorClass == this.ErrorClass.SYSTEM) {

                var systemErrorCode = (ErrorCode & 0x0000FFFF);
                var systemErrorMsg = SystemErrorCodeToErrorMessage(systemErrorCode);

                return systemErrorMsg;
            }
            else if (errorClass == this.ErrorClass.ADS) {

                var adsErrorCode = (ErrorCode & 0x0000FFFF);
                
                switch (adsErrorCode) {

                    // General ADS Error Codes
                    case 0x700: return "error class <device error>";
                    case 0x701: return "Service is not supported by server";
                    case 0x702: return "invalid index group";
                    case 0x703: return "invalid index offset";
                    case 0x704: return "reading/writing not permitted";
                    case 0x705: return "parameter size not correct";
                    case 0x706: return "invalid parameter value(s)";
                    case 0x707: return "device is not in a ready state";
                    case 0x708: return "device is busy";
                    case 0x709: return "invalid context (must be in Windows)";
                    case 0x70A: return "out of memory";
                    case 0x70B: return "invalid parameter value(s)";
                    case 0x70C: return "not found (files, ...)";
                    case 0x70D: return "syntax error in command or file";
                    case 0x70E: return "objects do not match";
                    case 0x70F: return "object already exists";
                    case 0x710: return "symbol not found";
                    case 0x711: return "symbol version invalid";
                    case 0x712: return "server is in invalid state";
                    case 0x713: return "AdsTransMode not supported";
                    case 0x714: return "Notification handle is invalid";
                    case 0x715: return "Notification client not registered";
                    case 0x716: return "no more notification handles";
                    case 0x717: return "size for watch too big";
                    case 0x718: return "device not initialized";
                    case 0x719: return "device has a timeout";
                    case 0x71A: return "query interface failed";
                    case 0x71B: return "wrong interface required";
                    case 0x71C: return "class ID is invalid";
                    case 0x71D: return "object ID is invalid";
                    case 0x71E: return "request is pending";
                    case 0x71F: return "request is aborted";
                    case 0x720: return "signal warning";
                    case 0x721: return "invalid array index";
                    case 0x722: return "symbol not active";
                    case 0x723: return "access denied";
                    case 0x724: return "missing license";
                    case 0x72c: return "exception occured during system start";
                    case 0x740: return "Error class <client error>";
                    case 0x741: return "invalid parameter at service";
                    case 0x742: return "polling list is empty";
                    case 0x743: return "var connection already in use";
                    case 0x744: return "invoke ID in use";
                    case 0x745: return "timeout elapsed";
                    case 0x746: return "error in win32 subsystem";
                    case 0x747: return "Invalid client timeout value";
                    case 0x748: return "ads-port not opened";
                    case 0x750: return "internal error in ads sync";
                    case 0x751: return "hash table overflow";
                    case 0x752: return "key not found in hash";
                    case 0x753: return "no more symbols in cache";
                    case 0x754: return "invalid response received";
                    case 0x755: return "sync port is locked";

                    default: return "0x" + adsErrorCode.toString(16).toUpperCase();
                }
            }
            else if (errorClass == this.ErrorClass.UPNP) {

                switch (ErrorCode) {

                    // WMI
                    case 0x80041001: return "(WMI) Call failed.";
                    case 0x80041002: return "(WMI) Object cannot be found.";
                    case 0x80041003: return "(WMI) Current user does not have permission to perform the action.";
                    case 0x80041006: return "(WMI) Not enough memory for the operation."
                    case 0x80041008: return "(WMI) One of the parameters to the call is not correct."
                    case 0x80041009: return "(WMI) Resource, typically a remote server, is not currently available."
                    case 0x8004100A: return "(WMI) Internal, critical, and unexpected error occurred. Report the error to Microsoft Technical Support."
                    case 0x8004100C: return "(WMI) Feature or operation is not supported."
                    case 0x80041019: return "(WMI) Item already exists.";
                        
                    // UPNP
                    case 0x800405BC: return "(UPNP) Invalid Port";
                    case 0x800405BD: return "(UPNP) Invalid Length";
                    case 0x800405BE: return "(UPNP) Invalid Data";
                    case 0x800405BF: return "(UPNP) Load";

                    default: return "0x" + ErrorCode.toString(16).toUpperCase();
                }
            }
            else if (errorClass == this.ErrorClass.MDP) {

                switch (ErrorCode) {

                    // Allgemeine Fehler           
                    case 0xECA60001: return "Fail - Unspecified error";
                    case 0xECA60100: return "Invalid index";
                    case 0xECA60101: return "Invalid access";
                    case 0xECA60102: return "Buffer too small";
                    case 0xECA60103: return "Type not supported";
                    case 0xECA60104: return "Out of memory";
                    case 0xECA60105: return "No data available";
                    case 0xECA60106: return "Invalid data";
                    case 0xECA60107: return "Invalid arg";
                    case 0xECA60108: return "Value out of range";
                    case 0xECA60200: return "Server is busy";
                    case 0xECA60201: return "MDP API not initialized";
                    case 0xECA60F00: return "Not implemented";
                    case 0xECA61000: return "Not supported";
                    case 0xECA60FFF: return "Unexpected error";

                    default: return "0x" + ErrorCode.toString(16).toUpperCase();
                }
            }
            else if (errorClass == this.ErrorClass.MDP_specific) {

                switch (ErrorCode) {

                    // Modulabhängige Fehlernummern     
                    case 0xECAF0401: return "User already exists";
                    case 0xECAF0402: return "User does not exist";
                    case 0xECAF0403: return "Group already exists";
                    case 0xECAF0404: return "Group does not exist";
                    case 0xECAF0410: return "Server is not installed";
                    case 0xECAF0411: return "Share already exists";
                    case 0xECAF0412: return "Share does not exist";
                    case 0xECAF0420: return "Ads route already exists";
                    case 0xECAF0421: return "Ads port could not be opened";
                    case 0xECAF0430: return "A variable with this name already exists";
                    case 0xECAF0431: return "Variable with requested name does not exist";
                    case 0xECAF0432: return "Section with specified name does not exist";
                    case 0xECAF0433: return "The name of the variable was invalid";
                    case 0xECAF0440: return "The name of the key (e.g. 'HKLM') was invalid";

                    default: return + "0x" + ErrorCode.toString(16).toUpperCase();
                }
            }
            else if (errorClass == this.ErrorClass.DEVMAN) {

                switch (ErrorCode) {

                    case 0x80050001: return "Fail - Unspecified Error";
                    case 0x80050010: return "Could not create XMLHttpObject";
                    case 0x80050011: return "Request timed out";
                    case 0x80050012: return "Soapresponse has faultstring";
                    case 0x80050013: return "Soapresponse empty";

                    case 0x80050020: return "Communication module is busy!";

                    case 0x80050030: return "Please enter a valid date!";
                    case 0x80050031: return "Please check your input!";

                    case 0x80050035: return "Could not add exclusion. FBWF is disabled!";

                    case 0x80050040: return "Passwords do not match!";
                    case 0x80050041: return "Please enter a valid password!";


                    default: return "0x" + ErrorCode.toString(16).toUpperCase();
                }
            }
            else if (errorClass == this.ErrorClass.MDPWEB) {

                switch (ErrorCode) {
                    case 0xA03D0000: return "Success";
                    case 0xA03D0001: return "Unspecific error";
                    case 0xA03D0002: return "Invalid HTTP Method (POST required)";
                    case 0xA03D0003: return "Invalid SOAP Message";
                    case 0xA03D0100: return "Out of memory";
                    case 0xA03D0101: return "Readbuffer too small";
                    case 0xA03D0102: return "Invalid writebuffer";
                    case 0xA03D0103: return "Out of range";
                    case 0xA03D0104: return "Invalid argument";
                    case 0xA03D0105: return "Maximum amount of subcommands reached";
                    case 0xA03D0106: return "Maximum length of readbuffer reached";
                    case 0xA03D0107: return "Maximum length of writebuffer reached";
                }
            }
            else {

                return "0x" + ErrorCode.toString(16).toUpperCase();

            }
        }

        var SystemErrorCodeToErrorMessage = function (ErrorCode) {

            if (isNaN(ErrorCode)) {
                return ErrorCode;
            }
            ErrorCode = Number(ErrorCode);

            switch (ErrorCode) {

                case 0: return "The operation completed successfully.";
                case 1: return "Incorrect function.";
                case 2: return "The system cannot find the file specified.";
                case 3: return "The system cannot find the path specified.";
                case 4: return "The system cannot open the file.";
                case 5: return "Access Denied.";
                case 6: return "The handle is invalid.";
                    //...
                case 10: return "The environment is incorrect.";
                    //...
                case 13: return "The data is invalid.";
                    // ...
                case 19: return "The media is write protected.";
                    // ...
                case 21: return "The device is not ready.";
                    //...
                case 53: return "The network path was not found.";
                    // ...
                case 84: return "Storage to process this request is not available.";
                    // ...
                case 86: return "The password is incorrect.";
                case 87: return "The parameter is incorrect.";
                    //...
                case 121: return "The semaphore timeout period has expired.";
                    // ...
                case 123: return "The filename, directory name, or volume label syntax is incorrect.";
                    //...
                case 154: return "The volume label you entered exceeds the label character limit of the target file system.";
                    //...
                case 1351: return "Configuration information could not be read from the domain controller, either because the machine is unavailable, or access has been denied.";
                    //...
                case 1371: return "Cannot perform this operation on built-in accounts.";
                    //...
                case 1377: return "One or more of the members specified were not members of the local group. No members were deleted.";
                case 1378: return "One or more of the members specified were already members of the local group. No new members were added.";
                    //...
                case 1388: return "One or more of the members cannot be added because their account type is invalid. No new members were added.";
                    //...
                case 1722: return "The RPC server is unavailable.";
                    //...
                case 2202: return "The specified username is invalid.";
                    //...
                case 2221: return "The user name could not be found.";
                    //...
                case 2224: return "The specified user already exists.";
                    // ...
                case 2245: return "The password does not meet the password policy requirements. Check the minimum password length, password complexity and password history requirements.";

                    // unspecified system error codes
                default: return "0x" + ErrorCode.toString(16).toUpperCase();
            }

        }

        // Returns the ErrorCode in decimal or hex depending on the ErrorClass
        // HTTP-Codes: decimal
        // Other: hex
        this.ErrorCodeDisplay = function (ErrorCode) {

            if (isNaN(ErrorCode)) {
                return ErrorCode;
            }
            ErrorCode = Number(ErrorCode);

            // Get ErrorClass from HighWord to identify the errors source
            var errorClass = this.GetErrorType(ErrorCode);

            if (errorClass == this.ErrorClass.HTTP) {
                return ErrorCode.toString(10);
            }
            else {
                return "0x" + ErrorCode.toString(16).toUpperCase();
            }
        }

    });


    // Expose ERROR.js instance to window object !!!
    window.CommunicationModule_ERROR = CommunicationModule_ERROR;

})(window);