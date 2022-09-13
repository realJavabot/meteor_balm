 <script>
 export default{
     data(){
         return {
             oc_num: ''
         }
     },
     created(){
        let oc = this.$storage.getStorageSync('oc');
        if(oc){
            this.oc_num = oc;
            this.process();
        }
     },
     methods: {
         process(){
            this.$emit('ocChange', this.oc_num);
            document.title = this.oc_num;
            this.$storage.setStorageSync('oc', this.oc_num);
         }
     }
 }
 </script>
 <template>
    <div class='ocSearch'>
        <ui-textfield v-model='oc_num' @keyup.enter='process' maxlength='8'>
            OC Number
        </ui-textfield>
        <ui-button @click='process'>Search</ui-button>
    </div>
</template>

<style>
    .ocSearch{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 30px 0 50px 0;
    }
    .ocSearch :first-child{
        margin-right: 25px;
    }
</style>