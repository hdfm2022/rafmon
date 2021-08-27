map = {
    connect() {
        $("#map>div").remove();
        $("#login").hide();
        $("#map").show();
        $("#map_info").show();
        $("#chat").show();
        $("#itemsstatus").show();
        
    },
    disconnect() {
        $("#login").show();
        $("#map_info").hide();
        $("#chat").hide();
        $("#map").hide();
        $("#map>div").remove();
        $("#itemsstatus").hide();
    },
    floor: {
        append(itemId, item) {
            let image = item.type;
            if (item.status) {
                image += "_" + item.status;
            }
            let extension = "png";
            if (item.type == "portal") {
                extension = "gif";
            }
            $("#map").append("<div data-type='" + item.type + "' class='floor' id='floor_" + itemId + "' style='margin-left: " + (((item.x - 1) * 40)) + "px; margin-top: " + (((item.y - 1) * 40)) + "px;" + "'><img src='img/floors/" + image + "." + extension + "' style='width:32px; height:32px; margin-top: 3px; margin-left: 3px;'></div>");
        }
    },
    big: {
        append(itemId, item) {
            let image = item.type;
            if (image == "water" || image == "red_water") {
                $("#map").append("<div data-type='" + item.type + "' class='water item' id='item_" + itemId + "' style='overflow: hidden; margin-left: " + (((item.x1 - 1) * 40)) + "px; margin-top: " + (((item.y1 - 1) * 40)) + "px; width: " + (((item.x2 - item.x1 + 1) * 40)) + "px; height: " + (((item.y2 - item.y1 + 1) * 40)) + "px;'><div class='insidewater waterLefting' style='width: calc(100% + 96px); height: calc(100%);background-image: url(\"img/big/" + image + ".jpg\")'></div></div>");
           
            } else {
                $("#map").append("<div data-type='" + item.type + "' class='item' id='item_" + itemId + "' style='margin-left: " + (((item.x1 - 1) * 40)) + "px; margin-top: " + (((item.y1 - 1) * 40)) + "px; width: " + (((item.x2 - item.x1 + 1) * 40)) + "px; height: " + (((item.y2 - item.y1 + 1) * 40)) + "px; background-image: url(\"img/big/" + image + ".jpg\")'></div>");

            }
        },
    },
    item: {
        append(itemId, item) {
            let image = item.type;
            if (item.status) {
                image += "_" + item.status;
            }
            $("#map").append("<div data-type='" + item.type + "' class='item' id='item_" + itemId + "' style='margin-left: " + (((item.x - 1) * 40)) + "px; margin-top: " + (((item.y - 1) * 40)) + "px;" + "'><img src='img/items/" + image + ".png' style='width:32px; height:32px; margin-top: 3px; margin-left: 3px;'></div>");
        },
        move(itemId, x, y) {
            $("#item_" + itemId).css("margin-left", (((x - 1) * 40)) + "px");
            $("#item_" + itemId).css("margin-top", (((y - 1) * 40)) + "px");
        },
        broked(itemId) {
            const type = $("#item_" + itemId).data("type");
            $("#item_" + itemId + " img").attr("src", "img/items/" + type + "_broked.png")
        },
        vanished(itemId) {
            $("#item_" + itemId + "").css("opacity", 0);
        },
        closed(itemId) {
            const type = $("#item_" + itemId).data("type");
            $("#item_" + itemId + " img").attr("src", "img/items/" + type + "_closed.png")
        }
    },
    char: {
        append(char) {
            const namediv = "<div class='nameup'>" + char.login + "</div>";
            const lifediv = "<div class='lifeup' id='life_up_1' style='border-right-width: 0px; background: rgb(255, 80, 20);'></div>";
            // <img class='img_char' src='img/gifs/slime_blue_128x128.gif' style='width:32px; height:32px; margin-top: 4px; margin-left: 3px;'> < old
            $("#map").append("<div class='char right' id='char_" + char.sid + "' style='margin-left: " + (((char.x - 1) * 40)) + "px; margin-top: " + (((char.y - 1) * 40)) + "px;" + "'>" + namediv + lifediv + "<div class='charimg char8'></div></div>");
        },
        remove(sid) {
            $("#char_" + sid).remove();
        },
        move(data) { 
            // data.sid, data.x, data.y, data.key
            console.log("move", data);
            if(socket.id == data.sid) {
                $("#map_xy").html(`x${data.x} y${data.y}`)
                map.char.status.updateKi(data.ki);
            }
            $("#char_" + data.sid).removeClass("right");
            $("#char_" + data.sid).removeClass("down");
            $("#char_" + data.sid).removeClass("up");

            switch(data.key) {
                case 'ArrowRight': $("#char_" + data.sid).addClass("right"); break;
                case 'ArrowLeft': break;
                case 'ArrowDown': $("#char_" + data.sid).addClass("down"); break;
                case 'ArrowUp': $("#char_" + data.sid).addClass("up"); break;
            }
            $("#char_" + data.sid).css("margin-left", (((data.x - 1) * 40)) + "px");
            $("#char_" + data.sid).css("margin-top", (((data.y - 1) * 40)) + "px");
        },
        status: {
            updateKi(ki) {
                $("#ki_atual").html(ki);
                $("#ki_inside").css("width", Math.round((ki / $("#ki_max").data("value")) * 200) + "px");
            },
            updateKiMax(ki_max) {
                $("#ki_max").data("value", ki_max);
                $("#ki_max").html("/"+ki_max);
            }
        }
    },
    kamehame: {

        start(data) {
            // $("#char_"+data.sid + " .img_char").attr("src", "img/gifs/slime_red_128x128.gif");
            $("#map #kamehameha_" + data.sid).remove(); // just in case
            $("#map #char_" + data.sid).append("<div id='kamehameha_" + data.sid + "' data-size='12' data-shoot='0' class='kamehameha kamepiscando'>&nbsp;</div>");
            setTimeout(() => { map.kamehame.grown(data) }, 1000);
        },
        grown(data) {
            const kamediv = $("#map #kamehameha_" + data.sid);
            if ($(kamediv).data("size") && $(kamediv).data("shoot") == "0") {
                let actualsize = $(kamediv).data("size");
                actualsize += 2;
                console.log(actualsize, "size atual");
                $(kamediv).data("size", actualsize);

                $(kamediv).css("width", actualsize + "px");
                $(kamediv).css("height", actualsize + "px");
                $(kamediv).css("border-radius", actualsize + "px");

                $(kamediv).css("margin-top", (-18 - (actualsize / 2)) + "px");
                $(kamediv).css("margin-left", (20 - (actualsize / 2)) + "px");

                if (actualsize < 32) {
                    console.log("set new timeout");
                    setTimeout(() => { map.kamehame.grown(data) }, 1000);
                }
            }
        },
        stop(data) {
            console.log("STOPOU KAME!");
            //const kamediv = $("#map #char_"+data.sid +" .kamehameha");
            //$("#map #char_"+data.sid + " .kamehameha").css('margin-left', (26 + 10 + 40) + "px");
        },
        going(data) {
            const kamediv = $("#map #kamehameha_" + data.sid);
            // width, height depende...
            const actualsize = $(kamediv).data("size");
            let width = actualsize + 40 * (data.kamehame.x2 - data.kamehame.x1);
            let height = actualsize + 40 * (data.kamehame.y2 - data.kamehame.y1);
            const marginleft = (20 - (actualsize / 2)) + (40 * (data.kamehame.x1 - 1));
            const margintop = (-18 - (actualsize / 2)) + (40 * (data.kamehame.y1));

            if (data.sid == socket.id) {
                map.char.status.updateKi(data.ki);
            }

            if (data.kamehame.hasCollision) {
                width += 15;
            }

            $(kamediv).css('width', (width) + "px");
            $(kamediv).css('height', (height) + "px");
            $(kamediv).css('margin-left', (marginleft) + "px");
            $(kamediv).css('margin-top', (margintop) + "px");
        },
        shoot(data) {
            let kamediv = $("#map #kamehameha_" + data.sid);
            console.warn("teria que pegar do data, e não do css");
            const actualsize = $(kamediv).data("size");

            $(kamediv).remove();

            $("#map").append("<div id='kamehameha_" + data.sid + "' data-size='" + actualsize + "' data-shoot='1' class='kamehameha'>&nbsp;</div>");
            kamediv = $("#map #kamehameha_" + data.sid);

            const marginleft = (20 - (actualsize / 2)) + (40 * (data.kamehame.x1 - 1));
            const margintop = (-18 - (actualsize / 2)) + (40 * (data.kamehame.y1));

            $(kamediv).css("border-radius", actualsize + "px");
            $(kamediv).css('margin-top', (margintop) + "px");
            $(kamediv).css('margin-left', (marginleft) + "px");

            $(kamediv).css("height", actualsize + "px");
            $(kamediv).css('width', actualsize + "px");
        },
        finish(data) {
            const kamediv = $("#map #kamehameha_" + data.sid);
            $(kamediv).remove();
        },
        end(data) {
            const kamediv = $("#map #kamehameha_" + data.sid);
            // $("#char_"+data.sid + " .img_char").attr("src", "img/gifs/slime_blue_128x128.gif");
            $(kamediv).remove();
        }
    }
}