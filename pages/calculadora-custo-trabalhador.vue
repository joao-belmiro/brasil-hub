<template>
  <div class="center-container">
    <Card class="shadow-sm dark:border-0 border-gray-200 w-full" style="--p-card-border-radius: 16px;">
      <template #content>
        <h2 class="text-xl md:text-2xl font-normal text-green-600 mb-6 md:mb-8">Calculadora de Custo do Trabalhador (CLT)</h2>

        <form @submit.prevent="calcularCusto" class="space-y-4 md:space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block not:dark:text-white mb-2 md:mb-3">Salário Bruto (R$)</label>            
              <InputNumber size="small" v-model="salarioBruto" mode="currency" currency="BRL" locale="pt-BR" class="w-full rounded-md" :invalid="errors.salarioBruto" />
              <p v-if="errors.salarioBruto" class="text-red-500 text-sm">
                {{ errors.salarioBruto }}
              </p>
            </div>
            <div>
              <label class="block not:dark:text-white mb-2 md:mb-3">Outros Benefícios Mensais (R$)</label>
              <InputNumber size="small" v-model="outrosBeneficios" mode="currency" currency="BRL" locale="pt-BR" class="w-full" :invalid="errors.outrosBeneficios" />
              <p v-if="errors.outrosBeneficios" class="text-red-500 text-sm">
                {{ errors.outrosBeneficios }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block not:dark:text-white mb-2 md:mb-3">VA/VR Mensal (R$)</label>
              <InputNumber size="small" v-model="valeRefeicaoAlimentacao" mode="currency" currency="BRL" locale="pt-BR" class="w-full rounded-md" :invalid="errors.valeRefeicaoAlimentacao" />
              <p v-if="errors.valeRefeicaoAlimentacao" class="text-red-500 text-sm">
                {{ errors.valeRefeicaoAlimentacao }}
              </p>
            </div>
            <div>
              <label class="block not:dark:text-white mb-2 md:mb-3">Vale Transporte (%)</label>
              <InputNumber size="small" v-model="valeTransportePercentual" suffix="%" class="w-full" :invalid="errors.valeTransportePercentual" />
              <p v-if="errors.valeTransportePercentual" class="text-red-500 text-sm">
                {{ errors.valeTransportePercentual }}
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4">
           
            <Button label="Limpar Tudo" class="p-button-secondary" @click="limparTudo" />
             <Button label="Calcular" class="w-full md:w-auto text-white" type="submit" />
           
          </div>
         
        </form>

        <div v-if="custoResults.length > 0" class="mt-6">
          <h3 class="text-xl font-bold mb-4">Custos Detalhados</h3>
          <DataTable :value="custoResults" class="p-datatable-sm">
            <Column field="description" header="Descrição"></Column>
            <Column field="value" header="Valor">
              <template #body="props" >
                {{ props.data.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
              </template>
            </Column>
          </DataTable>
          <div class="mt-4 text-right">
            <p class="text-lg font-semibold">Custo Total do Empregador: {{ custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</p>
          </div>
        </div>
      </template>
    </Card>    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Card from 'primevue/card';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { nextTick } from 'vue';
const salarioBruto = ref(3000);
const valeTransportePercentual = ref(6);
const valeRefeicaoAlimentacao = ref(20);
const outrosBeneficios = ref(100);
const custoResults = ref([]);
const errors = ref({});

definePageMeta({
  title: 'Calculadora de Custo Trabalhista CLT 2025 - Encargos e Benefícios',
  description: 'Descubra o custo total de um funcionário CLT em 2025 com encargos sociais, benefícios e impostos. Use nossa calculadora atualizada.',
});

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!salarioBruto.value || salarioBruto.value <= 0) {
    errors.value.salarioBruto = "O salário bruto é obrigatório e deve ser maior que zero.";
    isValid = false;
  }
  if (!outrosBeneficios.value || outrosBeneficios.value < 0) {
    errors.value.outrosBeneficios = "O valor deve ser maior ou igual a zero.";
    isValid = false;
  }
  if (!valeRefeicaoAlimentacao.value || valeRefeicaoAlimentacao.value < 0) {
    errors.value.valeRefeicaoAlimentacao = "O valor deve ser maior ou igual a zero.";
    isValid = false;
  }
  if (!valeTransportePercentual.value || valeTransportePercentual.value < 0 || valeTransportePercentual.value > 100) {
    errors.value.valeTransportePercentual = "O valor deve ser entre 0 e 100.";
    isValid = false;
  }
  return isValid;
};

const calcularCusto = () => {
  if (!validateForm()) {
    return;
  }
  const salario = salarioBruto.value;
  const outrosBeneficiosMensais = outrosBeneficios.value;
  const valeTransporte = salario * (valeTransportePercentual.value / 100);

  let inssEmpregado = 0;
  if (salario <= 1412.00) {
    inssEmpregado = salario * 0.075;
  } else if (salario <= 2666.68) {
    inssEmpregado = salario * 0.09;
  } else if (salario <= 4000.03) {
    inssEmpregado = salario * 0.12;
  } else if (salario <= 7786.02) {
    inssEmpregado = salario * 0.14;
  } else {
    inssEmpregado = 908.85;
  }

  const inssPatronal = salario * 0.20;
  const rat = salario * 0.03;
  const sistemaS = salario * 0.033;
  const fgts = salario * 0.08;
  const decimoTerceiro = salario / 12;
  const encargosDecimoTerceiro = decimoTerceiro * 0.08;
  const ferias = salario / 12;
  const adicionalFerias = ferias / 3;
  const encargosFerias = (ferias + adicionalFerias) * 0.08;

  custoResults.value = [
    { description: 'Salário Bruto', value: salario },
    { description: 'INSS (Empregado)', value: -inssEmpregado },
    { description: 'INSS Patronal', value: inssPatronal },
    { description: 'RAT', value: rat },
    { description: 'Sistema S', value: sistemaS },
    { description: 'FGTS', value: fgts },
    { description: '13º Salário (Provisão Mensal)', value: decimoTerceiro },
    { description: 'Encargos sobre 13º (Provisão Mensal)', value: encargosDecimoTerceiro },
    { description: 'Férias (Provisão Mensal)', value: ferias },
    { description: 'Adicional de Férias (1/3)', value: adicionalFerias },
    { description: 'Encargos sobre Férias', value: encargosFerias },
    { description: 'Vale Transporte (Contribuição do Empregado)', value: -valeTransporte },
    { description: 'Vale Refeição/Alimentação', value: outrosBeneficiosMensais },
  ];
};

const custoTotal = computed(() => {
  return custoResults.value.reduce((sum, item) => {
    if (['INSS (Empregado)', 'Vale Transporte (Contribuição do Empregado)'].includes(item.description)) {
      return sum;
    }
    return sum + item.value;
  }, 0);
});
const limparTudo = () => {
  salarioBruto.value = 0;
  valeTransportePercentual.value = 6;
  valeRefeicaoAlimentacao.value = 20;
  outrosBeneficios.value = 100;
  custoResults.value = [];
  errors.value = {};

};
 
const formatCurrency = (value) => {
    if (typeof value !== 'number') {
        return 'R$ 0,00';
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const getRowClass = (data) => {
  if (['INSS (Empregado)', 'Vale Transporte (Contribuição do Empregado)'].includes(data.description)) {
    return 'contribution';
  }
  return '';
};
</script>

<style scoped>
.contribution {
    color: green;
}
.center-container {
    display: flex;
  align-items: center;
  justify-content: center;

}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background: #343a40;
    color: white;
}

:deep(.p-datatable.p-datatable-sm .p-datatable-thead > tr > th) {
    padding: 0.5rem 0.5rem;
    font-size: 0.875rem;
}
:deep(.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td) {
    padding: 0.5rem 0.5rem;
    font-size: 0.875rem;
}

:deep(.p-inputnumber-input) {
    width: 100%;
}
</style>