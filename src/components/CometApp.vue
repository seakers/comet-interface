<template>
    <v-app dark>

        <!-- LOGIN OVERLAY -->
        <v-overlay v-model="login_overlay" opacity="0.8" z-index="1000">
            <login-modal></login-modal>
        </v-overlay>

        <!-- NAVIGATION -->
        <v-navigation-drawer v-model="drawer" app color="primary lighten-1">

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
            <v-divider class="primary darken-1"></v-divider>

            <!-- MENU ITEMS -->
            <v-list dense nav>

            </v-list>
        </v-navigation-drawer>

        <!-- CHAT BOX -->


        <!-- APP BAR -->
        <v-app-bar app class="primary white--text">
            <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>
            <v-toolbar-title>Comet App</v-toolbar-title>
            <v-spacer></v-spacer>
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
        <v-main class="secondary lighten-3">
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
    import LoginModal from "./LoginModal";


    export default {
        name: "CometApp",
        components: {
            LoginModal
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
            }),
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
            }
        },
        methods: {

        },
        async mounted() {
            await this.$store.dispatch('initialize');
        },
    }
</script>

<style scoped>

</style>