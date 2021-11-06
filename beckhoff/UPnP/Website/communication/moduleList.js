(function (window) {

    // namespace
    var CommunicationModule_moduleList = new (function () {

        // class
        this.moduleList = function (ModuleAddress, ModuleServiceTransferAddress, ModuleType) {

            var _ModuleList = [];

            this.getModules = function () {

                return _ModuleList;
            }

            this.getModuleItem = function (Index) {

                return _ModuleList[Index];
            }

            this.getModulesCount = function () {

                return _ModuleList.length;
            }
            
            this.IsArray = function (paramID) {

                // Every Array has the type VISIBLE STRING for the transport
                // Some Arrays (see documentation) must be converted to another type after transport

                var Size = -1;
                var Type = "VISIBLE STRING";    // most of all types are VISIBLE STRING
                
                switch (paramID) {

                    default:
                        // the parameter is not an array
                        return undefined; 


                        /////////////////////////////////////////////////////////////////////                           
                        // Time                           
                        ///////////////////////////////////////////////////////////////                           

                        // exception (80Byte): IE7 takes a very long time to load because the timezone array is so big!
                        // longest known Timezone-Displayname: 60 chars
                    case "TIME_Property_Timezones_Len": Size = 80; break;                       

                        ///////////////////////////////////////////////////////////////////// 
                        // Management 
                        /////////////////////////////////////////////////////////////// 
                    case "Management_Username_Property_Len": Size = 128; break;
                    case "Management_Domain_Property_Len": Size = 128; break;
                    case "Management_Group_Membership_Property_Len": Size = 255; break;
                    case "Management_Local_Groups_Property_Len": Size = 255; break;
                    case "Management_User_Flags_Property_Len": Type = "UNSIGNED32"; break;

                        ///////////////////////////////////////////////////////////////////// 
                        // RAS
                        /////////////////////////////////////////////////////////////// 
                    case "RAS_Line_Names_Property_Len": Size = 128; break;
                    case "RAS_Line_Enabled_Property_Len": Type = "BOOLEAN"; break;
                    case "RAS_Userlist_Property_Len": Size = 128; break;

                        ///////////////////////////////////////////////////////////////////// 
                        // FTP
                        /////////////////////////////////////////////////////////////// 
                    case "FTP_Property_Username_Len": Size = 255; break;

                        /////////////////////////////////////////////////////////////////////
                        // SMB
                        ///////////////////////////////////////////////////////////////
                    case "SMB_Property_Share_Names_Len": Size = 128; break;
                    case "SMB_Property_Path_Names_Len": Size = 255; break;
                    case "SMB_Property_Userlist_Len": Size = 255; break;
                    case "SMB_Property_Access_Rights_Len": Size = 255; break;                     // Unsigned32 for each User

                        /////////////////////////////////////////////////////////////////////
                        // TwinCAT
                        ///////////////////////////////////////////////////////////////
                    case "TwinCAT_Property_Route_Name_Len": Size = 255; break;                  // MaxLength: unknown
                    case "TwinCAT_Property_Route_Address_Len": Size = 128; break;               // MaxLength of computername: 63 Byte
                    case "TwinCAT_Property_Route_AMS_Address_Len": Size = 32; break;            // xxx.xxx.xxx.xxx.xxx.xxx
                    case "TwinCAT_Property_Route_Flags_Len": Type = "UNSIGNED32"; break;
                    case "TwinCAT_Property_Route_Timeout_Len": Type = "UNSIGNED32"; break;
                    case "TwinCAT_Property_Route_Transport_Len": Type = "UNSIGNED16"; break;
                    
                        /////////////////////////////////////////////////////////////////////
                        // Software
                        ///////////////////////////////////////////////////////////////
                    case "Software_Property_Name_Len": Size = 255; break;                       // Path
                    case "Software_Property_Company_Len": Size = 128; break;                    // Beckhoff Automation GmbH, etc.
                    case "Software_Property_Date_Len": Size = 32; break;                        // MM/dd/yyyy hh:mm 
                    case "Software_Property_Version_Len": Size = 32; break;                     // xxxx.xxxx.xxxx.xxxx

                        /////////////////////////////////////////////////////////////////////
                        // Firewall
                        ///////////////////////////////////////////////////////////////
                    case "Firewall_Flags_Property_Len": Type = "UNSIGNED32"; break;
                    case "Firewall_Mask_Property_Len": Type = "UNSIGNED32"; break;
                    case "Firewall_PrivateHost_Property_Len": break;
                    case "Firewall_PublicHost_Property_Len": break;
                    case "Firewall_PublicHostMask_Property_Len": break;
                    case "Firewall_Protocol_Property_Len": Type = "UNSIGNED32"; break;
                    case "Firewall_Action_Property_Len": Type = "UNSIGNED32"; break;
                    case "Firewall_PortRange_Property_Len": Type = "UNSIGNED32"; break;
                    case "Firewall_TypeAndCode_Property_Len": Type = "UNSIGNED16"; break;
                    case "Firewall_Description_Property_Len": break;
                    case "Firewall_UID_Property_Len": Type = "UNSIGNED32"; break;

                        /////////////////////////////////////////////////////////////////////
                        // DisplayDevice
                        ///////////////////////////////////////////////////////////////
                    case "DisplayDevice_Modes_Property_Len": Size = 64; break;                  
                        
                        /////////////////////////////////////////////////////////////////////
                        // EWF
                        ///////////////////////////////////////////////////////////////
                    case "EWF_VolumeName_Property_Len": Size = 8; break;                        //  C, D
                    case "EWF_VolumeID_Property_Len": Size = 64; break;                         // 
                    case "EWF_State_Property_Len": Type = "UNSIGNED32"; break;
                    case "EWF_Type_Property_Len": Type = "UNSIGNED32"; break;
                    case "EWF_BootCommand_Property_Len": Type = "UNSIGNED32"; break;

                        /////////////////////////////////////////////////////////////////////
                        // FBWF
                        ///////////////////////////////////////////////////////////////
                    case "FBWF_Volumes_Property_Len": Size = 64; break;
                    case "FBWF_Exclusions_Property_Len": Size = 255; break;

                        /////////////////////////////////////////////////////////////////////
                        // RAID
                        ///////////////////////////////////////////////////////////////
                    case "RAID_Property_SetsType_Len": Type = "UNSIGNED8"; break;
                    case "RAID_Property_SetsStateInfo_Len": Type = "UNSIGNED16"; break;
                    case "RAID_Property_SetsDrives_Len": Size = 255; break;                     // Infosys max.: 255
                    case "RAID_Property_DrivesSerialNumber_Len": Size = 64; break;              // Infosys max.: 40 Byte
                    case "RAID_Property_DrivesState_Len": Type = "UNSIGNED8"; break;

                        /////////////////////////////////////////////////////////////////////
                        // Mainboard
                        ///////////////////////////////////////////////////////////////
                    case "Mainboard_VoltageInformationName_Property_Len": Size = 64; break;                     // PwrCtrolVCC, CX2100 24V, etc. 
                    case "Mainboard_VoltageInformationLocation_Property_Len": Type = "SIGNED16"; break;
                    case "Mainboard_VoltageInformationVoltage_Property_Len": Type = "SIGNED16"; break;
                    case "Mainboard_VoltageInformationNominalVoltage_Property_Len": Type = "SIGNED16"; break;

                        /////////////////////////////////////////////////////////////////////
                        // DiskManagement
                        ///////////////////////////////////////////////////////////////
                    case "DiskManagement_DriveLetter_Property_Len": Size = 16; break;            // Win32: "C:\", "D:\" | CE: Hard Disk 
                    case "DiskManagement_VolumeLabel_Property_Len": Size = 64; break;           // Max length: NTFS 32, FAT 11
                    case "DiskManagement_FileSystem_Property_Len": Size = 16; break;            // FAT16, FAT, NTFS, exFAT
                    case "DiskManagement_DriveType_Property_Len": Type = "UNSIGNED32"; break;
                    case "DiskManagement_TotalSize_Property_Len": Type = "UNSIGNED64"; break;
                    case "DiskManagement_FreeBytes_Property_Len": Type = "UNSIGNED64"; break;
                    
                        /////////////////////////////////////////////////////////////////////
                        // PhysicalDrive
                        ///////////////////////////////////////////////////////////////
                    case "SMART_Indices_Property_Len": Type = "UNSIGNED8"; break;
                    case "SMART_StatusFlags_Property_Len": Type = "UNSIGNED16"; break;
                    case "SMART_CurrentValues_Property_Len": Type = "UNSIGNED8"; break;
                    case "SMART_WorstValues_Property_Len": Type = "UNSIGNED8"; break;
                    case "SMART_RawData_Property_Len": Size = 6; break;
                    case "SMART_Threshold_Property_Len": Type = "UNSIGNED8"; break;

                        /////////////////////////////////////////////////////////////////////
                        // MassStorageMonitoring
                        ///////////////////////////////////////////////////////////////
                    case "MassStorageMonitoring_Serialnumber_Property_Len": Size = 128; break;
                    case "MassStorageMonitoring_Slot_Property_Len": Type = "UNSIGNED8"; break;
                    case "MassStorageMonitoring_DriveLetters_Property_Len": Size = 128; break;
                    case "MassStorageMonitoring_DriveName_Property_Len": Size = 128; break;
                    case "MassStorageMonitoring_DriveType_Property_Len": Type = "UNSIGNED8"; break;
                    case "MassStorageMonitoring_EraseCountAverage_Property_Len": Type = "UNSIGNED64"; break;
                    case "MassStorageMonitoring_EraseCountSpecified_Property_Len": Type = "UNSIGNED64"; break;
                    case "MassStorageMonitoring_EraseCyclesLeftPercent_Property_Len": Type = "SIGNED16"; break;
                    case "MassStorageMonitoring_SpareBlocksRemaining_Property_Len": Type = "UNSIGNED64"; break;
                    case "MassStorageMonitoring_SpareBlocksInitial_Property_Len": Type = "UNSIGNED64"; break;
                    case "MassStorageMonitoring_SpareBlocksLeftPercent_Property_Len": Type = "SIGNED16"; break;
                    case "MassStorageMonitoring_ReallocatedSectors": Type = "UNSIGNED64"; break;
                    case "MassStorageMonitoring_SpinRetries": Type = "UNSIGNED64"; break;
                    case "MassStorageMonitoring_PendingSectors": Type = "UNSIGNED64"; break;
                    case "MassStorageMonitoring_UltraDmaCrcErrors": Type = "UNSIGNED64"; break;

                    /////////////////////////////////////////////////////////////////////
                    // UWF
                    ///////////////////////////////////////////////////////////////
                    case "UWF_Properties_Volumes": Size = 16; break;
                    case "UWF_Properties_VolumeProtectionCurrentStates": Type = "UNSIGNED8"; break;
                    case "UWF_Properties_VolumeProtectionNextStates": Type = "UNSIGNED8"; break;
                    case "UWF_Properties_FileExclusions": Size = 512; break;
                }

                if (Size === -1) {  // if size was not already set before

                    switch (Type) {

                        case "BOOLEAN":
                            Size = 1;
                            break;

                        case "SIGNED8":
                        case "UNSIGNED8":
                            Size = 1;
                            break;

                        case "SIGNED16":
                        case "UNSIGNED16":
                            Size = 2;
                            break;

                        case "SIGNED32":
                        case "UNSIGNED32":
                            Size = 4;
                            break;

                        case "UNSIGNED64":
                            Size = 8;
                            break;

                        case "REAL32":
                            Size = 4;
                            break;

                        case "VISIBLE STRING":
                            Size = 255;         // Default-size if unknown
                            break;

                        default:
                            Size = 0;
                            break;
                    }
                }

                var RetVal = [];
                    RetVal.push(Type);          // Type  
                    RetVal.push(Size);          // Size
                    return RetVal;
            }

            // Returns an ID depending on the ModuleType starting with 0
            // Sample:
            // If there are two NICs the first NIC gets the id 0 the second 1...
            // Every command or property can be identified by this ID and its name
            var GetIdOf = function (Type, CurrentIdx) {

                var iID = 0;

                for (var i = 0; i < CurrentIdx; i++) {

                    if (ModuleType[i] == Type) {
                        iID++;
                    }
                }

                return iID;
            }

            var createProperty = function (ID, Name, Address, SubIndex, Flags, Type, Size, Access) {

                var xxx_Property = new Defines.ModuleItem(
                    0,  // Property
                    ID,
                    Name,
                    Address,
                    SubIndex,
                    Flags,
                    Type,
                    Size,
                    Access,
                    undefined);

                _ModuleList.push(xxx_Property);
            }


            var createServiceTransfer = function (ID, Name, Address, SubIndex, Parameters, ResultSize) {

                var xxx_ServiceTransfer = new Defines.ModuleItem(
                    1, // ServiceTransfer
                    ID,
                    Name,
                    Address,
                    SubIndex,
                    0,          // Flags always 0
                    undefined,
                    undefined,
                    undefined,
                    Parameters);

                _ModuleList.push(xxx_ServiceTransfer);
                _ModuleList.push(createServiceTransferState(ID, Name, Address));
                _ModuleList.push(createServiceTransferResult(ID, Name, Address, ResultSize));

            }

            var createServiceTransferState = function (ID, Name, Address) {

                var xxx_ServiceTransfer_State = new Defines.ModuleItem(
                    2, // ServiceTransferState
                    ID,
                    Name + "_State",
                    Address,
                    2,              // always @ subindex 2
                    0,              // flags always 0
                    "UNSIGNED8",    // always UNSIGNED8
                    1,
                    "read-only",    
                    undefined);

                return xxx_ServiceTransfer_State;
            }

            var createServiceTransferResult = function (ID, Name, Address, ResultSize) {

                var Size = 80;
                if (ResultSize) { Size = ResultSize; }

                var xxx_ServiceTransfer_Result = new Defines.ModuleItem(
                    3, // ServiceTransferResult
                    ID,
                    Name + "_Result",
                    Address,
                    3,                  // always @ subindex 3
                    0,                  // flags always 0
                    "VISIBLE STRING",   // always STRING
                    Size,                 // always size 80
                    "read-only",
                    undefined);

                return xxx_ServiceTransfer_Result;
            }

            var _construct = function () {

                ///////////////////////////////////////////////////////////////////////////////
                // General Information | always at the same address(es)
                /////////////////////////////////////////////////////////////////////////////

                createProperty(0, "General_Device_Type", 0x1000, 0, 0, "DWORD32", 4, "read-only");
                createProperty(0, "GENERAL_Device_Name", 0x1008, 0, 0, "VISIBLE STRING", 128, "read-write");
                createProperty(0, "GENERAL_Hardware_Version", 0x1009, 0, 0, "VISIBLE STRING", 128, "constant");
                createProperty(0, "GENERAL_OS_and_Image_Version", 0x100A, 0, 0, "VISIBLE STRING", 128, "constant");
                createProperty(0, "GENERAL_IdentifyObject_Len", 0x1018, 0, 0, "UNSIGNED16", 2, "read-only");
                createProperty(0, "GENERAL_IdentifyObject_Vendor", 0x1018, 1, 0, "UNSIGNED32", 4, "constant");
                createProperty(0, "GENERAL_IdentifyObject_Product_Code", 0x1018, 2, 0, "UNSIGNED32", 4, "constant");
                createProperty(0, "GENERAL_IdentifyObject_Revision_Number", 0x1018, 3, 0, "UNSIGNED32", 4, "constant");
                createProperty(0, "GENERAL_IdentifyObject_Serial_Number", 0x1018, 4, 0, "UNSIGNED32", 4, "constant");

                createProperty(0, "DEVICE_Module_ID_List_ALL", 0xF020, 0, 1, "VISIBLE STRING", 1024, "read-only");
                createProperty(0, "DEVICE_IPC_Serial_Number", 0xF9F0, 0, 0, "VISIBLE STRING", 128, "constant");
                
                
                ///////////////////////////////////////////////////////////////////////////////
                // MODULES
                /////////////////////////////////////////////////////////////////////////////

                for (var i = 0; i < ModuleAddress.length; i++) {

                    var iID = GetIdOf(ModuleType[i], i);

                    switch (ModuleType[i]) {

                        case 2:

                            /////////////////////////////////////////////////////////////////////
                            // NIC Properties
                            ///////////////////////////////////////////////////////////////

                            // BaseAddress + 0
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(0, 10);
                            createProperty(iID, "NIC_Property_Name", PropertiesAddress, 3, 0,"VISIBLE STRING", 128, "read-only");

                            // BaseAddress + 1
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "NIC_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "NIC_Property_MAC_Address", PropertiesAddress, 1, 0, "VISIBLE STRING", 128, "constant");
                            createProperty(iID, "NIC_Property_IPv4_Address", PropertiesAddress, 2, 0, "VISIBLE STRING", 128, "read-write");
                            createProperty(iID, "NIC_Property_IPv4_Subnet_Mask", PropertiesAddress, 3, 0, "VISIBLE STRING", 128, "read-write");
                            createProperty(iID, "NIC_Property_DHCP", PropertiesAddress, 4, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "NIC_Property_IPv4_Default_Gateway", PropertiesAddress, 5, 0, "VISIBLE STRING", 128, "read-write");
                            createProperty(iID, "NIC_Property_IPv4_DnsServers", PropertiesAddress, 6, 0, "VISIBLE STRING", 128, "read-write");


                            // 0xBnn0 – IP Release/Renew Address (Service Transfer Object) 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(0, 10);

                            // Paramters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DummyByte", "UNSIGNED8"));

                            createServiceTransfer(iID, "NIC_Function_IP_Release_Renew", ServiceTransferAddress, 1, ServiceTransferParameters);
                            

                            // 0xBnn1 – Set IP And SubnetMask (Service Transfer Object) 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(1, 10);

                            // Paramters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cb", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cchIp", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cchSubnet", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cchGateway", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szIp", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szSubnet", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szGateway", "STRING"));

                            createServiceTransfer(iID, "NIC_Function_Set_IpAndSubnet", ServiceTransferAddress, 1, ServiceTransferParameters);

                            break;


                        case 3:

                            /////////////////////////////////////////////////////////////////////
                            // TIME Properties
                            ///////////////////////////////////////////////////////////////

                            // BaseAddress + 1
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "TIME_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "TIME_Property_SNTP_Server", PropertiesAddress, 1, 0, "VISIBLE STRING", 128, "read-write");
                            createProperty(iID, "TIME_Property_SNTP_Refresh", PropertiesAddress, 2, 0, "UNSIGNED32", 4, "read-write");
                            createProperty(iID, "TIME_Property_Seconds", PropertiesAddress, 3, 0, "UNSIGNED32", 4, "read-write");
                            createProperty(iID, "TIME_Property_Textual_DateTime_presentation", PropertiesAddress, 4, 0, "VISIBLE STRING", 128, "read-write");
                            createProperty(iID, "TIME_Property_Timezone", PropertiesAddress, 5, 0, "UNSIGNED16", 2, "read-write");
                            
                            // BaseAddress + 2
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "TIME_Property_Timezones_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-write");

                            break;


                        case 4:

                            /////////////////////////////////////////////////////////////////////
                            // Management
                            ///////////////////////////////////////////////////////////////

                            // BaseAddress + 1
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "Management_Username_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 2
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "Management_Domain_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 3
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(3, 10);
                            createProperty(iID, "Management_Group_Membership_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 4
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(4, 10);
                            createProperty(iID, "Management_Local_Groups_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 5
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(5, 10);
                            createProperty(iID, "Management_User_Flags_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

 
                            // 0xBnn0 – Add User (Service Transfer Object) 
                            // ServiceTransferAddress + 0
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(0, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbInputData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DomainLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("PasswordLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szName", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szDomain", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szPassword", "STRING"));

                            createServiceTransfer(iID, "Management_Function_Add_User", ServiceTransferAddress, 1, ServiceTransferParameters);
                            

                            // 0xBnn1 – Delete User (Service Transfer Object) 
                            // ServiceTransferAddress + 1
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(1, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbInputData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DomainLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szName", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szDomain", "STRING"));
                            
                            createServiceTransfer(iID, "Management_Function_Del_User", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn2 – Set Password (Service Transfer Object) obsolete
                            // ServiceTransferAddress + 2
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(2, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbInputData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DomainLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("PasswordLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szName", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szDomain", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szPassword", "STRING"));

                            createServiceTransfer(iID, "Management_Function_Change_Password", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn3 – Set Group Membership (Service Transfer Object) *
                            // ServiceTransferAddress + 3
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(3, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbInputData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("UserNameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("GroupNameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DomainNameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("IsMemberOfGroup", "BOOLEAN"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szUserName", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szGroupName", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szDomainName", "STRING"));

                            createServiceTransfer(iID, "Management_Function_Set_Group_Membership", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn4 – Create Group (Service Transfer Object) *
                            // ServiceTransferAddress + 4
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(4, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbInputData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("GroupNameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DomainNameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szGroupName", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szDomainName", "STRING"));

                            createServiceTransfer(iID, "Management_Function_Create_Group", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn5 – Delete Group (Service Transfer Object) *
                            // ServiceTransferAddress + 5
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(5, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbInputData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("GroupNameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DomainNameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szGroupName", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szDomainName", "STRING"));

                            createServiceTransfer(iID, "Management_Function_Delete_Group", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn6 – Set Password Secure (Service Transfer Object) 
                            // ServiceTransferAddress + 6
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(6, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbInputData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DomainLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("PasswordLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("PasswordNewLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szName", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szDomain", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szPassword", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szPasswordNew", "STRING"));

                            createServiceTransfer(iID, "Management_Function_Change_Password_Secure", ServiceTransferAddress, 1, ServiceTransferParameters);

                            break;


                        case 5:

                            /////////////////////////////////////////////////////////////////////
                            // RAS Properties
                            ///////////////////////////////////////////////////////////////

                            // BaseAddress + 1
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "RAS_Misc_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "RAS_Misc_Property_Enable", PropertiesAddress, 1, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "RAS_Misc_Property_Slow_Connection", PropertiesAddress, 2, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "RAS_Misc_Property_Use_DHCP", PropertiesAddress, 3, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "RAS_Misc_Property_Use_Auto_Addresses", PropertiesAddress, 4, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "RAS_Misc_Property_Static_Ip_Count", PropertiesAddress, 5, 0, "UNSIGNED32", 4, "read-write");
                            createProperty(iID, "RAS_Misc_Property_Static_Ip_Start", PropertiesAddress, 6, 0, "UNSIGNED32", 128, "read-write");

                            // BaseAddress + 2
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "RAS_Line_Names_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 3
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(3, 10);
                            createProperty(iID, "RAS_Line_Enabled_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 4
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(4, 10);
                            createProperty(iID, "RAS_Userlist_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            break;


                        case 6:

                            /////////////////////////////////////////////////////////////////////
                            // FTP Properties
                            ///////////////////////////////////////////////////////////////

                            // BaseAddress + 1
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "FTP_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "FTP_Property_Active", PropertiesAddress, 1, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "FTP_Property_Allow_Anonymous", PropertiesAddress, 2, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "FTP_Property_Allow_Anonymous_Upload", PropertiesAddress, 3, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "FTP_Property_Anonymous_Vroots", PropertiesAddress, 4, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "FTP_Property_Use_Authentication", PropertiesAddress, 5, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "FTP_Property_Default_Directory", PropertiesAddress, 6, 0, "VISIBLE STRING", 255, "read-write");

                            // BaseAddress + 2
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "FTP_Property_Username_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            break;


                        case 7:

                            /////////////////////////////////////////////////////////////////////
                            // SMB Properties
                            ///////////////////////////////////////////////////////////////

                            // BaseAddress + 1
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "SMB_Property_Share_Names_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 2
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "SMB_Property_Path_Names_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 3
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(3, 10);
                            createProperty(iID, "SMB_Property_Userlist_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 4
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(4, 10);
                            createProperty(iID, "SMB_Property_Access_Rights_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");


                            // 0xBnn0 – Add Share (Service Transfer Object) 
                            // FunctionBaseAddress + 0
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(0, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbInputData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("PathLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szName", "VISIBLE STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szPath", "VISIBLE STRING"));

                            createServiceTransfer(iID, "SMB_Function_Add_Share", ServiceTransferAddress, 1, ServiceTransferParameters);
                            

                            // 0xBnn1 – Del Share (Service Transfer Object) 
                            // FunctionBaseAddress + 1
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(1, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("ShareName", "VISIBLE STRING"));

                            createServiceTransfer(iID, "SMB_Function_Del_Share", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn2 – Set user Access rights (Service Transfer Object)
                            // FunctionBaseAddress + 2
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(2, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("ShareNameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("UserNameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("AccessRights", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("ShareName", "VISIBLE STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("UserName", "VISIBLE STRING"));

                            createServiceTransfer(iID, "SMB_Function_SetUserAccessRights", ServiceTransferAddress, 1, ServiceTransferParameters);

                            break;
                        
                        case 8:

                            /////////////////////////////////////////////////////////////////////
                            // TwinCAT Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn1 – Tc Misc 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "TwinCAT_TcMisc_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "TwinCAT_TcMisc_Property_MajorVersion", PropertiesAddress, 1, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "TwinCAT_TcMisc_Property_MinorVersion", PropertiesAddress, 2, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "TwinCAT_TcMisc_Property_Build", PropertiesAddress, 3, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "TwinCAT_TcMisc_Property_AmsNetID", PropertiesAddress, 4, 0, "VISIBLE STRING", 128, "read-write");
                            createProperty(iID, "TwinCAT_TcMisc_Property_RegLevel", PropertiesAddress, 5, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "TwinCAT_TcMisc_Property_TwinCATStatus", PropertiesAddress, 6, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "TwinCAT_TcMisc_Property_RunAsDevice", PropertiesAddress, 7, 0, "UNSIGNED16", 2, "read-write");
                            createProperty(iID, "TwinCAT_TcMisc_Property_ShowTargetVisu", PropertiesAddress, 8, 0, "UNSIGNED16", 2, "read-write");
                            createProperty(iID, "TwinCAT_TcMisc_Property_LogFileSize", PropertiesAddress, 9, 0, "UNSIGNED32", 4, "read-write");
                            createProperty(iID, "TwinCAT_TcMisc_Property_LogFilePath", PropertiesAddress, 10, 0, "VISIBLE STRING", 255, "read-write");
                            createProperty(iID, "TwinCAT_TcMisc_Property_TwinCATSystemID", PropertiesAddress, 11, 0, "VISIBLE STRING", 128, "read-only");
                            createProperty(iID, "TwinCAT_TcMisc_Property_Revision", PropertiesAddress, 12, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn2 - TwinCAT Route Name 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "TwinCAT_Property_Route_Name_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn3 - TwinCAT Route Address 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(3, 10);
                            createProperty(iID, "TwinCAT_Property_Route_Address_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn4 - TwinCAT Route AMS Address 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(4, 10);
                            createProperty(iID, "TwinCAT_Property_Route_AMS_Address_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn5 - TwinCAT Route Flags 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(5, 10);
                            createProperty(iID, "TwinCAT_Property_Route_Flags_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn6 - TwinCAT Route Timeout  
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(6, 10);
                            createProperty(iID, "TwinCAT_Property_Route_Timeout_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn7 - TwinCAT Route Transport 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(7, 10);
                            createProperty(iID, "TwinCAT_Property_Route_Transport_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn8 - TwinCAT Logfile 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(8, 10);
                            createProperty(iID, "TwinCAT_Property_TwinCAT_Logfile", PropertiesAddress, 0, 0, "VISIBLE STRING", 1024, "read-only");


                            // 0x8nn9 – Tc Router Status Information
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(9, 10);
                            createProperty(iID, "TwinCAT_TcRouterStatusInfo_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "TwinCAT_TcRouterStatusInfo_Property_MemoryMax", PropertiesAddress, 1, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "TwinCAT_TcRouterStatusInfo_Property_MemoryAvailable", PropertiesAddress, 2, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "TwinCAT_TcRouterStatusInfo_Property_RegisteredPorts", PropertiesAddress, 3, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "TwinCAT_TcRouterStatusInfo_Property_RegisteredDrivers", PropertiesAddress, 4, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "TwinCAT_TcRouterStatusInfo_Property_RegisteredTransports", PropertiesAddress, 5, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "TwinCAT_TcRouterStatusInfo_Property_DebugWindow", PropertiesAddress, 6, 0, "BOOLEAN", 1, "read-only");
                            createProperty(iID, "TwinCAT_TcRouterStatusInfo_Property_MailboxSize", PropertiesAddress, 7, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "TwinCAT_TcRouterStatusInfo_Property_MailboxUsedEntries", PropertiesAddress, 8, 0, "UNSIGNED32", 4, "read-only");

                            // 0xBnn0 - TwinCAT Add Route (Service Transfer Object) 
                            // FunctionBaseAddress + 0
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(0, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbInputData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Flags", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Timeout", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Transport", "UNSIGNED16"));
                            // The datatype "ByteArray" does not exist! So put one byte after the other...
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NetId_B1", "BOOLEAN"));    
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NetId_B2", "BOOLEAN"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NetId_B3", "BOOLEAN"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NetId_B4", "BOOLEAN"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NetId_B5", "BOOLEAN"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NetId_B6", "BOOLEAN"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("AddressLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szName", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szAddress", "STRING"));

                            createServiceTransfer(iID, "TwinCAT_Function_AddRoute", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn1 - TwinCAT Del Route (Service Transfer Object) 
                            // FunctionBaseAddress + 1
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(1, 10);

                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("NameLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szName", "STRING"));
                            
                            createServiceTransfer(iID, "TwinCAT_Function_DelRoute", ServiceTransferAddress, 1, ServiceTransferParameters);



                            break;

                        case 10:

                            /////////////////////////////////////////////////////////////////////
                            // Software Properties
                            ///////////////////////////////////////////////////////////////

                            // BaseAddress + 1
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "Software_Property_Name_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 2
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "Software_Property_Company_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 3
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(3, 10);
                            createProperty(iID, "Software_Property_Date_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // BaseAddress + 4
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(4, 10);
                            createProperty(iID, "Software_Property_Version_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            
                            break;

                        case 11:

                            /////////////////////////////////////////////////////////////////////
                            // CPU Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn1 - CPU Properties
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "CPU_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "CPU_Property_CPU_Frequency", PropertiesAddress, 1, 0, "UNSIGNED32", 4, "constant");
                            createProperty(iID, "CPU_Property_Current_CPU_Usage", PropertiesAddress, 2, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "CPU_Property_Current_CPU_Temperature", PropertiesAddress, 3, 0, "SIGNED16", 2, "read-only");

                            break;

                        case 12:

                            /////////////////////////////////////////////////////////////////////
                            // Memory Properties
                            ///////////////////////////////////////////////////////////////

                            // BaseAddress + 1
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "Memory_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "Memory_Property_Program_Memory_Allocated", PropertiesAddress, 1, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "Memory_Property_Program_Memory_Available", PropertiesAddress, 2, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "Memory_Property_Storage_Memory_Allocated_CE", PropertiesAddress, 3, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "Memory_Property_Storage_Memory_Available_CE", PropertiesAddress, 4, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "Memory_Property_Memory_Division", PropertiesAddress, 5, 0, "UNSIGNED32", 4, "read-write");
                            createProperty(iID, "Memory_Property_Program_Memory_Allocated_64", PropertiesAddress, 6, 0, "UNSIGNED64", 8, "read-only");
                            createProperty(iID, "Memory_Property_Program_Memory_Available_64", PropertiesAddress, 7, 0, "UNSIGNED64", 8, "read-only");
                            break;

                        case 14:

                            /////////////////////////////////////////////////////////////////////
                            // Firewall Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn1 – Firewall Settings 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "Firewall_Settings_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "Firewall_Settings_Property_EnableIPv4", PropertiesAddress, 1, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "Firewall_Settings_Property_EnableIPv6", PropertiesAddress, 2, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "Firewall_Settings_Property_Persist", PropertiesAddress, 3, 0, "BOOLEAN", 1, "read-write");

                            // 0x8nn2 – Flags 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "Firewall_Flags_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn3 – Mask 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(3, 10);
                            createProperty(iID, "Firewall_Mask_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn4 – Private Host 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(4, 10);
                            createProperty(iID, "Firewall_PrivateHost_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn5 – Public Host 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(5, 10);
                            createProperty(iID, "Firewall_PublicHost_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn6 – Public Host Mask 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(6, 10);
                            createProperty(iID, "Firewall_PublicHostMask_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn7 – Protocol 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(7, 10);
                            createProperty(iID, "Firewall_Protocol_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn8 – Action 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(8, 10);
                            createProperty(iID, "Firewall_Action_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn9 – Port Range 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(9, 10);
                            createProperty(iID, "Firewall_PortRange_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nnA – Type & Code 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(10, 10);
                            createProperty(iID, "Firewall_TypeAndCode_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nnB – Description 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(11, 10);
                            createProperty(iID, "Firewall_Description_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nnC – UID
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(12, 10);
                            createProperty(iID, "Firewall_UID_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            
                            // 0xBnn0 – Add Rule (Service Transfer Object) 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(0, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Flags", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Mask", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("PrivateHostOrFamily", "RAW", 40));   // max size 40 byte
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("PublicHostIP", "RAW", 40));          // string with fixed size of 40 byte
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("PublicHostMaskOrPrefix", "RAW", 4)); // max size 4 byte
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Protocol", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Actions", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("PortRange", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("TypeAndCode", "UNSIGNED16"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DescriptionLen", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szDescription", "STRING"));

                            createServiceTransfer(iID, "Firewall_Function_AddRule", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn1 – Delete Rule (Service Transfer Object)  
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(1, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("UId", "UNSIGNED32"));
                            
                            createServiceTransfer(iID, "Firewall_Function_DelRule", ServiceTransferAddress, 1, ServiceTransferParameters);

                            break;


                        case 16:

                            /////////////////////////////////////////////////////////////////////
                            // File System Object Properties
                            ///////////////////////////////////////////////////////////////

                            // 0xBnn0 - Dir (Service Transfer Object) 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(0, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbsRootDir", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("sRootDir", "VISIBLE STRING"));

                            createServiceTransfer(iID, "FSO_Function_Dir", ServiceTransferAddress, 1, ServiceTransferParameters, 131072);


                            // 0xBnn1 - GetFile(Service Transfer Object) 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(1, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbFilename", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("ContinuationHandle", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbMaxRead", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Filename", "STRING"));

                            createServiceTransfer(iID, "FSO_Function_GetFile", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn2 - WriteFile (Service Transfer Object) 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(2, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbFilename", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("ContinuationHandle", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("bWriteCompleted", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Filename", "STRING")); // [len cbFilename]
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("data", "STRING")); // is BYTE[cbData]

                            createServiceTransfer(iID, "FSO_Function_WriteFile", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn3 - CopyFile ServiceTransfer
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(3, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbSrc", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbDst", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Flags", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("SourceFilename", "STRING")); // [len cbSrc]
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DestinationFilename", "STRING")); // [len cbDst]

                            createServiceTransfer(iID, "FSO_Function_CopyFile", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn4 - DeleteFile ServiceTransfer
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(4, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbFilename", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("bRecurse", "BOOLEAN")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Filename", "STRING")); // [len cbFilename]
                            
                            createServiceTransfer(iID, "FSO_Function_DeleteFile", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn5 - mkdir  ServiceTransfer 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(5, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbFilename", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("bRecurse", "BOOLEAN"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Filename", "STRING")); // [len cbFilename]

                            createServiceTransfer(iID, "FSO_Function_mkdir", ServiceTransferAddress, 1, ServiceTransferParameters);

                            break;

                        case 17:    // not implemented
                            break;
                        case 18:    // not implemented
                            break;

                        case 19:

                            /////////////////////////////////////////////////////////////////////
                            // Display Device Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn0 –  
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(0, 10);
                            createProperty(iID, "DisplayDevice_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            //...
                            createProperty(iID, "DisplayDevice_Property_DeviceName", PropertiesAddress, 3, 0, "VISIBLE STRING", 128, "read-only");
                            //...

                            // 0x8nn1 – Device settings 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "DisplayDevice_Settings_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "DisplayDevice_Settings_Property_IDxActiveDisplayMode", PropertiesAddress, 1, 0, "UNSIGNED8", 1, "read-write");

                            // 0x8nn2 – Display modes 
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "DisplayDevice_Modes_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");


                            break;

                        case 20: 

                            /////////////////////////////////////////////////////////////////////
                            // EWF Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn1 – Volume Name
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "EWF_VolumeName_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn2 – Volume ID
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "EWF_VolumeID_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn3 – State
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(3, 10);
                            createProperty(iID, "EWF_State_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn4 – Type
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(4, 10);
                            createProperty(iID, "EWF_Type_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn5 – Boot command
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(5, 10);
                            createProperty(iID, "EWF_BootCommand_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");


                            // 0xBnn0 - EWF Commit and Disable Live*
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(0, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("VolumeName", "STRING"));
                            
                            createServiceTransfer(iID, "EWF_Function_CommitAndDisableLive", ServiceTransferAddress, 1, ServiceTransferParameters);

                            break;


                        case 21: 

                            /////////////////////////////////////////////////////////////////////
                            // FBWF Properties
                            ///////////////////////////////////////////////////////////////
                            
                            // 0x8nn1 – CurrentState
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "FBWF_CurrentState_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "FBWF_CurrentState_Property_State", PropertiesAddress, 1, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "FBWF_CurrentState_Property_Compression", PropertiesAddress, 2, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "FBWF_CurrentState_Property_PreAllocation", PropertiesAddress, 3, 0, "UNSIGNED32", 4, "read-only");

                            // 0x8nn2 – NextState
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "FBWF_NextState_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "FBWF_NextState_Property_State", PropertiesAddress, 1, 0, "UNSIGNED32", 4, "read-write");
                            createProperty(iID, "FBWF_NextState_Property_Compression", PropertiesAddress, 2, 0, "UNSIGNED32", 4, "read-write");
                            createProperty(iID, "FBWF_NextState_Property_PreAllocation", PropertiesAddress, 3, 0, "UNSIGNED32", 4, "read-write");

                            // 0x8nn3 – Volumes
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(3, 10);
                            createProperty(iID, "FBWF_Volumes_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn4 – Exclusions
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(4, 10);
                            createProperty(iID, "FBWF_Exclusions_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");


                            // 0xBnn0 - FBWF Add Volume Command object* 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(0, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));   
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));   
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cVolume", "STRING"));   // [len cbVolume]

                            createServiceTransfer(iID, "FBWF_Function_AddVolume", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn1 - FBWF Remove Volume Command object* 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(1, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));   
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));   
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("bClearExclusion", "BOOLEAN"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cVolume", "STRING"));   // [len cbVolume]

                            createServiceTransfer(iID, "FBWF_Function_RemoveVolume", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn2 - FBWF Add Exclusion Command object*  
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(2, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32")); 
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));  
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbFilePath", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cVolume", "STRING"));   // [len cbVolume]
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cFilePath", "STRING"));   // [len cbFilePath]

                            createServiceTransfer(iID, "FBWF_Function_AddExclusion", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn3 - FBWF Enum Exclusions Command object* 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(3, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Index", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cVolume", "STRING"));   // [len cbVolume]

                            createServiceTransfer(iID, "FBWF_Function_EnumExclusion", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn4 - FBWF Remove Exclusion Command object* 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(4, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbFilePath", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cVolume", "STRING"));   // [len cbVolume]
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cFilePath", "STRING"));    // [len cbFilePath]

                            createServiceTransfer(iID, "FBWF_Function_RemoveExclusion", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn5 - FBWF Commit File Command object* 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(5, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbFilePath", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cVolume", "STRING"));   // [len cbVolume]
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cFilePath", "STRING"));    // [len cbFilePath]

                            createServiceTransfer(iID, "FBWF_Function_CommitFile", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn6 - FBWF Commit All Command object* 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(6, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cVolume", "STRING"));   // [len cbVolume]
                            
                            createServiceTransfer(iID, "FBWF_Function_CommitAll", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn7 - FBWF RestoreFile Command object* 
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10) + parseInt(7, 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbFilePath", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cVolume", "STRING"));   // [len cbVolume]
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cFilePath", "STRING"));    // [len cbFilePath]

                            createServiceTransfer(iID, "FBWF_Function_RestoreFile", ServiceTransferAddress, 1, ServiceTransferParameters);

                            break;

                        case 22:    // not implemented
                            break;

                        case 23:

                            /////////////////////////////////////////////////////////////////////
                            // Silicon Drive Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn1 - Silicon Drive Information
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "SiliconDrive_Information_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "SiliconDrive_Information_Property_TotalEraseCounts", PropertiesAddress, 1, 0, "UNSIGNED64", 8, "read-only");      // UNSIGNED64 !!!
                            createProperty(iID, "SiliconDrive_Information_Property_DriveUsage", PropertiesAddress, 2, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "SiliconDrive_Information_Property_NumberOfSpares", PropertiesAddress, 3, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "SiliconDrive_Information_Property_SparesUsed", PropertiesAddress, 4, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "SiliconDrive_Information_Property_InternalUse1", PropertiesAddress, 5, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "SiliconDrive_Information_Property_InternalUse2", PropertiesAddress, 6, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "SiliconDrive_Information_Property_InternalUse3", PropertiesAddress, 7, 0, "UNSIGNED8", 1, "read-only");

                            break;

                        case 24:

                            /////////////////////////////////////////////////////////////////////
                            // OS Properties
                            ///////////////////////////////////////////////////////////////

                            // BaseAddress + 0
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(0, 10);
                            createProperty(iID, "OS_Header_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            // ...
                            createProperty(iID, "OS_Header_Property_OSName", PropertiesAddress, 3, 0, "VISIBLE STRING", 128, "read-only");
                            // ...

                            // BaseAddress + 1
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "OS_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "OS_Property_MajorVersion", PropertiesAddress, 1, 0, "UNSIGNED32", 4, "read-write");
                            createProperty(iID, "OS_Property_MinorVersion", PropertiesAddress, 2, 0, "UNSIGNED32", 4, "read-write");
                            createProperty(iID, "OS_Property_Build", PropertiesAddress, 3, 0, "UNSIGNED32", 4, "read-write");
                            createProperty(iID, "OS_Property_CSDVersion", PropertiesAddress, 4, 0, "VISIBLE STRING", 128, "read-write");

                            break;

                        case 25:

                            /////////////////////////////////////////////////////////////////////
                            // RAID Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn1 – Controller Info
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "RAID_Property_ControllerInfo_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "RAID_Property_ControllerInfo_State", PropertiesAddress, 1, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "RAID_Property_ControllerInfo_OfflineReason", PropertiesAddress, 2, 0, "UNSIGNED32", 4, "read-only");

                            // 0x8nn2 – RAID Sets Type
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "RAID_Property_SetsType_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn3 – RAID Sets State & Info
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(3, 10);
                            createProperty(iID, "RAID_Property_SetsStateInfo_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn4 – RAID Sets Drives
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(4, 10);
                            createProperty(iID, "RAID_Property_SetsDrives_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn5 – RAID Sets Drives
                            // Reserved

                            // 0x8nn9 – Drives Serial Number
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(9, 10);
                            createProperty(iID, "RAID_Property_DrivesSerialNumber_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nnA – Drives State
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(10, 10);
                            createProperty(iID, "RAID_Property_DrivesState_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            break;


                        case 26: // Cx9Flash
                            // internal module, do not use.
                            break;


                        case 27: 

                            /////////////////////////////////////////////////////////////////////
                            // FAN Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn0 - Fan Header
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(0, 10);
                            createProperty(iID, "Fan_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            // ...
                            createProperty(iID, "Fan_Property_AdapterName", PropertiesAddress, 3, 0, "VISIBLE STRING", 128, "read-only");
                            // ...

                            // 0x8nn1 - Fan Properties
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "Fan_Properties_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "Fan_Properties_Property_Speed", PropertiesAddress, 1, 0, "SIGNED16", 2, "read-only");

                            break;

                        case 28:

                            /////////////////////////////////////////////////////////////////////
                            // Mainboard Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn1 - Mainboard Information
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "Mainboard_Information_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "Mainboard_Information_Property_MainboardType", PropertiesAddress, 1, 0, "VISIBLE STRING", 128, "read-only");
                            createProperty(iID, "Mainboard_Information_Property_SerialNumber", PropertiesAddress, 2, 0, "VISIBLE STRING", 128, "read-only");
                            createProperty(iID, "Mainboard_Information_Property_ProductionDate", PropertiesAddress, 3, 0, "VISIBLE STRING", 128, "read-only");
                            createProperty(iID, "Mainboard_Information_Property_BootCount", PropertiesAddress, 4, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "Mainboard_Information_Property_OperatingTime", PropertiesAddress, 5, 0, "UNSIGNED32", 4, "read-only");        // in Minutes
                            createProperty(iID, "Mainboard_Information_Property_MinBoardTemperature", PropertiesAddress, 6, 0, "SIGNED32", 4, "read-only");    // °C
                            createProperty(iID, "Mainboard_Information_Property_MaxBoardTemperature", PropertiesAddress, 7, 0, "SIGNED32", 4, "read-only");    // °C
                            createProperty(iID, "Mainboard_Information_Property_MinInputVoltage", PropertiesAddress, 8, 0, "SIGNED32", 4, "read-only");        // mV
                            createProperty(iID, "Mainboard_Information_Property_MaxInputVoltage", PropertiesAddress, 9, 0, "SIGNED32", 4, "read-only");        // mV
                            createProperty(iID, "Mainboard_Information_Property_MainboardTemperature", PropertiesAddress, 10, 0, "SIGNED16", 2, "read-only");  // °C

                            // 0x8nn2 - Version Information
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "Mainboard_VersionInformation_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "Mainboard_VersionInformation_Property_MainboardRevision", PropertiesAddress, 1, 0, "UNSIGNED8", 1, "read-only");
                            createProperty(iID, "Mainboard_VersionInformation_Property_BiosMajorVersion", PropertiesAddress, 2, 0, "UNSIGNED8", 1, "read-only");
                            createProperty(iID, "Mainboard_VersionInformation_Property_BiosMinorVersion", PropertiesAddress, 3, 0, "UNSIGNED8", 1, "read-only");

                            // 0x8nn3 - Voltage Information Name
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(3, 10);
                            createProperty(iID, "Mainboard_VoltageInformationName_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn4 - Voltage Information Location
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(4, 10);
                            createProperty(iID, "Mainboard_VoltageInformationLocation_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn5 - Voltage Information Voltage     [mV]
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(5, 10);
                            createProperty(iID, "Mainboard_VoltageInformationVoltage_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn6 - Voltage Information NominalVoltage     [mV]
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(6, 10);
                            createProperty(iID, "Mainboard_VoltageInformationNominalVoltage_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            break;

                        case 29: 

                            /////////////////////////////////////////////////////////////////////
                            // Disk Management Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn1 - DriveLetter
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "DiskManagement_DriveLetter_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn2 - Volume Label
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "DiskManagement_VolumeLabel_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn3 - FileSystem
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(3, 10);
                            createProperty(iID, "DiskManagement_FileSystem_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn4 - Drive Type
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(4, 10);
                            createProperty(iID, "DiskManagement_DriveType_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn5 - Total size (Bytes)
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(5, 10);
                            createProperty(iID, "DiskManagement_TotalSize_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn6 - Free Bytes
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(6, 10);
                            createProperty(iID, "DiskManagement_FreeBytes_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            break;

                        case 30: 

                            /////////////////////////////////////////////////////////////////////
                            // UPS Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn1 - Mainboard Information
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(1, 10);
                            createProperty(iID, "UPS_Information_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "UPS_Information_Property_UPSModel", PropertiesAddress, 1, 0, "VISIBLE STRING", 128, "read-only");
                            createProperty(iID, "UPS_Information_Property_VendorName", PropertiesAddress, 2, 0, "VISIBLE STRING", 128, "read-only");
                            createProperty(iID, "UPS_Information_Property_Version", PropertiesAddress, 3, 0, "UNSIGNED8", 1, "read-only");
                            createProperty(iID, "UPS_Information_Property_Revision", PropertiesAddress, 4, 0, "UNSIGNED8", 1, "read-only");
                            createProperty(iID, "UPS_Information_Property_Build", PropertiesAddress, 5, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "UPS_Information_Property_SerialNumber", PropertiesAddress, 6, 0, "VISIBLE STRING", 128, "read-only");
                            createProperty(iID, "UPS_Information_Property_PowerStatus", PropertiesAddress, 7, 0, "UNSIGNED8", 1, "read-only");
                            createProperty(iID, "UPS_Information_Property_CommunicationStatus", PropertiesAddress, 8, 0, "UNSIGNED8", 1, "read-only");
                            createProperty(iID, "UPS_Information_Property_BatteryStatus", PropertiesAddress, 9, 0, "UNSIGNED8", 1, "read-only");
                            createProperty(iID, "UPS_Information_Property_BatteryCapacity", PropertiesAddress, 10, 0, "UNSIGNED8", 1, "read-only"); // [%]
                            createProperty(iID, "UPS_Information_Property_BatteryRuntime", PropertiesAddress, 11, 0, "UNSIGNED32", 4, "read-only"); // [sec]
                            createProperty(iID, "UPS_Information_Property_PersistentPowerFailCount", PropertiesAddress, 12, 0, "BOOLEAN", 1, "read-only");
                            createProperty(iID, "UPS_Information_Property_PowerFailCounter", PropertiesAddress, 13, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "UPS_Information_Property_FanError", PropertiesAddress, 14, 0, "BOOLEAN", 1, "read-only");
                            createProperty(iID, "UPS_Information_Property_NoBattery", PropertiesAddress, 15, 0, "BOOLEAN", 1, "read-only");
                            createProperty(iID, "UPS_Information_Property_TestCapacity", PropertiesAddress, 16, 0, "BOOLEAN", 1, "write-only");
                            createProperty(iID, "UPS_Information_Property_BatteryReplaceDate", PropertiesAddress, 17, 0, "VISIBLE STRING", 128, "read-only");
                            createProperty(iID, "UPS_Information_Property_IntervalServiceStatus", PropertiesAddress, 18, 0, "BOOLEAN", 1, "read-only");


                            // 0x8nn2 - UPS GPIO Pin Information
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10) + parseInt(2, 10);
                            createProperty(iID, "UPS_GPIOPinInformation_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "UPS_GPIOPinInformation_Property_Address", PropertiesAddress, 1, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "UPS_GPIOPinInformation_Property_Offset", PropertiesAddress, 2, 0, "UNSIGNED8", 1, "read-only");
                            createProperty(iID, "UPS_GPIOPinInformation_Property_Params", PropertiesAddress, 3, 0, "UNSIGNED8", 1, "read-only");

                            break;

                        case 31:

                            /////////////////////////////////////////////////////////////////////
                            // PhysicalDrive Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn0 - Drive Properties
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10);
                            createProperty(iID, "PhysicalDrive_Header_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "PhysicalDrive_Header_Property_Address", PropertiesAddress, 1, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "PhysicalDrive_Header_Property_Type", PropertiesAddress, 2, 0, "VISIBLE STRING", 128, "read-only");
                            createProperty(iID, "PhysicalDrive_Header_Property_Name", PropertiesAddress, 3, 0, "VISIBLE STRING", 128, "read-only");    // Serialnumber of harddisk
                            createProperty(iID, "PhysicalDrive_Header_Property_DevType", PropertiesAddress, 4, 0, "UNSIGNED32", 4, "read-only");

                            // 0x8nn1 - Drive Properties
                            PropertiesAddress++;
                            createProperty(iID, "PhysicalDrive_Properties_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "PhysicalDrive_Properties_Property_Index", PropertiesAddress, 1, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "PhysicalDrive_Properties_Property_Caption", PropertiesAddress, 2, 0, "VISIBLE STRING", 128, "read-only");
                            createProperty(iID, "PhysicalDrive_Properties_Property_LogicalPartitions", PropertiesAddress, 3, 0, "VISIBLE STRING", 128, "read-only");
                            createProperty(iID, "PhysicalDrive_Properties_Property_PartitionCount", PropertiesAddress, 4, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "PhysicalDrive_Properties_Property_TotalCylinders", PropertiesAddress, 5, 0, "UNSIGNED64", 8, "read-only");
                            createProperty(iID, "PhysicalDrive_Properties_Property_TotalHeads", PropertiesAddress, 6, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "PhysicalDrive_Properties_Property_TotalSectors", PropertiesAddress, 7, 0, "UNSIGNED64", 8, "read-only");
                            createProperty(iID, "PhysicalDrive_Properties_Property_TotalTracks", PropertiesAddress, 8, 0, "UNSIGNED64", 8, "read-only");

                            // 0x8nn2 - SMART Attribute Indices
                            PropertiesAddress++;
                            createProperty(iID, "SMART_Indices_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn3 - SMART Status Flags
                            PropertiesAddress++;
                            createProperty(iID, "SMART_StatusFlags_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn4 - SMART Current Values
                            PropertiesAddress++;
                            createProperty(iID, "SMART_CurrentValues_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn5 - SMART Worst Values
                            PropertiesAddress++;
                            createProperty(iID, "SMART_WorstValues_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn6 - SMART RawData
                            PropertiesAddress++;
                            createProperty(iID, "SMART_RawData_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn7 - SMART Threshold
                            PropertiesAddress++;
                            createProperty(iID, "SMART_Threshold_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            break;

                        case 32:

                            /////////////////////////////////////////////////////////////////////
                            // MassStorageMonitoring Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn0
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10);

                            // 0x8nn1 - Serialnumbers
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_Serialnumber_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn2 - Slot
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_Slot_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn3 - Drive Letter(s)
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_DriveLetters_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn4 - Drive Name
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_DriveName_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn5 - FlashDrive Types
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_DriveType_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn6 - EraseCountAverage
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_EraseCountAverage_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn7 - EraseCountSpecified
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_EraseCountSpecified_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn8 - EraseCyclesLeftPercent
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_EraseCyclesLeftPercent_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn9 - SpareBlocksRemaining
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_SpareBlocksRemaining_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nnA - SpareBlocksInitial
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_SpareBlocksInitial_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nnB - SpareBlocksLeftPercent
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_SpareBlocksLeftPercent_Property_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nnC - name
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_ReallocatedSectors", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nnD - name
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_SpinRetries", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nnE - name
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_PendingSectors", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nnF - name
                            PropertiesAddress++;
                            createProperty(iID, "MassStorageMonitoring_UltraDmaCrcErrors", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            break;


                        case 33:

                            /////////////////////////////////////////////////////////////////////
                            // UWF Properties
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn0
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10);

                            // 0x8nn1 - Current Status
                            PropertiesAddress++;
                            createProperty(iID, "UWF_Properties_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "UWF_Properties_CurrentState", PropertiesAddress, 1, 0, "BOOLEAN", 1, "read-only");
                            createProperty(iID, "UWF_Properties_CurrentOverlayMode", PropertiesAddress, 2, 0, "UNSIGNED32", 4, "read-only");
                            createProperty(iID, "UWF_Properties_CurrentOverlaySize_MB", PropertiesAddress, 3, 0, "UNSIGNED32", 4, "read-only");

                            // 0x8nn2 - Current Status
                            PropertiesAddress++;
                            createProperty(iID, "UWF_Properties_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "UWF_Properties_NextState", PropertiesAddress, 1, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "UWF_Properties_NextOverlayMode", PropertiesAddress, 2, 0, "UNSIGNED32", 4, "read-write");
                            createProperty(iID, "UWF_Properties_NextOverlaySize_MB", PropertiesAddress, 3, 0, "UNSIGNED32", 4, "read-write");

                            // 0x8nn3 - Volumes
                            PropertiesAddress++;
                            createProperty(iID, "UWF_Properties_Volumes", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn4 - Volume Protection Current States
                            PropertiesAddress++;
                            createProperty(iID, "UWF_Properties_VolumeProtectionCurrentStates", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn5 - Volume Protection Next States
                            PropertiesAddress++;
                            createProperty(iID, "UWF_Properties_VolumeProtectionNextStates", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");

                            // 0x8nn6 - File Exclusions
                            PropertiesAddress++;
                            createProperty(iID, "UWF_Properties_FileExclusions", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");


                            // 0xBnn0 - UWF Protect Volume
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Volume", "STRING"));

                            createServiceTransfer(iID, "UWF_Function_ProtectVolume", ServiceTransferAddress, 1, ServiceTransferParameters);

                            // 0xBnn1 - UWF Unprotect Volume
                            ServiceTransferAddress++;
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Volume", "STRING"));

                            createServiceTransfer(iID, "UWF_Function_UnprotectVolume", ServiceTransferAddress, 1, ServiceTransferParameters);

                            // 0xBnn2 - UWF Add Exclusion
                            ServiceTransferAddress++;
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbFilePath", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Volume", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("FilePath", "STRING"));
                            
                            createServiceTransfer(iID, "UWF_Function_AddExclusion", ServiceTransferAddress, 1, ServiceTransferParameters);
                            
                            // 0xBnn3 - UWF Enum Exclusions
                            ServiceTransferAddress++;
                            // not used

                            // 0xBnn4 - UWF Remove Exclusion
                            ServiceTransferAddress++;
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbVolume", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbFilePath", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("Volume", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("FilePath", "STRING"));

                            createServiceTransfer(iID, "UWF_Function_RemoveExclusion", ServiceTransferAddress, 1, ServiceTransferParameters);

                            break;

                        case 256:
                            
                            /////////////////////////////////////////////////////////////////////
                            // MISC
                            ///////////////////////////////////////////////////////////////

                            // 0x8nn0
                            var PropertiesAddress = parseInt(ModuleAddress[i], 10);

                            // 0x8nn1 - Drive Properties
                            PropertiesAddress++;
                            createProperty(iID, "Misc_Properties_Len", PropertiesAddress, 0, 0, "UNSIGNED16", 2, "read-only");
                            createProperty(iID, "Misc_Properties_StartupNumlockState", PropertiesAddress, 1, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "Misc_Properties_CERemoteDisplayState", PropertiesAddress, 2, 0, "BOOLEAN", 1, "read-only");
                            createProperty(iID, "Misc_Properties_CERemoteDisplayEnabled", PropertiesAddress, 3, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "Misc_Properties_SecurityWizardEnabled", PropertiesAddress, 4, 0, "BOOLEAN", 1, "read-write");
                            createProperty(iID, "Misc_Properties_AutoLogonUsername", PropertiesAddress, 5, 0, "VISIBLE STRING", 255, "read");
                            createProperty(iID, "Misc_Properties_GenerateCertificate", PropertiesAddress, 6, 0, "BOOLEAN", 1, "read-write");



                            // 0xBnn0 - Restore Factory Settings (Service Transfer Object) (verfügbar für Windows CE)
                            var ServiceTransferAddress = parseInt(ModuleServiceTransferAddress[i], 10);
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DummyByte", "UNSIGNED16"));

                            createServiceTransfer(iID, "MISC_Function_RestoreFactorySettings", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn1 - Reboot (Service Transfer Object) 
                            ServiceTransferAddress++;
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("DummyByte", "UNSIGNED8"));
                            
                            createServiceTransfer(iID, "MISC_Function_Reboot", ServiceTransferAddress, 1, ServiceTransferParameters);


                            // 0xBnn2 - Auto Logon (Service Transfer Object) 
                            ServiceTransferAddress++;
                            // Parameters
                            var ServiceTransferParameters = [];
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cbData", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cchUsername", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cchDomain", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("cchPassword", "UNSIGNED32"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("bAutoLogon", "BOOLEAN"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szUsername", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szDomain", "STRING"));
                            ServiceTransferParameters.push(new Defines.ServiceTransferParameter("szPassword", "STRING"));

                            createServiceTransfer(iID, "MISC_Function_AutoLogon", ServiceTransferAddress, 1, ServiceTransferParameters);

                            break;

                    }
                }
            }

            _construct();

        }

    });

    // Expose DEFINES instance to window object !!!
    window.CommunicationModule_moduleList = CommunicationModule_moduleList;

})(window);
            