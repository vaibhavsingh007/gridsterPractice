// Binds a grid click hook
var typeList = ["Visualization", "Data Source", "Banner", "Footer"];
var serializedGrid;
var mask, popup;

var ge = function (id) {
    return document.getElementById(id);
};

function bindGridClickHook() {
    $(".gridster ul li").each(function () {
        $(this).dblclick(function () {
            captureTypeBinding(this.id);
        });
    });

    // Assign global vars
    mask = $("#divMask");
    popup = $("#captureType");
}

function captureTypeBinding(id) {
    // Show mask
    mask.show();

    // Show popup
    popup.show();

    // Embed grid id to hdn
    $("#gridId").val(id);
}

function hookSaveGridHandler() {

    // Hook save button event
    $("#btnSaveType").on("click", function () {
        var capturedType = $("select").val();
        var gridId = $("#gridId").val();
        saveGridType(gridId, capturedType);
    });

    // Hook close window event
    $("#btnCloseType").on("click", function () {
        mask.hide();
        popup.hide();
    });
}

function saveGridType(id, type) {
    // Fetch grid and mark span text
    updatePTag(id, type);

    // Hide popup and mask
    $("#divMask").hide();
    $("#captureType").hide();
}

function updatePTag(widgetId, type) {
    // Check if p tag exists
    var p = $("#" + widgetId + " p");

    if (p.length == 0) {
        p = document.createElement('p');
        ge(widgetId).appendChild(p);
    }
    
    p.textContent = "I am a " + type + "!!";
}

function serializeGrid(oGridster) {
    serializedGrid = oGridster.serialize();
}

function deserializeGrid(oGridster) {
    $.each(serializedGrid, function () {
        oGridster.add_widget('<li id="' + this.id + '">' + this.htmlContent + '</li>',
                                        this.size_x, this.size_y, this.col, this.row);
    });

    // Bind grid hooks again
    bindGridClickHook();
    hookSaveGridHandler();
}

$(document).ready(function () {
    var oGridster;
    $(function () { //DOM Ready
        oGridster = $(".gridster ul").gridster({
            widget_margins: [10, 10],
            widget_base_dimensions: [140, 140],
            min_cols: 6,
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
    });

    // Bind button handlers
    $("#btnSerialize").on("click", function () {
        serializeGrid(oGridster);
    });
    $("#btnClearAll").on("click", function () {
        oGridster.remove_all_widgets();
    });
    $("#btnLoadAll").on("click", function () {
        deserializeGrid(oGridster)
    });

    // Call grid hook for Type
    bindGridClickHook();
    hookSaveGridHandler();
});