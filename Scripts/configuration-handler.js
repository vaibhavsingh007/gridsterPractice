var pageVM;
var mask, popup;
var oGridster;

// PageVM json model
var jsonModel = {
    "currentWId": "",   // ID of the widget.
    "selectedVoId": "", // ID of the selected visualization object (VO) for the widget.
    "voTypes": [        // An array for all VO options available for the dash.
      {
      "voId": "VO1",
      "voName": "column-stacking"
  },
      {
          "voId": "VO3",
          "voName": "column"
      },
      {
          "voId": "TO1",
          "voName": "Table"
      }

   ],
    "widgetConfig": {       // Configuration object for the widget.
        "voConfig": {       // VO configuration object.
            "voname": "",
            "type": "",
            "title": "",
            "subtitle": "",
            "legendshow": "",
            "legendpos": "",
            "seriesincol": "",
            "tp_def": "",
            "tp_exception": "",
            "sortcat": "",
            "sortseries": "",
            "areaGroup": "",
            "defaultAreaId": "",
            "tpcolors": ""
        },
        "iusConfig": {          // VO-IUS configuration object.
            "voname": "",
            "grpname": "",
            "SEC": "",
            "SECGID": "",
            "SUBSEC": "",
            "SUBSECGID": "",
            "Ind": "",
            "Unit": "",
            "SubGrp": "",
            "IGID": "",
            "UGID": "",
            "SGID": "",
            "SerTitle": "",
            "Color": "",
            "Type": "",
            "Formatter": "",
            "tp": "",
            "tpException": "",
            "mapObject": "",
            "rankObject": "",
            "FTObject": "",
            "FTIndex": ""
        }
    }

};

// -- View Model construction using KO Mapping --
function bindPageVM() {
    oGridster = hookGridster();

    // Grab configuration window for future reference
    mask = $("#divMask");
    popup = $("#divConfiguration");

    // Construct view model from json
    pageVM = ko.mapping.fromJS(jsonModel);

    // Set VO selected VO type observable.
    // They are using voname for id and type for name
    pageVM.widgetConfig.voConfig.voname = ko.computed(function () {
        return pageVM.selectedVoId();
    });
    pageVM.widgetConfig.voConfig.type = ko.computed(function () {
        var voNameObj = pageVM.voTypes().filter(function (el) {
            return el.voId() == pageVM.selectedVoId();
        });
        return voNameObj.length >= 1 ? voNameObj[0].voName : '';
    });

    // Add event-handlers
    pageVM.widgetClickHandler = widgetClickHandler;
    pageVM.configSaveHandler = configSaveHandler;
    pageVM.dashboardSaveHandler = dashboardSaveHandler;
    pageVM.addWidgetHandler = addWidgetHandler;

    // Do the action
    ko.applyBindings(pageVM);
};

function hookGridster() {
    var oGridster = $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [140, 140],
        min_cols: 3,
        resize: {
            enabled: true
        },
        serialize_params: function ($w, wgd) {
            return {
                id: $($w).attr('id'),
                col: wgd.col,
                row: wgd.row,
                size_x: wgd.size_x,
                size_y: wgd.size_y,
                htmlContent: $($w).html()
            };
        }

    }).data('gridster');

    return oGridster;
}


// -- Event Handlers -----------------------------------------

function addWidgetHandler() {
    // Get widget html (with dynamic guid)
    var newWidgetId = guid();
    var widgetHtml = getNewWidgetHtml(newWidgetId);

    oGridster.add_widget(widgetHtml, 1, 1);

    // Update KO binding for widget click handler
    var newWidget = document.getElementById(newWidgetId);
    ko.applyBindingsToNode(newWidget, null, pageVM);
}

function widgetClickHandler(data, event) {
    var wId = event.target.id;

    // Update current wigdet id in action on the pageVM
    pageVM.currentWId(wId);

    // Update config model
    ko.mapping.fromJS(getWidgetConfigJsonByWidgetId(wId), pageVM);

    showConfigurationWindow();
};

function configSaveHandler() {
    // Get selected VO details


    widgetConfigMap[pageVM.currentWId()] = ko.mapping.toJS(pageVM.widgetConfig);

    hideConfigurationWindow();
}

function dashboardSaveHandler() {
    // Construct dash object required to be sent to the server.
    // Ex: Area, widgetId <=> objectId map, Gridster serialized grid, Config json array

    var widgetToObjectIds = {};
    var widgetConfigArray = [];

    Object.keys(widgetConfigMap).every(function (element, index, array) {
        var currentWidgetConfig = widgetConfigMap[element];

        // Assign current widget id to object id association. Currently selecting
        // ..voname. Should be a unique id for the VO.
        widgetToObjectIds[element] = currentWidgetConfig.voConfig.voname;

        widgetConfigArray.push(currentWidgetConfig);
        return true;
    });

    // Update the global finalized object
    finalizedDashboard.widgetToObjectIds = widgetToObjectIds;
    finalizedDashboard.gridsterSerializedGrid = oGridster.serialize();
    finalizedDashboard.configJson = widgetConfigArray;
}


// -- Helpers ------------------------------------------------

function showConfigurationWindow(wId) {
    // Show mask
    mask.show();

    // Show popup
    popup.show();
}

function hideConfigurationWindow() {
    mask.hide();
    popup.hide();
}

function getWidgetConfigJsonByWidgetId(wId) {

    var widgetConfigJson;

    // Check if entry in widget map
    if (widgetConfigMap.hasOwnProperty(wId)) {
        widgetConfigJson = widgetConfigMap[wId];
    }
    else {
        widgetConfigJson = new widgetConfig();
    }

    return {
        "widgetConfig": widgetConfigJson
    };
}

function getNewWidgetHtml(newWidgetId) {
    return '<li id="' + newWidgetId + '" data-bind="click: widgetClickHandler">' + newWidgetId + '</li>';
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


// -- Objects and models ----------------------------------------

var widgetConfigMap = {};   // Used to store per widget configuration.

var finalizedDashboard = {
    area: "",
    widgetToObjectIds: {},
    gridsterSerializedGrid: "",
    configJson: []
};  // Object to serialize the final dashboard configuration.

var baseVM = function () {
    this.currentWId = "";
    this.selectedVoId = "";
    this.voTypes = voTypes;
    this.widgetConfig = new widgetConfig();
};

var widgetConfig = function () {
    this.voConfig = new voConfig();
    this.iusConfig = new iusConfig();
};

var vo = function (id, name) {
    this.voId = id;
    this.voName = name;
}

var voTypes = [
    new vo("VO1", "column-stacking"),
    new vo("TO1", "Table"),
    new vo("VO4", "column")
];

var voConfig = function () {
    this.voname = "";
    this.type = "";
    this.title = "";
    this.subtitle = "";
    this.legendshow = "";
    this.legendpos = "";
    this.seriesincol = "";
    this.tp_def = "";
    this.tp_exception = "";
    this.sortcat = "";
    this.sortseries = "";
    this.areaGroup = "";
    this.defaultAreaId = "";
    this.tpcolors = "";
}

var iusConfig = function () {
    this.voname = "";
    this.grpname = "";
    this.SEC = "";
    this.SECGID = "";
    this.SUBSEC = "";
    this.SUBSECGID = "";
    this.Ind = "";
    this.Unit = "";
    this.SubGrp = "";
    this.IGID = "";
    this.UGID = "";
    this.SGID = "";
    this.SerTitle = "";
    this.Color = "";
    this.Type = "";
    this.Formatter = "";
    this.tp = "";
    this.tpException = "";
    this.mapObject = "";
    this.rankObject = "";
    this.FTObject = "";
    this.FTIndex = "";
}