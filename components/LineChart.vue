<template>
  <div class="mt-6">
    <h2 class="text-lg font-bold mb-4">Evolução da Poupança</h2>
    <VChart class="chart" :option="chartOptions" />
  </div>
</template>

<script setup>
import { computed, provide, shallowRef, onMounted } from 'vue';
import { use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';

provide(THEME_KEY, 'default');

use([
  SVGRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const props = defineProps({
  dados: Array
});

const chartOptions = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['Saldo', 'Total Depositado'] },
  xAxis: { type: 'category', data: props.dados.map(d => d.mes) },
  yAxis: { type: 'value' },
  series: [
    { name: 'Saldo', type: 'line', data: props.dados.map(d => d.saldo), smooth: true },
    { name: 'Total Depositado', type: 'line', data: props.dados.map(d => d.totalDepositado), smooth: true }
  ]
}));
</script>

<style scoped>
.chart {
  height: 500px;
}
</style>
