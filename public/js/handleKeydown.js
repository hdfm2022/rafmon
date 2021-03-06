function handleKeyup(event) {
    let keyPressed = event.key;

    if (keyPressed === "1" && myOwnChar.kamehameha === 1) {
        console.log("shoot kamehameha");
        myOwnChar.kamehameha = 2;
        socket.emit('shootKamehame', {});
    }
}

function handleKeydown(event) {
    // f1 - f12
    let useChatFirst = true;
    let keyPressed = event.key;
    if (event.keyCode >= 112 && event.keyCode <= 123) {
        event.preventDefault();
        useChatFirst = false;
    }

    if (event.target.id == "chat_text" && useChatFirst) {
        if (keyPressed == "Enter") {
            if ($('#chat_text').val()) {
                socket.emit('chat_msg', { message: $('#chat_text').val() });
                $('#chat_text').val("");
            }
        }
        //console.warn('unknow key', keyPressed);
        return false;
    }

    if (conectado) {
        keyPressed = checkAtalhoKeyPressed(keyPressed);

        myOwnChar.lastActivity = Date.now();

        if (keyPressed === "ArrowRight" || keyPressed === "ArrowLeft" || keyPressed === "ArrowUp" || keyPressed === "ArrowDown") {
            // console.log('movement', keyPressed);
            if (event.ctrlKey) {
                console.log("so virar de lado");

                
                const messageObject = {
                    key: keyPressed
                }
                socket.emit('dance', messageObject);

            } else {
                const messageObject = {
                    key: keyPressed
                }
                socket.emit('move', messageObject);
            }
        } else if (keyPressed === "1") {
            // if (myOwnChar.kamehameha === 0) {
                myOwnChar.kamehameha = 1;
                console.log("start kamehameha");
                socket.emit('startKamehame', {});
            // }
        } else if (keyPressed === "Escape") {
            if (myOwnChar.kamehameha === 1) {
                console.log("end kamehameha");
                myOwnChar.kamehameha = 0;
                socket.emit('endKamehame', {});
            }
            if (myOwnChar.kamehameha === 2) {
                console.log("stop kamehameha");
                myOwnChar.kamehameha = 0;
                socket.emit('stopKamehame', {});
            }
        } else if (keyPressed === "p" || keyPressed === "p") {
            console.log("adm_showPortal");
            socket.emit('adm_showPortal', {});
        } else {
            console.warn('unknow key', keyPressed);
        }
    }
    // console.warn('pressed key', event.keyCode, event.key);
}

function checkAtalhoKeyPressed(keyPressed) {
    switch (keyPressed) {
        case "a": return "ArrowLeft";
        case "d": return "ArrowRight";
        case "w": return "ArrowUp";
        case "s": return "ArrowDown";
    }
    return keyPressed;
}

document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);