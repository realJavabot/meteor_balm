<script>
export default{
    props: ['ocnum'],
    data(){
        return {
            session_id: '',
            info: '',
            selected_rows: [],
            valid: false,
            loading: false
        }
    },
    watch: {
        async ocnum(newval, oldval){
            this.update();
        }
    },
    methods: {
        async update(){
            this.loading = true;
            this.valid = true;
            this.session_id = await (await fetch(`http://192.168.86.39:8000/sess/michael/ixl101mio9`, {mode: 'cors'})).text();
            fetch(`http://192.168.86.39:8000/${this.session_id}/${this.ocnum}`, {mode: 'cors'})
                .then(response=>{
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Something went wrong');
                })
                .then(data=>{
                    data['marked_table']['headers'] = data['marked_table']['headers'].slice(0,8);
                    data['marked_table']['body'] = this.gen_body(data['marked_table']);
                    data['inventory_table']['body'] = this.gen_body(data['inventory_table']);
                    data['qc']['left'].forEach(table=>{
                        return table['body'] = this.gen_body(table);
                    });
                    data['qc']['right'].forEach(table=>{
                        return table['body'] = this.gen_body(table);
                    });
                    data['instructions'] = data['instructions'].filter(e=> e.length>2 && !e.includes("No instruction"));
                    
                    // console.log(data);
                    
                    this.info = data;
                    this.loading = false;
                }).catch(()=>{
                    this.valid = false;
                    this.loading = false;
                });
        },
        gen_body(table){
            if(Array.isArray(table['body'][0])){
                const new_body = [];
                table['body'].forEach(el=>{
                    const temp = {};
                    table['headers'].forEach((h, i)=>{
                            temp[h] = el[i];
                    });
                    new_body.push(temp);
                });
                return new_body;
            }else{
                const headless = {};
                table['headers'].forEach((head, i) => {
                    headless[head] = table['body'][i];
                });
                return [headless];
            }
        },
        async start(){
            this.selected_rows.forEach(i=>{
                try{
                    const sys = this.info['marked_table'].body[i];
                    fetch(`http://192.168.86.39:8000/start/${this.session_id}/${this.ocnum}/${sys["#"]}`, {mode: 'cors'});
                    sys["Testing Started"] = 'just now';
                    sys["Test By"].body[i][4] = 'michael';
                }catch{}
            });
        },
        async end(){
            this.selected_rows.forEach(i=>{
                try{
                    const sys = this.info['marked_table'].body[i];
                    fetch(`http://192.168.86.39:8000/end/${this.session_id}/${this.ocnum}/${sys["#"]}`, {mode: 'cors'});
                    sys["Testing Done"] = 'just now';
                }catch{}
            });
        }
    },
    async created(){
        this.update();
    }
}
</script>

<template>
    <div v-if="valid">
    <div v-if="loading">
        <center><ui-spinner active></ui-spinner></center>
    </div>
    <div v-else>
        <div class="instructions">
            <div>
                <h3 class="header">Sales:</h3>
                <span class="sales">{{info.sales}}</span>
                <h3 class="header">Customer:</h3>
                <span class="sales">{{info.customer[0]}}</span>
            </div>
            <div>
                <h3 class="header">Instructions:</h3>
                <ui-list>
                <ui-item v-for="val in info.instructions" :key="val">
                    <ui-item-text-content>{{val}}</ui-item-text-content>
                </ui-item>
                </ui-list>
            </div>
            <div>
                <h3 class="header">Raid:</h3>
                <ui-list>
                <ui-item v-for="val in info.raid" :key="val">
                    <ui-item-text-content>{{val}}</ui-item-text-content>
                </ui-item>
                </ui-list>
            </div>
        </div>
        <!-- <span>Customer: {{info.customer[0]}}</span> -->
        <ui-table
            fullwidth
            row-checkbox
            v-model = "selected_rows"
            v-if = "info['marked_table']"
            :data = "info['marked_table']['body']"
            :thead = "info['marked_table']['headers']"
            :tbody = "info['marked_table']['headers']"
            class="rust-table">
        </ui-table>
        <ui-button @click="start" class="mark">mark start</ui-button>
        <ui-button @click="end" class="mark">mark end</ui-button>
        <ui-table
            fullwidth
            v-if = "info['inventory_table']"
            :data = "info['inventory_table']['body']"
            :thead = "info['inventory_table']['headers']"
            :tbody = "info['inventory_table']['headers']"
            class="rust-table">
        </ui-table>
        <div class="qc" v-if = "info['qc']">
            <div class="qcTables" v-for="[i, tab] of info['qc']['left'].entries()">
                <ui-table
                    :data = "tab['body']"
                    :thead = "tab['headers']"
                    :tbody = "tab['headers']"
                    class="rust-table" />
                <ui-table
                    :data = "info['qc']['right'][i]['body']"
                    :thead = "info['qc']['right'][i]['headers']"
                    :tbody = "info['qc']['right'][i]['headers']"
                    class="rust-table" />
            </div>
        </div>
    </div>
    </div>
    <h1 v-else>
        OC Not in TIPS
    </h1>
</template>

<style>
    .instructions{
        display:flex;
        justify-content: space-around;
        margin-top:30px;
    }
    .instructions div{
        width:100%;
        max-width: 500px;
        box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);
    }
    .rust-table{
        margin-top:50px;
    }
    .header{
        text-align: center;
    }
    .mdc-deprecated-list-item__text{
        white-space: normal !important;
    }
    .mdc-deprecated-list-item{
        height:auto !important;
        min-height: 48px;
    }
    .mark{
        margin: 30px;
    }
    .sales{
        padding: 10px;
    }
    .qcTables{
        
    }
    .qcTables div{
        width:100%;
    }
</style>