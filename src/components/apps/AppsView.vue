<template>
    <v-container style="padding: 0px 18px 0px 18px;" class="secondary darken-2">

        <!--ACTIVE APPS-->
        <v-row justify="center" style="padding-top: 20px;">
            <v-col v-for="app in active_apps" :key="app.name" :cols="app.cols">
<!--                <transition name="fade">-->
<!--                    <v-slide-y-transition>-->
<!--                            <component :is="app.component"></component>-->
<!--                    </v-slide-y-transition>-->
<!--                </transition>-->
                <component :is="app.component"></component>
            </v-col>
        </v-row>




    </v-container>
</template>

<script>
    import { mapState } from 'vuex';
    import Visualizer from "./Visualizer";
    import DataMining from "./DataMining";
    import DesignBuilder from "./DesignBuilder";
    import EnumerationTool from "./EnumerationTool";
    import Algorithms from "./Algorithms";


    export default {
        name: "apps-view",
        components: {
            Visualizer,
            DataMining,
            DesignBuilder,
            EnumerationTool,
            Algorithms
        },
        data: function () {
            return {
                value: null
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                username: state => state.user.username,
                email: state => state.user.email,
                nav_bar_apps: state => state.controls.nav_bar_apps,
            }),
            active_apps(){
                let apps = [];
                for(let x = 0; x < this.nav_bar_apps.length; x++){
                    let app = this.nav_bar_apps[x]
                    if(app['active'] === true){
                        apps.push(this.nav_bar_apps[x]);
                    }
                }
                return apps;
            }
        },
        methods: {

        },
        apollo: {

        },
        watch: {

        },
        async mounted() {

        }
    }
</script>





<style scoped>

</style>