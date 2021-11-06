(function (window) {

    // namespace
    var ControlLib = new (function () {

        this.MainNavigationButton = function () {

            this.Create = function (MenueID, Title, ImagePath) {

                var MainNavigationButtonHtml = "";

                MainNavigationButtonHtml += '<div id="' + MenueID + '_MainButton" class ="MainNavigationTile">';
                //MainNavigationButtonHtml += '   <div id="' + MenueID + '_rangeborder_MainButton" class="MainNavigationTile_RangeBorder"></div>';
                MainNavigationButtonHtml += '   <div id="' + MenueID + '_body_MainButton" class="MainNavigationTile_Body_Unselected">';
                MainNavigationButtonHtml += '       <img alt="" src="' + ImagePath + '" align="right"></img>';
                MainNavigationButtonHtml += '       <div id="' + MenueID + '_text_MainButton" class= "MainNavigationTile_BodyText">' + Title + '</div>';
                MainNavigationButtonHtml += '   </div>';
                MainNavigationButtonHtml += '</div>';

                return MainNavigationButtonHtml;
            }
        }

        this.SubNavigationButton = function () {

            this.Create = function (MenueID, Title, ImagePath) {

                var SubNavigationButtonHtml = "";

                SubNavigationButtonHtml += '<div id="' + MenueID + '_SubButton" class ="SubNavigationTile">';
                //SubNavigationButtonHtml += '    <div id="' + MenueID + '_rangeborder_SubButton" class="SubNavigationTile_RangeBorder"></div>';
                SubNavigationButtonHtml += '    <div id="' + MenueID + '_body_SubButton" class="SubNavigationTile_Body_Unselected">';
                SubNavigationButtonHtml += '       <div id="' + MenueID + '_icon_SubButton" class="SubNavigationTile_Icon" style="background-image:url(' + ImagePath + ')"></div>';
                SubNavigationButtonHtml += '       <div id="' + MenueID + '_text_SubButton" class="SubNavigationTile_BodyText">' + Title + '</div>';
                SubNavigationButtonHtml += '    </div>';
                SubNavigationButtonHtml += '</div>';

                return SubNavigationButtonHtml;
            }
        }

        this.Bargraph = function () {

            /*
            var getBarstyleByValue = function (Value, BarIndex, BarMaxIndex) {

                var BarCount = Math.floor(Value / 100 * BarMaxIndex);   // amount of bars that will have a color

                if (BarIndex < BarCount) {
                    if (Value > 90) {
                        return 'style="background-color:Red"';
                    }
                    else if (Value > 80) {
                        return 'style="background-color:Yellow"';
                    }
                    else {
                        return 'style="background-color:Lime"';
                    }
                }
                else {
                    return "";
                }
            }
            this.Create = function (ImagePath, Title, Value, Unity) {

                var BarGraphHtml = "";
                var BarMaxIndex = 30;

                BarGraphHtml += '<div id="" class="Bargraph_Body">';
                BarGraphHtml += '   <div id="" class="Bargraph_Body_Info_Container">';
                BarGraphHtml += '       <div id="" class="Bargraph_Body_Info_Image" style="background-image:url(' + ImagePath + ')"></div>';
                BarGraphHtml += '       <div id="" class="Bargraph_Body_Info_Title">' + Title + '</div>';
                BarGraphHtml += '       <div id="" class="Bargraph_Body_Info_Value">' + Value + Unity + '</div>';
                BarGraphHtml += '   </div>';
                BarGraphHtml += '   <div id="" class="Bargraph_Body_Bar_Container">';

                for (var i = 0; i < BarMaxIndex; i++) {
                    BarGraphHtml += '       <div id="" class="Bargraph_Body_Bar_Item" ' + getBarstyleByValue(Value, i, BarMaxIndex) + '></div>';
                }

                BarGraphHtml += '   </div>';
                BarGraphHtml += '   <div id="" class="Bargraph_Body_Range_Container">';
                BarGraphHtml += '       <div id="" class="Bargraph_Body_Range_Item_Green"></div>';
                BarGraphHtml += '       <div id="" class="Bargraph_Body_Range_Item_Yellow"></div>';
                BarGraphHtml += '       <div id="" class="Bargraph_Body_Range_Item_Red"></div>';
                BarGraphHtml += '       </div>';
                BarGraphHtml += '   <div id="" class="Bargraph_Body_RangeText_Container">';
                BarGraphHtml += '       <div id="" class="Bargraph_Body_RangeText_Item_Green_Zero">0</div>';
                BarGraphHtml += '       <div id="" class="Bargraph_Body_RangeText_Item_Green">80</div>';
                BarGraphHtml += '       <div id="" class="Bargraph_Body_RangeText_Item_Yellow">90</div>';
                BarGraphHtml += '       <div id="" class="Bargraph_Body_RangeText_Item_Red">100</div>';
                BarGraphHtml += '   </div>';
                BarGraphHtml += '</div>';

                return BarGraphHtml;
            }

            var getTinyBarstyleByValue = function (Value, BarIndex) {

                var BarCount = 0;

                if (Value <= 80) {
                    BarCount = 0.075 * Value;
                }
                else if (Value > 80 && Value <= 100) {
                    BarCount = 0.2 * Value - 10;
                }

                BarCount = Math.floor(BarCount);   // amount of bars that will have a color

                if (BarIndex < BarCount) {
                    if (Value > 90) {
                        return 'style="background-color:Red"';
                    }
                    else if (Value > 80) {
                        return 'style="background-color:Yellow"';
                    }
                    else {
                        return 'style="background-color:Lime"';
                    }
                }
                else {
                    return "";
                }
            }
            this.CreateTiny = function (ImagePath, Title, Value, Unity) {

                var BarGraphHtml = "";
                var BarMaxIndex = 10;

                BarGraphHtml += '<div id="" class="BargraphTiny_Body">';
                BarGraphHtml += '    <div id="" class="BargraphTiny_Body_Image">';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_Image" style="background-image:url(' + ImagePath + ')"></div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '    <div id="" class="BargraphTiny_Body_Progress_Container">';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_Bar_Container">';
                
                for (var i = 0; i < BarMaxIndex; i++) {
                    BarGraphHtml += '       <div id="" class="BargraphTiny_Body_Bar_Item" ' + getTinyBarstyleByValue(Value, i) + '></div>';
                }

                BarGraphHtml += '        </div>';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_Range_Container">';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_Range_Item_Green"></div>';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_Range_Item_Yellow"></div>';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_Range_Item_Red"></div>';
                BarGraphHtml += '         </div>';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_RangeText_Container">';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_RangeText_Item_Green_Zero">0</div>';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_RangeText_Item_Green">80</div>';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_RangeText_Item_Yellow">90</div>';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_RangeText_Item_Red">100</div>';
                BarGraphHtml += '        </div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '    <div id="" class="BargraphTiny_Body_Value_Container">';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_Value">' + Value + Unity + '</div>';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_Title">' + Title + '</div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '</div>';


                return BarGraphHtml;
            }
            
            var getTinyDynamicBarstyleByValue = function (Min, GreenMax, YellowMax, Max, Value, BarIndex) {

                // 10 bars
                // 6 green
                // 2 yellow
                // 2 red

                var BarCount = 0;

                if (Value >= Min && Value <= GreenMax) {

                    BarCount = (6 / (GreenMax - Min)) * Value;      // m*x
                    BarCount += 0 - (6 / (GreenMax - Min)) * Min;   // + b
                }
                else if (Value > GreenMax && Value <= YellowMax) {
                    
                    BarCount = (2 / (YellowMax - GreenMax)) * Value;    // m*x
                    BarCount += 6 - (2 / (YellowMax - GreenMax)) * GreenMax;  // + b
                }
                else if (Value > YellowMax && Value <= Max) {

                    BarCount = (2 / (Max - YellowMax)) * Value;    // m*x
                    BarCount += 8 - (2 / (Max - YellowMax)) * YellowMax;  // + b
                }

                BarCount = Math.floor(BarCount);   // amount of bars that will have a color

                if (BarIndex < BarCount) {
                    if (Value > YellowMax) {
                        return 'style="background-color:Red"';
                    }
                    else if (Value > GreenMax) {
                        return 'style="background-color:Yellow"';
                    }
                    else {
                        return 'style="background-color:Lime"';
                    }
                }
                else {
                    return "";
                }
            }
            this.CreateTinyDynamic = function (ImagePath, Title, Unity, Min, GreenMax, YellowMax, Max, Value) {

                var BarGraphHtml = "";
                
                BarGraphHtml += '<div id="" class="BargraphTiny_Body">';
                BarGraphHtml += '    <div id="" class="BargraphTiny_Body_Image">';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_Image" style="background-image:url(' + ImagePath + ')"></div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '    <div id="" class="BargraphTiny_Body_Progress_Container">';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_Bar_Container">';

                var BarMaxIndex = 10; //const
                for (var i = 0; i < BarMaxIndex; i++) {
                    BarGraphHtml += '       <div id="" class="BargraphTiny_Body_Bar_Item" ' + getTinyDynamicBarstyleByValue(Min, GreenMax, YellowMax, Max, Value, i) + '></div>';
                }

                BarGraphHtml += '        </div>';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_Range_Container">';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_Range_Item_Green"></div>';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_Range_Item_Yellow"></div>';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_Range_Item_Red"></div>';
                BarGraphHtml += '         </div>';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_RangeText_Container">';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_RangeText_Item_Green_Zero">' + Min +  '</div>';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_RangeText_Item_Green">' + GreenMax + '</div>';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_RangeText_Item_Yellow">' + YellowMax + '</div>';
                BarGraphHtml += '            <div id="" class="BargraphTiny_Body_RangeText_Item_Red">' + Max + '</div>';
                BarGraphHtml += '        </div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '    <div id="" class="BargraphTiny_Body_Value_Container">';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_Value">' + Value + Unity + '</div>';
                BarGraphHtml += '        <div id="" class="BargraphTiny_Body_Title">' + Title + '</div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '</div>';


                return BarGraphHtml;
            }
            */

            // Progressbar View - Bars have only one color
            var getTinyDefaultBarstyleByValue = function (Max, Value, BarMaxIndex) {

                // calc amount of bars that will have a color 
                var ColoredBarsCount = Math.floor(Value / Max * BarMaxIndex);   

                // if rounded amount is 0 but the value is bigger than 0 display 1 colored bar
                if (ColoredBarsCount == 0 && Value > 0) { ColoredBarsCount = 1; }

                return ColoredBarsCount;
            }

            this.CreateDefaultBar = function (ImagePath, Title, Unity, Max, Value) {

                var BarGraphHtml = "";

                BarGraphHtml += '<div id="" class="BargraphTinyDefault_Body">';
                BarGraphHtml += '    <div id="" class="BargraphTinyDefault_ImageContainer">';
                BarGraphHtml += '       <div id="" class="BargraphTinyDefault_Body_Image" style="background-image:url(' + ImagePath + ')"></div>';
                BarGraphHtml += '       <div id="" class="BargraphTinyDefault_Body_Title">' + Title + '</div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '    <div id="" class="BargraphTinyDefault_Body_Progress_Container">';
                BarGraphHtml += '        <div id="" class="BargraphTinyDefault_Body_Bar_Container">';

                var BarMaxIndex = 10; //const
                var BarIndex = getTinyDefaultBarstyleByValue(Max, Value, BarMaxIndex);

                for (var i = 0; i < BarMaxIndex; i++) {

                    BarGraphHtml += '       <div id="" class="BargraphTinyDefault_Body_Bar_Item" ';

                    if (i < BarIndex) {
                        BarGraphHtml += 'style="background-color:Lime"';
                    }

                    BarGraphHtml += '></div>';
                }

                BarGraphHtml += '        </div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '    <div id="" class="BargraphTinyDefault_Body_Value_Container">';
                
                if (Value.length > 4) {
                    BarGraphHtml += '        <div id="" class="BargraphTinyDefault_Body_Value_Small">' + Value.toString() + Unity + '</div>';
                }
                else {
                    
                    BarGraphHtml += '        <div id="" class="BargraphTinyDefault_Body_Value">' + Value.toString() + Unity + '</div>';
                }
                BarGraphHtml += '        <div id="" class="BargraphTinyDefault_Body_Max">Max: ' + Max.toString() + Unity + '</div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '</div>';

                return BarGraphHtml;
            }
            this.CreateDefaultBar_NoMaxDisplay = function (ImagePath, Title, Unity, Max, Value) {

                var BarGraphHtml = "";

                BarGraphHtml += '<div id="" class="BargraphTinyDefault_Body">';
                BarGraphHtml += '    <div id="" class="BargraphTinyDefault_ImageContainer">';
                BarGraphHtml += '       <div id="" class="BargraphTinyDefault_Body_Image" style="background-image:url(' + ImagePath + ')"></div>';
                BarGraphHtml += '       <div id="" class="BargraphTinyDefault_Body_Title">' + Title + '</div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '    <div id="" class="BargraphTinyDefault_Body_Progress_Container">';
                BarGraphHtml += '        <div id="" class="BargraphTinyDefault_Body_Bar_Container">';

                var BarMaxIndex = 10; //const
                var BarIndex = getTinyDefaultBarstyleByValue(Max, Value, BarMaxIndex);

                for (var i = 0; i < BarMaxIndex; i++) {

                    BarGraphHtml += '       <div id="" class="BargraphTinyDefault_Body_Bar_Item" ';

                    if (i < BarIndex) {
                        BarGraphHtml += 'style="background-color:Lime"';
                    }

                    BarGraphHtml += '></div>';
                }

                BarGraphHtml += '        </div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '    <div id="" class="BargraphTinyDefault_Body_Value_Container">';

                if (Value.length > 4) {
                    BarGraphHtml += '        <div id="" class="BargraphTinyDefault_Body_Value_Small">' + Value.toString() + Unity + '</div>';
                }
                else {

                    BarGraphHtml += '        <div id="" class="BargraphTinyDefault_Body_Value">' + Value.toString() + Unity + '</div>';
                }
                //BarGraphHtml += '        <div id="" class="BargraphTinyDefault_Body_Max">Max: ' + Max.toString() + Unity + '</div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '</div>';

                return BarGraphHtml;
            }
            this.CreateMemoryBar = function (ImagePath, Title, TotalRAM /*in byte*/, UsedRAM /*in byte*/) {
                // uses getTinyDefaultBarstyleByValue, too

                var BarGraphHtml = "";

                BarGraphHtml += '<div id="" class="BargraphTinyDefault_Body">';
                BarGraphHtml += '    <div id="" class="BargraphTinyDefault_ImageContainer">';
                BarGraphHtml += '       <div id="" class="BargraphTinyDefault_Body_Image" style="background-image:url(' + ImagePath + ')"></div>';
                BarGraphHtml += '       <div id="" class="BargraphTinyDefault_Body_Title">' + Title + '</div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '    <div id="" class="BargraphTinyDefault_Body_Progress_Container">';
                BarGraphHtml += '        <div id="" class="BargraphTinyDefault_Body_Bar_Container">';

                var BarMaxIndex = 10; //const
                var BarIndex = getTinyDefaultBarstyleByValue(TotalRAM, UsedRAM, BarMaxIndex);

                for (var i = 0; i < BarMaxIndex; i++) {

                    BarGraphHtml += '       <div id="" class="BargraphTinyDefault_Body_Bar_Item" ';

                    if (i < BarIndex) {
                        BarGraphHtml += 'style="background-color:Lime"';
                    }

                    BarGraphHtml += '></div>';
                }

                BarGraphHtml += '        </div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '    <div id="" class="BargraphTinyDefault_Body_Value_Container">';
                BarGraphHtml += '        <div id="" class="BargraphTinyDefault_Body_Value">' + getBestMemoryUnity(UsedRAM, 1) + '</div>';
                BarGraphHtml += '        <div id="" class="BargraphTinyDefault_Body_Max">Max: ' + getBestMemoryUnity(TotalRAM, 1) + '</div>';
                BarGraphHtml += '    </div>';
                BarGraphHtml += '</div>';

                return BarGraphHtml;
            }

            var getBestMemoryUnity = function (Memory /*in byte*/, digits) {

                var n = 0;
                var displayableMemory = 0;
                var unity = "";

                if (Memory > 0) {
                    n = Math.floor(Math.log(Memory) / Math.log(1024));
                    displayableMemory = (Memory / Math.pow(1024, n)).toFixed(digits);
                }

                var unities = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
                if (n >= 0 && n < unities.length) {
                    unity = unities[n];
                }

                return displayableMemory + unity;
            }
        }

        this.Button = function () {

            this.Create = function (ButtonID, Text) {

                var ButtonHtml = "";

                ButtonHtml += '<button id="' + ButtonID + '">' + Text + '</button>';

                return ButtonHtml;
            }
        }

        this.SmallButton = function () {

            this.Create = function (ButtonID, Type, PopupText) {

                var mPopupText = "";
                var src = "res/modules/action/";

                switch (Type) {
                    case "save":
                        src += "Save.png";
                        mPopupText = "Save";
                        break;
                    case "delete":
                        src += "Delete.png";
                        mPopupText = "Discard Changes"
                        break;
                    case "configure":
                        src += "Configure.png";
                        mPopupText = "Configure";
                        break;
                    case "refresh":
                        src += "Refresh.png";
                        mPopupText = "Refresh";
                        break;
                    case "power":
                        src += "Power.png";
                        mPopupText = "On/Off";
                        break;

                    default:
                        src = "";
                        mPopupText = "";
                        break;
                }

                // if parameter PopupText is set, overwrite default text
                if (PopupText != undefined) {
                    mPopupText = PopupText;
                }

                var SmallButtonHtml = '<img id="' + ButtonID + '" src="' + src + '" title="' + mPopupText + '" style="margin:0px 0px 0px 10px"></img>';
                
                return SmallButtonHtml;
            }
        }

        this.Combobox = function () {

            this.Create = function (ComboboxID, Items, optWidth) {
                
                var width = "155px";

                if (optWidth != undefined) {
                    width = optWidth;
                }
                
                var ComboboxHtml = '<select id="' + ComboboxID + '" style="width:' + width + '"/>';

                for (var i = 0; i < Items.length; i++) {
                    ComboboxHtml += '<option value="' + i + '">' + Items[i] + '</option>';
                }

                ComboboxHtml += "</select>";

                return ComboboxHtml;
            }

            this.CreateMap = function (ComboboxID, Items, Values, optWidth) {

                var width = "155px";

                if (optWidth != undefined) {
                    width = optWidth;
                }
                
                var ComboboxHtml = '<select id="' + ComboboxID + '" style="width:' + width + '"/>';

                for (var i = 0; i < Items.length; i++) {
                    ComboboxHtml += '<option value="' + Values[i] + '">' + Items[i] + '</option>';
                }

                ComboboxHtml += "</select>";

                return ComboboxHtml;
            }
        }

        this.Textbox = function () {

            this.Create = function (TextboxID, optWidth) {

                var width = "150px";

                if (optWidth != undefined) {
                    width = optWidth;
                }
                
                var TextboxHtml = "";
                TextboxHtml += '<input type="text" id="' + TextboxID + '" style="width:' + width + '"/>';

                return TextboxHtml;
            }

            this.CreatePassword = function (TextboxID, optWidth) {

                var width = "150px";

                if (optWidth != undefined) {
                    width = optWidth;
                }

                var TextboxHtml = "";
                TextboxHtml += '<input type="password" id="' + TextboxID + '" style="width:' + width + '"/>';

                return TextboxHtml;
            }
        }

        this.SMBFolder = function () {

            this.Create = function (ID, Text, Link, ImagePath16x16) {
                
                var SMBFolderHtml = "";

                SMBFolderHtml += '<div>';
                SMBFolderHtml += '  <img src="' + ImagePath16x16 + '"/>';
                SMBFolderHtml += '  <a id="' + ID + '"href="' + Link + '">' + Text + '</a>';
                SMBFolderHtml += '</div>';

                return SMBFolderHtml;
            }
        }

        this.Radiobutton = function () {

            this.Create = function (RadiobuttonGroup, Value, Text, Checked) {

                if (Checked == undefined) {
                    Checked = false;
                }

                var Radiobutton = "";
                Radiobutton = '<input type="radio" id="' + RadiobuttonGroup + '_' + Text + '" name="' + RadiobuttonGroup + '" value="' + Value + '"' + (Checked ? ' checked="checked" ' : '') + '>' + Text + '</input>';
                
                return Radiobutton;
            }
        }

        this.Checkbox = function () {

            this.Create = function (ID, Value, Text, Checked) {

                if (Checked == undefined) {
                    Checked = false;
                }

                var Checkbox = "";
                Checkbox = '<input type="checkbox" id="' + ID + '" value="' + Value + '"' + (Checked ? ' checked="checked" ' : '') + '>' + Text + '</input>';
                
                return Checkbox;
            }
        }

        this.BustermBox = function () {

            this.Create = function (BustermboxID) {

                var BustermboxHtml = "";

                BustermboxHtml += '<div id="' + BustermboxID + '"></div>';

                return BustermboxHtml;
            }
        }

        this.BustermButton = function () {

            this.Create = function (BustermID, Title, ImagePath) {

                var BustermButtonHtml = "";

                BustermButtonHtml += '<div id="' + BustermID + '_BustermButton" class ="BusTermTile">';
                //BustermButtonHtml += '    <div id="' + MenueID + '_rangeborder_BustermButton" class="BusTermTile_RangeBorder"></div>';
                BustermButtonHtml += '    <div id="' + BustermID + '_body_SubButton" class="BusTermTile_Body_Unselected">';
                BustermButtonHtml += '       <div id="' + BustermID + '_icon_SubButton" class="BusTermTile_Icon" style="background-image:url(' + ImagePath + ')"></div>';
                BustermButtonHtml += '       <div id="' + BustermID + '_text_SubButton" class="BusTermTile_BodyText">' + Title + '</div>';
                BustermButtonHtml += '    </div>';
                BustermButtonHtml += '</div>';

                return BustermButtonHtml;
            }
        }

    });

    // Expose Control_Bargraph instance to window object !!!
    window.ControlLib = ControlLib;

})(window);