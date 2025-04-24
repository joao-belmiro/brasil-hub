<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card
    style="--p-card-border-radius: 1rem;"
      v-for="(calculator, index) in calculators"
      :key="index"
      class="rounded-3xl bg-card text-card-foreground shadow-sm cursor-pointer border-1 border-transparent hover:border-green-600 hover:drop-shadow-lg"
    >
      <template #content>
        <NuxtLink :to="calculator.to" class="flex items-center gap-4 h-full">
          <div class="p-3 rounded-full bg-green-500/10">
            <Icon
               color="#009739"
              :strokeWidth="2"
              :name="calculator.icon"
              :class="['text-lg']"
            />
          </div>
          <div>
            <h3 class="font-semibold text-lg">{{ calculator.title }}</h3>
            <p class="text-sm text-gray-500">{{ calculator.description }}</p>
          </div>
        </NuxtLink >
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Card from "primevue/card";

const calculators = ref([
  {
    title: "Calculadora de Poupança",
    description: "Calcule o rendimento da sua poupança",
    icon: "PiggyBank",
    to: 'poupanca'
  },
  {
    title: "Correção IPCA",
    description: "Corrija valores pela inflação IPCA",
    icon: "TrendingUp",
    to: 'correcao-ipca'
  },
  {
    title: "Rescisão Contratual",
    description: "Calcule os valores da rescisão contratual",
    icon: "FileMinus",
    to: 'rescisao-contratual'
  },
  {
    title: "Salário Líquido",
    description: "Calcule seu salário líquido CLT",
    icon: "DollarSign",
    to: 'calculo-irpf'
  },
  {
    title: "Calculadora IRPF",
    description: "Calcule seu IRPF",
    icon: "PiggyBank",
    to: 'calculo-irpf'
  },
  {
    title: "Calculadora Custo CLT",
    description: "Calcule os custos de um funcionário CLT",
    icon: "ChartArea",
    to: 'calculadora-custo-trabalhador'
  },

]);
</script>
