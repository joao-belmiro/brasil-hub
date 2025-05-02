<template>
  <div class="center-container p-4">
    <Card class="shadow-sm dark:border-0 border-gray-200 w-full" style="--p-card-border-radius: 16px;">
      <template #content>
        <h2 class="text-xl md:text-2xl font-normal text-green-600 mb-6 md:mb-8">Simulador de Juros Compostos</h2>

        <form @submit.prevent="calcularPoupanca" class="space-y-4 md:space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs not:dark:text-white mb-2 md:mb-3">Valor inicial</label>
              <InputNumber size="small" v-model="valorInicial" mode="currency" currency="BRL" locale="pt-BR" class="w-full rounded-md"
                :invalid="errors.valorInicial" />
              <p v-if="errors.valorInicial" class="text-red-500 text-sm">
                {{ errors.valorInicial }}
              </p>

            </div>
            <div>
              <label class="block text-xs not:dark:text-white mb-2 md:mb-3">Valor mensal</label>
              <InputNumber size="small" v-model="aporte" mode="currency" currency="BRL" locale="pt-BR" class="w-full"
                :invalid="errors.aporte" />
              <p v-if="errors.aporte" class="text-red-500 text-sm">
                {{ errors.aporte }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs not:dark:text-white mb-2 md:mb-3">Taxa de juros anual (%)</label>
              <InputNumber size="small" v-model="taxaJuros" mode="decimal" :min="0" :max="100" class="w-full"
                :invalid="errors.taxaJuros" />
              <p v-if="errors.taxaJuros" class="text-red-500 text-sm">
                {{ errors.taxaJuros }}
              </p>
            </div>
            <div>
              <label class="block text-xs not:dark:text-white mb-2 md:mb-3">Período (meses)</label>
              <InputNumber size="small" v-model="meses" :min="1" class="w-full" :invalid="errors.meses" />
              <p v-if="errors.meses" class="text-red-500 text-sm">
                {{ errors.meses }}
              </p>
            </div>
          </div>
          
        <Button label="Calcular" size="small" class="w-full md:w-auto text-white" icon="pi pi-calculator" type="submit" />
        </form>

        <div v-if="dadosGrafico.length" class="mt-6 flex flex-col md:flex-row gap-4">
          <Card class="shadow-sm dark:border-0 border-gray-200 w-full md:w-1/2" style="--p-card-border-radius: 16px;">
            <template #content>
              <p class="text-lg not:dark:text-white">Total Depositado</p>
              <p class="text-2xl md:text-3xl font-semibold text-green-600">
                {{ dadosGrafico[dadosGrafico.length - 1]?.totalDepositado ?
                  dadosGrafico[dadosGrafico.length - 1].totalDepositado.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }) :
                'R$ 0,00' }}
              </p>
            </template>
          </Card>

          <Card class="shadow-sm dark:border-0 border-gray-200 w-full md:w-1/2" style="--p-card-border-radius: 16px;">
            <template #content>
              <p class="text-lg not:dark:text-white">Saldo com juros</p>
              <p class="text-2xl md:text-3xl font-semibold text-green-600">
                {{ dadosGrafico[dadosGrafico.length - 1]?.saldo ?
                  dadosGrafico[dadosGrafico.length - 1].saldo.toLocaleString('pt-BR', {
                    style: 'currency', currency: 'BRL'
                  }) :
                'R$ 0,00' }}
              </p>
            </template>
          </Card>
        </div>
        <div v-if="dadosGrafico.length > 0" class="mt-6">
          <h3 class="text-lg font-semibold mb-3">Demonstrativo do Cálculo</h3>
          <p>
            O cálculo de juros compostos é feito mês a mês, considerando o saldo inicial, os aportes mensais e a taxa de juros mensal. A fórmula utilizada é:
          </p>
          <div class="overflow-x-auto m-4">
            <div class="flex flex-row gap-2 justify-center" style="font-family: sans-serif; font-size: 1rem; line-height: 1.6;">
              <p>
                <strong
                  >Saldo<sub>final</sub></strong
                >
                =
                <strong
                  >Saldo<sub>inicial</sub></strong
                >
                × (1 + Taxa<sub>mensal</sub>)<sup>meses</sup> +
              </p>

              <div style="display: flex; align-items: center;">
                <strong
                  >Aporte</strong
                >
                ×
                (
                <span class="fraction"><sup>(1 + Taxa<sub>mensal</sub>)<sup>meses</sup> − 1</sup>&frasl;<sub>Taxa<sub>mensal</sub></sub></span> )
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table
              class="min-w-full border-b">
              <thead class="">
                <tr>
                  <th class="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-600 dark:text-gray-300">Mês
                  </th>
                  <th class="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-600 dark:text-gray-300">Saldo
                    Inicial
                  </th>
                  <th class="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-600 dark:text-gray-300">Aporte
                  </th>
                  <th class="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-600 dark:text-gray-300">Juros
                  </th>
                  <th class="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-600 dark:text-gray-300">Saldo
                    Final
                  </th>
                </tr>
              </thead>
              <tbody class="text-gray-700 dark:text-gray-300">
                <tr v-for="(item, index) in dadosGrafico" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td class="py-2 px-4 border-b dark:border-gray-600">{{ item.mes }}</td>
                  <td class="py-2 px-4 border-b dark:border-gray-600">{{ (index === 0 ? valorInicial :
                    dadosGrafico[index -
                      1].saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
                  <td class="py-2 px-4 border-b dark:border-gray-600">{{ aporte.toLocaleString('pt-BR', {
                    style:
                      'currency',
                    currency: 'BRL' }) }}</td>
                  <td class="py-2 px-4 border-b dark:border-gray-600">{{ calcularJuros(index).toLocaleString('pt-BR', {
                    style:
                    'currency', currency: 'BRL' }) }}</td>
                  <td class="py-2 px-4 border-b dark:border-gray-600">{{ item.saldo.toLocaleString('pt-BR', {
                    style:
                      'currency',
                    currency: 'BRL' }) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
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
const errors = ref({});
const dadosGrafico = ref([]);

definePageMeta({
  title: 'Simulador de Rendimento da Poupança 2025',
  description: 'Veja quanto seu dinheiro rende na poupança com aportes mensais e taxa Selic atualizada. Gráficos e comparativos com outros investimentos.',
});
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!valorInicial.value || valorInicial.value <= 0) {
    errors.value.valorInicial = "O valor inicial é obrigatório e deve ser maior que zero.";
    isValid = false;
  }
  if (!aporte.value || aporte.value <= 0) {
    errors.value.aporte = "O aporte mensal é obrigatório e deve ser maior que zero.";
    isValid = false;
  }
  if (!taxaJuros.value || taxaJuros.value < 0 || taxaJuros.value > 100) {
    errors.value.taxaJuros = "A taxa de juros é obrigatória e deve ser entre 0 e 100.";
    isValid = false;
  }
  if (!meses.value || meses.value < 1) {
    errors.value.meses = "O período é obrigatório e deve ser maior ou igual a 1.";
    isValid = false;
  }
  return isValid;
};

const calcularPoupanca = () => {
  if (!validateForm()) {
    return;
  }
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

const calcularJuros = (index) => {
  const taxaMensal = taxaJuros.value / 12 / 100;
  return parseFloat(((index === 0 ? valorInicial.value : dadosGrafico.value[index - 1].saldo) * taxaMensal).toFixed(2));
};
</script>

<style scoped>
.center-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>