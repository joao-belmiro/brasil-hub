import { use } from 'echarts/core';

// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';

export default defineNuxtPlugin(() => {
  use([CanvasRenderer, BarChart, LineChart, GridComponent, TooltipComponent]);
});
