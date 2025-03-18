import {
  Chart,
  type ChartConfiguration,
  type ChartType,
  type DefaultDataPoint,
  type UpdateMode,
} from "chart.js";

// type ChartConfig<T extends ChartType, U, J> =  ConstructorParameters<typeof Chart<T, U, J>>[1];

export interface Params<
  T extends ChartType = ChartType,
  U = DefaultDataPoint<T>,
  J = unknown,
> {
  config: ChartConfiguration<T, U, J>;
  updateMode: UpdateMode;
}

export function chartAction<T extends ChartType, U, J>(
  node: HTMLCanvasElement,
  params: Params<T, U, J>,
) {
  const { config } = params;

  const chart = new Chart(node, config);

  return {
    update(updatedParams: Params<T, U, J>) {
      const { config, updateMode } = updatedParams;
      chart.data = config.data;
      if (config.options) {
        chart.options = config.options;
      }
      chart.update(updateMode);
    },
    destroy() {
      chart.destroy();
    },
  };
}
