<script>
  import { Chart } from "svelte-echarts";

  import { init, use } from "echarts/core";
  import { BarChart } from "echarts/charts";
  import { GridComponent, TitleComponent } from "echarts/components";
  import { CanvasRenderer } from "echarts/renderers";

  // now with tree-shaking
  use([BarChart, GridComponent, CanvasRenderer, TitleComponent]);

  export let options = {
    title: {
      text: "ECharts Example",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "bar",
        data: [120, 200, 150, 80, 70, 110, 130],
      },
    ],
  };
</script>

<div class="h-full w-full">
  <Chart {init} {options} />
</div>
