<template>
  <div class="center-container p-4">
    
    <Card class="mb-4 shadow-sm dark:border-0 border-gray-200 w-full" style="--p-card-border-radius: 16px;">
      <template #content>
        <h2 class="text-xl md:text-2xl font-normal text-green-600 mb-6 md:mb-8">Correção IPCA</h2>
        <div class="mb-4">
          <div class="flex flex-row flex-wrap gap-4">
            <div class="w-full sm:w-full md:w-full lg:w-1/3">
              <label for="valorInicial" class="text-xs mb-2 block">Valor Inicial:</label>
              <InputNumber id="valorInicial" v-model.number="valorInicial" mode="currency" currency="BRL" locale="pt-BR" class="w-full"  />
              <p v-if="errors.valorInicial" class="text-red-500 text-sm">
                {{ errors.valorInicial }}
              </p>
            </div>
            <div class="w-full sm:w-full md:w-full lg:w-1/4">
              <label for="anoInicial" class="text-xs mb-2 block">Ano Inicial:</label>
              <Dropdown id="anoInicial" v-model="anoInicial" :options="anos" optionLabel="ano" placeholder="Selecione o Ano"
                class="w-full" :invalid="errors.anoInicial" />
              <p v-if="errors.anoInicial" class="text-red-500 text-sm">
                {{ errors.anoInicial }}
              </p>
            </div>
            <div class="w-full sm:w-full md:w-full lg:w-1/4">
              <label for="anoFinal" class="text-xs mb-2 block">Ano Final:</label>
              <Dropdown id="anoFinal" v-model="anoFinal" :options="anos" optionLabel="ano" placeholder="Selecione o Ano"
                class="w-full" :invalid="errors.anoFinal" />
                 <p v-if="errors.anoFinal" class="text-red-500 text-sm">
                {{ errors.anoFinal }}
              </p>
            </div>
          </div>
        </div>
        <Button @click="calcularCorrecao" label="Calcular" icon="pi pi-calculator" class="p-button-raised"/>
      </template>
    </Card>
        <Card v-if="valorCorrigido !== null" class="shadow-sm dark:border-0 border-gray-200 mt-4" style="--p-card-border-radius: 16px;">
            <template #content>
                <h2 class="text-xl mb-3">Valor Corrigido: </h2>
                <p class="text-green-600 font-bold text-2xl">{{ valorCorrigido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</p>

                <DataTable v-if="ipcaAnual.length > 0" :value="ipcaAnual" class="shadow-md border-gray-300 mt-4">
                    <Column field="ano" header="Ano" style="min-width: 10rem">
                        <template #body="slotProps">
                            {{ slotProps.data.ano }}
                        </template>
                    </Column>
                    <Column field="ipca" header="IPCA" style="min-width: 10rem">
                        <template #body="slotProps">
                            {{ slotProps.data.ipca.toFixed(2) }}%
                        </template>
                    </Column>
                </DataTable>
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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const valorInicial = ref(0);
const anoInicial = ref(null);
const anoFinal = ref(null);
const valorCorrigido = ref(null);
const ipcaAnual = ref([]);
const errors = ref({}); 
// IPCA data
const ipcaData = {
  2010: 5.91, 2011: 6.50, 2012: 5.84, 2013: 5.91, 2014: 6.41,
  2015: 10.67, 2016: 6.29, 2017: 2.95, 2018: 3.75, 2019: 4.31,
  2020: 4.52, 2021: 10.06, 2022: 5.79, 2023: 4.62, 2024: 4.83
};

const anos = Array.from({ length: 2024 - 2010 + 1 }, (_, i) => ({ ano: 2010 + i }));

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!valorInicial.value || valorInicial.value <= 0) {
    errors.value.valorInicial = "O valor inicial é obrigatório e deve ser maior que zero.";
    isValid = false;
  }
  if (!anoInicial.value) {
    errors.value.anoInicial = "O ano inicial é obrigatório.";
    isValid = false;
  }
  if (!anoFinal.value) {
    errors.value.anoFinal = "O ano final é obrigatório.";
    isValid = false;
  }
  if (anoInicial.value && anoFinal.value && anoInicial.value.ano > anoFinal.value.ano) {
    errors.value.anoFinal = "O ano final deve ser maior ou igual ao ano inicial.";
    isValid = false;
  }

  return isValid;
};

const calcularCorrecao = () => {
  if (!validateForm()) {
    return;
  } const yearStart = anoInicial.value.ano;
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

<script>
  export default {
    useHead: {title: 'Correção Monetária pelo IPCA - Calculadora Online Atualizada',
    description: 'Calcule a correção de valores com base no IPCA de forma simples e gratuita. Dados atualizados com os índices oficiais.',}
  }
</script>
