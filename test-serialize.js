var gridData;
$(function () { //DOM Ready

    $(".gridster ul").gridster({
        widget_margins: [5, 5],
        widget_base_dimensions: [50, 50],
        serialize_params: function ($w, wgd) {
            return {
                id: wgd.el[0].id,
                col: wgd.col,
                row: wgd.row,
                htmlContent: $($w).html()
            };
        }
    });

    var gridster = $(".gridster ul").gridster().data('gridster');

    $('#gridsterDetails').bind('click', function () {
        gridData = gridster.serialize();
        var htmlString = '';
        $.each(gridData, function (index, value) {

            htmlString += '<li   data-row="' + value.row + '"  data-col="' + value.col + '"  data-sizex="1" data-sizey="1" >' + value.htmlContent +
                '</li>';
        });

        $("#reszableCopy").html(htmlString);

        
        return false;
    });



});