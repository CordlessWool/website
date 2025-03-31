<script
    lang="ts"
    generics="TType extends ChartType = ChartType, TData = DefaultDataPoint<TType>, TLabel= unknown "
>
    import { themeStore, THEME } from "$layout/lib/theme";

    import type {
        ChartData,
        ChartOptions,
        DefaultDataPoint,
        ChartType,
        UpdateMode,
    } from "chart.js";
    import {
        Chart,
        RadarController,
        RadialLinearScale,
        PointElement,
        LineElement,
        Filler,
    } from "chart.js";
    import { tick } from "svelte";
    import { chartAction } from "./PolarChartAction";

    Chart.register(
        RadarController,
        RadialLinearScale,
        PointElement,
        LineElement,
        Filler,
    );

    type Props = {
        data: ChartData<TType, TData, TLabel>;
        scale?: [number, number];
        options?: ChartOptions<TType>;
        updateMode?: UpdateMode;
    };


    let { data, options = {}, scale, updateMode }: Props = $props();
    let textColor = $state("#27272a");
    let lightColor = $state("#a1a1aa");
    let backgroundColor = $state("#f4f4f5");
    let primaryColor = $state("#5eead4");

    $effect(() => {
      if($themeStore === THEME.DARK) {
        textColor = "#d4d4d8";
        lightColor = "#52525b";
        backgroundColor = "#18181b";
        primaryColor = "#0f766e";
      } else {
        textColor = "#27272a";
        lightColor = "#a1a1aa";
        backgroundColor = "#f4f4f5";
        primaryColor = "#5eead4";
      }
    })

    const rgba = (color: string, alpha: number) => {
        const hex = color.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
</script>

<div class="lg:col-span-2">
    {#await tick() then}
        <canvas
            use:chartAction={{
                config: {
                    type: "radar",
                    data: {
                        ...data,
                        datasets: data.datasets?.map((dataset: ChartData<TType, TData, TLabel>['datasets']) => ({
                            fill: true,
                            backgroundColor: rgba($state.snapshot(primaryColor), 0.5),
                            borderColor: $state.snapshot(primaryColor),
                            pointBackgroundColor: $state.snapshot(primaryColor),
                            pointBorderColor: $state.snapshot(backgroundColor),
                            ...dataset,
                        })),
                    },
                    options: {
                        maintainAspectRatio: false,
                        responsive: true,
                        scales: {
                            r: {
                                angleLines: {
                                    display: true,
                                    color: $state.snapshot(lightColor), // Angle line color for dark mode
                                },
                                ticks: {
                                    beginAtZero: true,
                                    backdropColor: "transparent",
                                    color: $state.snapshot(textColor), // Tick color for dark mode
                                    background: $state.snapshot(backgroundColor), // Background color for dark mode
                                    stepSize: 20,
                                },
                                pointLabels: {
                                    // Labels around the edge of the radar chart
                                    color: $state.snapshot(textColor),
                                    font: {
                                        family: "Monospace",
                                        size: 14,
                                        weight: "bold",
                                    },
                                },
                                grid: {
                                    // Grid line color for the radial scale
                                    color: $state.snapshot(lightColor),
                                },
                                ...(scale
                                    ? {
                                          suggestedMin: scale[0],
                                          suggestedMax: scale[1],
                                      }
                                    : {}),
                            },
                        },
                        elements: {
                            line: {
                                borderWidth: 3,
                            },
                        },
                        ...options,
                    },
                },
                updateMode,
            }}
        >
        </canvas>
    {/await}
</div>

<style>
    div {
        position: relative;
        margin: auto;
        overflow: hidden;
    }

    canvas {

        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

    }
</style>
