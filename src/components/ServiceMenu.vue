<template>
    <v-list dense nav>

        <v-container style="padding: 0;">
            <v-row dense>
                <v-col cols="9">
                    <v-subheader style="color: white !important; font-size: large;">Services</v-subheader>
                </v-col>
                <v-col cols="3">
                    <v-btn icon dark color="white" style="margin-left: 10px" v-on:click="send_ping" :disabled="!canPing">
                        <v-icon dark v-if="canPing">
                            mdi-reload
                        </v-icon>
                        <v-icon dark v-if="!canPing">
                            mdi-timer-sand
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>

        <v-container style="padding-left: 8px; padding-right: 8px; padding-top: 0;">
            <v-row dense>
                <v-col cols="12">
                    <v-card elevation="4">
                        <v-card-text style="padding: 8px;">
                            <p style="color: black; font-size: medium; margin-bottom: 0;">Evaluator Servers</p>
                            <p style="margin-bottom: 0;">Running: {{available_design_evaluators}}</p>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12">
                    <v-card elevation="4">
                        <v-card-text style="padding: 8px;">
                            <p style="color: black; font-size: medium; margin-bottom: 0;">Algorithm Servers</p>
                            <p style="margin-bottom: 0;">Running: {{running_genetic_algorithms}}</p>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-list-item style="margin-bottom: 10px;">
            <v-btn color="success" to="/services" dark block>Service Page</v-btn>
        </v-list-item>

<!--        <v-list-item>-->
<!--            <v-card rounded>-->
<!--&lt;!&ndash;                <v-card-title>Design Evaluators</v-card-title>&ndash;&gt;-->
<!--                <v-card-text>Design Evaluator</v-card-text>-->

<!--            </v-card>-->
<!--        </v-list-item>-->
    </v-list>
</template>

<script>
    import {mapState, mapGetters} from "vuex";
    import {wsTools} from "../scripts/websocket-tools";

    export default {
        name: "service-menu",
        data: function() {
            return {
                lastPingId: null,
                canPing: true,
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                user_info_id: state => state.user.user_info_id,
                username: state => state.user.username,
                email: state => state.user.email,
                problem_id: state => state.problem.problem_id,
                dataset_id: state => state.problem.dataset_id,
            }),
            ...mapGetters({
                serviceStatus: 'getServiceStatus',
                pingId: 'getPingId'
            }),
            available_design_evaluators(){
                let count = 0;
                let vassar_containers = this.serviceStatus['comet-evaluator'];
                for(let x = 0; x < vassar_containers.length; x++){
                    let container = vassar_containers[x];
                    let vassar_status = container['container']['VassarStatus'];
                    let problem_id = container['container']['problem_id'];
                    if(vassar_status === 'RUNNING' && parseInt(problem_id) === this.problem_id){
                        count += 1;
                    }
                }
                this.$store.commit('setAvailableDesignEvaluators', count);
                return count;
            },
            running_genetic_algorithms(){
                let count = 0;
                let containers = this.serviceStatus['comet-algorithm'];
                for(let x = 0; x < containers.length; x++){
                    let container = containers[x];
                    let container_status = container['container']['Status'];
                    if(container_status === 'Running'){
                        count += 1;
                    }
                }
                this.$store.commit('setAvailableGeneticAlgorithms', count);
                return count;
            },
        },
        methods: {
            send_ping(){
                this.canPing = false;
                this.lastPingId = this.generate_msg_id();
                wsTools.websocket.send(JSON.stringify({msg_type: "ping_services", ping_id: this.lastPingId}));
                setTimeout(() => {this.canPing = true;}, 30000);
            },
            generate_msg_id(){
                let length = 15;
                let result           = '';
                let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let charactersLength = characters.length;
                for ( let i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            },
        },
        watch: {
            pingId() {
                if(this.pingId === null){
                    this.canPing = true;
                }
                if(this.pingId === this.lastPingId){
                    this.canPing = true;
                }
            }
        }
    }
</script>

<style scoped>

</style>