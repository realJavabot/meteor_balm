import { createApp } from 'vue';
import App from './App.vue';

import Vue3Storage, { StorageType } from 'vue3-storage';;

import BalmUI from 'balm-ui';
import BalmUIPlus from 'balm-ui-plus'; 
import 'balm-ui-css';

createApp(App)
    .use(Vue3Storage, {namespace: "pro_", storage: StorageType.Session})
    .use(BalmUI, {UiTextfield: {}, UiTable: {}, UiTabs: {}, UiSelect: {}, UiButton: {raised: true}, UiTooltip: {}, UiList: {}, UiSpinner: {}, UiFile: {}, UiPagination: {}, UiDialog: {}, UiDialogTitle: {}, UiDialogActions: {}})
    .use(BalmUIPlus)
    .mount('#app');
