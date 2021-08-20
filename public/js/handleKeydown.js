    function handleKeyup(event) {
        let keyPressed = event.key;

       if (keyPressed === "z") {
            console.log("end kamehameha");
            myOwnChar.kamehameha = 0;
            socket.emit('endKamehame', {});
       }
    }
    
    function handleKeydown(event) {
        // f1 - f12
        if (event.keyCode >= 112 && event.keyCode <= 123) { 
            event.preventDefault();
        }
        if (conectado) {
            let keyPressed = event.key;

            keyPressed = checkAtalhoKeyPressed(keyPressed);

            if (keyPressed === "ArrowRight" || keyPressed === "ArrowLeft" || keyPressed === "ArrowUp" || keyPressed === "ArrowDown") {
                // console.log('movement', keyPressed);
                const messageObject = {
                    key: keyPressed
                }
                socket.emit('move', messageObject);
            } else if (keyPressed === "z") {
                if (myOwnChar.kamehameha == 0) {
                    myOwnChar.kamehameha = 1;
                    console.log("start kamehameha");
                    socket.emit('startKamehame', {});
                }
            } else {
                // console.warn('unknow key', keyPressed);
            }
        }
        // console.warn('pressed key', event.keyCode, event.key);
    }

    function checkAtalhoKeyPressed(keyPressed) {
        switch(keyPressed) {
            case "a": return "ArrowLeft";
            case "d": return "ArrowRight";
            case "w": return "ArrowUp";
            case "s": return "ArrowDown";
        }
        return keyPressed;
    }

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);