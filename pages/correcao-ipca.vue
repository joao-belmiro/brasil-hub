<template>
  <div class="center-container mx-auto p-4">
    <Card class="mb-4 shadow-sm dark:border-0 border-gray-200 w-full" style="--p-card-border-radius: 16px;">
      <template #content>
        <h1 class="text-2xl font-bold mb-4">Correção IPCA</h1>
        <div class="mb-4">
          <div class="flex flex-row flex-wrap gap-4">
            <div class="sm:w-full md:w-full lg:w-1/3">
              <label for="valorInicial" class="block mb-2">Valor Inicial:</label>
              <InputNumber id="valorInicial" v-model.number="valorInicial" class="w-full" mode="decimal" :minFractionDigits="2"
                :maxFractionDigits="2" />
            </div>
            <div class="sm:w-full md:w-full lg:w-1/4">
              <label for="anoInicial" class="block mb-2">Ano Inicial:</label>
              <Dropdown id="anoInicial" v-model="anoInicial" :options="anos" optionLabel="ano" placeholder="Selecione o Ano"
                class="w-full" />
            </div>
            <div class="sm:w-full md:w-full lg:w-1/4">
              <label for="anoFinal" class="block mb-2">Ano Final:</label>
              <Dropdown id="anoFinal" v-model="anoFinal" :options="anos" optionLabel="ano" placeholder="Selecione o Ano"
                class="w-full" />
            </div>
          </div>
        </div>
        <Button @click="calcularCorrecao" label="Calcular" class="p-button-raised" />
      </template>
    </Card>
    <Card v-if="valorCorrigido !== null" class="shadow-sm dark:border-0 border-gray-200" style="--p-card-border-radius: 16px;">
          <template #content>
             <h2 class="text-xl font-semibold">Valor Corrigido:</h2>
            <p class="text-green-600 font-bold text-2xl">{{ valorCorrigido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</p>
          </template>
        </Card>
    <Card v-if="ipcaAnual.length > 0" class="shadow-sm dark:border-0 border-gray-200 mt-4"
        style="--p-card-border-radius: 16px;">
        <template #content>
            <h2 class="text-xl font-semibold">IPCA Anual:</h2>
            <ul>
                <li v-for="item in ipcaAnual" :key="item.ano">
                    {{ item.ano }}: {{ item.ipca.toFixed(2) }}%
                </li>
            </ul>
        </template>
        </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import Card from "primevue/card";
import Dropdown from 'primevue/dropdown';

const valorInicial = ref(0);
const anoInicial = ref(null);
const anoFinal = ref(null);
const valorCorrigido = ref(null);
const ipcaAnual = ref([]);

// IPCA data
const ipcaData = {
  2010: 5.91, 2011: 6.50, 2012: 5.84, 2013: 5.91, 2014: 6.41,
  2015: 10.67, 2016: 6.29, 2017: 2.95, 2018: 3.75, 2019: 4.31,
  2020: 4.52, 2021: 10.06, 2022: 5.79, 2023: 4.62, 2024: 4.83
};

const anos = Array.from({ length: 2024 - 2010 + 1 }, (_, i) => ({ ano: 2010 + i }));

const calcularCorrecao = () => {
  if (!anoInicial.value || !anoFinal.value || anoInicial.value.ano > anoFinal.value.ano) {
    valorCorrigido.value = null;
    ipcaAnual.value = [];
    return;
  }
  const yearStart = anoInicial.value.ano;
  const yearEnd = anoFinal.value.ano;

  if (yearStart < 2010 || yearEnd > 2024 || yearStart > yearEnd) {
      valorCorrigido.value = null;
      ipcaAnual.value = [];
      return;
  }

  ipcaAnual.value = [];
  let valorAtual = valorInicial.value;
  for (let ano = yearStart; ano <= yearEnd; ano++) {
    if (ipcaData[ano]) {
       ipcaAnual.value.push({ ano: ano, ipca: ipcaData[ano] });
      valorAtual *= (1 + ipcaData[ano] / 100);
    }
  }

  valorCorrigido.value = parseFloat(valorAtual.toFixed(2));
};
</script>
