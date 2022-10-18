<template>
    <v-card elevation="4">
        <v-card-title style="padding-bottom: 0;">Visualizer</v-card-title>
        <v-container>
            <v-row>

                <!--CONTROLS-->
                <v-col cols="6">
                    Controls
                </v-col>

                <!--PLOT-->
                <v-col cols="6">
                    <Plotly :data="data"
                            :layout="layout" :display-mode-bar="true"
                            v-on:plotly-click="select_datapoint()"
                    ></Plotly>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
    import { mapState } from 'vuex';
    import { Plotly } from 'vue-plotly'

    export default {
        name: "visualizer",
        components: {
            Plotly
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
            data() {
                return [{
                    x: [1],
                    y: [1],
                    z: [1],
                    type:"scatter3d",
                    mode: "markers",
                    marker: {
                        size: 3,
                    },
                    text: ['point'],
                }];
            },
            layout() {
                return {
                    scene: {
                        xaxis:{
                            title: 'FOM 1',
                        },
                        yaxis:{
                            title: 'FOM 2',
                        },
                        zaxis:{
                            title: 'FOM 3',
                        },
                    },
                    margin:{
                        t: 0,
                        l: 0,
                        r: 0,
                        b: 0,
                    },
                }
            }
        },
        methods: {
            select_datapoint(){
                console.log('--> POINT SELECTED');
            }
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