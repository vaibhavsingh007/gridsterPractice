// -- Objects and models --

var widgetConfigMap = {};   // Used to store

var finalizedDashboard = {
    area: "",
    widgetToObjectIds: {},
    gridsterSerializedGrid: "",
    configJson: []
};

var baseVM = function () {
    this.currentWidgetId
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
    new vo("VO2", "column-stacking"),
    new vo("VO3", "column"),
    new vo("TO1", "Table"),
    new vo("VO4", "column"),
    new vo("VO5", "column"),
    new vo("VO6", "column"),
    new vo("VO7", "column"),
    new vo("VO8", "column")
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