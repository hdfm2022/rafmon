map = {
    connect() {
        $("#login").hide();
        $("#map").show();
    },
    disconnect() {
        $("#login").show();
        $("#map").hide();
        $("#map>div").remove();
    },
    floor: {
        append(itemId, item) {
            let image = item.type;
            if (item.status) {
                image += "_"+item.status;
            }
            $("#map").append("<div data-type='"+item.type+"' class='floor' id='floor_" + itemId + "' style='margin-left: " + (((item.x - 1) * 40)) + "px; margin-top: " + (((item.y - 1) * 40)) + "px;" + "'><img src='img/items/"+image+".png' style='width:32px; height:32px; margin-top: 4px; margin-left: 4px;'></div>");
        },
    },
    item: {
        append(itemId, item) {
            let image = item.type;
            if (item.status) {
                image += "_"+item.status;
            }
            $("#map").append("<div data-type='"+item.type+"' class='item' id='item_" + itemId + "' style='margin-left: " + (((item.x - 1) * 40)) + "px; margin-top: " + (((item.y - 1) * 40)) + "px;" + "'><img src='img/items/"+image+".png' style='width:32px; height:32px; margin-top: 4px; margin-left: 4px;'></div>");
        },
        move(itemId, x, y) {
            $("#item_" + itemId).css("margin-left", (((x - 1) * 40)) + "px");
            $("#item_" + itemId).css("margin-top", (((y - 1) * 40)) + "px");
        },
        broked(itemId) {
            const type = $("#item_"+itemId).data("type");
            $("#item_"+itemId + " img").attr("src", "img/items/"+type+"_broked.png")
        }
    },
    char: {
        append(char) {
            const namediv = "<div class='nameup'>" + char.login + "</div>";
            const lifediv = "<div class='lifeup' id='life_up_1' style='border-right-width: 0px; background: rgb(255, 80, 20);'></div>";
            $("#map").append("<div class='char' id='char_" + char.sid + "' style='margin-left: " + (((char.x - 1) * 40)) + "px; margin-top: " + (((char.y - 1) * 40)) + "px;" + "'>" + namediv + lifediv + "<img src='img/gifs/slime_blue_128x128.gif' style='width:32px; height:32px; margin-top: 4px; margin-left: 4px;'></div>");
        },
        offline(sid) {
            $("#char_" + sid).hide();
        },
        move(sid, x, y) {
            $("#char_" + sid).css("margin-left", (((x - 1) * 40)) + "px");
            $("#char_" + sid).css("margin-top", (((y - 1) * 40)) + "px");
        }
    }
}