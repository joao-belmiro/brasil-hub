import { defineNuxtPlugin } from '#app';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button'; // Importe os componentes que você deseja usar
import MegaMenu  from 'primevue/megamenu';
const pt = {
    firstDayOfWeek: 0,
    dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
    dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
    dayNamesMin: ['D','S','T','Q','Q','S','S'],
    monthNames: ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
    monthNamesShort: ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'],
    today: 'Hoje',
    clear: 'Limpar',
    dateFormat: 'dd/mm/yy',
    weekHeader: 'Sm'
  };
  export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true, locale: pt });
    nuxtApp.vueApp.component('Button', Button);
    nuxtApp.vueApp.component('MegaMenu', MegaMenu);
});