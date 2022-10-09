import Vue from 'vue';
import vuetify from './plugins/vuetify' // path to vuetify export
import App from './components/App';
import store from './store';
// import store from './store';
// import {wsTools} from "./scripts/websocket-tools";


// Styles
// import './styles/app.scss';
// import 'shepherd.js/dist/css/shepherd.css';

let app = new Vue({
    el: '#app',
    vuetify,
    store,
    render: h => h(App)
});
