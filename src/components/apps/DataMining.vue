<template>
    <v-card elevation="4">
        <v-card-title>Data Mining</v-card-title>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "data-mining",
    data: function () {
        return {
            value: null
        }
    },
    computed: {
        ...mapState({
            user_id: state => state.user.user_id,
            user_info_id: state => state.user.user_info_id,
            username: state => state.user.username,
            email: state => state.user.email,
            nav_bar_apps: state => state.controls.nav_bar_apps,
        }),
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