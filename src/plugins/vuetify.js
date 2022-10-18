// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import light from './themes/comet_light'

Vue.use(Vuetify)

const theme_opts = {
    theme: {
        dark: false,
        themes: {
            light
        },
    },
}

const opts = {}

export default new Vuetify(theme_opts)