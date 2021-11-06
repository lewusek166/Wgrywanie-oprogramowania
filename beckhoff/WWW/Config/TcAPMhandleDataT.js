/*!
--------------
TcAdsWebService JavaScript Library
--------------
Version: v1.0.1.0
--------------
Copyright 2012, Beckhoff Automation GmbH
http://www.beckhoff.com
--------------
Description:
    
--------------
*/
////////////////////////////////////////////////////
(function (window) {

    var TcAdsWebService = new (function () {

        this.Response = (function (hasError, error, reader, isBusy) {

            this.isBusy = isBusy;
            this.hasError = hasError;
            this.error = error;
            this.reader = reader;
            this.getTypeString = (function () {
                return "TcAdsWebService.Response";
            });

        });

        this.Error = (function (errorMessage, errorCode) {

            this.errorMessage = errorMessage;
            this.errorCode = errorCode;
            this.getTypeString = (function () {
                return "TcAdsWebService.Error";
            });

        });

        this.ResquestError = (function (requestStatus, requestStatusText) {

            this.requestStatus = requestStatus;
            this.requestStatusText = requestStatusText;
            this.getTypeString = (function () {
                return "TcAdsWebService.ResquestError";
            });

        });

        this.Client = (function (sServiceUrl, sServiceUser, sServicePassword) {

            this.getTypeString = (function () {
                return "TcAdsWebService.Client";
            });

            this.readwrite = (function (sNetId, nPort, nIndexGroup, nIndexOffset, cbRdLen, pwrData, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {

                var message =
                        "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                        "<SOAP-ENV:Envelope " +
                        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" " +
                        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" " +
                        "xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                        "SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" >" +
                        "<SOAP-ENV:Body><q1:ReadWrite xmlns:q1=\"http://beckhoff.org/message/\">" +
                        "<netId xsi:type=\"xsd:string\">" + sNetId + "</netId>" +
                        "<nPort xsi:type=\"xsd:int\">" + nPort + "</nPort>" +
                        "<indexGroup xsi:type=\"xsd:unsignedInt\">" + nIndexGroup + "</indexGroup>" +
                        "<indexOffset xsi:type=\"xsd:unsignedInt\">" + nIndexOffset + "</indexOffset>" +
                        "<cbRdLen xsi:type=\"xsd:int\">" + cbRdLen + "</cbRdLen>" +
                        "<pwrData xsi:type=\"xsd:base64Binary\">" + pwrData + "</pwrData>" +
                        "</q1:ReadWrite></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                return sendMessage(message, "http://beckhoff.org/action/TcAdsSync.Readwrite", pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async);

            });

            this.readState = (function (sNetId, nPort, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {

                var message =
                        "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                        "<SOAP-ENV:Envelope " +
                        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" " +
                        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" " +
                        "xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                        "SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" >" +
                        "<SOAP-ENV:Body><q1:ReadState xmlns:q1=\"http://beckhoff.org/message/\">" +
                        "<netId xsi:type=\"xsd:string\">" + sNetId + "</netId>" +
                        "<nPort xsi:type=\"xsd:int\">" + nPort + "</nPort>" +
                        "</q1:ReadState></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                return sendMessage(message, "http://beckhoff.org/action/TcAdsSync.ReadState", pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async);
            });

            this.writeControl = (function (sNetId, nPort, adsState, deviceState, pData, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {

                var message =
                        "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                        "<SOAP-ENV:Envelope " +
                        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" " +
                        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" " +
                        "xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                        "SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" >" +
                        "<SOAP-ENV:Body><q1:WriteControl xmlns:q1=\"http://beckhoff.org/message/\">" +
                        "<netId xsi:type=\"xsd:string\">" + sNetId + "</netId>" +
                        "<nPort xsi:type=\"xsd:int\">" + nPort + "</nPort>" +
                        "<adsState xsi:type=\"xsd:int\">" + adsState + "</adsState>" +
                        "<deviceState xsi:type=\"xsd:int\">" + deviceState + "</deviceState>" +
                        "<pData xsi:type=\"xsd:base64Binary\">" + pData + "</pData>" +
                        "</q1:WriteControl></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                return sendMessage(message, "http://beckhoff.org/action/TcAdsSync.WriteControl", pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async);
            });

            this.write = (function (sNetId, nPort, nIndexGroup, nIndexOffset, pData, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {

                var message =
                        "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                        "<SOAP-ENV:Envelope " +
                        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" " +
                        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" " +
                        "xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                        "SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" >" +
                        "<SOAP-ENV:Body><q1:Write xmlns:q1=\"http://beckhoff.org/message/\">" +
                        "<netId xsi:type=\"xsd:string\">" + sNetId + "</netId>" +
                        "<nPort xsi:type=\"xsd:int\">" + nPort + "</nPort>" +
                        "<indexGroup xsi:type=\"xsd:unsignedInt\">" + nIndexGroup + "</indexGroup>" +
                        "<indexOffset xsi:type=\"xsd:unsignedInt\">" + nIndexOffset + "</indexOffset>" +
                        "<pData xsi:type=\"xsd:base64Binary\">" + pData + "</pData>" +
                        "</q1:Write></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                return sendMessage(message, "http://beckhoff.org/action/TcAdsSync.Write", pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async);
            });

            this.read = (function (sNetId, nPort, nIndexGroup, nIndexOffset, cbLen, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {

                var message =
                        "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                        "<SOAP-ENV:Envelope " +
                        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" " +
                        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" " +
                        "xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                        "SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" >" +
                        "<SOAP-ENV:Body><q1:Read xmlns:q1=\"http://beckhoff.org/message/\">" +
                        "<netId xsi:type=\"xsd:string\">" + sNetId + "</netId>" +
                        "<nPort xsi:type=\"xsd:int\">" + nPort + "</nPort>" +
                        "<indexGroup xsi:type=\"xsd:unsignedInt\">" + nIndexGroup + "</indexGroup>" +
                        "<indexOffset xsi:type=\"xsd:unsignedInt\">" + nIndexOffset + "</indexOffset>" +
                        "<cbLen xsi:type=\"xsd:int\">" + cbLen + "</cbLen>" +
                        "</q1:Read></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                return sendMessage(message, "http://beckhoff.org/action/TcAdsSync.Read", pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async);
            });

            var handleSyncResponse = function (xhr) {

                var errorMessage = undefined, errorCode = 0;

                if (xhr.readyState != 4 || xhr.status != 200) {
                    // Request has been aborted.
                    //  Maybe because of timeout.
                    var resp = undefined;
                    try {
                        resp = new TcAdsWebService.Response(
                            true, new TcAdsWebService.ResquestError(xhr.status, xhr.statusText), undefined, false);
                    } catch (err) {
                        // Internet Explorer throws exception on abort
                        resp = new TcAdsWebService.Response(
                            true, new TcAdsWebService.ResquestError(0, 0), undefined, false);
                    }

                    return resp;
                }

                var sSoapResponse = xhr.responseXML.documentElement;
                var faultstringNodes = sSoapResponse.getElementsByTagName('faultstring');
                if (faultstringNodes.length != 0) {

                    errorMessage = faultstringNodes[0].firstChild.data;
                    var errorCodeNodes = sSoapResponse.getElementsByTagName('errorcode');

                    if (errorCodeNodes.length != 0) {
                        errorCode = sSoapResponse.getElementsByTagName('errorcode')[0].firstChild.data;
                    } else {
                        errorCode = "-";
                    }

                    var resp = new TcAdsWebService.Response(
                                true, new TcAdsWebService.Error(errorMessage, errorCode), undefined, false);
                    return resp;

                } else {

                    var ppDataNodes = sSoapResponse.getElementsByTagName('ppData');
                    var ppRdDataNodes = sSoapResponse.getElementsByTagName('ppRdData');
                    var pAdsStateNodes = sSoapResponse.getElementsByTagName('pAdsState');
                    var pDeviceStateNodes = sSoapResponse.getElementsByTagName('pDeviceState');

                    var soapData = undefined;
                    if (ppDataNodes.length != 0) {
                        //read
                        soapData = ppDataNodesfirstChild.data;
                    } else if (ppRdDataNodes.length != 0) {
                        // readwrite
                        soapData = ppRdDataNodes[0].firstChild.data;
                    } else if (pAdsStateNodes.length != 0 && pDeviceStateNodes.length) {
                        // readState
                        var adsState = pAdsStateNodes[0].firstChild.data;
                        var deviceState = pDeviceStateNodes[0].firstChild.data;

                        var writer = new TcAdsWebService.DataWriter();
                        writer.writeWORD(parseInt(adsState, 10));
                        writer.writeWORD(parseInt(deviceState, 10));

                        soapData = writer.getBase64EncodedData();
                    }

                    if (soapData) {
                        var resp = new TcAdsWebService.Response(
                                            false,
                                            undefined,
                                            new TcAdsWebService.DataReader(soapData), false);
                        return resp;
                    } else {
                        // write completes without data in response
                        var resp = new TcAdsWebService.Response(false, undefined, undefined, false);
                        return resp;
                    }
                }
            }

            var handleAsyncResponse = function (xhr, pCallback, userState) {

                if (xhr.readyState < 4) {
                    if (pCallback) {
                        var resp = new TcAdsWebService.Response(false, undefined, undefined, true);
                        pCallback(resp, userState);
                    }
                }

                if (xhr.readyState == 4) {

                    if (xhr.status == 200) {

                        var errorMessage = undefined, errorCode = 0;

                        var sSoapResponse = xhr.responseXML.documentElement;
                        var faultstringNodes = sSoapResponse.getElementsByTagName('faultstring');
                        if (faultstringNodes.length != 0) {

                            errorMessage = faultstringNodes[0].firstChild.data;
                            var errorCodeNodes = sSoapResponse.getElementsByTagName('errorcode');

                            if (errorCodeNodes.length != 0) {
                                errorCode = sSoapResponse.getElementsByTagName('errorcode')[0].firstChild.data;
                            } else {
                                errorCode = "-";
                            }

                            if (pCallback) {
                                var resp = new TcAdsWebService.Response(
                                            true, new TcAdsWebService.Error(errorMessage, errorCode), undefined, false);
                                pCallback(resp, userState);
                            }

                        } else {

                            var ppDataNodes = sSoapResponse.getElementsByTagName('ppData');
                            var ppRdDataNodes = sSoapResponse.getElementsByTagName('ppRdData');
                            var pAdsStateNodes = sSoapResponse.getElementsByTagName('pAdsState');
                            var pDeviceStateNodes = sSoapResponse.getElementsByTagName('pDeviceState');

                            var soapData = undefined;
                            if (ppDataNodes.length != 0) {
                                //read
                                soapData = ppDataNodesfirstChild.data;
                            } else if (ppRdDataNodes.length != 0) {
                                // readwrite
                                soapData = ppRdDataNodes[0].firstChild.data;
                            } else if (pAdsStateNodes.length != 0 && pDeviceStateNodes.length) {
                                // readState
                                var adsState = pAdsStateNodes[0].firstChild.data;
                                var deviceState = pDeviceStateNodes[0].firstChild.data;

                                var writer = new TcAdsWebService.DataWriter();
                                writer.writeWORD(parseInt(adsState, 10));
                                writer.writeWORD(parseInt(deviceState, 10));

                                soapData = writer.getBase64EncodedData();
                            }

                            if (soapData) {
                                if (pCallback) {
                                    var resp = new TcAdsWebService.Response(
                                                false, undefined, new TcAdsWebService.DataReader(soapData), false);
                                    if (pCallback)
                                        pCallback(resp, userState);
                                }
                            } else {

                                // write completes without data in response
                                if (pCallback) {
                                    var resp = new TcAdsWebService.Response(false, undefined, undefined, false);
                                    pCallback(resp, userState);
                                }
                            }
                        }

                    } else {
                        // Request has been aborted.
                        //  Maybe because of timeout.
                        if (pCallback) {

                            var resp = undefined;
                            try {
                                resp = new RTcAdsWebService.esponse(
                            true, new TcAdsWebService.ResquestError(xhr.status, xhr.statusText), undefined, false);
                            } catch (err) {
                                // Internet Explorer throws exception on abort
                                resp = new TcAdsWebService.Response(
                            true, new TcAdsWebService.ResquestError(0, 0), undefined, false);
                            }
                            pCallback(resp, userState);
                        }
                    }
                }
            }

            var sendMessage = function (message, method, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {

                if (async == null || async == undefined)
                    async = true;

                var xhr = undefined;
                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else {
                    try {
                        // MS Internet Explorer (ab v6)
                        xhr = ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e) {
                        try {
                            // MS Internet Explorer (ab v5)
                            xhr = new ActiveXObject("Msxml2.XMLHTTP");
                        } catch (e) {
                            xhr = undefined;
                        }
                    }
                }

                if (xhr == undefined)
                    return null;

                if (async) {
                    xhr.onreadystatechange = function () {
                        handleAsyncResponse(xhr, pCallback, userState);
                    }
                }

                if (sServiceUser && sServicePassword) {
                    xhr.open("POST", sServiceUrl, async, sServiceUser, sServicePassword);
                } else {
                    xhr.open("POST", sServiceUrl, async);
                }

                if ("timeout" in xhr && ajaxTimeout)
                    xhr.timeout = ajaxTimeout;

                if ("ontimeout" in xhr && ajaxTimeoutCallback) {
                    xhr.ontimeout = ajaxTimeoutCallback;
                }

                xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");

                xhr.send(message);

                if (!async) {
                    return handleSyncResponse(xhr);
                }
                else {
                    return null;
                }
            }
        });

        this.DataReader = (function (data) {

            this.offset = 0;
            this.decodedData = Base64.decode(data);

            this.getTypeString = (function () {
                return "TcAdsWebService.DataReader";
            });

            this.readSINT = (function () {
                var res = convertDataToInt(this.decodedData.substr(this.offset, 1), 1);
                this.offset = this.offset + 1;
                return res;
            });

            this.readINT = (function () {
                var res = convertDataToInt(this.decodedData.substr(this.offset, 2), 2);
                this.offset = this.offset + 2;
                return res;
            });

            this.readDINT = (function () {
                var res = convertDataToInt(this.decodedData.substr(this.offset, 4), 4);
                this.offset = this.offset + 4;
                return res;
            });

            this.readBYTE = (function () {
                var res = convertDataToUInt(this.decodedData.substr(this.offset, 1), 1);
                this.offset = this.offset + 1;
                return res;
            });

            this.readWORD = (function () {
                var res = convertDataToUInt(this.decodedData.substr(this.offset, 2), 2);
                this.offset = this.offset + 2;
                return res;
            });

            this.readDWORD = (function () {
                var res = convertDataToUInt(this.decodedData.substr(this.offset, 4), 4);
                this.offset = this.offset + 4;
                return res;
            });

            this.readBOOL = (function () {
                var res = this.decodedData.substr(this.offset, 1).charCodeAt(0);
                this.offset = this.offset + 1;
                return res;
            });

            this.readString = (function (length) {

                if (isNaN(length)) {
                    throw "Parameter \"length\" has to be a valid number.";
                }

                var res = this.decodedData.substr(this.offset, length);
                this.offset = this.offset + length;
                return res;
            });

            this.readREAL = (function () {
                var decData = [];
                decData[0] = convertDataToUInt(this.decodedData.substr(this.offset + 0, 1), 1);
                decData[1] = convertDataToUInt(this.decodedData.substr(this.offset + 1, 1), 1);
                decData[2] = convertDataToUInt(this.decodedData.substr(this.offset + 2, 1), 1);
                decData[3] = convertDataToUInt(this.decodedData.substr(this.offset + 3, 1), 1);

                var binData = [];
                binData[0] = dec2Binary(decData[0]);
                binData[1] = dec2Binary(decData[1]);
                binData[2] = dec2Binary(decData[2]);
                binData[3] = dec2Binary(decData[3]);

                var binStr = binData[3] + binData[2] + binData[1] + binData[0];

                var res = binary2Real(binStr, TcAdsWebService.TcAdsWebServiceDataTypes.REAL);
                this.offset = this.offset + 4;
                return res;
            });

            this.readLREAL = (function () {
                var decData = [];
                decData[0] = convertDataToUInt(this.decodedData.substr(this.offset + 0, 1), 1);
                decData[1] = convertDataToUInt(this.decodedData.substr(this.offset + 1, 1), 1);
                decData[2] = convertDataToUInt(this.decodedData.substr(this.offset + 2, 1), 1);
                decData[3] = convertDataToUInt(this.decodedData.substr(this.offset + 3, 1), 1);
                decData[4] = convertDataToUInt(this.decodedData.substr(this.offset + 4, 1), 1);
                decData[5] = convertDataToUInt(this.decodedData.substr(this.offset + 5, 1), 1);
                decData[6] = convertDataToUInt(this.decodedData.substr(this.offset + 6, 1), 1);
                decData[7] = convertDataToUInt(this.decodedData.substr(this.offset + 7, 1), 1);

                var binData = [];
                binData[0] = dec2Binary(decData[0]);
                binData[1] = dec2Binary(decData[1]);
                binData[2] = dec2Binary(decData[2]);
                binData[3] = dec2Binary(decData[3]);
                binData[4] = dec2Binary(decData[4]);
                binData[5] = dec2Binary(decData[5]);
                binData[6] = dec2Binary(decData[6]);
                binData[7] = dec2Binary(decData[7]);

                var binStr = binData[7] + binData[6] + binData[5] + binData[4] + binData[3] + binData[2] + binData[1] + binData[0];

                var res = binary2Real(binStr, TcAdsWebService.TcAdsWebServiceDataTypes.LREAL);
                this.offset = this.offset + 8;
                return res;
            });
        });

        this.DataWriter = (function () {

            this.getTypeString = (function () {
                return "TcAdsWebService.DataWriter";
            });

            this.getBase64EncodedData = (function () {
                return Base64.encode(byteArrayToBinaryString(byteArray));
            });

            this.writeSINT = (function (value) {
                byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.Integer, 1, byteArray);
            });

            this.writeINT = (function (value) {
                byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.Integer, 2, byteArray);
            });

            this.writeDINT = (function (value) {
                byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.Integer, 4, byteArray);
            });

            this.writeBYTE = (function (value) {
                byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.UnsignedInteger, 1, byteArray);
            });

            this.writeWORD = (function (value) {
                byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.UnsignedInteger, 2, byteArray);
            });

            this.writeDWORD = (function (value) {
                byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.UnsignedInteger, 4, byteArray);
            });

            this.writeBOOL = (function (value) {
                byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.BOOL, 1, byteArray);
            });

            this.writeString = (function (value, length) {
                byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.String, length, byteArray);
            });

            this.writeREAL = (function (value) {
                byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.REAL, 4, byteArray);
            });

            this.writeLREAL = (function (value) {
                byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.LREAL, 8, byteArray);
            });

            var byteArray = [];

            var PrepareData = function (data, type, len, array) {
                var j = array.length;

                if (type == TcAdsWebService.TcAdsWebServiceDataTypes.String) {
                    var k;

                    for (k = 0; k < data.length; k++) {
                        array[j++] = data.charCodeAt(k);
                    }

                    for (; k < len; k++) {
                        array[j++] = 0;
                    }

                }
                else if (type == TcAdsWebService.TcAdsWebServiceDataTypes.BOOL) {
                    array[j++] = data;
                }
                else if (type == TcAdsWebService.TcAdsWebServiceDataTypes.Integer || type == TcAdsWebService.TcAdsWebServiceDataTypes.UnsignedInteger) {

                    if (len == 1) {
                        array[j++] = ToByte(parseInt((data >> (0)), 10));
                    }
                    else if (len == 2) {
                        data = parseInt(data);
                        array[j++] = ToByte(parseInt((data >> (0)), 10));
                        array[j++] = ToByte(parseInt((data >> (8)), 10));
                    }
                    else if (len == 4) {
                        data = parseInt(data);

                        if (isNaN(data))
                            data = 0;

                        array[j++] = ToByte(parseInt((data >> (0)), 10));
                        array[j++] = ToByte(parseInt((data >> (8)), 10));
                        array[j++] = ToByte(parseInt((data >> (16)), 10));
                        array[j++] = ToByte(parseInt((data >> (24)), 10));
                    }
                }
                else if (type == TcAdsWebService.TcAdsWebServiceDataTypes.REAL) {
                    var binary = real2Binary(data, type);

                    var subBytes = [];
                    subBytes[0] = binary.substring(0, 8);
                    subBytes[1] = binary.substring(8, 16);
                    subBytes[2] = binary.substring(16, 24);
                    subBytes[3] = binary.substring(24, 32);

                    array[j++] = binary2Dec(subBytes[3]);
                    array[j++] = binary2Dec(subBytes[2]);
                    array[j++] = binary2Dec(subBytes[1]);
                    array[j++] = binary2Dec(subBytes[0]);
                }
                else if (type == TcAdsWebService.TcAdsWebServiceDataTypes.LREAL) {
                    var binary = real2Binary(data, type);

                    var subBytes = [];
                    subBytes[0] = binary.substring(0, 8);
                    subBytes[1] = binary.substring(8, 16);
                    subBytes[2] = binary.substring(16, 24);
                    subBytes[3] = binary.substring(24, 32);

                    subBytes[4] = binary.substring(32, 40);
                    subBytes[5] = binary.substring(40, 48);
                    subBytes[6] = binary.substring(48, 56);
                    subBytes[7] = binary.substring(56, 64);

                    array[j++] = binary2Dec(subBytes[7]);
                    array[j++] = binary2Dec(subBytes[6]);
                    array[j++] = binary2Dec(subBytes[5]);
                    array[j++] = binary2Dec(subBytes[4]);
                    array[j++] = binary2Dec(subBytes[3]);
                    array[j++] = binary2Dec(subBytes[2]);
                    array[j++] = binary2Dec(subBytes[1]);
                    array[j++] = binary2Dec(subBytes[0]);
                }

                return array;
            }
        });

        this.TcAdsReservedIndexGroups = {
            "PlcRWMX": 16416,
            "PlcRWMB": 16416,
            "PlcRWRB": 16432,
            "PlcRWDB": 16448,
            "SymbolTable": 61440,
            "SymbolName": 61441,
            "SymbolValue": 61442,
            "SymbolHandleByName": 61443,
            "SymbolValueByName": 61444,
            "SymbolValueByHandle": 61445,
            "SymbolReleaseHandle": 61446,
            "SymbolInfoByName": 61447,
            "SymbolVersion": 61448,
            "SymbolInfoByNameEx": 61449,
            "SymbolDownload": 61450,
            "SymbolUpload": 61451,
            "SymbolUploadInfo": 61452,
            "SymbolNote": 61456,
            "IOImageRWIB": 61472,
            "IOImageRWIX": 61473,
            "IOImageRWOB": 61488,
            "IOImageRWOX": 61489,
            "IOImageClearI": 61504,
            "IOImageClearO": 61520,
            "DeviceData": 61696
        };

        this.TcAdsWebServiceDataTypes = {
            "String": 0,
            "BOOL": 1,
            "Integer": 2,
            "UnsignedInteger": 3,
            "LREAL": 4,
            "REAL": 5
        };

        this.AdsState = {
            "INVALID"	: 0,
            "IDLE" : 1,
            "RESET" : 2,
            "INIT" : 3,
            "START" : 4,
            "RUN" : 5,
            "STOP" : 6,
            "SAVECFG"	: 7,
            "LOADCFG"	: 8,
            "POWERFAILURE" : 9,
            "POWERGOOD" : 10,
            "ERROR" : 11,
            "SHUTDOWN" : 12,
            "SUSPEND"	: 13,
            "RESUME" : 14,
            "CONFIG" : 15,	
            "RECONFIG" : 16	
        };

        var byteArrayToBinaryString = function (arr) {
            var res = "";
            for (var i = 0; i < arr.length; i++) {
                res += String.fromCharCode(arr[i] & 0xFF);
            }
            return res;
        }

        var Base64 = (function () {

            var encode = function (data) {
                var out = "", c1, c2, c3, e1, e2, e3, e4;
                for (var i = 0; i < data.length; ) {
                    c1 = data.charCodeAt(i++);
                    c2 = data.charCodeAt(i++);
                    c3 = data.charCodeAt(i++);
                    e1 = c1 >> 2;
                    e2 = ((c1 & 3) << 4) + (c2 >> 4);
                    e3 = ((c2 & 15) << 2) + (c3 >> 6);
                    e4 = c3 & 63;
                    if (isNaN(c2))
                        e3 = e4 = 64;
                    else if (isNaN(c3))
                        e4 = 64;
                    out += tab.charAt(e1) + tab.charAt(e2) + tab.charAt(e3) + tab.charAt(e4);
                }
                return out;
            }

            var decode = function (data) {
                var out = "", c1, c2, c3, e1, e2, e3, e4;
                for (var i = 0; i < data.length; ) {
                    e1 = tab.indexOf(data.charAt(i++));
                    e2 = tab.indexOf(data.charAt(i++));
                    e3 = tab.indexOf(data.charAt(i++));
                    e4 = tab.indexOf(data.charAt(i++));
                    c1 = (e1 << 2) + (e2 >> 4);
                    c2 = ((e2 & 15) << 4) + (e3 >> 2);
                    c3 = ((e3 & 3) << 6) + e4;
                    out += String.fromCharCode(c1);
                    if (e3 != 64)
                        out += String.fromCharCode(c2);
                    if (e4 != 64)
                        out += String.fromCharCode(c3);
                }
                return out;
            }

            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            return { encode: encode, decode: decode };
        })();

        var real2Binary = function (value, type) {

            var exp = 0, man = 0, bias = 0;

            switch (type) {

                case TcAdsWebService.TcAdsWebServiceDataTypes.LREAL:
                    exp = 11;
                    man = 52;
                    bias = 1023;
                    break;

                case TcAdsWebService.TcAdsWebServiceDataTypes.REAL:
                default:
                    exp = 8;
                    man = 23;
                    bias = 127;
            }

            var sign = (value >= 0.0) ? 0 : 1;

            var n = 0, power, sign2;
            if (value > 0 || value < 0) {
                if (value < 2 && value > -2)
                    sign2 = -1;
                else sign2 = 1;

                for (power = 0; n < 1 || n > 2; ++power) {
                    n = Math.pow(-1, sign) * value / (Math.pow(2, sign2 * power));
                }
                power--;
            } else {
                power = bias;
                sign2 = -1;
            }

            var exponent = bias + (sign2 * power);
            exponent = exponent.toString(2);

            for (var i = exponent.length; i < exp; i++) {
                exponent = "0" + exponent;
            }

            var n2 = 0, temp = 0, fraction = "";
            n = n - 1;
            for (var i = 1; i < (man + 1); i++) {
                temp = n2 + 1 / Math.pow(2, i);
                if (temp <= n) {
                    n2 = temp;
                    fraction += "1";
                }
                else fraction += "0";
            }

            var res = sign + exponent + fraction;
            return res;
        }

        var binary2Real = function (binary, type) {
            var neg, nullE = true, nullF = true, oneE = true, strE = "", x = 0, exp, man, bias;

            if ((binary.charAt(0) == 0))
                neg = false;
            else
                neg = true;

            switch (type) {

                case TcAdsWebService.TcAdsWebServiceDataTypes.LREAL:
                    exp = 11;
                    man = 52;
                    bias = 1023;
                    break;

                case TcAdsWebService.TcAdsWebServiceDataTypes.REAL:
                default:
                    exp = 8;
                    man = 23;
                    bias = 127;
            }

            for (var i = 1; i <= exp; i++) {
                strE += binary.charAt(i);

                if (binary.charAt(i) != "0")
                    nullE = false;

                if (binary.charAt(i) != "1")
                    oneE = false;
            }

            var strF = "";

            for (var i = exp + 1; i <= exp + man; i++) {
                strF += binary.charAt(i);

                if (binary.charAt(i) != "0")
                    nullF = false;
            }

            if (nullE && nullF) {
                //return ((!neg) ? "0" : "-0");
                // Return zero for negative and positive zero
                return 0.0;
            }

            if (oneE && nullF)
                return Infinity;

            if (oneE && nullF)
                return NaN;

            var exponent = binary2Dec(strE) - bias;

            var fraction = 0;

            for (var i = 0; i < strF.length; ++i) {
                fraction = fraction + parseInt(strF.charAt(i)) * Math.pow(2, -(i + 1));
            }

            fraction = fraction + 1;
            var ret = Math.pow(-1, binary.charAt(0)) * fraction * Math.pow(2, exponent);

            return ret;
        }

        var ToByte = function (v) {
            return parseInt(v, 10) & 255;
        }

        var dec2Binary = function (value) {
            var buf = "";
            var buf2 = "";
            var quotient = value;
            var i = 0;

            do {
                buf += (Math.floor(quotient % 2) == 1 ? "1" : "0");
                quotient /= 2;
                i++;
            }
            while (i < 8);

            buf = buf.split("").reverse().join("");

            return buf;
        }

        var binary2Dec = function (binary) {
            var ret = 0;

            for (var i = 0; i < binary.length; ++i) {
                if (binary.charAt(i) == '1')
                    ret = ret + Math.pow(2, (binary.length - i - 1));
            }

            return ret;
        }

        var convertDataToUInt = function (data, len) {
            var res = 0;

            if (len == 4) {
                res = (data.charCodeAt(3) << 24 | data.charCodeAt(2) << 16 | data.charCodeAt(1) << 8 | data.charCodeAt(0 + 0)) >>> 0; // ">>> 0" = handle value as unsigned
            }
            else if (len == 2) {
                res = (data.charCodeAt(1) << 8 | data.charCodeAt(0)) >>> 0; // ">>> 0" = handle value as unsigned
            }
            else if (len == 1) {
                res = data.charCodeAt(0) >>> 0; // ">>> 0" = handle value as unsigned
            }

            return res;
        }

        var convertDataToInt = function (data, len) {
            var res = 0;

            if (len == 4) {
                res = (data.charCodeAt(3) << 24 | data.charCodeAt(2) << 16 | data.charCodeAt(1) << 8 | data.charCodeAt(0));
            }
            else if (len == 2) {
                var cCode = (data.charCodeAt(1) << 8 | data.charCodeAt(0));
                var sign = (cCode & 0x8000);
                if (sign == 0x8000) {
                    // Byte 1 = 100000, Byte 0 = 000000
                    //  Fill left 16 Bytes with 1
                    cCode = cCode | 0xFFFF8000;
                } else {
                    // Byte 1 = 000000, Byte 0 = 000000
                    //  Fill left 16 Bytes with 0
                    cCode = cCode & 0x7FFF;
                }
                res = cCode;
            }
            else if (len == 1) {
                // JavaScript handles numbers always as 32 bit integer values;
                var cCode = data.charCodeAt(0);
                var sign = (cCode & 0x80);
                if (sign == 0x80) {
                    // byte_0 = 100000
                    //  Fill left 24 Bytes with 1
                    cCode = cCode | 0xFFFFFF80;
                } else {
                    // byte_0 = 000000
                    //  Fill left 24 Bytes with 0
                    cCode = cCode & 0x7F;
                }
                res = cCode;
            }

            return res;
        }

    });
    ////////////////////////////////////////////////////
    // Expose TcAdsWebService instance to window object.
    window.TcAdsWebService = TcAdsWebService;
    ////////////////////////////////////////////////////
})(window);
////////////////////////////////////////////////////

  
  (function (window) {
  
			 /* Wrapper für Ausgaben auf der Konsole / debugging
			 * 
			 * @param {Mixed} message  Nachricht die angezeigt werden soll
			 */
			function log(message) {
				try {
					window.console.log(message);
				} catch(e) {
					//fallback
					alert(message);
				}
			}
			
            var NETID = ""; // Empty string for local machine;
            var PORT = "801"; // PLC Runtime port;
            var SERVICE_URL = "http://192.168.100.1/TcAdsWebService/TcAdsWebService.dll";
			//var SERVICE_URL = "http://" + window.document.location.hostname + "/TcAdsWebService/TcAdsWebService.dll"; // HTTP path to the target TcAdsWebService;

            // The TcAdsWebService.Client object for ajax communication with the TcAdsWebService;
            var client = new TcAdsWebService.Client(SERVICE_URL, null, null);

            var general_timeout = 500; // This timeout value is used for all requests;

            var readLoopID = null; // The id of the read interval; Can be used to stop the polling if need;
            var readLoopDelay = 100;

            var readSymbolValuesData = null; // This variable will store the Base64 encoded binary data string for the read sumcommando;

            // Array of symbol names to read;
            var handlesVarNames = 
					[
                    ".DRIVE.INPUTS.ACTUALDISTANCE_MM",".DRIVE.INPUTS.TARGETSPEED_MMS",
					".DRIVE.OUTPUTS.ACTUALDISTANCE_MM",".DRIVE.OUTPUTS.ACTUALSPEED_MMS",".DRIVE.OUTPUTS.TARGETSPEED_MMS",
					"RUNDRIVING.REDUCE.STATE_TARGETSPEED_MMS","RUNDRIVING.REDUCE.STEERING_TARGETSPEED_MMS","RUNDRIVING.REDUCE.HEIGHT_TARGETSPEED_MMS","RUNDRIVING.REDUCE.SENSOR_TARGETSPEED_MMS","RUNDRIVING.REDUCE.NEWTARGETSPEED_MMS","RUNDRIVING.REDUCE.SLOWDISTANCE_TARGETSPEED_MMS",  
					"RUNDRIVING.DIAGNOSTICS.ACTIVEENTRIES[0].ERRORCODE","RUNDRIVING.DIAGNOSTICS.ACTIVEENTRIES[1].ERRORCODE","RUNDRIVING.DIAGNOSTICS.ACTIVEENTRIES[2].ERRORCODE","RUNDRIVING.DIAGNOSTICS.ACTIVEENTRIES[3].ERRORCODE","RUNDRIVING.DIAGNOSTICS.ACTIVEENTRIES[4].ERRORCODE",
					"RUNDRIVING.DIAGNOSTICS.PASSIVEENTRIES[0].ERRORCODE","RUNDRIVING.DIAGNOSTICS.PASSIVEENTRIES[1].ERRORCODE","RUNDRIVING.DIAGNOSTICS.PASSIVEENTRIES[2].ERRORCODE","RUNDRIVING.DIAGNOSTICS.PASSIVEENTRIES[3].ERRORCODE","RUNDRIVING.DIAGNOSTICS.PASSIVEENTRIES[4].ERRORCODE",   
					"RUNDRIVING.SLOWDOWNREQURIED","RUNDRIVING.ALLOWFULLSPEEDINLOADDIRECTION",//22
					"RUNDRIVING.DRIVEBRAKINGDECELERATIONSUPERVISION.ENABLE","RUNDRIVING.DRIVEBRAKINGDECELERATIONSUPERVISION.ISOK","RUNDRIVING.DRIVEDIRECTIONSUPERVISION.ENABLE","RUNDRIVING.DRIVEDIRECTIONSUPERVISION.ISOK",
					"RUNDRIVING.DRIVEDISTANCESUPERVISION.ENABLE","RUNDRIVING.DRIVEDISTANCESUPERVISION.ISOK","RUNDRIVING.DRIVERANGECURVESUPERVISION.ENABLE","RUNDRIVING.DRIVERANGECURVESUPERVISION.ISOK",
					"RUNDRIVING.DRIVERANGESTARIGHTAHEADSUPERVISION.ENABLE","RUNDRIVING.DRIVERANGESTARIGHTAHEADSUPERVISION.ISOK","RUNDRIVING.DRIVESELFMOVEMENTSUPERVISION.ISINMONITORINGSTATE", //neu hinzu 03032015[1 mal Bool] erledigt
					"RUNDRIVING.DRIVESELFMOVEMENTSUPERVISION.ISOK",//33					
					".STEERING.INPUTS.ACTUALSTEERINGANGLE_CDEG",".STEERING.INPUTS.TARGETSTEERINGANGLE_CDEG",
					".STEERING.OUTPUTS.ACTUALSTEERINGANGLE_CDEG",".STEERING.OUTPUTS.TARGETSTEERINGANGLE_CDEG",//37
					"RUNSTEERING.PPARUNNING","RUNSTEERING.OUTPUT.TESTINGPOSITIVEANGLE","RUNSTEERING.OUTPUT.TESTINGNEGATIVEANGLE","RUNSTEERING.TPOSTRUN.Q",//41
					"RUNSTEERING.DIAGNOSTICS.ACTIVEENTRIES[0].ERRORCODE","RUNSTEERING.DIAGNOSTICS.ACTIVEENTRIES[1].ERRORCODE","RUNSTEERING.DIAGNOSTICS.ACTIVEENTRIES[2].ERRORCODE","RUNSTEERING.DIAGNOSTICS.ACTIVEENTRIES[3].ERRORCODE","RUNSTEERING.DIAGNOSTICS.ACTIVEENTRIES[4].ERRORCODE",
					"RUNSTEERING.DIAGNOSTICS.PASSIVEENTRIES[0].ERRORCODE","RUNSTEERING.DIAGNOSTICS.PASSIVEENTRIES[1].ERRORCODE","RUNSTEERING.DIAGNOSTICS.PASSIVEENTRIES[2].ERRORCODE","RUNSTEERING.DIAGNOSTICS.PASSIVEENTRIES[3].ERRORCODE","RUNSTEERING.DIAGNOSTICS.PASSIVEENTRIES[4].ERRORCODE",//51
					"RUNSTEERING.STEERRANGEHISTORYSUPERVISION.ERRORCONDITION",//52
					"RUNFORK.RAISINGFORK","RUNFORK.LOWERINGFORK","RUNFORK.STANDINGONHOMEPOSITION",//55
					"RUNFORK.LOSTREFERENCE.Q1",//56
					"RUNFORK.LIFTDIRECTIONSUPERVISION.ENABLE","RUNFORK.LIFTDIRECTIONSUPERVISION.ISOK","RUNFORK.LIFTRANGESUPERVISION.ENABLE","RUNFORK.LIFTRANGESUPERVISION.ISOK","RUNFORK.LIFTRANGEHISTORYSUPERVISION.ENABLE","RUNFORK.LIFTRANGEHISTORYSUPERVISION.ISOK", //neu hinzu 03032015[6 mal Bool]
					".FORK.INPUTS.ACTUALLIFTHEIGHT_MM",".FORK.INPUTS.TARGETLIFTHEIGHT_MM",".FORK.OUTPUTS.ACTUALLIFTHEIGHT_MM",".FORK.OUTPUTS.ACTUALLIFTSPEED_MMS",".FORK.OUTPUTS.TARGETLIFTSPEED_MMS",//61
					"RUNFORK.OUTPUT.TARGETREACHED","RUNFORK.OUTPUT.ISMOVINGONINNERMAST","RUNFORK.OUTPUT.ISMOVINGONOUTERMAST","RUNFORK.OUTPUT.ABOVEREARSENSORLEVEL", //neu hinzu 03032015[4 mal Bool] 
					"RUNFORK.CONTROL.TRY.ABSDISTANCETOTARGET_MM", //neu hinzu 03032015 [1mal Int]
					"RUNFORK.DIAGNOSTICS.ACTIVEENTRIES[0].ERRORCODE","RUNFORK.DIAGNOSTICS.ACTIVEENTRIES[1].ERRORCODE","RUNFORK.DIAGNOSTICS.ACTIVEENTRIES[2].ERRORCODE","RUNFORK.DIAGNOSTICS.ACTIVEENTRIES[3].ERRORCODE","RUNFORK.DIAGNOSTICS.ACTIVEENTRIES[4].ERRORCODE",
					"RUNFORK.DIAGNOSTICS.PASSIVEENTRIES[0].ERRORCODE","RUNFORK.DIAGNOSTICS.PASSIVEENTRIES[1].ERRORCODE","RUNFORK.DIAGNOSTICS.PASSIVEENTRIES[2].ERRORCODE","RUNFORK.DIAGNOSTICS.PASSIVEENTRIES[3].ERRORCODE","RUNFORK.DIAGNOSTICS.PASSIVEENTRIES[4].ERRORCODE"   //71
					];

            // Symbol handle variables;
            var hInputActualDistance_mm = null;var hInputTargetSpeed_mms = null;
			var hOutputActualDistance_mm = null;var hOutputActualSpeed_mms = null;var hOutpuntTargetSpeed_mms = null;
			var hDriveReduceStateTargetspeed_mms = null; var hDriveReduceSteeringTargetSpeed_mms = null;var hDriveReduceHeightTargetSpeed = null; var hDriveReduceSensorTargetspeed_mms = null;var hDriveReduceNewtargetspeed_mms = null; var hDriveReduceSlowDistanceTargetspeed_mms = null;
			var hDriveDiagnosticsActiveEntries0Errorcode = null;var hDriveDiagnosticsActiveEntries1Errorcode = null;var hDriveDiagnosticsActiveEntries2Errorcode = null;var hDriveDiagnosticsActiveEntries3Errorcode = null;var hDriveDiagnosticsActiveEntries4Errorcode = null;
			var hDriveDiagnosticsPassiveEntries0Errorcode = null;var hDriveDiagnosticsPassiveEntries1Errorcode = null;var hDriveDiagnosticsPassiveEntries2Errorcode = null;var hDriveDiagnosticsPassiveEntries3Errorcode = null;var hDriveDiagnosticsPassiveEntries4Errorcode = null;
			var hDriveSlowDownRequired = null;var hDriveAllowFullSpeedInLoadDirection = null;var hDriveDrivebrakingDecelerationSupervisionEnable = null;var hDriveDrivebrakingDecelerationSupervisionIsOk = null;var hDriveDrivedirectionSupervisionEnable = null;var hDriveDrivedirectionSupervisionIsOk = null;var hDriveDrivedistanceSupervisionEnable = null;var hDriveDrivedistanceSupervisionIsOk = null;
			var hDriveDriverangecurveSupervisionEnable = null; var hDriveDriverangecurveSupervisionIsOk = null;var hDriveDriverangestarightaheadSupervisionEnable = null;var hDriveDriverangestarightaheadSupervisionEnableIsOk = null;var hDriveDriveSelfmovementSupervisionIsOk = null; var hDriveDriveSelfmovementSupervisionIsInMonitoringState = null;
			var hSteeringInputsActualSteeringAngle_cdeg = null;var hSteeringInputsTargetSteeringAngle_cdeg = null;var hSteeringOutputsActualSteeringAngle_cdeg = null;var hSteeringOutputsTargetSteeringAngle_cdeg = null;var hSteeringDiagnosticsActiveEntries0Errorcode = null;var hSteeringDiagnosticsActiveEntries1Errorcode = null;
			var hSteeringDiagnosticsPassiveEntries0Errorcode = null;var hSteeringDiagnosticsPassiveEntries1Errorcode = null;var hSteeringPPArunning = null;var hSteeringOutputTestingPositiveAngle = null;
			var hSteeringOutputTestingNegativeAngle = null;var hSteeringTpostRunQ = null;var hSteeringSteerRangeHistorySupervisionErrorCondition = null;
			var hForkRaisingFork = null;var ForkLoweringFork = null;var ForkStandingOnHomePosition = null;var hForkLostReferenceQ1 = null;
			var hRunforkLiftDirectionSupervisionEnable = null;var hRunforkLiftDirectionSupervisionIsOk = null; var hRunforkLiftRangeSupervisionEnable = null;var hRunforkLiftRangeSupervisionIsOk = null;var hRunforkLiftRangeHistorySupervisionEnable = null;var hRunforkLiftRangeHistorySupervisionIsOk = null;
			var hForkInputsActualLiftHeight_mm = null;var hForkInputsTargetLiftHeight_mm = null;var hForkOutputsActualLiftHeight_mm = null;var hForkOutputsActualLiftSpeed_mms = null;var hForkOutputsTargetLiftSpeed_mms = null;
			var hForkOutputTargetReached = null;var hForkOutputIsMovingOnInnermast = null;var hForkOutputIsMovingOnOutermast = null;var hForkOutputAboveRearSensorlevel = null;
			var hForkControlTryAbsDistanceToTarget_mm = null;
			var hForkDiagnosticsActiveEntries0Errorcode = null;var hForkDiagnosticsActiveEntries1Errorcode = null;var hForkDiagnosticsPassiveEntries0Errorcode = null;var hForkDiagnosticsPassiveEntries1Errorcode = null;
						
			                        
            // Occurs if the window has loaded;
            window.onload = (function () {

                // Create sumcommando for reading twincat symbol handles by symbol name;
                var handleswriter = new TcAdsWebService.DataWriter();

                // Write general information for each symbol handle to the TcAdsWebService.DataWriter object;
                for (var i = 0; i < handlesVarNames.length; i++) {
                    handleswriter.writeDINT(TcAdsWebService.TcAdsReservedIndexGroups.SymbolHandleByName);
                    handleswriter.writeDINT(0);
                    handleswriter.writeDINT(4); // Expected size; A handle has a size of 4 byte;
                    handleswriter.writeDINT(handlesVarNames[i].length); // The length of the symbol name string;
                }

                // Write symbol names after the general information to the TcAdsWebService.DataWriter object;
                for (var i = 0; i < handlesVarNames.length; i++) {
                    handleswriter.writeString(handlesVarNames[i]);
                }

                // Send the list-read-write command to the TcAdsWebService by use of the readwrite function of the TcAdsWebService.Client object;
                client.readwrite(
                    NETID,
                    PORT,
                    0xF082, // IndexGroup = ADS list-read-write command; Used to request handles for twincat symbols;
                    handlesVarNames.length, // IndexOffset = Count of requested symbol handles;
                    (handlesVarNames.length * 4) + (handlesVarNames.length * 8), // Length of requested data + 4 byte errorcode and 4 byte length per twincat symbol;
                    handleswriter.getBase64EncodedData(),
                    RequestHandlesCallback,
                    null,
                    general_timeout,
                    RequestHandlesTimeoutCallback,
                    true);

            });

          

            // Occurs if the readwrite for the sumcommando has finished;
            var RequestHandlesCallback = (function (e, s) {

                if (e && e.isBusy) {
                    // HANDLE PROGRESS TASKS HERE;
                    // Exit callback function because request is still busy;
					log('Immer noch beschäftigt da PC');
                    return;
                }

                if (e && !e.hasError) {

                    // Get TcAdsWebService.DataReader object from TcAdsWebService.Response object;
                    var reader = e.reader;
					log(reader);

                    // Read error code and length for each handle;
                    for (var i = 0; i < handlesVarNames.length; i++) {

                        var err = reader.readDWORD();
                        var len = reader.readDWORD();

                        if (err != 0) {
                            // HANDLE SUMCOMMANDO ERRORS HERE;
							log('Wir haben da leider an Request handles ERROR mit de Variablen??!!');
							return;
                        }

                    }

                    // Read handles from TcAdsWebService.DataReader object;
			

				var handlesForVariables = [	
			 hInputActualDistance_mm = reader.readDWORD(),hInputTargetSpeed_mms = reader.readDWORD(),hOutputActualDistance_mm = reader.readDWORD(), hOutputActualSpeed_mms = reader.readDWORD(), hOutpuntTargetSpeed_mms = reader.readDWORD(),
			 hDriveReduceStateTargetspeed_mms = reader.readDWORD(),  hDriveReduceSteeringTargetSpeed_mms = reader.readDWORD(), hDriveReduceHeightTargetSpeed = reader.readDWORD(),  hDriveReduceSensorTargetspeed_mms = reader.readDWORD(),
			 hDriveReduceNewtargetspeed_mms = reader.readDWORD(), hDriveReduceSlowDistanceTargetspeed_mms = reader.readDWORD(),
			 hDriveDiagnosticsActiveEntries0Errorcode = reader.readDWORD(), hDriveDiagnosticsActiveEntries1Errorcode = reader.readDWORD(), hDriveDiagnosticsActiveEntries2Errorcode = reader.readDWORD(),hDriveDiagnosticsActiveEntries3Errorcode = reader.readDWORD(), hDriveDiagnosticsActiveEntries4Errorcode = reader.readDWORD(),
			 hDriveDiagnosticsPassiveEntries0Errorcode = reader.readDWORD(), hDriveDiagnosticsPassiveEntries1Errorcode = reader.readDWORD(),hDriveDiagnosticsPassiveEntries2Errorcode = reader.readDWORD(), hDriveDiagnosticsPassiveEntries3Errorcode = reader.readDWORD(), hDriveDiagnosticsPassiveEntries4Errorcode = reader.readDWORD(),
			 hDriveSlowDownRequired = reader.readDWORD(),hDriveAllowFullSpeedInLoadDirection = reader.readDWORD(),
			 hDriveDrivebrakingDecelerationSupervisionEnable = reader.readDWORD(), hDriveDrivebrakingDecelerationSupervisionIsOk = reader.readDWORD(),hDriveDrivedirectionSupervisionEnable = reader.readDWORD(),  hDriveDrivedirectionSupervisionIsOk = reader.readDWORD(), hDriveDrivedistanceSupervisionEnable = reader.readDWORD(), hDriveDrivedistanceSupervisionIsOk = reader.readDWORD(),
			 hDriveDriverangecurveSupervisionEnable = reader.readDWORD(),  hDriveDriverangecurveSupervisionIsOk = reader.readDWORD(), hDriveDriverangestarightaheadSupervisionEnable = reader.readDWORD(), hDriveDriverangestarightaheadSupervisionEnableIsOk = reader.readDWORD(),
			 hDriveDriveSelfmovementSupervisionIsInMonitoringState = reader.readDWORD() , hDriveDriveSelfmovementSupervisionIsOk = reader.readDWORD(),  
			 hSteeringInputsActualSteeringAngle_cdeg = reader.readDWORD(), hSteeringInputsTargetSteeringAngle_cdeg = reader.readDWORD(),
			 hSteeringOutputsActualSteeringAngle_cdeg = reader.readDWORD(), hSteeringOutputsTargetSteeringAngle_cdeg = reader.readDWORD(),
			 hSteeringPPArunning = reader.readDWORD(), hSteeringOutputTestingPositiveAngle = reader.readDWORD(),hSteeringOutputTestingNegativeAngle = reader.readDWORD(), hSteeringTpostRunQ = reader.readDWORD(),
			 hSteeringDiagnosticsActiveEntries0Errorcode = reader.readDWORD(),hSteeringDiagnosticsActiveEntries1Errorcode = reader.readDWORD(),hSteeringDiagnosticsActiveEntries2Errorcode = reader.readDWORD(),hSteeringDiagnosticsActiveEntries3Errorcode = reader.readDWORD(),hSteeringDiagnosticsActiveEntries4Errorcode = reader.readDWORD(),
			 hSteeringDiagnosticsPassiveEntries0Errorcode = reader.readDWORD(),hSteeringDiagnosticsPassiveEntries1Errorcode = reader.readDWORD(),hSteeringDiagnosticsPassiveEntries2Errorcode = reader.readDWORD(),hSteeringDiagnosticsPassiveEntries3Errorcode = reader.readDWORD(),hSteeringDiagnosticsPassiveEntries4Errorcode = reader.readDWORD(),
			 hSteeringSteerRangeHistorySupervisionErrorCondition = reader.readDWORD(),
			 hForkRaisingFork = reader.readDWORD(), hForkLoweringFork = reader.readDWORD(), hForkStandingOnHomePosition = reader.readDWORD(),
			 hForkLostReferenceQ1 = reader.readDWORD(),
			 hRunforkLiftDirectionSupervisionEnable = reader.readDWORD(), hRunforkLiftDirectionSupervisionIsOk = reader.readDWORD(), hRunforkLiftRangeSupervisionEnable = reader.readDWORD(), hRunforkLiftRangeSupervisionIsOk = reader.readDWORD(), hRunforkLiftRangeHistorySupervisionEnable = reader.readDWORD(), hRunforkLiftRangeHistorySupervisionIsOk = reader.readDWORD(),
			 hForkInputsActualLiftHeight_mm = reader.readDWORD(), hForkInputsTargetLiftHeight_mm = reader.readDWORD(), hForkOutputsActualLiftHeight_mm = reader.readDWORD(), hForkOutputsActualLiftSpeed_mms = reader.readDWORD(), hForkOutputsTargetLiftSpeed_mms = reader.readDWORD(),
			 hForkOutputTargetReached = reader.readDWORD(), hForkOutputIsMovingOnInnermast = reader.readDWORD() , hForkOutputIsMovingOnOutermast = reader.readDWORD() , hForkOutputAboveRearSensorlevel = reader.readDWORD() ,
			 hForkControlTryAbsDistanceToTarget_mm = reader.readDWORD(),
			 hForkDiagnosticsActiveEntries0Errorcode = reader.readDWORD(),hForkDiagnosticsActiveEntries1Errorcode = reader.readDWORD(),hForkDiagnosticsActiveEntries2Errorcode = reader.readDWORD(),hForkDiagnosticsActiveEntries3Errorcode = reader.readDWORD(),hForkDiagnosticsActiveEntries4Errorcode = reader.readDWORD(),
			 hForkDiagnosticsPassiveEntries0Errorcode = reader.readDWORD(),hForkDiagnosticsPassiveEntries1Errorcode = reader.readDWORD(),hForkDiagnosticsPassiveEntries2Errorcode = reader.readDWORD(),hForkDiagnosticsPassiveEntries3Errorcode = reader.readDWORD(),hForkDiagnosticsPassiveEntries4Errorcode = reader.readDWORD(),
										  ];		
			
			var VarSize = [2,2,2,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2,2,2,4,4,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2];
			
			
			
                    // Create sum commando to read symbol values based on the handle;
                    var readSymbolValuesWriter = new TcAdsWebService.DataWriter();

					
	
			var handlestring ="hInputActualDistance_mm;hInputTargetSpeed_mms;hOutputActualDistance_mm;hOutputActualSpeed_mms;hOutpuntTargetSpeed_mms;hDriveReduceStateTargetspeed_mms;hDriveReduceSteeringTargetSpeed_mms;hDriveReduceHeightTargetSpeed;hDriveReduceSensorTargetspeed_mms;hDriveReduceNewtargetspeed_mms;hDriveDiagnosticsActiveEntries0Errorcode;hDriveDiagnosticsActiveEntries1Errorcode;hDriveDiagnosticsActiveEntries2Errorcode;hDriveDiagnosticsActiveEntries3Errorcode;hDriveDiagnosticsActiveEntries4Errorcode;hDriveDiagnosticsPassiveEntries0Errorcode;hDriveDiagnosticsPassiveEntries1Errorcode;hDriveDiagnosticsPassiveEntries2Errorcode;hDriveDiagnosticsPassiveEntries3Errorcode;hDriveDiagnosticsPassiveEntries4Errorcode; hDriveSlowDownRequried;hDriveAllowFullSpeedInLoadDirection; hDriveDrivebrakingDecelerationSupervisionEnable;hDriveDrivebrakingDecelerationSupervisionIsOk;hDriveDrivedirectionSupervisionEnable;hDriveDrivedirectionSupervisionIsOk;hDriveDrivedistanceSupervisionEnable;hDriveDrivedistanceSupervisionIsOk;hDriveDriverangecurveSupervisionEnable;hDriveDriverangecurveSupervisionIsOk;hDriveDriverangestarightaheadSupervisionEnable;hDriveDriverangestarightaheadSupervisionEnableIsOk;hDriveDriveSelfmovementSupervisionEnable;hDriveDriveSelfmovementSupervisionIsOk;hSteeringInputsActualSteeringAngle_cdeg;hSteeringInputsTargetSteeringAngle_cdeg;hSteeringOutputsActualSteeringAngle_cdeg;hSteeringOutputsTargetSteeringAngle_cdeg;hSteeringDiagnosticsActiveEntries0Errorcode;hSteeringDiagnosticsActiveEntries1Errorcode;hSteeringDiagnosticsPassiveEntries0Errorcode;hSteeringDiagnosticsPassiveEntries1Errorcode;hSteeringPPArunning;hSteeringOutputTestingPositiveAngle;hSteeringOutputTestingNegativeAngle;hSteeringTpostRunQ;hSteeringSteerRangeHistorySupervisionErrorCondition;hForkRaisingFork; ForkLoweringFork;ForkStandingOnHomePosition;hForkLostReferenceQ1;hForkInputsActualLiftHeight_mm;hForkInputsTargetLiftHeight_mm;hForkOutputsActualLiftHeight_mm;hForkOutputsActualLiftSpeed_mms;hForkOutputsTargetLiftSpeed_mms;hForkDiagnosticsActiveEntries0Errorcode;hForkDiagnosticsActiveEntries1Errorcode;hForkDiagnosticsPassiveEntries0Errorcode;hForkDiagnosticsPassiveEntries1Errorcode;";
			var felder = handlestring.split(';');
			
					for (var k = 0; k < handlesForVariables.length; k++) {
                    
					//  "Input Actual Distance" // INT
                    readSymbolValuesWriter.writeDINT(TcAdsWebService.TcAdsReservedIndexGroups.SymbolValueByHandle); // IndexGroup
                    readSymbolValuesWriter.writeDINT(handlesForVariables[k]); // IndexOffset = The target handle
                    readSymbolValuesWriter.writeDINT(VarSize[k]); // Size to read;
																		 }
					// Get Base64 encoded data from TcAdsWebService.DataWriter;
                    readSymbolValuesData = readSymbolValuesWriter.getBase64EncodedData();

                    // Start cyclic reading of symbol values;
                    readLoopID = window.setInterval(ReadLoop, readLoopDelay);

                } else {

                    if (e.error.getTypeString() == "TcAdsWebService.ResquestError") {
                        // HANDLE TcAdsWebService.ResquestError HERE;
						log('Request TcAdsWebService handles Error: 1010');
                    }
                    else if (e.error.getTypeString() == "TcAdsWebService.Error") {
                        // HANDLE TcAdsWebService.Error HERE;
						log('TcAdsWebService handles Error: 1020');
                    }

                }

            });

            // Occurs if the readwrite for the sumcommando to request symbol handles runs into timeout;
            var RequestHandlesTimeoutCallback = (function () {
                log('ReadWrite Summenkommando Anfrage Erhalt Symbole dauert zu lang ==> timeout ');
            });

            // Interval callback for cyclic reading;
            var ReadLoop = (function () {

                // Send the read-read-write command to the TcAdsWebService by use of the readwrite function of the TcAdsWebService.Client object;
                client.readwrite(
                    NETID,
                    PORT,
                    0xF080, // 0xF080 = Read command;
                    handlesVarNames.length, // IndexOffset = Variables count;
                    143 + (handlesVarNames.length * 4), // Length of requested data + 4 byte errorcode per variable !!!!!!!!!!!!!
                    readSymbolValuesData,
                    ReadCallback,
                    null,
                    general_timeout,
                    ReadTimeoutCallback,
                    true);

            });

            // Occurs if the read-read-write command has finished;
            var ReadCallback = (function (e, s) {

                if (e && e.isBusy) {
                    // HANDLE PROGRESS TASKS HERE;
                    // Exit callback function because request is still busy;
					return;
                }

                if (e && !e.hasError) {

                    var reader = e.reader;
					log('Halle 90');

                    // Read error codes from begin of TcAdsWebService.DataReader object;
                    for (var i = 0; i < handlesVarNames.length; i++) {
                        var err = reader.readDWORD();
						log('Halle 100');
                        if (err != 0) {
                            // HANDLE SUMCOMMANDO ERRORS HERE;
							log('Halle 200');
                            //return;
                        }
                    }

								
	// READ Symbol data from TcAdsWebService.DataReader object;
    //  "Input aktuelle Distanzmessung"INT "Input Target Speed"INT "Output aktuelle Distanzmessung"INT "Output Actual Speed"REAL "Output Target Speed"REAL
    var InputActualDistance_mm = reader.readINT();var InputTargetSpeed_mms = reader.readINT();var OutputActualDistance = reader.readINT();var OutputActualSpeed_mms = reader.readREAL();var OutputTargetSpeed_mms = reader.readREAL();
    //  "Drive Reduce State Targetspeed_mms"INT "Drive Reduce Steering TargetSpeed_mms"INT "Drive Reduce Height TargetSpeed"INT "Drive Reduce Sensor Targetspeed_mms"INT "Drive Reduce Newtargetspeed_mms"INT
    var DriveReduceStateTargetspeed_mms = reader.readINT();var DriveReduceSteeringTargetSpeed_mms = reader.readINT();var DriveReduceHeightTargetSpeed = reader.readINT();var DriveReduceSensorTargetspeed_mms = reader.readINT();var DriveReduceNewtargetspeed_mms = reader.readINT();var DriveReduceSlowDistanceTargetspeed_mms = reader.readINT();
	// "Diagnostics Aktive und Passive Einträge 'Driving' die vorhanden sind. Momentan je 5 Stück gemapped"INT
	var DriveDiagnosticsActiveEntries0Errorcode = reader.readINT();var DriveDiagnosticsActiveEntries1Errorcode = reader.readINT();var DriveDiagnosticsActiveEntries2Errorcode = reader.readINT();var DriveDiagnosticsActiveEntries3Errorcode = reader.readINT();var DriveDiagnosticsActiveEntries4Errorcode = reader.readINT();
	var DriveDiagnosticsPassiveEntries0Errorcode = reader.readINT();var DriveDiagnosticsPassiveEntries1Errorcode = reader.readINT();var DriveDiagnosticsPassiveEntries2Errorcode = reader.readINT();var DriveDiagnosticsPassiveEntries3Errorcode = reader.readINT();var DriveDiagnosticsPassiveEntries4Errorcode = reader.readINT();
    // "Drive SlowDown Requried"BOOL "Drive AllowFullSpeed InLoadDirection"BOOL              
	var DriveSlowDownRequired = reader.readBOOL(); var DriveAllowFullSpeedInLoadDirection = reader.readBOOL();
	// "Supervision Überwachung von Funktionen/Zuständen"BOOL
	var	DriveDrivebrakingDecelerationSupervisionEnable = reader.readBOOL(); var DriveDrivebrakingDecelerationSupervisionIsOk = reader.readBOOL();var DriveDrivedirectionSupervisionEnable = reader.readBOOL();var DriveDrivedirectionSupervisionIsOk = reader.readBOOL();
	var DriveDrivedistanceSupervisionEnable = reader.readBOOL();var DriveDrivedistanceSupervisionIsOk = reader.readBOOL();var DriveDriverangecurveSupervisionEnable = reader.readBOOL();var DriveDriverangecurveSupervisionIsOk = reader.readBOOL();
	var DriveDriverangestarightaheadSupervisionEnable = reader.readBOOL();var DriveDriverangestarightaheadSupervisionEnableIsOk = reader.readBOOL();var DriveDriveSelfmovementSupervisionIsInMonitoringState = reader.readBOOL(); //neu hinzu 03032015[1 mal Bool] erledigt 
	var DriveDriveSelfmovementSupervisionIsOk = reader.readBOOL();			
	//"Inputs von Actual Steering und Target Steering"INT
	var SteeringInputsActualSteeringAngle_cdeg = reader.readINT();var SteeringInputsTargetSteeringAngle_cdeg = reader.readINT();				
	//"Outputs ActualSteeringAngle und TargetSteeringAngle"INT
	var SteeringOutputsActualSteeringAngle_cdeg = reader.readINT();var SteeringOutputsTargetSteeringAngle_cdeg = reader.readINT();
	//"Flags PPArunning und TestingPositiveAngle und TestingNegativeAngle und PostRun"BOOL 
	var SteeringPPArunning = reader.readBOOL();var SteeringOutputTestingPositiveAngle = reader.readBOOL();var SteeringOutputTestingNegativeAngle = reader.readBOOL();var SteeringTpostRunQ = reader.readBOOL();
	// "Diagnostics Aktive und Passive Einträge  'Steering' die vorhanden sind. Momentan je 5 Stück gemapped"INT
	var SteeringDiagnosticsActiveEntries0Errorcode = reader.readINT();var SteeringDiagnosticsActiveEntries1Errorcode = reader.readINT();var SteeringDiagnosticsActiveEntries2Errorcode = reader.readINT();var SteeringDiagnosticsActiveEntries3Errorcode = reader.readINT();var SteeringDiagnosticsActiveEntries4Errorcode = reader.readINT();
	var SteeringDiagnosticsPassiveEntries0Errorcode = reader.readINT();var SteeringDiagnosticsPassiveEntries1Errorcode = reader.readINT();var SteeringDiagnosticsPassiveEntries2Errorcode = reader.readINT();var SteeringDiagnosticsPassiveEntries3Errorcode = reader.readINT();var SteeringDiagnosticsPassiveEntries4Errorcode = reader.readINT();
	//"checken ob in RangeHistorySupervision ein Error vorliegt"BOOL
	var SteeringSteerRangeHistorySupervisionErrorCondition = reader.readBOOL();
	//"Flags Raising Fork und Lowering Fork und Standing on HomePosition prüfen"BOOL
	var ForkRaisingFork = reader.readBOOL();var ForkLoweringFork = reader.readBOOL();var ForkStandingOnHomePosition = reader.readBOOL();
	//"LostReference prüfen"BOOL 
	var ForkLostReferenceQ1 = reader.readBOOL();
	//neu hinzu am 03032015
	var RunforkLiftDirectionSupervisionEnable = reader.readBOOL();var RunforkLiftDirectionSupervisionIsOk = reader.readBOOL();var RunforkLiftRangeSupervisionEnable = reader.readBOOL();var RunforkLiftRangeSupervisionIsOk = reader.readBOOL();var RunforkLiftRangeHistorySupervisionEnable = reader.readBOOL();var RunforkLiftRangeHistorySupervisionIsOk = reader.readBOOL();
	//"Inputs und Outputs von Gabel ForkInputs ActualLiftHeight_mm, TargetLiftHeight_mm, ActualLiftHeight_mm, ActualLiftSpeed_mms, TargetLiftSpeed_mms"INT und REAL
	var ForkInputsActualLiftHeight_mm = reader.readINT();var ForkInputsTargetLiftHeight_mm = reader.readINT();var ForkOutputsActualLiftHeight_mm = reader.readINT();var ForkOutputsActualLiftSpeed_mms = reader.readREAL();var ForkOutputsTargetLiftSpeed_mms = reader.readREAL();
	//03032015 apply
	var ForkOutputTargetReached = reader.readBOOL();var ForkOutputIsMovingOnInnermast = reader.readBOOL();var ForkOutputIsMovingOnOutermast = reader.readBOOL();var ForkOutputAboveRearSensorlevel = reader.readBOOL();
	var ForkControlTryAbsDistanceToTarget_mm = reader.readINT();
	//"Diagnostics Aktive und Passive Einträge  'Fork' die vorhanden sind. Momentan je 5 Stück gemapped"INT
	var ForkDiagnosticsActiveEntries0Errorcode = reader.readINT();var ForkDiagnosticsActiveEntries1Errorcode = reader.readINT();var ForkDiagnosticsActiveEntries2Errorcode = reader.readINT();var ForkDiagnosticsActiveEntries3Errorcode = reader.readINT();var ForkDiagnosticsActiveEntries4Errorcode = reader.readINT();
	var ForkDiagnosticsPassiveEntries0Errorcode = reader.readINT();var ForkDiagnosticsPassiveEntries1Errorcode = reader.readINT();var ForkDiagnosticsPassiveEntries2Errorcode = reader.readINT();var ForkDiagnosticsPassiveEntries3Errorcode = reader.readINT();var ForkDiagnosticsPassiveEntries4Errorcode = reader.readINT();
	
		// Textblock: Count
show001.textContent = InputActualDistance_mm;
show002.textContent = InputTargetSpeed_mms;
show003.textContent = OutputActualDistance;
show004.textContent = OutputActualSpeed_mms;
show005.textContent = OutputTargetSpeed_mms;
show006.textContent = DriveReduceStateTargetspeed_mms;
show007.textContent = DriveReduceSteeringTargetSpeed_mms;
show008.textContent = DriveReduceHeightTargetSpeed;
show009.textContent = DriveReduceSensorTargetspeed_mms;
show010.textContent = DriveReduceNewtargetspeed_mms;
show011.textContent = DriveDiagnosticsActiveEntries0Errorcode;
show012.textContent = DriveDiagnosticsActiveEntries1Errorcode;
show013.textContent = DriveDiagnosticsActiveEntries2Errorcode;
show014.textContent = DriveDiagnosticsActiveEntries3Errorcode;
//show015.textContent = DriveDiagnosticsActiveEntries4Errorcode;
show016.textContent = DriveDiagnosticsPassiveEntries0Errorcode;
show017.textContent = DriveDiagnosticsPassiveEntries1Errorcode;
show018.textContent = DriveDiagnosticsPassiveEntries2Errorcode;
show019.textContent = DriveDiagnosticsPassiveEntries3Errorcode;
//show020.textContent = DriveDiagnosticsPassiveEntries4Errorcode;
if (DriveSlowDownRequired){document.all.show021.style.backgroundColor = "green";} else {document.all.show021.style.backgroundColor = "red";}
if (DriveAllowFullSpeedInLoadDirection) {document.all.show022.style.backgroundColor = "green";} else {document.all.show022.style.backgroundColor = "red";}
if (DriveDrivebrakingDecelerationSupervisionEnable) {document.all.show023.style.backgroundColor = "green";} else {document.all.show023.style.backgroundColor = "red";}
if (DriveDrivebrakingDecelerationSupervisionIsOk) {document.all.show024.style.backgroundColor = "green";} else {document.all.show024.style.backgroundColor = "red";}
if (DriveDrivedirectionSupervisionEnable) {document.all.show025.style.backgroundColor = "green";} else {document.all.show025.style.backgroundColor = "red";}
if (DriveDrivedirectionSupervisionIsOk) {document.all.show026.style.backgroundColor = "green";} else {document.all.show026.style.backgroundColor = "red";}
if (DriveDrivedistanceSupervisionEnable) {document.all.show027.style.backgroundColor = "green";} else {document.all.show027.style.backgroundColor = "red";}
if (DriveDrivedistanceSupervisionIsOk) {document.all.show028.style.backgroundColor = "green";} else {document.all.show028.style.backgroundColor = "red";}
if (DriveDriverangecurveSupervisionEnable) {document.all.show029.style.backgroundColor = "green";} else {document.all.show029.style.backgroundColor = "red";}
if (DriveDriverangecurveSupervisionIsOk) {document.all.show030.style.backgroundColor = "green";} else {document.all.show030.style.backgroundColor = "red";}
if (DriveDriverangestarightaheadSupervisionEnable) {document.all.show031.style.backgroundColor = "green";} else {document.all.show031.style.backgroundColor = "red";}
if (DriveDriverangestarightaheadSupervisionEnableIsOk) {document.all.show032.style.backgroundColor = "green";} else {document.all.show032.style.backgroundColor = "red";}
if (DriveDriveSelfmovementSupervisionIsInMonitoringState) {document.all.show072.style.backgroundColor = "green";} else {document.all.show072.style.backgroundColor = "red";}
if (DriveDriveSelfmovementSupervisionIsOk) {document.all.show033.style.backgroundColor = "green";} else {document.all.show033.style.backgroundColor = "red";}

show034.textContent = SteeringInputsActualSteeringAngle_cdeg;
show035.textContent = SteeringInputsTargetSteeringAngle_cdeg;
show036.textContent = SteeringOutputsActualSteeringAngle_cdeg;
show037.textContent = SteeringOutputsTargetSteeringAngle_cdeg;
if (SteeringPPArunning) {document.all.show038.style.backgroundColor = "green";} else {document.all.show038.style.backgroundColor = "red";}
if (SteeringOutputTestingPositiveAngle) {document.all.show039.style.backgroundColor = "green";} else {document.all.show039.style.backgroundColor = "red";}
if (SteeringOutputTestingNegativeAngle) {document.all.show040.style.backgroundColor = "green";} else {document.all.show040.style.backgroundColor = "red";}
if (SteeringTpostRunQ) {document.all.show041.style.backgroundColor = "green";} else {document.all.show041.style.backgroundColor = "red";}
show042.textContent = SteeringDiagnosticsActiveEntries0Errorcode;
show043.textContent = SteeringDiagnosticsActiveEntries1Errorcode;
show044.textContent = SteeringDiagnosticsActiveEntries2Errorcode;
show045.textContent = SteeringDiagnosticsActiveEntries3Errorcode;
//show046.textContent = SteeringDiagnosticsActiveEntries4Errorcode;
show047.textContent = SteeringDiagnosticsPassiveEntries0Errorcode;
show048.textContent = SteeringDiagnosticsPassiveEntries1Errorcode;
show049.textContent = SteeringDiagnosticsPassiveEntries2Errorcode;
show050.textContent = SteeringDiagnosticsPassiveEntries3Errorcode;
//show051.textContent = SteeringDiagnosticsPassiveEntries4Errorcode;
if (SteeringSteerRangeHistorySupervisionErrorCondition) {document.all.show052.style.backgroundColor = "green";} else {document.all.show052.style.backgroundColor = "red";}

if (ForkRaisingFork) {document.all.show053.style.backgroundColor = "green";} else {document.all.show053.style.backgroundColor = "red";}
if (ForkLoweringFork) {document.all.show054.style.backgroundColor = "green";} else {document.all.show054.style.backgroundColor = "red";}
if (ForkStandingOnHomePosition) {document.all.show055.style.backgroundColor = "green";} else {document.all.show055.style.backgroundColor = "red";}
if (ForkLostReferenceQ1) {document.all.show056.style.backgroundColor = "green";} else {document.all.show056.style.backgroundColor = "red";}
if (RunforkLiftDirectionSupervisionEnable) {document.all.show073.style.backgroundColor = "green";} else {document.all.show073.style.backgroundColor = "red";}
if (RunforkLiftDirectionSupervisionIsOk) {document.all.show074.style.backgroundColor = "green";} else {document.all.show074.style.backgroundColor = "red";}
if (RunforkLiftRangeSupervisionEnable) {document.all.show075.style.backgroundColor = "green";} else {document.all.show075.style.backgroundColor = "red";}
if (RunforkLiftRangeSupervisionIsOk) {document.all.show076.style.backgroundColor = "green";} else {document.all.show076.style.backgroundColor = "red";}
if (RunforkLiftRangeHistorySupervisionEnable) {document.all.show077.style.backgroundColor = "green";} else {document.all.show077.style.backgroundColor = "red";}
if (RunforkLiftRangeHistorySupervisionIsOk) {document.all.show078.style.backgroundColor = "green";} else {document.all.show078.style.backgroundColor = "red";}
if (ForkOutputIsMovingOnInnermast) {document.all.show079.style.backgroundColor = "green";} else {document.all.show079.style.backgroundColor = "red";}
if (ForkOutputIsMovingOnOutermast) {document.all.show080.style.backgroundColor = "green";} else {document.all.show080.style.backgroundColor = "red";}
if (ForkOutputAboveRearSensorlevel) {document.all.show081.style.backgroundColor = "green";} else {document.all.show081.style.backgroundColor = "red";}
if (ForkOutputTargetReached) {document.all.show082.style.backgroundColor = "green";} else {document.all.show082.style.backgroundColor = "red";}
show083.textContent = ForkControlTryAbsDistanceToTarget_mm;
show057.textContent = ForkInputsActualLiftHeight_mm; 
show058.textContent = ForkInputsTargetLiftHeight_mm;	
show059.textContent = ForkOutputsActualLiftHeight_mm;
show060.textContent = ForkOutputsActualLiftSpeed_mms;
show061.textContent = ForkOutputsTargetLiftSpeed_mms;
show062.textContent = ForkDiagnosticsActiveEntries0Errorcode;
show063.textContent = ForkDiagnosticsActiveEntries1Errorcode;
show064.textContent = ForkDiagnosticsActiveEntries2Errorcode;	
show065.textContent = ForkDiagnosticsActiveEntries3Errorcode;	
//show066.textContent = ForkDiagnosticsActiveEntries4Errorcode;	
show067.textContent = ForkDiagnosticsPassiveEntries0Errorcode;	
show068.textContent = ForkDiagnosticsPassiveEntries1Errorcode;	
show069.textContent = ForkDiagnosticsPassiveEntries2Errorcode;	
show070.textContent = ForkDiagnosticsPassiveEntries3Errorcode;
//show071.textContent = ForkDiagnosticsPassiveEntries4Errorcode;								
show084.textContent = DriveReduceSlowDistanceTargetspeed_mms;
					
			// Progress
                  					
					
                } else {

                    if (e.error.getTypeString() == "TcAdsWebService.ResquestError") {
                        // HANDLE TcAdsWebService.ResquestError HERE;
						log('Halle 10');
                    }
                    else if (e.error.getTypeString() == "TcAdsWebService.Error") {
						log('HANDLE in Halle gebaut 01');
                        // HANDLE TcAdsWebService.Error HERE;
                    }
                }

            });

            // Occurs if the read-read-write command runs into timeout;
            var ReadTimeoutCallback = (function () {
                // Handle Timeout here;
            });

            // Occurs if the release symbol handle request has finished;
            var FreeHandleCallback = (function (e, s) {

                if (e && e.isBusy) {
                    // HANDLE PROGRESS TASKS HERE;
                    // Exit callback function because request is still busy;
					log('Hob vergessen do an Log zum Setzen bzw. an innerHTM der ned geht');
                    //return;
                }

                if (e && !e.hasError) {
                    // Success
					log('HANDLE in Halle gebaut 10');
                } else {

                    if (e.error.getTypeString() == "TcAdsWebService.ResquestError") {
					log('HANDLE in Halle gebaut 100');
                        // HANDLE TcAdsWebService.ResquestError HERE;
                    
                    }
                    else if (e.error.getTypeString() == "TcAdsWebService.Error") {
					log('HANDLE in Halle gebaut 1000');
                        // HANDLE TcAdsWebService.Error HERE;
                    }
                }

            });

            // Occurs if the release symbol handle request runs into timeout;
            var FreeHandleTimeoutCallback = (function () {
                // Handle Timeout here;
                alert("timeout");
            });

            // Occurs if the browser window or tab is closed;
            //  IndexGroup 0xF006 = Release Symbol Handle;
            //  IndexOffset = Symbol handle;
            window.onbeforeunload = (function () {

                // Free Handles
                client.write(NETID, PORT, 0xF006, hInputActualDistance_mm, "", FreeHandleCallback, "hInputActualDistance_mm", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hInputTargetSpeed_mms, "", FreeHandleCallback, "hInputTargetSpeed_mms", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hOutputActualDistance_mm, "", FreeHandleCallback, "hOutputActualDistance_mm", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hOutputActualSpeed_mms, "", FreeHandleCallback, "hOutputActualSpeed_mms", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hOutpuntTargetSpeed_mms, "", FreeHandleCallback, "hOutpuntTargetSpeed_mms", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveReduceStateTargetspeed_mms, "", FreeHandleCallback, "hDriveReduceStateTargetspeed_mms", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hDriveReduceSteeringTargetSpeed_mms, "", FreeHandleCallback, "hDriveReduceSteeringTargetSpeed_mms", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveReduceHeightTargetSpeed, "", FreeHandleCallback, "hDriveReduceHeightTargetSpeed", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveReduceSensorTargetspeed_mms, "", FreeHandleCallback, "hDriveReduceSensorTargetspeed_mms", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveReduceNewtargetspeed_mms, "", FreeHandleCallback, "hDriveReduceNewtargetspeed_mms", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveReduceSlowDistanceTargetspeed_mms, "", FreeHandleCallback, "hDriveReduceSlowDistanceTargetspeed_mms", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDiagnosticsActiveEntries0Errorcode, "", FreeHandleCallback, "hDriveDiagnosticsActiveEntries0Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hDriveDiagnosticsActiveEntries1Errorcode, "", FreeHandleCallback, "hDriveDiagnosticsActiveEntries1Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDiagnosticsActiveEntries2Errorcode, "", FreeHandleCallback, "hDriveDiagnosticsActiveEntries2Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDiagnosticsActiveEntries3Errorcode, "", FreeHandleCallback, "hDriveDiagnosticsActiveEntries3Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDiagnosticsActiveEntries4Errorcode, "", FreeHandleCallback, "hDriveDiagnosticsActiveEntries4Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDiagnosticsPassiveEntries0Errorcode, "", FreeHandleCallback, "hDriveDiagnosticsPassiveEntries0Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDiagnosticsPassiveEntries1Errorcode, "", FreeHandleCallback, "hDriveDiagnosticsPassiveEntries1Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hDriveDiagnosticsPassiveEntries2Errorcode, "", FreeHandleCallback, "hDriveDiagnosticsPassiveEntries2Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDiagnosticsPassiveEntries3Errorcode, "", FreeHandleCallback, "hDriveDiagnosticsPassiveEntries3Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDiagnosticsPassiveEntries4Errorcode, "", FreeHandleCallback, "hDriveDiagnosticsPassiveEntries4Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveSlowDownRequired, "", FreeHandleCallback, "hDriveSlowDownRequired", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveAllowFullSpeedInLoadDirection, "", FreeHandleCallback, "hDriveAllowFullSpeedInLoadDirection", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDrivebrakingDecelerationSupervisionEnable, "", FreeHandleCallback, "hDriveDrivebrakingDecelerationSupervisionEnable", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hDriveDrivebrakingDecelerationSupervisionIsOk, "", FreeHandleCallback, "hDriveDrivebrakingDecelerationSupervisionIsOk", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDrivedirectionSupervisionEnable, "", FreeHandleCallback, "hDriveDrivedirectionSupervisionEnable", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDrivedirectionSupervisionIsOk, "", FreeHandleCallback, "hDriveDrivedirectionSupervisionIsOk", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDrivedistanceSupervisionEnable, "", FreeHandleCallback, "hDriveDrivedistanceSupervisionEnable", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDrivedistanceSupervisionIsOk, "", FreeHandleCallback, "hDriveDrivedistanceSupervisionIsOk", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDriverangecurveSupervisionEnable, "", FreeHandleCallback, "hDriveDriverangecurveSupervisionEnable", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hDriveDriverangecurveSupervisionIsOk, "", FreeHandleCallback, "hDriveDriverangecurveSupervisionIsOk", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDriverangestarightaheadSupervisionEnable, "", FreeHandleCallback, "hDriveDriverangestarightaheadSupervisionEnable", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDriverangestarightaheadSupervisionEnableIsOk, "", FreeHandleCallback, "hDriveDriverangestarightaheadSupervisionEnableIsOk", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDriveSelfmovementSupervisionIsInMonitoringState, "", FreeHandleCallback, "hDriveDriveSelfmovementSupervisionIsInMonitoringState", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hDriveDriveSelfmovementSupervisionIsOk, "", FreeHandleCallback, "hDriveDriveSelfmovementSupervisionIsOk", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringInputsActualSteeringAngle_cdeg, "", FreeHandleCallback, "hSteeringInputsActualSteeringAngle_cdeg", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hSteeringInputsTargetSteeringAngle_cdeg, "", FreeHandleCallback, "hSteeringInputsTargetSteeringAngle_cdeg", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringOutputsActualSteeringAngle_cdeg, "", FreeHandleCallback, "hSteeringOutputsActualSteeringAngle_cdeg", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringOutputsTargetSteeringAngle_cdeg, "", FreeHandleCallback, "hSteeringOutputsTargetSteeringAngle_cdeg", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hSteeringPPArunning, "", FreeHandleCallback, "hSteeringPPArunning", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringOutputTestingPositiveAngle, "", FreeHandleCallback, "hSteeringOutputTestingPositiveAngle", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringOutputTestingNegativeAngle, "", FreeHandleCallback, "hSteeringOutputTestingNegativeAngle", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringTpostRunQ, "", FreeHandleCallback, "hSteeringTpostRunQ", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringDiagnosticsActiveEntries0Errorcode, "", FreeHandleCallback, "hSteeringDiagnosticsActiveEntries0Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringDiagnosticsActiveEntries1Errorcode, "", FreeHandleCallback, "hSteeringDiagnosticsActiveEntries1Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hSteeringDiagnosticsActiveEntries2Errorcode, "", FreeHandleCallback, "hSteeringDiagnosticsActiveEntries2Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringDiagnosticsActiveEntries3Errorcode, "", FreeHandleCallback, "hSteeringDiagnosticsActiveEntries3Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringDiagnosticsActiveEntries4Errorcode, "", FreeHandleCallback, "hSteeringDiagnosticsActiveEntries4Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringDiagnosticsPassiveEntries0Errorcode, "", FreeHandleCallback, "hSteeringDiagnosticsPassiveEntries0Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringDiagnosticsPassiveEntries1Errorcode, "", FreeHandleCallback, "hSteeringDiagnosticsPassiveEntries1Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
                client.write(NETID, PORT, 0xF006, hSteeringDiagnosticsPassiveEntries2Errorcode, "", FreeHandleCallback, "hSteeringDiagnosticsPassiveEntries2Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hSteeringDiagnosticsPassiveEntries3Errorcode, "", FreeHandleCallback, "hSteeringDiagnosticsPassiveEntries3Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hSteeringDiagnosticsPassiveEntries4Errorcode, "", FreeHandleCallback, "hSteeringDiagnosticsPassiveEntries4Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hSteeringSteerRangeHistorySupervisionErrorCondition, "", FreeHandleCallback, "hSteeringSteerRangeHistorySupervisionErrorCondition", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkRaisingFork, "", FreeHandleCallback, "hForkRaisingFork", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkLoweringFork, "", FreeHandleCallback, "hForkLoweringFork", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkStandingOnHomePosition, "", FreeHandleCallback, "hForkStandingOnHomePosition", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkLostReferenceQ1, "", FreeHandleCallback, "hForkLostReferenceQ1", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hRunforkLiftDirectionSupervisionEnable, "", FreeHandleCallback, "hRunforkLiftDirectionSupervisionEnable", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hRunforkLiftDirectionSupervisionIsOk, "", FreeHandleCallback, "hRunforkLiftDirectionSupervisionIsOk", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hRunforkLiftRangeSupervisionEnable, "", FreeHandleCallback, "hRunforkLiftRangeSupervisionEnable", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hRunforkLiftRangeSupervisionIsOk, "", FreeHandleCallback, "hRunforkLiftRangeSupervisionIsOk", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hRunforkLiftRangeHistorySupervisionEnable, "", FreeHandleCallback, "hRunforkLiftRangeHistorySupervisionEnable", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hRunforkLiftRangeHistorySupervisionIsOk, "", FreeHandleCallback, "hRunforkLiftRangeHistorySupervisionIsOk", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkInputsActualLiftHeight_mm, "", FreeHandleCallback, "hForkInputsActualLiftHeight_mm", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkInputsTargetLiftHeight_mm, "", FreeHandleCallback, "hForkInputsTargetLiftHeight_mm", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkOutputsActualLiftHeight_mm, "", FreeHandleCallback, "hForkOutputsActualLiftHeight_mm", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkOutputsActualLiftSpeed_mms, "", FreeHandleCallback, "hForkOutputsActualLiftSpeed_mms", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkOutputsTargetLiftSpeed_mms, "", FreeHandleCallback, "hForkOutputsTargetLiftSpeed_mms", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkOutputTargetReached, "", FreeHandleCallback, "hForkOutputTargetReached", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkOutputIsMovingOnInnermast, "", FreeHandleCallback, "hForkOutputIsMovingOnInnermast", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkOutputIsMovingOnOutermast, "", FreeHandleCallback, "hForkOutputIsMovingOnOutermast", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkOutputAboveRearSensorlevel, "", FreeHandleCallback, "hForkOutputAboveRearSensorlevel", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkControlTryAbsDistanceToTarget_mm, "", FreeHandleCallback, "hForkControlTryAbsDistanceToTarget_mm", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkDiagnosticsActiveEntries0Errorcode, "", FreeHandleCallback, "hForkDiagnosticsActiveEntries0Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkDiagnosticsActiveEntries1Errorcode, "", FreeHandleCallback, "hForkDiagnosticsActiveEntries1Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkDiagnosticsActiveEntries2Errorcode, "", FreeHandleCallback, "hForkDiagnosticsActiveEntries2Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkDiagnosticsActiveEntries3Errorcode, "", FreeHandleCallback, "hForkDiagnosticsActiveEntries3Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkDiagnosticsActiveEntries4Errorcode, "", FreeHandleCallback, "hForkDiagnosticsActiveEntries4Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkControlTryAbsDistanceToTarget_mm, "", FreeHandleCallback, "hForkControlTryAbsDistanceToTarget_mm", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkDiagnosticsPassiveEntries0Errorcode, "", FreeHandleCallback, "hForkDiagnosticsPassiveEntries0Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkDiagnosticsPassiveEntries1Errorcode, "", FreeHandleCallback, "hForkDiagnosticsPassiveEntries1Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkDiagnosticsPassiveEntries2Errorcode, "", FreeHandleCallback, "hForkDiagnosticsPassiveEntries2Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkDiagnosticsPassiveEntries3Errorcode, "", FreeHandleCallback, "hForkDiagnosticsPassiveEntries3Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
				client.write(NETID, PORT, 0xF006, hForkDiagnosticsPassiveEntries4Errorcode, "", FreeHandleCallback, "hForkDiagnosticsPassiveEntries4Errorcode", general_timeout, FreeHandleTimeoutCallback, true);
							
            });
						
			
        })(window);