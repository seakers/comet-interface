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
                <v-list-item-content>
                    <v-list-item-title class="text-h6">
                        {{ username }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="white--text">
                        {{ email }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
<!--            <v-divider class="primary darken-1"></v-divider>-->

            <!-- MENU ITEMS -->
            <v-list dense nav>

                <v-list-item style="margin-bottom: 10px;" v-for="item in nav_bar_apps" :key="item.name" link v-bind:class="{ 'bg-active': item.active }" v-on:click="toggle_app(item.name)">
                    <v-list-item-icon>
                        <v-icon color="white">{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="white--text">
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

            </v-list>
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
            <v-img :src="lockheed_icon" max-width="170" style="margin-right: 10px;"></v-img>
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
    import LoginModal from "./LoginModal";
    import RegisterModal from "./RegisterModal";
    import Chatbox from "./Chatbox";


    export default {
        name: "CometApp",
        components: {
            LoginModal,
            RegisterModal,
            Chatbox
        },
        data: function () {
            return {
                modules_db: null,

                // --> Main links <--
                main_links: [
                    // { name: 'Mastery', icon: 'mdi-school', link: '/mastery'},
                ],

                // --> Test links <--
                test_links: [
                    // { name: 'Take Exam', icon: 'mdi-brain', link: '/adaptive-test'},
                    // { name: 'Take Exam', icon: 'mdi-brain', link: '/take-exam'},
                    // { name: 'Targeted', icon: 'mdi-bullseye-arrow', link: '/targeted-test'},
                ],

                // --> Module links <--
                module_links: [],
                module_links_2: {},
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
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