<template>
  <div class="center-container">
    <Card
      class="shadow-sm dark:border-0 border-gray-200 w-full"
      style="--p-card-border-radius: 16px"
    >
      <template #title><h2 class="text-xl md:text-2xl font-normal text-green-600 mb-6 md:mb-8">Calculadora de Salário e IRPF</h2></template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="w-full sm:w-full md:w-full lg:w-1/2">
            <label for="grossSalary" class="text-xs mb-2 block"
              >Salário Bruto (R$)</label
            >
            <InputNumber
              class="w-full"
              size="small"
              inputId="grossSalary"
              v-model="grossSalary"
              :invalid="errors.grossSalary"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              fluid
            />
            <p v-if="errors.grossSalary" class="text-red-500 text-sm">
              {{ errors.grossSalary }}
            </p>
          </div>
        </div>

        <Button label="Calcular" size="small" icon="pi pi-calculator" class="mt-4" @click="calculateIrpf" />
       
        <div v-if="calculationRows.length > 0" class="mt-6">
          <DataTable :value="calculationRows" class="p-datatable-sm p-datatable-gridlines">
            <Column field="label" header="Descrição"></Column>
            <Column field="value" header="Valor">
              <template #body="data">
                <span v-if="data.rowIndex === calculationRows.length - 1" class="text-xl">
                  <span v-if="data.data.currency">R$ </span>{{ data.data.value }}<span
                    v-if="data.data.percentage"
                    >%</span
                  >
                </span>
                <span
                  v-else-if="data.data.label === 'Salário Bruto'"
                  class="text-green-500"
                >
                  <span v-if="data.data.currency">R$ </span>{{ data.data.value }}<span
                    v-if="data.data.percentage"
                    >%</span
                  >
                </span>
                <span
                  v-else-if="data.data.label === 'INSS' || data.data.label === 'IRPF Devido'"
                  class="text-red-500"
                >
                  <span v-if="data.data.currency">- R$ </span>{{ data.data.value }}<span
                    v-if="data.data.percentage"
                    >%</span
                  >
                </span>
                <span v-else>
                  <span v-if="data.data.currency">R$ </span>{{ data.data.value }}<span v-if="data.data.percentage">%</span>
                </span>
              </template>
            </Column>
          </DataTable>
          <p class="mt-3 text-sm text-gray-500">
            *Valores aproximados. Consulte um profissional para cálculos precisos.
          </p>

          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-3">Demonstrativo do Cálculo</h3>

            <div class="mb-4">
              <h4 class="font-medium">1. Cálculo do INSS</h4>
              <p>O cálculo do INSS é feito com base em alíquotas progressivas sobre o salário bruto. Para este exemplo, usamos uma tabela simplificada:</p>
              <DataTable
                :value="inssCalculation"
                class="p-datatable-sm p-datatable-gridlines"
              >
                <Column field="range" header="Faixa de Salário" />
                <Column field="rate" header="Alíquota" />
                <Column field="maxDeduction" header="Dedução Máxima" />
              </DataTable>
            </div>

            <div>
              <h4 class="font-medium">2. Cálculo do IRPF</h4>
              <p>
                O IRPF é calculado sobre a base de cálculo (Salário Bruto - INSS)
                aplicando a alíquota correspondente e deduzindo a parcela a
                deduzir:
              </p>
              <DataTable
                :value="irpfCalculation"
                class="p-datatable-sm p-datatable-gridlines"
              >
                <Column field="range" header="Base de Cálculo" />
                <Column field="rate" header="Alíquota" />
                <Column field="deduction" header="Parcela a Deduzir" />
              </DataTable>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const grossSalary = ref(0);
const calculationResult = ref(null);
const errors = ref({});

const calculateIrpf = async () => {
  errors.value = {};

  if (!grossSalary.value) {
    errors.value.grossSalary = "Salário bruto é obrigatório.";
    return;
  }

  if (grossSalary.value <= 0) {
    errors.value.grossSalary = "Salário bruto deve ser maior que zero.";
    return;
  }

  const gross = parseFloat(grossSalary.value);

  // INSS
  let inssRate = 0;
  let inss = 0;

  if (gross <= 1320.00) {
    inssRate = 0.075;
  } else if (gross <= 2571.29) {
    inssRate = 0.09;
  } else if (gross <= 3856.94) {
    inssRate = 0.12;
  } else if (gross <= 7507.49) {
    inssRate = 0.14;
  } else {
    inss = 828.39;
  }

  if (inss === 0) {
    inss = gross * inssRate;
  }

  const irpfBase = gross - inss;
  let irpfRate = 0;
  let irpfDeduction = 0;
  let irpf = 0;

  if (irpfBase <= 2112.00) {
    irpfRate = 0;
    irpfDeduction = 0;
  } else if (irpfBase <= 2826.65) {
    irpfRate = 0.075;
    irpfDeduction = 158.40;
  } else if (irpfBase <= 3751.05) {
    irpfRate = 0.15;
    irpfDeduction = 370.40;
  } else if (irpfBase <= 4664.68) {
    irpfRate = 0.225;
    irpfDeduction = 651.73;
  } else {
    irpfRate = 0.275;
    irpfDeduction = 884.96;
  }

  if (irpfRate > 0) {
    irpf = irpfBase * irpfRate - irpfDeduction;
  }

  const netSalary = irpfBase - irpf;

  calculationResult.value = {
    grossSalary: gross.toFixed(2),
    inss: inss.toFixed(2),
    irpfBase: irpfBase.toFixed(2),
    irpfRate: (irpfRate * 100).toFixed(1),
    irpfDeduction: irpfDeduction.toFixed(2),
    irpf: irpf.toFixed(2),
    netSalary: netSalary.toFixed(2),
  };
};

const calculationRows = computed(() => {
  if (!calculationResult.value) return [];
  return [
    { label: "Salário Bruto", value: calculationResult.value.grossSalary, currency: true },
    { label: "INSS", value: calculationResult.value.inss, currency: true },
    { label: "Base de Cálculo IRPF", value: calculationResult.value.irpfBase, currency: true },
    { label: "Alíquota IRPF", value: calculationResult.value.irpfRate, percentage: true },
    { label: "Parcela a Deduzir", value: calculationResult.value.irpfDeduction, currency: true },
    { label: "IRPF Devido", value: calculationResult.value.irpf, currency: true },
    { label: "Salário Líquido", value: calculationResult.value.netSalary, currency: true },
  ];
});

const inssCalculation = computed(() => [
  { range: "Até R$ 1.320,00", rate: "7,5%", maxDeduction: "R$ 99,00" },
  { range: "De R$ 1.320,01 até R$ 2.571,29", rate: "9,0%", maxDeduction: "R$ 214,42" },
  { range: "De R$ 2.571,30 até R$ 3.856,94", rate: "12,0%", maxDeduction: "R$ 365,78" },
  { range: "De R$ 3.856,95 até R$ 7.507,49", rate: "14,0%", maxDeduction: "R$ 886,32" },
  { range: "Acima de R$ 7.507,49", rate: "-", maxDeduction: "Teto: R$ 828,39" },
]);

const irpfCalculation = computed(() => [
  { range: "Até R$ 2.112,00", rate: "0%", deduction: "R$ 0,00" },
  { range: "De R$ 2.112,01 até R$ 2.826,65", rate: "7,5%", deduction: "R$ 158,40" },
  { range: "De R$ 2.826,66 até R$ 3.751,05", rate: "15%", deduction: "R$ 370,40" },
  { range: "De R$ 3.751,06 até R$ 4.664,68", rate: "22,5%", deduction: "R$ 651,73" },
  { range: "Acima de R$ 4.664,68", rate: "27,5%", deduction: "R$ 884,96" },
]);
</script>
