<script>
    import SysStat from './SysStat.vue';
    import Error from './Error.vue';
    import { useEvent } from 'balm-ui';

    export default{
        components: {SysStat, Error},
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
                    ],
                balmUI: useEvent(),
                files: [],
                page: 1,
                total: 1,
                filePopup: false
            }
        },
        watch: {
            async ocnum(newval, oldval){
                this.update();
            },
            async page(newval, oldval){
                this.update();
            },
            files(newval, oldval){
                console.log(newval);
            }
        },
        async created(){
            this.update();
        },
        computed:{
            headers(){
                if(this.systems.length < 1){ return []; }
                return ['SN', 'IP', 'Services', 'Errors'];
            },
            table_body(){
                return ['SN', 'ip', {slot: 'service_ind'}, {slot: 'errors'}];
            },
            service_list(){
                return this.services.map(service => {
                    return {label: service, value: service};
                });
            }
        },
        methods:{
            async update(){
                try{
                    this.info = await( await fetch('http://10.0.7.170/order/'+this.ocnum) ).json();

                    const sysArray = [];
                    for(let sysID in this.info){
                        if(sysID < (this.page-1)*10 || sysID >= (this.page)*10){
                            continue;
                        }
                        let sys = this.info[sysID];
                        sysArray.push(
                            {
                                SN: sys["serial"],
                                ip: sys["OS IP"]
                            }
                        );
                    }
                    this.systems = sysArray;
                    this.total = this.info.length;
                }catch{}
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
            <SysStat :info='data' :key='data.ip' @add_services='add_services'/>
        </template>
        <template #errors='{data}'>
            <Error :key='data.ip' :info='data'></Error>
        </template>
        <ui-pagination
            v-model="page"
            :total="total"
            show-total
            @change="onPage"
            position="center"
        ></ui-pagination>
    </ui-table>
    <div>
        <ui-select class='actionSelect' :options='service_list' v-model='sel_service'/>
        <ui-select class='actionSelect' :options='state_list' v-model='sel_state'/>
        <ui-button @click='sys_event' :disabled='sel_service == ""'>Apply</ui-button>
    </div>
    <ui-button @click="filePopup = true">Upload Service</ui-button>
    <ui-dialog v-model="filePopup" @confirm="onConfirm">
        <ui-dialog-title>Service Files Upload</ui-dialog-title>
        <ui-dialog-content>
            <form class="fileUpload">
                <label for="service">Service File (.service): </label>
                <ui-file 
                    @change="balmUI.onChange('files', $event)"
                    name="service"
                ></ui-file>
                <label for="script">Service Script (.sh): </label>
                <ui-file 
                    @change="balmUI.onChange('files', $event)"
                    name="script"
                ></ui-file>
            </form>
        </ui-dialog-content>
        <ui-dialog-actions></ui-dialog-actions>
    </ui-dialog>
</template>

<style>
.systemTable{
    width: 2300px;
}
.actionSelect{
    margin:20px;
}
.fileUpload{
    display: flex;
    flex-direction: column;
}
.fileUpload label{
    margin-top:20px;
}
</style>