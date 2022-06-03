<script>
    import SysStat from './SysStat.vue';

    export default{
        components: {SysStat},
        props: ['ocnum'],
        data(){
            return {
                info: [{}],
                systems: [{}],
                selected_rows: [],
                services: [],
                sel_service: '',
                sel_state: '',
                state_list: [
                        {label: "Start", value: "start"}, 
                        {label:"Stop", value: "stop"}
                    ]
            }
        },
        async created(){
            this.update();
            setInterval(this.update, 3000);
        },
        computed:{
            headers(){
                if(this.systems.length < 1){ return []; }
                return Object.keys(this.systems[0]);
            },
            table_body(){
                return [...this.headers, {slot: 'service_ind'}];
            },
            service_list(){
                return this.services.map(service => {
                        return {label: service, value: service};
                    });
            }
        },
        methods:{
            async update(){
                this.info = await( await fetch('http://10.0.7.170/order/'+this.ocnum) ).json();

                const sysArray = [];
                for(let sys of this.info){
                    sysArray.push(
                        {
                            SN: sys["serial"],
                            ip: sys["OS IP"]
                        }
                    );
                }

                this.systems = sysArray;
            },
            sys_event(){
                this.selected_rows.forEach(i=>{
                    fetch(`http://${this.systems[i].ip}/services/${this.sel_service}?state=${this.sel_state}`, {
                        method: 'POST'
                    });
                });
            },
            add_services(services){
                services.forEach(service => {
                    if(!this.services.includes(service)){
                        this.services.push(service);
                    }
                });
            }
        }
    }
</script>

<template>
    <ui-table
        v-model="selected_rows"
        fullwidth
        :data = "systems"
        :thead = "headers"
        :tbody = "table_body"
        row-checkbox>
        <template #service_ind='{data}'>
            <SysStat :info='data' @add_services='add_services'/>
        </template>
    </ui-table>
    <ui-select class='actionSelect' :options='service_list' v-model='sel_service'/>
    <ui-select class='actionSelect' :options='state_list' v-model='sel_state'/>
    <ui-button @click='sys_event'>Apply</ui-button>
</template>

<style>
.systemTable{
    width: 2300px;
}
.actionSelect{
    margin:20px;
}
</style>