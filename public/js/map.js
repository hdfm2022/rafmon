map = {
    connect() {
        $("#map>div").remove();
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
            let extension = "png";
            if (item.type == "portal") {
                extension = "gif";
            }
            $("#map").append("<div data-type='"+item.type+"' class='floor' id='floor_" + itemId + "' style='margin-left: " + (((item.x - 1) * 40)) + "px; margin-top: " + (((item.y - 1) * 40)) + "px;" + "'><img src='img/floors/"+image+"."+extension+"' style='width:32px; height:32px; margin-top: 3px; margin-left: 3px;'></div>");
        }
    },
    item: {
        append(itemId, item) {
            let image = item.type;
            if (item.status) {
                image += "_"+item.status;
            }
            $("#map").append("<div data-type='"+item.type+"' class='item' id='item_" + itemId + "' style='margin-left: " + (((item.x - 1) * 40)) + "px; margin-top: " + (((item.y - 1) * 40)) + "px;" + "'><img src='img/items/"+image+".png' style='width:32px; height:32px; margin-top: 3px; margin-left: 3px;'></div>");
        },
        move(itemId, x, y) {
            $("#item_" + itemId).css("margin-left", (((x - 1) * 40)) + "px");
            $("#item_" + itemId).css("margin-top", (((y - 1) * 40)) + "px");
        },
        broked(itemId) {
            const type = $("#item_"+itemId).data("type");
            $("#item_"+itemId + " img").attr("src", "img/items/"+type+"_broked.png")
        },
        closed(itemId) {
            const type = $("#item_"+itemId).data("type");
            $("#item_"+itemId + " img").attr("src", "img/items/"+type+"_closed.png")
        }
    },
    char: {
        append(char) {
            const namediv = "<div class='nameup'>" + char.login + "</div>";
            const lifediv = "<div class='lifeup' id='life_up_1' style='border-right-width: 0px; background: rgb(255, 80, 20);'></div>";
            $("#map").append("<div class='char' id='char_" + char.sid + "' style='margin-left: " + (((char.x - 1) * 40)) + "px; margin-top: " + (((char.y - 1) * 40)) + "px;" + "'>" + namediv + lifediv + "<img class='img_char' src='img/gifs/slime_blue_128x128.gif' style='width:32px; height:32px; margin-top: 4px; margin-left: 3px;'></div>");
        },
        remove(sid) {
            $("#char_" + sid).remove();
        },
        move(sid, x, y) {
            $("#char_" + sid).css("margin-left", (((x - 1) * 40)) + "px");
            $("#char_" + sid).css("margin-top", (((y - 1) * 40)) + "px");
        }
    },
    kamehame: {
        start(data) {
            // $("#char_"+data.sid + " .img_char").attr("src", "img/gifs/slime_red_128x128.gif");
            $("#map #char_"+data.sid).append("<div data-size='12' class='kamehameha'>&nbsp;</div>");
            setTimeout( () => { map.kamehame.grown(data) }, 1000 );
        },
        grown(data) {
            const kamediv = $("#map #char_"+data.sid +" .kamehameha");
            if ($(kamediv).data("size")) {
                let actualsize = $(kamediv).data("size");
                actualsize += 2;
                console.log(actualsize, "size atual");
                $(kamediv).data("size", actualsize);

                $(kamediv).css("width", actualsize + "px");
                $(kamediv).css("height", actualsize + "px");
                $(kamediv).css("border-radius", actualsize + "px");

                $(kamediv).css("margin-top", (-18 - (actualsize/2)) + "px");
                $(kamediv).css("margin-left", (20 - (actualsize/2)) + "px");

                if (actualsize < 26) {
                    console.log("set new timeout");
                    setTimeout( () => { map.kamehame.grown(data) } , 1000 );
                }
            }
        },
        end(data) {
            // $("#char_"+data.sid + " .img_char").attr("src", "img/gifs/slime_blue_128x128.gif");
            // $("#map #char_"+data.sid + " .kamehameha").remove();
        }
    }
}