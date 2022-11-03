<template>
    <v-card elevation="4">

        <v-app-bar class="primary white--text" elevation="0" dense clipped-left>
            <v-toolbar-title>Algorithms</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        <v-icon dark>
                            mdi-cog
                        </v-icon>
                        <v-icon dark>
                            mdi-menu-down
                        </v-icon>
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-item-group>
                        <v-list-item>
                            <v-list-item-title>Stop All Algorithms</v-list-item-title>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-menu>
        </v-app-bar>






        <v-container>
            <v-row>
                <v-col style="padding: 0">
                    <v-navigation-drawer color="primary lighten-1" permanent clipped>

                        <!-- MENU HEADER -->
                        <v-list dense rounded>
                            <v-list-item class="white--text">
                                Item
                            </v-list-item>
                        </v-list>

                    </v-navigation-drawer>
                </v-col>

                <!--CONTROL PANEL-->
                <v-col >
                    text
                </v-col>


            </v-row>
        </v-container>


    </v-card>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "algorithms",
    data: function () {
        return {}
    },
    computed: {
        ...mapState({
            user_id: state => state.user.user_id,
            is_admin: state => state.user.is_admin,
            user_info_id: state => state.user.user_info_id,
            problem_id: state => state.problem.problem_id,
            dataset_id: state => state.problem.dataset_id,
            available_design_evaluators: state => state.services.available_design_evaluators,
            evaluation_queue: state => state.services.evaluation_queue,
        }),
    },
    methods: {

    },
    apollo: {

    },
    watch: {

    },

}
</script>

<style scoped>

</style>