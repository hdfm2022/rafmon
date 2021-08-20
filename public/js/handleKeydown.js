    function handleKeydown(event) {
        if (conectado) {
            const keyPressed = event.key;
            if (keyPressed === "ArrowRight" || keyPressed === "ArrowLeft" || keyPressed === "ArrowUp" || keyPressed === "ArrowDown") {
                console.log('movement', keyPressed);
                const messageObject = {
                    key: keyPressed,
                    mapId
                }
                socket.emit('move', messageObject);
            } else {
                console.warn('unknow key', keyPressed);
            }
        }
    }
    document.addEventListener('keydown', handleKeydown);