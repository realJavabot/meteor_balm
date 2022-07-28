<script>
    import System from './System.vue';

    export default{
        components: {System},
        props: ['ocnum'],
        data(){
            return {
                info: []
            }
        },
        watch: {
            async ocnum(newval, oldval){
                this.info = await( await fetch('http://10.0.7.170/order/'+newval) ).json();
            }
        },
        async created(){
            this.info = await( await fetch('http://10.0.7.170/order/'+this.ocnum) ).json();
        },
        computed:{
            tdStyle(){
                return {
                    width: `${2300 / this.headers.length}px`,
                    textOverflow: 'ellipsis',
                    display: 'inline-block',
                    textAlign: 'center'
                };
            },
            inventory(){
                if(this.info.length == 0){return [];}
                let inv = [];
                const get_unique = (info, key) => {
                    const devices = {};
                    Object.keys(info.Storage).forEach(i=>{
                        if(!Array.isArray(info.Storage[i])){return;}
                        info.Storage[i].forEach(devs=>{
                            if(!devices[devs[key]]){
                                devices[devs[key]] = 0;
                            }
                            devices[devs[key]]++;
                        });
                    });
                    return Object.keys(devices)
                        .map(dev => `${devices[dev]} ${dev}`)
                        .join(' ');
                };
                for(let sysID in this.info){
                    let sys = this.info[sysID];
                    let template = {
                        'Serial'        : sys['serial'],
                        'Model'         : sys['System']['Motherboard Model'],
                        'MB_Serial'     : sys['System']['Motherboard Serial'],
                        'Chassis_Serial': sys['Chassis Serial'],
                        'Memory'        : sys['Memory']['Amount'],
                        'CPU'           : sys['CPU']['Processors'][0]['Model'],
                        'Disk'          : get_unique(sys, 'model'),
                        'BIOS'          : sys['System']['BIOS']
                    }
                    
                    if(sys['BMC']){
                        template['IPMI'] = sys['BMC']['firmware'];
                    }
                    
                    template['Disk Firmware'] = get_unique(sys, 'firmware');

                    let count = 0;
                    sys['Network'].forEach(dev=>{
                        count++;
                        template[`MAC_${count}`] = dev.mac.toUpperCase();
                    });
                    
                    if(sys['BMC']){
                        template['BMC_MAC'] = sys['BMC']['mac'].toUpperCase();
                        template['BMC_IP']  = sys['BMC']['ip'];
                    }

                    inv.push(template);
                }
                return inv;
            },
            headers(){
                if(this.inventory.length == 0){return;}
                return Object.keys(this.inventory[0]);
            },
            table_headers(){
                if(this.inventory.length == 0){return;}
                return [
                    {
                        value: 'SN',
                        sort: 'asc',
                        columnId: 'Serial'
                    },
                    ...Object.keys(this.inventory[0]).slice(1)
                ]
            }
        },
        methods:{
            download(contentType) {
                const a = document.createElement("a");
                const data = document.getElementsByClassName("column");
                let content = "";
                content += this.headers.join(",") + "\n";
                this.inventory.forEach(server => {
                    const serverRow = [];
                    Object.keys(server).forEach(k => {
                        serverRow.push(server[k]);
                    })
                    content += serverRow.join(",") + "\n";
                });
                const file = new Blob([content], { type: contentType });
                a.href = URL.createObjectURL(file);
                a.download = `${this.ocnum}.csv`;
                a.click();
            }
        }
    }
</script>

<template>
    <ui-table
        fullwidth
        :data = "inventory"
        :thead = "table_headers"
        :tbody = "headers">
    </ui-table>
    <ui-button class='downloadButton' @click='download'>download</ui-button>
</template>

<style>
.mdc-data-table__header-cell{
    vertical-align: middle;
}
.downloadButton{
    margin:20px;
}
</style>