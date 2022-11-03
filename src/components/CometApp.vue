<template>
    <v-app dark>

        <!-- LOGIN OVERLAY -->
        <v-overlay v-model="login_overlay" opacity="0.8" z-index="1000">
            <login-modal></login-modal>
        </v-overlay>

        <!-- REGISTER OVERLAY -->
        <v-overlay v-model="register_overlay" opacity="0.8" z-index="1000">
            <register-modal></register-modal>
        </v-overlay>

        <!-- NAVIGATION -->
        <v-navigation-drawer v-model="drawer" app color="primary">

            <!-- MENU HEADER -->
            <v-list-item class="white--text">
                <v-img :src="lockheed_icon" max-width="225" style="margin-top: 5px; margin-bottom: 5px;"></v-img>
            </v-list-item>

            <hr style="color: #FFFFFF; margin-left: 8px; margin-right: 8px;">

            <!-- APPS -->
            <v-list dense nav>
                <v-subheader style="color: white !important; font-size: large;">Tools</v-subheader>
                <v-list-item style="margin-bottom: 10px;" v-for="item in nav_bar_apps" :key="item.name" link v-bind:class="{ 'bg-active': item.active }" v-on:click="toggle_app(item.name)">
                    <v-list-item-icon>
                        <v-icon color="white">{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="white--text">
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <hr style="color: #FFFFFF; margin-left: 8px; margin-right: 8px;">

            <!-- PROBLEM PICKER -->
            <problem-picker></problem-picker>

            <hr style="color: #FFFFFF; margin-left: 8px; margin-right: 8px;">

            <!-- SERVICE MENU -->
            <service-menu></service-menu>

            <hr style="color: #FFFFFF; margin-left: 8px; margin-right: 8px;">


        </v-navigation-drawer>

        <!-- CHAT BOX -->
        <v-navigation-drawer v-model="chatbox"
                             app
                             right
                             color="primary lighten-1"
                             width="400"
        >
            <chatbox></chatbox>
        </v-navigation-drawer>

        <!-- APP BAR -->
        <v-app-bar app class="primary darken-1 white--text">
            <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>
            <v-toolbar-title>Comet App</v-toolbar-title>
            <v-spacer></v-spacer>
<!--            <v-img :src="lockheed_icon" max-width="170" style="margin-right: 10px;"></v-img>-->
            <v-btn @click="chatbox = !chatbox" icon style="margin-right: 10px;">
                <v-badge
                    :content="new_messages"
                    :value="new_messages"
                    color="green"
                    overlap
                >
                    <v-icon color="white" v-if="chatbox === false">mdi-chevron-left</v-icon>
                    <v-icon color="white" v-if="chatbox === true">mdi-chevron-right</v-icon>
                    <v-icon color="white">mdi-message</v-icon>
                </v-badge>
            </v-btn>
        </v-app-bar>

        <!-- VUE ROUTER CONTENT -->
        <v-main class="secondary darken-2">
            <transition name="fade">
                <v-expand-transition mode="in-out">
                    <router-view :key="this.$route.path"></router-view>
                </v-expand-transition>
            </transition>
        </v-main>

    </v-app>
</template>

<script>
    import {mapState} from "vuex";
    import {get_icon} from "../store/images/utils";
    import {fetchPost} from "../scripts/fetch-helpers";
    import {wsTools} from "../scripts/websocket-tools";
    import LoginModal from "./LoginModal";
    import RegisterModal from "./RegisterModal";
    import Chatbox from "./Chatbox";
    import ProblemPicker from "./ProblemPicker";
    import ServiceMenu from "./ServiceMenu";

    export default {
        name: "CometApp",
        components: {
            LoginModal,
            RegisterModal,
            Chatbox,
            ProblemPicker,
            ServiceMenu
        },
        data: function () {
            return {

            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                user_info_id: state => state.user.user_info_id,
                username: state => state.user.username,
                email: state => state.user.email,
                new_messages: state => state.user.new_messages,
                nav_bar_apps: state => state.controls.nav_bar_apps,
            }),
            lockheed_icon() {
                return get_icon();
            },
            drawer: {
                get() {
                    return this.$store.state.user.drawer;
                },
                set(value) {
                    this.$store.commit('set_drawer_value', value);
                }
            },
            chatbox: {
                get() {
                    return this.$store.state.user.chatbox;
                },
                set(value) {
                    this.$store.commit('set_chatbox_value', value);
                }
            },
            login_overlay: {
                get() {
                    return this.$store.state.user.login_overlay;
                },
                set(value) {
                    this.$store.commit('set_login_overlay', value);
                }
            },
            register_overlay: {
                get() {
                    return this.$store.state.user.register_overlay;
                },
                set(value) {
                    this.$store.commit('set_register_overlay', value);
                }
            }
        },
        methods: {
            async toggle_app(app_name){
                await this.$store.commit('toggle_app', app_name)
            }
        },
        async mounted() {

            // --> 1. Generate session
            await fetchPost(API_URL + 'auth/generate-session', new FormData());

            // --> 2. Start websocket connection
            await wsTools.wsConnect(this.$store);

            // --> 3. Try to initialize
            await this.$store.dispatch('initialize');
        },
    }
</script>

<style scoped>

.wrapper {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    min-height: 100vh;
    max-width: 100vw;
    padding: 10px;
    width: 100vw;
    height: 100vh;
}

.bg-active {
    background-color: #ff8200;
    color : white !important;
}


</style>