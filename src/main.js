import { createApp } from 'vue';
import App from './App.vue';

import BalmUI from 'balm-ui';
import BalmUIPlus from 'balm-ui-plus'; 
import 'balm-ui-css';

createApp(App)
    .use(BalmUI, {UiTextfield: {}, UiTable: {}, UiTabs: {}, UiSelect: {}, UiButton: {raised: true}, UiTooltip: {}, UiList: {}, UiSpinner: {}, UiFile: {}, UiPagination: {}, UiDialog: {}, UiDialogTitle: {},UiDialogActions: {acceptText:"Upload", cancelText:"Cancel"}})
    .use(BalmUIPlus)
    .mount('#app');
