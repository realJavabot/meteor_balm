<script>
import Dropdown from './Dropdown.vue';
import Arraylist from './Arraylist.vue';
import Status from './Status.vue';
export default{
    components: {Dropdown, Arraylist, Status},
    props: ['info'],
    emits: ['add_services'],
    data(){
        return {
            confirmed: false,
            services: [],
            message: `Pinging ${this.info.SN} at ${this.info.ip}...`
        }
    },
    async created(){
        this.attempt();
    },
    methods: {
         async attempt(){
            try{
                this.services = await( await fetch(`http://${this.info.ip}/services`) ).json();
                this.$emit('add_services', this.services);
                this.confirmed = true;
            }catch(e){
                this.message = `${this.info.SN} unavailable atm`;
                setTimeout(() => {
                    this.attempt();
                }, 3000);
            }
         }
    }
}
</script>

<template>
    <Status v-for='serv in services' :ip='info.ip' :service='serv' v-if='confirmed'/>
    <span v-else> {{message}} </span>
</template>

<style>
</style>