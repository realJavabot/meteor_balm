<script>
import Table from './components/Table.vue';
import Stat from './components/Stat.vue';
import Tip from './components/Tip.vue';
import OCInput from './components/OCInput.vue';
import Empty from './components/Empty.vue';
import { search } from './components/search.mjs';
import Invalid from './components/Invalid.vue';

export default{
  components: {Table, Stat, Empty, Tip, Invalid, OCInput},
  data(){
    return {
      oc_num: '',
      valid: false,
      active: 0
    }
  },
  methods: {
    async oc_change(new_oc){
      let valid = true;
      this.oc_num = new_oc;

      let srch = await search(new_oc);
      if(!Array.isArray(srch)){
        valid = false;
      }

      valid &= (new_oc)? true : false;
      this.valid = valid;
    }
  }
}
</script>

<template>
  <OCInput @ocChange='oc_change'/>
  <ui-tabs v-model='active'>
    <ui-tab>Inventory</ui-tab>
    <ui-tab>Services</ui-tab>
    <ui-tab>Tip</ui-tab>
  </ui-tabs>
  <ui-panels v-model='active'>
    <ui-panel>
      <Table v-if='valid' :ocnum='oc_num'/>
      <Empty v-else-if='oc_num == ""'/>
      <Invalid v-else/>
    </ui-panel>
    <ui-panel>
      <Stat v-if='valid' :ocnum='oc_num'/>
      <Empty v-else-if='oc_num == ""'/>
      <Invalid v-else/>
    </ui-panel>
    <ui-panel>
      <Tip :ocnum='oc_num'/>
    </ui-panel>
  </ui-panels>
</template>

<style>
</style>