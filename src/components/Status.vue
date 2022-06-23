<script>
export default{
    props: ['ip', 'service', 'style'],
    data(){
        return {
            status: 'na'
        }
    },
    async created(){
        this.update();
        setInterval(this.update, 3000);
    },
    methods: {
        async update(){
            try{
                const stat_data = await (await fetch(`http://${this.ip}/services/${this.service}`)).json();
                let status = stat_data.status;
                stat_data.output.forEach(line => {
                    if(line.message.includes('Succeeded')){
                        status = 'Succeeded';
                    }
                });
                this.status = status;
            }catch{
                this.status = 'na';
            }
        }
    },
    computed: {
        backgroundColor(){
            return {
                'na': '#EEE',
                'Stopped': '#723D46',
                'Running': '#FFE1A8',
                'Succeeded': '#C9CBA3'
            }[this.status];
        }
    }
}
</script>

<template>
    <td :style='[ { backgroundColor } ]' class='padded'>
        <span>{{service.split('.')[0]}}: {{status}}</span>
    </td>
</template>

<style>
    .padded{
        padding: 3px 6px;
    }
</style>