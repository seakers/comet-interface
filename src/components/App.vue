<template>
<v-app>
    <div style="height: 100%; font-family: Roboto;">
        <v-navigation-drawer permanent dark app>
        
            <v-list>
                <v-list-item>
                    <v-list-item-title style="font-weight: bold; font-size: larger;">
                        LogTool
                    </v-list-item-title>
                </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list>

                <v-list-item v-for="service in services" :key="service.title" link v-on:click="getLogs(service.id)">
                    <v-list-item-icon><v-icon>{{ service.icon }}</v-icon></v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title style="padding-left: 8px; font-weight: bold;">
                            {{ service.title }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

            </v-list>
        </v-navigation-drawer>

        
        <v-content style="height: 100%">
            <v-container style="height: 100%">
                <transition name="fade" mode="out-in">
                    <template v-if="current_id === 'interface'">
                        <interface-panel></interface-panel>
                    </template>
                    <template v-if="current_id === 'brain'">
                        <brain-panel></brain-panel>
                    </template>
                    <template v-if="current_id === 'vassar'">
                        <vassar-panel></vassar-panel>
                    </template>
                    <template v-if="current_id === 'datamining'">
                        <datamining-panel></datamining-panel>
                    </template>
                </transition>
            </v-container>
        </v-content>
        

        <v-footer dark app>
            <v-spacer></v-spacer>
            <div>Seaklab</div>
        </v-footer>

    </div>
</v-app>
</template>

<script>
    import {wsTools} from "../scripts/websocket-tools";
    import {fetchGet, fetchPost} from '../scripts/fetch-helpers';
    import InterfacePanel from './InterfacePanel';
    import BrainPanel from './BrainPanel';
    import VassarPanel from './VassarPanel';
    import DataminingPanel from './DataminingPanel';

    export default {
        name: 'app',
        data: function () {
            return {
                current_id: 'interface',
                services: [
                    { title: 'Interface', icon: 'mdi-vuejs', id: 'interface' },
                    { title: 'Brain', icon: 'mdi-brain', id: 'brain' },
                    { title: 'Vassar', icon: 'mdi-robot-industrial', id: 'vassar' },
                    { title: 'Datamining', icon: 'mdi-chart-bar-stacked', id: 'datamining' },
                ],
            }
        },
        components: {
            InterfacePanel,
            BrainPanel,
            VassarPanel,
            DataminingPanel
        },
        computed: {},
        methods: {
            getLogs(id) {
                console.log(id);
                this.current_id = id;
            }

        },
        async mounted() {
            console.log("App Mounted - generating session");
            await fetchPost(API_URL + 'auth/generate-session', new FormData());
            await wsTools.wsConnect();
        },

        async beforeDestroy() {
            // Send request to get log information
            console.log("InterfacePanel mounted");
            let reqData = new FormData();
            reqData.append('service', 'interface');
            reqData.append('log_type', this.log_type);
            reqData.append('command', 'stop');
            let dataResponse = await fetchPost(API_URL + 'logapp/logfile', reqData);
        },






        watch: {}
    }
</script>



<style scoped>
   .fade-enter-active{
         transition: opacity .25s;
    }
    .fade-leave-active {
        transition: opacity .4s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>