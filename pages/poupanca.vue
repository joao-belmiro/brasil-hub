<template>
<div class="center-container">
<Card class="shadow-sm dark:border-0 border-gray-200 max-w-4xl w-full" style="--p-card-border-radius: 16px;">
    <template #content>
    <h2 class="text-xl md:text-2xl font-normal text-green-600 mb-6 md:mb-8">Simulador de Juros Compostos</h2>
    
    <form @submit.prevent="calcularPoupanca" class="space-y-4 md:space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block not:dark:text-white mb-2 md:mb-3">Valor inicial</label>
          <InputNumber size="small" v-model="valorInicial" mode="currency" currency="BRL" locale="pt-BR" class="w-full rounded-md" />
        </div>
        <div>
          <label class="block not:dark:text-white mb-2 md:mb-3">Valor mensal</label>
          <InputNumber size="small" v-model="aporte" mode="currency" currency="BRL" locale="pt-BR" class="w-full" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block not:dark:text-white mb-2 md:mb-3">Taxa de juros anual (%)</label>
          <InputNumber size="small" v-model="taxaJuros" mode="decimal" :min="0" :max="100" class="w-full" />
        </div>
        <div>
          <label class="block not:dark:text-white mb-2 md:mb-3">Período (meses)</label>
          <InputNumber size="small" v-model="meses" :min="1" class="w-full" />
        </div>
      </div>
  
      <Button label="Calcular" class="w-full md:w-auto text-white" type="submit" />
    </form>

    <div v-if="dadosGrafico.length" class="mt-6 flex flex-col md:flex-row gap-4">
      <Card class="border-gray-100 border-1 w-full md:w-1/2" style="--p-card-border-radius: 16px;">
        <template #content>
          <p class="text-lg not:dark:text-white">Total Depositado</p>
          <p class="text-2xl md:text-3xl font-semibold text-green-600">
            {{ dadosGrafico[dadosGrafico.length - 1]?.totalDepositado ?
              dadosGrafico[dadosGrafico.length - 1].totalDepositado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) :
              'R$ 0,00' }}
          </p>
        </template>
      </Card>

      <Card class="border-gray-100 border-1 w-full md:w-1/2" style="--p-card-border-radius: 16px;">
        <template #content>
          <p class="text-lg not:dark:text-white">Saldo com juros</p>
          <p class="text-2xl md:text-3xl font-semibold text-green-600">
            {{ dadosGrafico[dadosGrafico.length - 1]?.saldo ?
              dadosGrafico[dadosGrafico.length - 1].saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) :
              'R$ 0,00' }}
          </p>
        </template>
      </Card>
    </div>
    <LineChart1 v-if="dadosGrafico.length" :dados="dadosGrafico" class="w-full mt-6" />
    </template>
  </Card>
</div>
</template>

<script setup>
import { ref } from 'vue';
import LineChart1 from '@/components/LineChart.vue';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Card from "primevue/card";

const valorInicial = ref(3000);
const aporte = ref(500);
const taxaJuros = ref(6.17);
const meses = ref(12);
const dadosGrafico = ref([]);

const calcularPoupanca = () => {
  const taxaMensal = taxaJuros.value / 12 / 100;
  const resultados = Array.from({ length: meses.value }, (_, i) => {
    const mes = i + 1;
    const totalDepositado = valorInicial.value + (aporte.value * mes);
    
    const saldo = (valorInicial.value * Math.pow(1 + taxaMensal, mes)) + 
                 (aporte.value * ((Math.pow(1 + taxaMensal, mes) - 1) / taxaMensal));
    
    return {
      mes: `Mês ${mes}`,
      saldo: parseFloat(saldo.toFixed(2)),
      totalDepositado: parseFloat(totalDepositado.toFixed(2))
    };
  });
  
  dadosGrafico.value = resultados;
};
</script>

<style scoped>
.center-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>