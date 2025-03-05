<template>
<div class="center-container">
<Card b class="shadow-sm dark:border-0 border-gray-200" style="--p-card-border-radius: 16px;">
    <template #content>
    <h2 class="text-xl font-normal text-green-600 mb-8">Simulador de Juros Compostos</h2>
    
    <form @submit.prevent="calcularPoupanca" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block not:dark:text-white  mb-3">Valor inicial</label>
          <InputNumber size="small" v-model="valorInicial" mode="currency" currency="BRL" locale="pt-BR" class="w-full rounded-md" />
        </div>
        <div>
          <label class="block not:dark:text-white mb-3">Valor mensal</label>
          <InputNumber size="small" v-model="aporte" mode="currency" currency="BRL" locale="pt-BR" class="w-full" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block not:dark:text-white mb-3">Taxa de juros anual (%)</label>
          <InputNumber size="small" v-model="taxaJuros" mode="decimal" :min="0" :max="100" class="w-full" />
        </div>
        <div>
          <label class="block not:dark:text-white mb-3">Período (meses)</label>
          <InputNumber size="small"  v-model="meses" :min="1" class="w-full" />
        </div>
      </div>
  
      <Button label="Calcular" class=" text-white" type="submit" />
    </form>

    <div v-if="dadosGrafico.length" class="mt-6">
          <LineChart1 v-if="dadosGrafico.length" :dados="dadosGrafico" />
    </div>
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
  let saldo = valorInicial.value;
  let totalDepositado = valorInicial.value;
  let jurosMes= taxaJuros.value /12;
  const dados = [];

  for (let i = 1; i <= meses.value; i++) {
    saldo += aporte.value;
    totalDepositado += aporte.value;
    saldo *= 1 + jurosMes / 100; 
    dados.push({
      mes: `Mês ${i}`,
      saldo: parseFloat(saldo.toFixed(2)), // Corrige precisão
      totalDepositado: parseFloat(totalDepositado.toFixed(2))
    });
  }

  dadosGrafico.value = dados;
};
</script>