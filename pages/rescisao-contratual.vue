<template>
  <div class="center-container mx-auto p-4">
    <Card class="shadow-sm dark:border-0 border-gray-200 p-4" style="--p-card-border-radius: 16px;">
      <template #content>
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Rescisão Contratual</h1>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div class="col-span-1">
            <label for="dataAdmissao" class="text-xs mb-2 block">Data de Admissão:</label>
            <DatePicker id="dataAdmissao" v-model="dataAdmissao" dateFormat="dd/mm/yy" class="w-full"
              :showIcon="true" placeholder="DD/MM/AAAA" size="small" />
          </div>
          <div class="col-span-1">
            <label for="dataDemissao" class="text-xs mb-2 block">Data de Demissão:</label>
            <DatePicker id="dataDemissao" v-model="dataDemissao" dateFormat="dd/mm/yy" class="w-full"
              :showIcon="true" placeholder="DD/MM/AAAA" size="small" />
          </div>
          <div class="col-span-1">
            <label for="salarioBruto" class="text-xs mb-2 block">Salário Bruto Mensal:</label>
            <InputNumber id="salarioBruto" v-model.number="salarioBruto" mode="decimal" :minFractionDigits="2"
              :maxFractionDigits="2" class="w-full" placeholder="Ex: 3000.00" size="small" />
          </div>
          <div class="col-span-1">
            <label for="motivoRescisao" class="text-xs mb-2 block">Motivo da Rescisão:</label>
            <Dropdown id="motivoRescisao" v-model="motivoRescisao" :options="motivosRescisao" optionLabel="label"
              class="w-full" placeholder="Selecione o Motivo" size="small" />
          </div>
          <div class="col-span-1">
            <label for="diasAviso" class="text-xs mb-2 block">Dias de Aviso Prévio (Trabalhado ou Indenizado):</label>
            <InputNumber id="diasAviso" v-model.number="diasAviso" :minFractionDigits="0" :maxFractionDigits="0"
              class="w-full" placeholder="Ex: 30" size="small" />
          </div>
          <div class="col-span-1">
            <label for="decimoTerceiroProporcional" class="text-xs mb-2 block">13º Salário Proporcional (Meses):</label>
            <InputNumber id="decimoTerceiroProporcional" v-model.number="decimoTerceiroProporcional"
              :minFractionDigits="0" :maxFractionDigits="0" class="w-full" placeholder="Ex: 5" size="small" />
          </div>
           <div class="col-span-1">
            <label for="feriasVencidas" class="text-xs mb-2 block">Férias Vencidas (Meses):</label>
            <InputNumber id="feriasVencidas" v-model.number="feriasVencidas" :minFractionDigits="0"
              :maxFractionDigits="0" class="w-full" placeholder="Ex: 1" size="small" />
          </div>
          <div class="col-span-1">
            <label for="feriasProporcionais" class="text-xs mb-2 block">Férias Proporcionais (Meses):</label>
            <InputNumber id="feriasProporcionais" v-model.number="feriasProporcionais" :minFractionDigits="0"
              :maxFractionDigits="0" class="w-full" placeholder="Ex: 5" size="small" />
          </div>
          <div class="col-span-1">
           <label for="beneficiosAdicionais" class="text-xs mb-2 block">Benefícios Adicionais:</label>
            <InputNumber id="beneficiosAdicionais" v-model.number="beneficiosAdicionais" mode="decimal"
              :minFractionDigits="2" :maxFractionDigits="2" class="w-full" placeholder="Ex: 200.00" size="small" />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          
           <Button label="Limpar Tudo" class="p-button-secondary" @click="limparTudo" />
           <Button label="Calcular" @click="calcularRescisao" class="p-button-raised" :disabled="calculando"/>
          </div>
      </template>
    </Card>

    <Card v-if="rescisaoCalculada" class="mt-6 shadow-sm dark:border-0 border-gray-200 p-4" style="--p-card-border-radius: 16px;"
      :loading="calculando">
      <template #content>
        <h1 class="text-2xl font-bold mb-4">Resumo da Rescisão Contratual</h1>
        <div class="grid gap-4">
          <p class="col-span-1">Saldo de Salário: {{ formatCurrency(saldoSalario) }}</p>
          <p class="col-span-1">Férias Vencidas + 1/3: {{ formatCurrency(feriasVencidasValor) }}</p>
          <p class="col-span-1">Férias Proporcionais + 1/3: {{ formatCurrency(feriasProporcionaisValor) }}</p>
          <p class="col-span-1">13º Salário Proporcional: {{ formatCurrency(decimoTerceiroProporcionalValor) }}</p>
          <p class="col-span-1">Aviso Prévio: {{ formatCurrency(avisoPrevioValor) }}</p>
          <p class="col-span-1">Multa FGTS: {{ formatCurrency(multaFGTS) }}</p>
          <p class="col-span-1">Benefícios Adicionais: {{ formatCurrency(beneficiosAdicionais) }}</p>
          <p class="col-span-1">Total Bruto a Receber: {{ formatCurrency(totalBruto) }}</p>
          <p class="col-span-1">Descontos INSS: {{ formatCurrency(descontoINSS) }}</p>
          <p class="col-span-1">Descontos IRRF: {{ formatCurrency(descontoIRRF) }}</p>
          <p class="col-span-1">Total Líquido a Receber: {{ formatCurrency(totalLiquido) }}</p>
          <div class="col-span-1 flex justify-end">
            <Button label="Exportar para PDF" @click="exportToPDF" class="p-button-raised" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { jsPDF } from "jspdf";


const salarioBruto = ref(0);
const dataAdmissao = ref(null);
const dataDemissao = ref(null);
const motivoRescisao = ref(null);
const diasAviso = ref(0);
const feriasVencidas = ref(0);
const feriasProporcionais = ref(0);
const decimoTerceiroProporcional = ref(0);
const beneficiosAdicionais = ref(0);

const motivosRescisao = ref([
  { label: 'Sem Justa Causa', value: 'sem-justa-causa' },
  { label: 'Por Justa Causa', value: 'por-justa-causa' },
  { label: 'Pedido de Demissão', value: 'pedido-de-demissao' },
  { label: 'Rescisão Indireta', value: 'rescisao-indireta' },
  { label: 'Acordo entre as Partes', value: 'acordo-entre-as-partes' },
]);

const calculando = ref(false);
const rescisaoCalculada = ref(false);

const calcularRescisao = () => {
  calculando.value = true;
  rescisaoCalculada.value = true;
  calculando.value = false;

};

const rescisaoData = computed(() => {
  return [
    {
      description: "Saldo de Salário",
      value: formatCurrency(saldoSalario.value),
      details: `Referente aos dias trabalhados até a data de demissão (${dataDemissao.value?.getDate()}).`,
    },
    {
      description: "Férias Vencidas + 1/3",
      value: formatCurrency(feriasVencidasValor.value),
      details: `Férias vencidas + adicional de 1/3 sobre o valor das férias.`,
    },
    {
      description: "Férias Proporcionais + 1/3",
      value: formatCurrency(feriasProporcionaisValor.value),
      details: `Férias proporcionais ao período trabalhado + adicional de 1/3 sobre o valor das férias proporcionais.`,
    },
    {
      description: "13º Salário Proporcional",
      value: formatCurrency(decimoTerceiroProporcionalValor.value),
      details: `Referente aos meses trabalhados no ano vigente.`,
    },
    {
      description: "Aviso Prévio",
      value: formatCurrency(avisoPrevioValor.value),
      details: `Valor referente ao aviso prévio, conforme o motivo da rescisão e os dias de aviso.`,
    },
    {
      description: "Multa FGTS",
      value: formatCurrency(multaFGTS.value),
      details: `Multa de 40% ou 20% sobre o saldo do FGTS, dependendo do motivo da rescisão.`,
    },

  ];
});
const limparTudo = () => {
    salarioBruto.value = 0;
    dataAdmissao.value = null;
    dataDemissao.value = null;
    motivoRescisao.value = null;
    diasAviso.value = 0;
    feriasVencidas.value = 0;
    feriasProporcionais.value = 0;
    decimoTerceiroProporcional.value = 0;
    beneficiosAdicionais.value = 0;
    rescisaoCalculada.value = false
    calculando.value = false
};


const saldoSalario = computed(() => {
  if (!dataDemissao.value) return 0;
  const diasTrabalhados = dataDemissao.value.getDate();
  return parseFloat(((salarioBruto.value / 30) * diasTrabalhados).toFixed(2));
});

const feriasVencidasValor = computed(() => {
  if (feriasVencidas.value > 0) {
    return parseFloat(((salarioBruto.value * feriasVencidas.value) + (salarioBruto.value / 3)).toFixed(2));
  }
  return 0;
});

const feriasProporcionaisValor = computed(() => {
  if (feriasProporcionais.value > 0) {
    return (salarioBruto.value / 12 * feriasProporcionais.value) + (salarioBruto.value / 12 * feriasProporcionais.value) / 3;
  }
  return 0
});

const decimoTerceiroProporcionalValor = computed(() => {
  return parseFloat(((salarioBruto.value / 12) * decimoTerceiroProporcional.value).toFixed(2));

});

const avisoPrevioValor = computed(() => {
    if (!motivoRescisao.value) return 0;

    const motivo = motivoRescisao.value.value;

    if (motivo === 'sem-justa-causa' || motivo === 'rescisao-indireta') {
      if (diasAviso.value > 0) {
        return parseFloat(salarioBruto.value.toFixed(2));
      } else {
         return parseFloat(salarioBruto.value.toFixed(2));
      }
    } else if (motivo === 'acordo-entre-as-partes') {
      if (diasAviso.value > 0) {
        return parseFloat((salarioBruto.value / 2).toFixed(2));
      } else {
          return parseFloat((salarioBruto.value / 2).toFixed(2));
      }
    }
    return 0;
  });
  
const multaFGTS = computed(() => {
  if (motivoRescisao.value.value === 'sem-justa-causa' || motivoRescisao.value.value === 'rescisao-indireta' || motivoRescisao.value.value === 'acordo-entre-as-partes') {
    const fgtsDepositado = (salarioBruto.value * 0.08) * 12;
    return motivoRescisao.value.value === 'acordo-entre-as-partes' ? (fgtsDepositado * 0.2) : (fgtsDepositado * 0.4);
  }
  return 0;
});

const totalBruto = computed(() => {
  return saldoSalario.value + feriasVencidasValor.value + feriasProporcionaisValor.value +
    decimoTerceiroProporcionalValor.value + avisoPrevioValor.value + multaFGTS.value + beneficiosAdicionais.value;
});

const descontoINSS = computed(() => {
  const baseCalculoINSS = totalBruto.value;
  if (baseCalculoINSS <= 1320) {
    return baseCalculoINSS * 0.075;
  } else if (baseCalculoINSS <= 2571.29) {
    return (baseCalculoINSS - 1320) * 0.09 + 99;
  } else if (baseCalculoINSS <= 3856.94) {
    return (baseCalculoINSS - 2571.29) * 0.12 + 211.62;
  } else if (baseCalculoINSS <= 7507.49) {
    return (baseCalculoINSS - 3856.94) * 0.14 + 365.84;
  } else {
    return 877.24;
  }
});

const descontoIRRF = computed(() => {
  const baseCalculoIRRF = totalBruto.value - descontoINSS.value;
  if (baseCalculoIRRF <= 2112.00) {
    return 0;
  } else if (baseCalculoIRRF <= 2826.65) {
    return (baseCalculoIRRF * 0.075) - 158.40;
  } else if (baseCalculoIRRF <= 3751.05) {
    return (baseCalculoIRRF * 0.15) - 370.40;
  } else if (baseCalculoIRRF <= 4664.68) {
    return (baseCalculoIRRF * 0.225) - 651.73;
  } else {
    return (baseCalculoIRRF * 0.275) - 884.96;
  }
});

const totalDescontos = computed(() => {
  return descontoINSS.value + descontoIRRF.value;
});

const totalLiquido = computed(() => {
  return totalBruto.value - totalDescontos.value;
});
const pieChartData = computed(() => {
  return [
    { value: saldoSalario.value, name: 'Saldo de Salário' },
    { value: feriasVencidasValor.value, name: 'Férias Vencidas' },
    { value: feriasProporcionaisValor.value, name: 'Férias Proporcionais' },
    { value: decimoTerceiroProporcionalValor.value, name: '13º Salário Proporcional' },
    { value: avisoPrevioValor.value, name: 'Aviso Prévio' },
    { value: multaFGTS.value, name: 'Multa FGTS' },
    { value: beneficiosAdicionais.value, name: 'Benefícios Adicionais' },
    { value: totalDescontos.value, name: 'Descontos' }
  ];
});
 
const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};




const exportToPDF = () => {
  const doc = new jsPDF();

  doc.text("Resumo da Rescisão Contratual", 10, 10);
  doc.setFontSize(10)
  doc.text(`Saldo de Salário: ${formatCurrency(saldoSalario.value)}`, 10, 20);
  doc.text(`Férias Vencidas + 1/3: ${formatCurrency(feriasVencidasValor.value)}`, 10, 30);
  doc.text(`Férias Proporcionais + 1/3: ${formatCurrency(feriasProporcionaisValor.value)}`, 10, 40);
  doc.text(`13º Salário Proporcional: ${formatCurrency(decimoTerceiroProporcionalValor.value)}`, 10, 50);
  doc.text(`Aviso Prévio: ${formatCurrency(avisoPrevioValor.value)}`, 10, 60);
  doc.text(`Multa FGTS: ${formatCurrency(multaFGTS.value)}`, 10, 70);
  doc.text(`Benefícios Adicionais: ${formatCurrency(beneficiosAdicionais.value)}`, 10, 80);
  doc.text(`Total Bruto a Receber: ${formatCurrency(totalBruto.value)}`, 10, 90);
  doc.text(`Descontos INSS: ${formatCurrency(descontoINSS.value)}`, 10, 100);
  doc.text(`Descontos IRRF: ${formatCurrency(descontoIRRF.value)}`, 10, 110);
  doc.text(`Total de Descontos: ${formatCurrency(totalDescontos.value)}`, 10, 120);
  doc.setFontSize(14)
  doc.setTextColor("#008000");
  doc.text(`Valor Líquido da Rescisão: ${formatCurrency(totalLiquido.value)}`, 10, 140);

  doc.save("rescisao.pdf");
};
</script>

<style scoped>
/* Estilos opcionais para o componente de tabela */
.p-datatable {
  width: 100%;
}
.p-datatable-header {
  font-weight: bold;
}
</style>