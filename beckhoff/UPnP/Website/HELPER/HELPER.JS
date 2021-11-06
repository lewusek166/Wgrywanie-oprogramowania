(function (window) {

    // namespace
    var Helper = new (function () {


        //////////////////////////////////////////////////////////////////////////////////
        //  Information about browser
        ////////////////////////////////////////////////////////////////////////////////

        this.getBrowserInfo = function () {

            var browsers = [];
            browsers.push("MSIE");
            browsers.push("Firefox");
            browsers.push("Opera");
            browsers.push("Chrome");
            browsers.push("Safari");

            var sAgent = navigator.userAgent;
            var oBrowserInfo = new Defines.BrowserInfo("", "", "", sAgent);

            for (var i = 0; i < browsers.length; i++) {

                var namePosition = sAgent.indexOf(browsers[i]);
                if (namePosition > -1) {

                    // browser found
                    oBrowserInfo.name = browsers[i];

                    // find the version
                    // 1. step: look behind the browsers name
                    oBrowserInfo.version = sAgent.substring(namePosition + browsers[i].length + 1);

                    // 2. step: try to find a "Version" item in the agent string
                    var versionPosition = sAgent.indexOf("Version");
                    if (versionPosition > -1) {
                        oBrowserInfo.version = sAgent.substring(versionPosition + 8 /* 8 = length of the word "Version " */);
                    }

                    // 3. step: find the end of the versionnumber by searching for a ";" or " "
                    var versionEndPosition = oBrowserInfo.version.indexOf(";");
                    if (versionEndPosition < 0) {
                        versionEndPosition = oBrowserInfo.version.indexOf(" ");
                    }

                    if (versionEndPosition > -1) {
                        oBrowserInfo.version = oBrowserInfo.version.substring(0, versionEndPosition);

                        // get major of version
                        var versionDotPosition = oBrowserInfo.version.indexOf(".");
                        if (versionDotPosition > -1) {
                            oBrowserInfo.major = oBrowserInfo.version.substring(0, versionDotPosition);
                        }
                    }

                    break;
                }
            }

            return oBrowserInfo;
        }

        this.getMaxSoapRequestsCount = function () {

            //var oBrowserInfo = this.getBrowserInfo();

            //switch (oBrowserInfo.name) {

            //    case "MSIE":
            //        if (oBrowserInfo.major == 7) {
            //            return 2;
            //        }
            //        else if (oBrowserInfo.major == 8) {
            //            return 6;
            //        }
            //        else if (oBrowserInfo.major == 9) {
            //            return 6;
            //        }
            //        else if (oBrowserInfo.major == 10) {
            //            return 8;
            //        }
            //        break;

            //    case "Firefox":
            //        if (oBrowserInfo.major == 18) {
            //            return 6;
            //        }
            //        else if (oBrowserInfo.major == 19) {
            //            return 6;
            //        }
            //        else if (oBrowserInfo.major == 20) {
            //            return 6;
            //        }
            //        else if (oBrowserInfo.major == 21) {
            //            return 6;
            //        }
            //        break;

            //    case "Opera":
            //        break;

            //    case "Chrome":
            //        break;

            //    case "Safari":
            //        break;
            //}

            // return defaultRequestCount if no case was successfull before
            // limit requestCount to 1 ...every browser should be able to do that
            var defaultRequestCount = 1;
            return defaultRequestCount;

        }

        this.getRandomNumber = function (min, max) {
            return Math.round(Math.random() * (max - min)) + min;
        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //  Active Request Count
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.CActiveRequestCount = function () {

            this.count = 0;

            this.Init = function () {
                this.count = 0;
            }

            this.RequestsFinished = function () {
                if (this.count < 0) { this.count = 0; }
                return (this.count == 0);
            }

            this.Increment = function () {
                this.count++;
            }

            this.Decrement = function () {
                this.count--;
                if (this.count < 0) { this.count = 0; }
            }
        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: General
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.escapeHtml = function (str) {

            var divTmp = document.createElement('div');
            divTmp.appendChild(document.createTextNode(str));

            return divTmp.innerHTML;
        }

        this.getStatusString = function (Status) {
            if (Status == 0) {
                return "Disabled";
            }
            else if (Status == 1) {
                return "Enabled";
            }
            else {
                return Status;
            }
        }

        this.getBooleanToString = function (Status) {
            if (Status == 0) {
                return "False";
            }
            else if (Status == 1) {
                return "True";
            }
            else {
                return Status;
            }
        }

        this.ReplaceAll = function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        }

        this.StringStartsWith = function (str, find) {
            if (str.indexOf(find) == 0) {
                return true;
            }
            return false;
        }

        this.getLWORD = function (DWORD) {
            return DWORD & 0x0000FFFF;
        }

        this.getHWORD = function (DWORD) {
            return (DWORD & 0xFFFF0000) >> 16;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: General-module
        ////////////////////////////////////////////////////////////////////////////////////////////////////


        this.getOsAndImageVersion = function (OsAndImageVersion) {

            if (this.StringStartsWith(OsAndImageVersion, "?")) {
                return "";  // MDP returns "???" if no data could be read !!!
            }
            else {
                return OsAndImageVersion;
            }
        }

        this.getHardwareVersion = function (HardwareVersion) {

            try {
                var sRetVal = "";

                var sHardwareVersionArr = HardwareVersion.split(";");
                if (sHardwareVersionArr.length == 3) {

                    // Hardware
                    if (this.StringStartsWith(sHardwareVersionArr[0], "???")) {
                        // this is not a valid dataset --> add nothing to sRetVal !
                    }
                    else if (this.StringStartsWith(sHardwareVersionArr[0], "??") && sHardwareVersionArr[0].length == 6) {
                        // unknown model number:
                        //   sample: ??xxxx (DWORD xxxx = ModelNo. of old EEPromDeviceInfo structure)
                        sRetVal += sHardwareVersionArr[0].substring(2); // remove "??"
                    }
                    else {
                        // string is OK
                        sRetVal += sHardwareVersionArr[0];
                    }

                    // Version
                    if (!this.StringStartsWith(sHardwareVersionArr[1], "v?") &&
                        sHardwareVersionArr[1].length > 0) {

                        sRetVal += " " + sHardwareVersionArr[1];
                    }

                    // Date
                    if (!this.StringStartsWith(sHardwareVersionArr[2], "?") &&
                        sHardwareVersionArr[2].length > 0) {

                        sRetVal += " " + sHardwareVersionArr[2];
                    }
                }

                return sRetVal;
            }
            catch (e) {
                return HardwareVersion;
            }

        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: Firewall
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        this.getFirewallProtocol = function (protocol) {
            //https://msdn.microsoft.com/en-us/library/aa450056.aspx

            /*
                For TCP, "Protocol"=dword:6.
                For UDP, "Protocol"=dword:11.
                For ICMPv4, "Protocol"=dword:1.
                For ICMPv6, "Protocol"=dword:3A.
                For AH (IPSec), "Protocol"=dword:33.
                For ESP (IPSec), "Protocol"=dword:32.
            */

            switch (protocol) {
                case 6: return "TCP";
                case 17: return "UDP";
                case 1: return "ICMPv4";
                case 58: return "ICMPv6";
                case 51: return "AH (IPSec)";
                case 50: return "ESP (IPSec)";
                default: return protocol.toString();
            }
        }

        this.getFirewallAction = function (action) {

            /*
            // Firewall Actions
            var FWA_BLOCK = 0x01;
            var FWA_ALLOW = 0x02;
            var FWA_ALLOW_RESPONSE = 0x03;
            */

            switch (action) {
                case 1: return "FWA_BLOCK";
                case 2: return "FWA_ALLOW";
                case 3: return "FWA_ALLOW_RESPONSE";
                default: return action;
            }
        }

        this.getFirewallProtocolNames = function () {
            return res = ["TCP", "UDP", "ICMPv4", "ICMPv6", "AH (IPSec)", "ESP (IPSec)"];
        }

        this.getFirewallProtocolIdByName = function (name) {
            if (name === "TCP") { return 6; }
            else if (name === "UDP") { return 17; }
            else if (name === "ICMPv4") { return 1; }
            else if (name === "ICMPv6") { return 58; }
            else if (name === "AH (IPSec)") { return 51; }
            else if (name === "ESP (IPSec)") { return 50; }
            else { return -1; }
        }

        this.getFirewallMasks = function (info) {
            /*
            FWM_PRIVATE_HOST		= 0x0001
            FWM_PUBLIC_HOST			= 0x0002
            FWM_PORT				= 0x0004
            FWM_TYPE				= 0x0008
            FWM_CODE				= 0x0010
            FWM_PROTOCOL			= 0x0020
            FWM_ACTION				= 0x0040
            FWM_PUBLIC_HOST_MASK	= 0x0800
            FWM_PUBLIC_HOST_PREFIX	= 0x1000 
            */

            //https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
            var activeMasks = [];

            if (info & 1) { activeMasks.push("FWM_PRIVATE_HOST"); }
            if (info & 2) { activeMasks.push("FWM_PUBLIC_HOST"); }
            if (info & 4) { activeMasks.push("FWM_PORT"); }
            if (info & 8) { activeMasks.push("FWM_TYPE"); }
            if (info & 16) { activeMasks.push("FWM_CODE"); }
            if (info & 32) { activeMasks.push("FWM_PROTOCOL"); }
            if (info & 64) { activeMasks.push("FWM_ACTION"); }
            if (info & 1024) { activeMasks.push("FWM_PUBLIC_HOST_MASK"); }
            if (info & 4096) { activeMasks.push("FWM_PUBLIC_HOST_PREFIX"); }

            return activeMasks;
        }

        this.getFirewallFlags = function (info) {

            //FWF_BLOCK = 01
            //FWF_ALLOW = 02
            //FWF_LOG = 04
            //FWF_INBOUND = 08
            //FWF_OUTBOUND = 16
            //FWF_DISABLED = 20 
            // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators

            var activeMasks = [];

            if (info & 1) { activeMasks.push("FWF_BLOCK"); }
            if (info & 2) { activeMasks.push("FWF_ALLOW"); }
            if (info & 4) { activeMasks.push("FWF_LOG"); }
            if (info & 8) { activeMasks.push("FWF_INBOUND"); }
            if (info & 16) { activeMasks.push("FWF_OUTBOUND"); }
            if (info & 32) { activeMasks.push("FWF_DISABLED"); }

            return activeMasks;
        }

        /*UINT32*/ this.getFirewallPortRangeDWORD = function (/*UINT16*/ min, /*UINT16*/ max) {

            var dwFirewallPortsBuffer = new dataStream.DataWriter();
            dwFirewallPortsBuffer.writeWORD(min);
            dwFirewallPortsBuffer.writeWORD(max);

            return dwFirewallPortsBuffer.getByteArray();
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: EWF module
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.getEWFBootCommandOut = function (BootCommandIdx) {

            /*
            OUT Values
            ---------------
            0 = No Command 
            1 = Enable
            2 = Disable
            3 = SetLevel
            4 = Commit 
            */

            switch (BootCommandIdx) {
                case 0: return "No command";
                case 1: return "Enable";
                case 2: return "Disable";
                case 3: return "SetLevel";
                case 4: return "Commit ";

                default: return BootCommandIdx;
            }
        }

        this.getEWFBootCommandsIn = function () {

            /*
            IN Values
            ---------------------------------
            0 = ClearCommand
            1 = EwfMgrEnable
            2 = EwfMgrDisable without Commit
            3 = EwfMgrDisable with Commit
            4 = EwfMgrCommit 
            */

            return sRetVal = ["Clear command", "Enable", "Disable", "Commit and Disable", "Commit"];
        }

        this.getEWFStatusString = function (Status) {

            /*
            0  = EWF_ENABLED
            1 =  EWF_DISABLED
            */

            if (Status == 0) {
                return "Enabled";
            }
            else if (Status == 1) {
                return "Disabled";
            }
            else {
                return Status;
            }
        }

        this.getEWFType = function (Type) {
            switch (Type) {
                case 0: return "EWF_DISK";
                case 1: return "EWF_RAM";
                case 2: return "EWF_RAM_REG";

                default: return Type;
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: FBWF module
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        this.getExclustionListArr = function (ExclusionMultistring) {

            // MDP sends a multistring:
            // Folders are splitted by a Nulltermination

            var sExclusionList = [];
            var iStartIdx = 0;

            for (var i = 0; i < ExclusionMultistring.length; i++) {

                if (ExclusionMultistring.charCodeAt(i) == 0) {  // if delimiter found...
                    
                    sExclusionList.push(ExclusionMultistring.substring(iStartIdx, i));
                    iStartIdx = (i + 1);
                }
                else if (ExclusionMultistring.length == (i + 1)) {   // ...or end of string

                    sExclusionList.push(ExclusionMultistring.substring(iStartIdx, ExclusionMultistring.length));
                    iStartIdx = (i + 1);
                }
            }

            return sExclusionList;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: Memory module
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.getMemoryUsagePercent = function (Allocated, Available) {

            // Allocated = Total Memory
            // Available = Free Memory

            var Used = Allocated - Available;
            return Math.round(Used / Allocated * 100);
        }

        this.getBestMemoryUnity = function (Memory /*in byte*/, digits) {

            var unities = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

            var n1 = 0;
            var n2 = 0;
            var displayableMemory = 0;
            var unity = "";

            if (Memory > 0) {
                n2 = Math.floor(Math.log(Memory) / Math.log(1024));
                displayableMemory = (Memory / Math.pow(1024, n2)).toFixed(digits);
            }

            var unity = "";
            var n = n1 + n2;

            if (n >= 0 && n < unities.length) {
                unity = unities[n];
            }
            return displayableMemory + unity;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: Diskmanagement module
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.getDriveType = function (Type) {

            /*
            DRV_UNKNOWN = 0,
            DRV_FIXED = 1,
            DRV_REMOVABLE = 2,
            DRV_CDROM = 4
            */

            switch (Type) {

                case 0: return "Unknown";
                case 1: return "Fixed";
                case 2: return "Removable";
                case 4: return "CD-Rom";

                default: return Type;
            }
        }



        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: RAID module
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.getRaidState = function (State) {

            switch (State) {
                case 1: return "Good";
                case 2: return "Failed";
                case 3: return "Offline";
                case 4: return "Power off";

                default: return State;
            }
        }

        this.getRaidOfflineReason = function (Reason) {

            switch (Reason) {
                case 0: return "No reason";
                case 1: return "Initializing";
                case 2: return "Bus degraded";
                case 3: return "Bus failure";

                default: return Reason;
            }

        }

        this.getRaidSetType = function (Type) {

            switch (Type) {
                case 0: return "No RAID";
                case 1: return "RAID Type 0";
                case 2: return "RAID Type 1";
                case 3: return "RAID Type 10";
                case 4: return "RAID Type 5";
                case 5: return "RAID Type 15";
                case 255: return "No standard RAID";

                default: return Type;
            }
        }


        this.getRaidSetStateAndInfo = function (/*UINT16*/ SetStateAndInfo) {

            var nSetState = SetStateAndInfo & 0x00FF;           // 1.Byte
            var nSetInfo = (SetStateAndInfo & 0xFF00) >> 8;     // 2.Byte

            switch (nSetState) {
                case 0: return "OK";
                case 1: return "Degraded";
                case 2: return "Rebuilding (" + nSetInfo + " %)";
                case 3: return "Failed";
                
                default: return nSetState;
            }
        }

        // 0x8nn4
        this.getRaidSetsHarddisks = function (/*VISIBLE STRING*/ Harddisks) {
            
            var nHarddiskIdxs = [];
            for (var i = 0; i < Harddisks.length; i++) {
                nHarddiskIdxs.push(Harddisks.charCodeAt(i));
                if (nHarddiskIdxs[i] > 0) {
                    nHarddiskIdxs[i]--; // n-1
                }
            }

            return nHarddiskIdxs;
        }

        // 0x8nnA
        this.getRaidSetHarddiskState = function (/*UINT8*/ HarddiskState) {

            switch (HarddiskState) {
                case 0: return "OK";
                case 1: return "Rebuilding";
                case 2: return "Failed";
                case 3: return "Degraded";

                default: return HarddiskState;
            }
        }



        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: TwinCAT module
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.getTwinCATState = function (State) {

            switch (State) {
                case 0: return "Invalid";
                case 1: return "Idle";
                case 2: return "Reset";
                case 3: return "Init";
                case 4: return "Start";
                case 5: return "Run";
                case 6: return "Stop";
                case 7: return "Save Config";
                case 8: return "Load Config";
                case 9: return "Power failure";
                case 10: return "Power good";
                case 11: return "ERROR";
                case 12: return "Shutdown";
                case 13: return "Suspend";
                case 14: return "Resume";
                case 15: return "Config";
                case 16: return "Reconfig";

                default: return State;
            }

        }

        this.getTwinCATRegLevel = function (RegLevel) {

            switch (RegLevel) {
                case 0: return "CP";
                case 1: return "I/O";
                case 2: return "PLC";
                case 3: return "NC-PTP";
                case 4: return "NCI";

                default: return RegLevel;
            }

        }

        this.getTwinCATRouteTransportTypes = function () {

            /*
            TYPE E_RouteTransportType :
            (
                eRouteTransport_None            := 0,
                eRouteTransport_TCP_IP          := 1,
                eRouteTransport_IIO_LIGHTBUS    := 2,
                eRouteTransport_PROFIBUS_DP     := 3,
                eRouteTransport_PCI_ISA_BUS     := 4,
                eRouteTransport_ADS_UDP         := 5,
                eRouteTransport_FATP_UDP        := 6,
                eRouteTransport_COM_PORT        := 7,
                eRouteTransport_USB             := 8,
                eRouteTransport_CAN_OPEN        := 9,
                eRouteTransport_DEVICE_NET      := 10,
                eRouteTransport_SSB             := 11,
                eRouteTransport_SOAP            := 12
            );
            */

            var Types = ["None", 
                        "TCP_IP",
                        "IIO_LIGHTBUS",
                        "PROFIBUS_DP",
                        "PCI_ISA_BUS",
                        "ADS_UDP",
                        "FATP_UDP",
                        "COM_PORT",
                        "USB",
                        "CAN_OPEN",
                        "DEVICE_NET",
                        "SSB",
                        "SOAP"];

            return Types;
        }

        this.getTwinCATRouteTransportTypeById = function (TransportTypeId) {

            var sTransportTypes = this.getTwinCATRouteTransportTypes();

            if (sTransportTypes.length > TransportTypeId) {
                return sTransportTypes[TransportTypeId];
            }
            else {
                return TransportTypeId;
            }
        }        

        this.getTwinCATRouteFlagsArr = function (nFlags) {

            sFlagsArr = [];

            var ADSSYSADDREMOTEFLAG_TEMPORARY  = 0x00000001
            var ADSSYSADDREMOTEFLAG_DYNAMIC    = 0x00000002  // hostname instead of IP address
            var ADSSYSADDREMOTEFLAG_NOOVERRIDE = 0x00000004         

            if (nFlags & ADSSYSADDREMOTEFLAG_TEMPORARY) {
                sFlagsArr.push("Temporary");
            }
            else {
                sFlagsArr.push("Static");
            }

            if (nFlags & ADSSYSADDREMOTEFLAG_DYNAMIC) {
                sFlagsArr.push("Host Name");
            }
            else {
                sFlagsArr.push("IP Address");
            }

            if (nFlags & ADSSYSADDREMOTEFLAG_NOOVERRIDE) {
                sFlagsArr.push("NoOverride");
            }

            return sFlagsArr;
        }

        this.getTwinCATRouteFlagsStr = function (nFlags) {

            var sFlagsStr = "";
            sFlagsArr = this.getTwinCATRouteFlagsArr(nFlags);
            
            for (var i = 0; i < sFlagsArr.length; i++) {

                sFlagsStr += sFlagsArr[i];

                if ((i + 1) < sFlagsArr.length) {
                    sFlagsStr += ", ";
                }
            }

            return sFlagsStr;
        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: Mainboard module
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.getMainboardVoltageLocation = function (State) {

            switch (State) {
                case 0: return "Unknown";
                case 1: return "Other";
                case 2: return "Processor";
                case 3: return "Disk";
                case 4: return "System Management Module";
                case 5: return "Motherboard";
                case 6: return "Memory Module";
                case 7: return "Power Supply";
                case 8: return "Addin Card";
                case 9: return "Front Panel Board";
                case 10: return "Back Panel Board";
                case 11: return "Peripherie";
                case 12: return "Chassis";
                case 13: return "Battery";
                case 14: return "UPS";
                case 15: return "Graffic Board";
                case 16: return "Super IO";
                case 17: return "Chipset";
                case 18: return "Power Controller";

                default: return State;
            }

        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: UPS module
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.getUPSPowerStatusInfo = function (State) {
            switch (State) {
                case 0: return "Unknown";
                case 1: return "Online";
                case 2: return "On Batteries";
                default: return State;
            }
        }

        this.getUPSCommunicationStatusInfo = function (State) {
            switch (State) {
                case 0: return "Unknown";
                case 1: return "Ok";
                case 2: return "Error";
                default: return State;
            }
        }

        this.getUPSBatteryStatusInfo = function (State) {
            switch (State) {
                case 0: return "Unknown";
                case 1: return "Ok";
                case 2: return "Change Battery";
                default: return State;
            }
        }
        

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: Time module
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.parseDateFromTimestamp = function (Timestamp) {

            var dtUtc = new Date(Timestamp * 1000);

            var day = dtUtc.getDate();
            var month = dtUtc.getMonth() + 1;
            var year = dtUtc.getFullYear();

            return (day < 10 ? "0" : "") + day + "." + (month < 10 ? "0" : "") + month + "." + year;
        }

        this.parseTimeFromTimestamp = function (Timestamp) {

            var dtUtc = new Date(Timestamp * 1000);

            var hh = dtUtc.getHours();
            var mm = dtUtc.getMinutes();
            var ss = dtUtc.getSeconds();

            return (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
        }

        this.createDateTimeUTC = function (OldTimestamp, NewDate, NewTime) {

            var dtUtc = new Date(OldTimestamp * 1000);

            var NewDateArr = NewDate.split(".");
            if (NewDateArr.length != 3) { return -1; }
            dtUtc.setDate(NewDateArr[0]);
            dtUtc.setMonth(NewDateArr[1] - 1);
            dtUtc.setFullYear(NewDateArr[2]);

            var NewTimeArr = NewTime.split(":");
            if (NewTimeArr.length != 3) { return -1; }
            dtUtc.setHours(NewTimeArr[0]);
            dtUtc.setMinutes(NewTimeArr[1]);
            dtUtc.setSeconds(NewTimeArr[2]);

            return dtUtc.getTime() / 1000;
        }

        this.TextualDateTime_ISO8601 = function (TextualDatetime) {

            var _validDate = false;
            var _TextualDatetime = TextualDatetime;

            var Year = 0, Month = 0, Day = 0;
            var Hours = 0, Minutes = 0; Seconds = 0; Milliseconds = 0;
            var TimezoneBias_Minutes = 0;

            this.isValidDate = function () {
                return _validDate;
            }

            this.getDateString = function () {

                if (!_validDate) { return ""; }

                return (Day < 10 ? "0" : "") + Day + "." + (Month < 10 ? "0" : "") + Month + "." + Year;
            }

            this.getTimeString = function () {

                if (!_validDate) { return ""; }

                return (Hours < 10 ? "0" : "") + Hours + ":" + (Minutes < 10 ? "0" : "") + Minutes + ":" + (Seconds < 10 ? "0" : "") + Seconds;
            }

            this.getLongTimeString = function () {

                if (!_validDate) { return ""; }

                return this.getTimeString() + "." + Milliseconds;
            }

            this.getTimezoneBiasString = function () {

                if (!_validDate) { return ""; }

                var hh = 0, mm = 0;

                hh = parseInt(Math.abs(TimezoneBias_Minutes) / 60, 10);
                mm = parseInt(Math.abs(TimezoneBias_Minutes) % 60, 10);

                return (TimezoneBias_Minutes >= 0 ? "+" : "-") + (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm;
            }

            this.getISO8601String = function () {

                if (!_validDate) { return ""; }

                return Year + "-" + (Month < 10 ? "0" : "") + Month + "-" + (Day < 10 ? "0" : "") + Day + "T" +
                        this.getLongTimeString() +
                        this.getTimezoneBiasString();
            }

            // ISO8601 fixed in mdp
            //this.getISO8601NotString = function () {

            //    if (!_validDate) { return ""; }

            //    return Year + "." + (Month < 10 ? "0" : "") + Month + "." + (Day < 10 ? "0" : "") + Day + "T" +
            //            this.getLongTimeString() +
            //            this.getTimezoneBiasString();
            //}

            this.setDateTime = function (NewDate, NewTime) {

                if (!_validDate) { return false }

                var NewDateArr = NewDate.split(".");
                if (NewDateArr.length != 3) { return false; }

                var NewTimeArr = NewTime.split(":");
                if (NewTimeArr.length != 3) { return false; }

                Day = Number(NewDateArr[0]);
                Month = Number(NewDateArr[1]);
                Year = Number(NewDateArr[2]);

                Hours = Number(NewTimeArr[0]);
                Minutes = Number(NewTimeArr[1]);
                Seconds = Number(NewTimeArr[2]);
                Milliseconds = 0;

                return true;
            }

            this.setTimezoneBias = function (NewTimezoneBias_Minutes) {

                if (!_validDate) { return false }

                TimezoneBias_Minutes = NewTimezoneBias_Minutes;

                return true;
            }

            // constructor
            var parse = function () {

                var regexp = "([0-9]{4}).([0-9]{2}).([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{1,3})([-+])([0-9]{2}):([0-9]{2})";
                var d = _TextualDatetime.match(new RegExp(regexp));

                if (d) {
                    TimezoneBias_Minutes = (Number(d[9]) * 60) + Number(d[10]);
                    if (d[8] == '-') { TimezoneBias_Minutes *= -1; }

                    Year = Number(d[1]);
                    Month = Number(d[2]);
                    Day = Number(d[3]);

                    Hours = Number(d[4]);
                    Minutes = Number(d[5]);
                    Seconds = Number(d[6]);
                    Milliseconds = Number(d[7]);

                    _validDate = true;
                }
            }
            parse();
        }

        this.getSNTPRefreshDurationsArr = function () {

            var SNTPRefreshDurations = [];

            // Add hours
            for (var i = 1; i < 24; i++) {
                SNTPRefreshDurations.push(i + " hour" + (i > 1 ? "s" : ""));
            }

            // Add days
            for (var i = 1; i < 33; i++) {
                SNTPRefreshDurations.push(i + " day" + (i > 1 ? "s" : ""));
            }

            return SNTPRefreshDurations;
        }

        // Calculates the MDP Value [sec] by the index of the combobox [0 - 54]
        this.getSNTPRefreshDurationInSec = function (index /*index of combobox*/) {

            if (isNaN(index)) {
                return 3600;
            }
            index = Number(index);

            // index is zero based!
            
            if (index < 23) {
                return (index + 1) * 3600;  // hours
            }
            else if (index >= 23 && index < 55) {
                index -= 23;
                return (index + 1) * 3600 * 24; // days
            }
            else {
               return 3600; // error case: return 1 hour
            }
        }

        // Calculates the index of the combobox [0-54] by the value of MDP [s] 
        this.getSNTPRefreshDurationIndex = function (seconds /*value from mdp*/) {

            if (isNaN(seconds)) {
                return 0;
            }
            seconds = Number(seconds);

            var hours = (seconds / 3600).toFixed(0);

            if (hours >= 24) {

                // calc days
                var days = (hours / 24).toFixed(0);
                if (days < 1) {
                    return 23;  // 1 hour
                }
                else {  
                    return Math.min(23 + (days - 1), 54);   // last index is 54 !
                }
            }
            else {

                if (hours < 1) {
                    return 0;
                }
                else {
                    return hours - 1;
                }
            }
        }

        this.getBestRefrehTimeUnity = function (seconds) {

            if (isNaN(seconds)) {
                return seconds;
            }
            seconds = Number(seconds);

            if (seconds >= 60) {

                // Calc minutes
                var minutes = seconds / 60;
                if (minutes >= 60) {

                    // Calc hours
                    var hours = minutes / 60
                    if (hours >= 24) {

                        // last step... Calc days
                        var days = hours / 24;
                        return days.toFixed(0) + " day" + (days == 1 ? "" : "s");
                    }
                    else {
                        return hours.toFixed(0) + " hour" + (hours == 1 ? "" : "s");
                    }
                }
                else {
                    return minutes.toFixed(0) + " minute" + (minutes == 1 ? "" : "s");
                }
            }
            else {
                return seconds.toFixed(0) + " second" + (seconds == 1 ? "" : "s");
            }

        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: SMB Module
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.parseDirs = function (data) {

            var Dirs = [];

            if (data == undefined) {
                return Dirs;
            }

            var MdpOffset = 2; // Offset because of status(1byte) and padding(1byte) in result data

            // Version of Filesystem Module
            var version = (data.charCodeAt(5) << 24 | data.charCodeAt(4) << 16 | data.charCodeAt(3) << 8 | data.charCodeAt(2)) >>> 0;

            if (version != 0) {
                var tmp = [];
                return tmp;
            }

            var cbData = (data.charCodeAt(9) << 24 | data.charCodeAt(8) << 16 | data.charCodeAt(7) << 8 | data.charCodeAt(6)) >>> 0;
            var cbDirs = (data.charCodeAt(13) << 24 | data.charCodeAt(12) << 16 | data.charCodeAt(11) << 8 | data.charCodeAt(10)) >>> 0;
            var cFiles = (data.charCodeAt(17) << 24 | data.charCodeAt(16) << 16 | data.charCodeAt(15) << 8 | data.charCodeAt(14)) >>> 0;
            var nOffsDir = (data.charCodeAt(21) << 24 | data.charCodeAt(20) << 16 | data.charCodeAt(19) << 8 | data.charCodeAt(18)) >>> 0;
            var nOffsFile = (data.charCodeAt(25) << 24 | data.charCodeAt(24) << 16 | data.charCodeAt(23) << 8 | data.charCodeAt(22)) >>> 0;

            // so.. the first DirectoryInfo starts at
            var CurrentDir = nOffsDir + MdpOffset;

            for (var i = 0; i < cbDirs; i++) {

                // DirectoryInfo: 4Byte (Offset of next DirectoryInfo)
                //                4Byte (Length of DirectoryName)
                //                XByte (Directory Name)

                // 4Byte = Offset of next DirectoryInfo
                var nextDir = (data.charCodeAt(CurrentDir + 3) << 24 | data.charCodeAt(CurrentDir + 2) << 16 | data.charCodeAt(CurrentDir + 1) << 8 | data.charCodeAt(CurrentDir + 0)) >>> 0;

                // 4Byte = Directoryname length
                var DirectoryNameLength = (data.charCodeAt(CurrentDir + 7) << 24 | data.charCodeAt(CurrentDir + 6) << 16 | data.charCodeAt(CurrentDir + 5) << 8 | data.charCodeAt(CurrentDir + 4)) >>> 0;

                // XByte = Directoryname (Beginn @ CurrentDir + 8Byte)
                //                       (Stop   @ CurrentDir + 8Byte + Length of Directoryname) 
                var DirectoryName = "";
                for (var j = (CurrentDir + 8) ; j < (CurrentDir + 8 + DirectoryNameLength) ; j++) {
                    DirectoryName += data.charAt(j);
                }

                Dirs.push(DirectoryName);
                CurrentDir = nextDir + MdpOffset;
            }

            return Dirs;
        }

        this.parseAccessRights = function (data) {

            // signed!
            try
            {
                var access = (data.charCodeAt(3) << 24 | data.charCodeAt(2) << 16 | data.charCodeAt(1) << 8 | data.charCodeAt(0));
            
                var sRetVal = "";
                if(access == -1) { 

                    sRetVal = "Full Access"; 
                }
                else{
                    if (access & 0xA ) { sRetVal += "Read "; }
                    if (access & 0x14) { sRetVal += "Change "; }
                }
                
                if (sRetVal == "") {
                    sRetVal = "Unknown";
                }

                return sRetVal;
            }
            catch (e) {
                return "Unknown";
            }
        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: SMART module
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        this.getSmartAttributenameById = function (AttributeId) {

            switch (AttributeId) {
                case 1: return "Read Error Rate";
                case 2: return "Throughput Performance";
                case 3: return "Spin-Up Time";
                case 4: return "Start/Stop Count";
                case 5: return "Reallocated Sectors Count";
                case 6: return "Read Channel Margin";
                case 7: return "Seek Error Rate";
                case 8: return "Seek Time Performance";
                case 9: return "Power-On Hours (POH)";
                case 10: return "Spin Retry Count";
                case 11: return "Recalibration Retries";
                case 12: return "Device Power Cycle Count";
                case 13: return "Soft Read Error Rate";
                    // ...
                case 100: return "Erase/Program Cycles";
                    // ...
                case 103: return "Translation Table Rebuild";
                    // ...
                case 108: return "Unknown";
                    // ...
                case 170: return "Reserved Block Count";
                case 171: return "Program Fail Count";
                case 172: return "Erase Fail Count";
                case 173: return "Wear Leveller Worst Case Erase Count";
                case 174: return "Unexpected Power Loss";
                case 175: return "Program Fail Count";
                case 176: return "Erase Fail Count";
                case 177: return "Wear Leveling Count";
                case 178: return "Used Reserved Block Count";
                case 179: return "Used Reserved Block Count";
                case 180: return "Unused Reserved Block Count";
                case 181: return "Program Fail Count";
                case 182: return "Erase Fail Count";
                case 183: return "SATA Downshifts";
                case 184: return "End-to-End error";
                case 185: return "Head Stability";
                case 186: return "Induced Op-Vibration Detection";
                case 187: return "Reported Uncorrectable Errors";
                case 188: return "Command Timeout";
                case 189: return "High Fly Writes";
                case 190: return "Temperature Difference from 100";
                case 191: return "G-sense error rate";
                case 192: return "Power-off Retract Count";
                case 193: return "Load/Unload Cycle";
                case 194: return "Temperature";
                case 195: return "Hardware ECC Recovered";
                case 196: return "Reallocation Event Count";
                case 197: return "Current Pending Sector Count";
                case 198: return "Uncorrectable Sector Count";
                case 199: return "UltraDMA CRC Error Count";
                case 200: return "Write Error Rate/Multi-Zone Error Rate";
                case 201: return "Soft Read Error Rate";
                case 202: return "Data Address Mark errors";
                case 203: return "Run Out Cancel";
                case 204: return "Soft ECC Correction";
                case 205: return "Thermal Asperity Rate (TAR)";
                case 206: return "Flying Height";
                case 207: return "Spin High Current";
                case 208: return "Spin Buzz";
                case 209: return "Offline Seek Performance";
                    // ...
                case 220: return "Disk Shift";
                case 221: return "G-Sense Error Rate";
                case 222: return "Loaded Hours";
                case 223: return "Load/Unload Retry Count";
                case 224: return "Load Friction";
                case 225: return "Load/Unload Cycle Count";
                case 226: return "Load 'In'-time";
                case 227: return "Torque Amplification Count";
                case 228: return "Power-Off Retract Cycle";
                    // ...
                case 230: return "GMR Head Amplitude";
                case 231: return "Temperature";
                case 232: return "Available Reserved Space";
                case 233: return "Media Wearout Indicator";
                    // ...
                case 240: return "Head Flying Hours";
                case 241: return "Total LBAs Written";
                case 242: return "Total LBAs Read";
                    // ...
                case 250: return "Read Error Retry Rate";
                    // ...

                default: return "Unknown";

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // MDP: NTLMUser
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.getNTLMUserAccountIsActive = function (flags) {

            var UF_ACCOUNTDISABLE = 0x0002;

            if (!winxp) {
                return true;
            }
            else {
                return !((flags & UF_ACCOUNTDISABLE) == UF_ACCOUNTDISABLE);
            }
        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // Security Wizard
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        var bSecWizDeactivated = false;

        this.setDeactivateSecurityWizard = function () {
            bSecWizDeactivated = true;
        }

        this.getStartSecurityWizard = function () {

            try {
                if (bSecWizDeactivated) {
                    return false;
                }

                if (secwiz != undefined) {
                    return secwiz;
                }

                return false;
            }
            catch (e) {
                return false;
            }
        }

        this.LoadJS = function (url) {
            
            var scriptTag = document.createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.src = url;
            document.getElementsByTagName('head')[0].appendChild(scriptTag);
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // Further functions
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        this.dataToByteArray = function (data) {

            var RetVal = [];

            for (var i = 0; i < data.length; i++) {
                RetVal.push(data.charCodeAt(i));
            }

            return RetVal;
        }

        this.StringStartsWith = function (string, suffix) {

            return (string.indexOf(suffix) == 0);
        }

        this.StringEndsWith = function (string, suffix) {

            return (string.indexOf(suffix, string.length - suffix.length) !== -1);
        }

        this.StringContains = function (string, suffix) {
            return (string.indexOf(suffix) !== -1);
        }

        this.StringCut = function (string) {

            // if every charCode is 0, cut the string to a length of 0
            var EndPos = 0;

            for (var i = string.length; i > 0; i--) {

                // charCodeAt is ZeroBased!
                var charCode = string.charCodeAt(i - 1);
                if (charCode != 0) {
                    EndPos = i;
                    break;
                }
            }

            var retVal = string.substring(0, EndPos);
            return retVal;
        }

        this.ShowLoading = function (message) {

            try {
                var html = "";
                html += '<div class="ErrorDiv">';
                html += '<div class="Message">';
                html += '<img id="loadingImg" alt="" src="res/website/other/loading_big.gif"></img>';
                if (message != undefined) {
                    html += '<br/>' + message;
                }
                html += '</div>';
                html += '</div>';
                document.getElementById("OverlayLoading").style.zIndex = 100;
                document.getElementById("OverlayLoading").innerHTML = html;
            }
            catch (e) { }
        }

        this.HideLoading = function () {

            try {
                document.getElementById("OverlayLoading").style.zIndex = -1;
                document.getElementById("OverlayLoading").innerHTML = "";
            }
            catch (e) { }
        }

        this.ShowSecurityWarning = function () {

            try {
                document.getElementById("OverlaySecurityWarning").style.zIndex = 100;
                document.getElementById("OverlaySecurityWarning").innerHTML = '<div class="security_warning_body">Click here to change the default credentials!</div>';
                document.getElementById("OverlaySecurityWarning").onclick = function () { window.DevMan.ChangePage("Security", "Wizard"); }
                document.getElementById("Head").style.marginTop = "25px";
            }
            catch (e) { }
        }

        this.HideSecurityWarning = function () {

            try {
                document.getElementById("OverlaySecurityWarning").style.zIndex = -1;
                document.getElementById("OverlaySecurityWarning").innerHTML = "";
                document.getElementById("OverlaySecurityWarning").onclick = "";
                document.getElementById("Head").style.marginTop = "0px";
            }
            catch (e) { }
        }

        this.displayTime = function() {
            var str = "";

            var currentTime = new Date();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            var seconds = currentTime.getSeconds();
            var mseconds = currentTime.getMilliseconds();

            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            str += seconds + "." + mseconds;

            return str;
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////  Call RebootActive before rebooting
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        var Rebooting = false;
        
        // Reload the current page after n seconds
        this.RebootActive = function () {

            Rebooting = true;
            
            // set to false after n seconds
            if (winxp) {
                setTimeout(this.RebootElapsed, 180 * 1000);
                setTimeout(this.RebootShowLoading, 10 * 1000);
            }
            else {
                setTimeout(this.RebootElapsed, 120 * 1000);
                setTimeout(this.RebootShowLoading, 4 * 1000);
            }
        }

        // Do not reload the current page
        this.RebootActiveNoWait = function () {

            Rebooting = true;

            // set to false after n seconds
            if (winxp) {
                setTimeout(this.RebootElapsed, 180 * 1000);
            }
            else {
                setTimeout(this.RebootElapsed, 120 * 1000);
            }
        }

        this.RebootElapsed = function () {

            Rebooting = false;
        }

        this.RebootShowLoading = function () {

            try {
                window.DevMan.ReloadActivePage();
            }
            catch (e) { }
        }


        this.DisplayError = function (errorCode) {

            var SkipError = [0x0,   // success
                             405,   // Method now allowed
                             503,   // "Service not available"
                             0x2ee7,
                             0x2ef3,
                             0x2efd,
                             0x2efe,
                             0x2eff,
                             0x2fa8,
                             0xECA70000];   // WinError Success

            if (Rebooting === true) {

                // Hide Errors while device is restarting:
                SkipError.push(0x80050011); // "Request timed out"
                SkipError.push(0x80050012); // "UPnP Error"
                SkipError.push(0x80050013); // "Soap response empty" (XP)
            }

            for (var i = 0 ; i < SkipError.length; i++) {
                if (SkipError[i] == errorCode) { return false; }
            }

            return true;
        }

    });
    // Expose Helper instance to window object !!!
    window.Helper = Helper;

})(window);