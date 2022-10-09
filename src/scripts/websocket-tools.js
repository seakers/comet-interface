import ReconnectingWebSocket from "reconnecting-websocket";
import store from '../store';


class WebsocketTools {
    constructor() {
        this.websocket = null;
        this.experimentWebsocket = null;
    }

    async wsConnect() {
        return new Promise((resolve, reject) => {
            // Websocket connection
            let websocket = new ReconnectingWebSocket(WS_URL + 'ws');
            let pingIntervalId = null;

            websocket.onopen = () => {
                console.log('Web Socket Connection Made');

                // Start ping routine
                pingIntervalId = setInterval(() => {
                    console.log("Ping sent!");
                    websocket.send(JSON.stringify({'msg_type': 'ping'}));
                }, 30000);

                // Resolve the promise
                this.websocket = websocket;
                resolve();
            };
            websocket.onclose = (event) => {
                console.log("Websockets closed", event);
                clearInterval(pingIntervalId);
            };
            websocket.onmessage = (event) => {
                let message = JSON.parse(event.data);
                console.log("MESSAGE", message);

                let interface_err = 'interface.err.log';
                let interface_out = 'interface.out.log';
                let brain_err = 'brain.err.log';
                let brain_out = 'brain.out.log';
                let vassar_err = 'vassar.err.log';
                let vassar_out = 'vassar.out.log';
                let datamining_err = 'datamining.err.log';
                let datamining_out = 'datamining.out.log';

                // PING
                if (message['type'] === 'ping') {
                    console.log("Ping!");
                }
                // INITIAL WRITE
                if (message['type'] === 'logfile.send') {
                    let contents = message['contents'];
                    let keys = Object.keys(contents);

                    if (interface_err in contents){
                        store.commit('set_interface_standard_error', contents[interface_err]);
                    }
                    if (interface_out in contents){
                        store.commit('set_interface_standard_output', contents[interface_out]);
                    }
                    if (brain_err in contents){
                        store.commit('set_brain_standard_error', contents[brain_err]);
                    }
                    if (brain_out in contents){
                        store.commit('set_brain_standard_output', contents[brain_out]);
                    }
                    if (vassar_err in contents){
                        store.commit('set_vassar_standard_error', contents[vassar_err]);
                    }
                    if (vassar_out in contents){
                        store.commit('set_vassar_standard_output', contents[vassar_out]);
                    }
                    if (datamining_err in contents){
                        store.commit('set_datamining_standard_error', contents[datamining_err]);
                    }
                    if (datamining_out in contents){
                        store.commit('set_datamining_standard_output', contents[datamining_out]);
                    }
                }
                // UPDATES
                if (message['type'] === 'logfile.update') {
                    let contents = message['contents'];
                    let keys = Object.keys(contents);

                    if (interface_err in contents){
                        store.commit('update_interface_standard_error', contents[interface_err]);
                    }
                    if (interface_out in contents){
                        store.commit('update_interface_standard_output', contents[interface_out]);
                    }
                    if (brain_err in contents){
                        store.commit('update_brain_standard_error', contents[brain_err]);
                    }
                    if (brain_out in contents){
                        store.commit('update_brain_standard_output', contents[brain_out]);
                    }
                    if (vassar_err in contents){
                        store.commit('update_vassar_standard_error', contents[vassar_err]);
                    }
                    if (vassar_out in contents){
                        store.commit('update_vassar_standard_output', contents[vassar_out]);
                    }
                    if (datamining_err in contents){
                        store.commit('update_datamining_standard_error', contents[datamining_err]);
                    }
                    if (datamining_out in contents){
                        store.commit('update_datamining_standard_output', contents[datamining_out]);
                    }
                }
            };
        });
    }

    async wsRefresh() {
        this.websocket.refresh();
    }
}

export let wsTools = new WebsocketTools();
