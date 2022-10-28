import ReconnectingWebSocket from "reconnecting-websocket";

class WebsocketTools {
    constructor() {
        this.websocket = null;
    }

    async wsConnect(store) {
        return new Promise((resolve, reject) => {
            // Websocket connection
            let websocket = new ReconnectingWebSocket(WS_URL + 'ws');
            let pingIntervalId = null;
            let servicePingIntervalId = null;

            websocket.onopen = () => {
                console.log('Web Socket Connection Made');

                // --> Start pinging brain api
                pingIntervalId = setInterval(() => {
                    console.log("Pinging Server!");
                    websocket.send(JSON.stringify({'msg_type': 'ping'}));
                }, 30000);

                // --> Start pinging brain api
                servicePingIntervalId = setInterval(() => {
                    console.log("Pinging Services!");
                    websocket.send(JSON.stringify({'msg_type': 'ping_services'}));
                }, 300000);

                // --> Send initial service ping
                console.log('--> INITIAL PING')
                websocket.send(JSON.stringify({'msg_type': 'ping_services'}));

                // --> Resolve promise
                this.websocket = websocket;
                resolve();
            };

            websocket.onclose = (event) => {
                console.log("Websockets closed", event);
                clearInterval(pingIntervalId);
                clearInterval(servicePingIntervalId);
            };

            websocket.onmessage = (event) => store.dispatch("onWebsocketsMessage", event);
        });
    }

    async wsReconnect() {
        this.websocket.reconnect();
    }
}

export let wsTools = new WebsocketTools();
