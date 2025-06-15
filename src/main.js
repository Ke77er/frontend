import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// PrimeVue Components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import ToggleButton from 'primevue/togglebutton'
import MultiSelect from 'primevue/multiselect'
import Panel from 'primevue/panel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'

const app = createApp(App)

app.use(PrimeVue)

// Register components globally
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dropdown', Dropdown)
app.component('Calendar', Calendar)
app.component('InputText', InputText)
app.component('ToggleButton', ToggleButton)
app.component('MultiSelect', MultiSelect)
app.component('Panel', Panel)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('Tag', Tag)

app.mount('#app')